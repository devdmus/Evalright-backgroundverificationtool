import { Router } from 'express';
import { pool } from './config/db';

const router = Router();

function formatDate(value: any): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function formatDateTime(value: any): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${mm}/${dd}/${yyyy} ${hh}:${min}`;
}

function money(n: any): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

async function resolveCompanyId(userId: string): Promise<string | null> {
  const res = await pool.query('SELECT company_id FROM users WHERE id = $1 LIMIT 1', [userId]);
  return res.rows[0]?.company_id || null;
}

// List invoices for the authenticated client company
router.get('/api/invoices', async (req: any, res: any) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user must be authenticated.' });
    }

    const companyId = req.authUser?.company_id || (await resolveCompanyId(userId));
    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: company not found.' });
    }

    const result = await pool.query(
      `
      SELECT
        i.id,
        i.invoice_number,
        i.issue_date,
        i.due_date,
        i.total,
        i.status,
        i.amount,
        o.order_number,
        o.id AS order_id,
        COALESCE(b.name, 'Headquarters') AS branch_name
      FROM invoices i
      JOIN orders o ON o.id = i.order_id
      LEFT JOIN branches b ON b.id = o.branch_id
      WHERE o.company_id = $1
      ORDER BY i.issue_date DESC NULLS LAST, i.invoice_number DESC
      `,
      [companyId]
    );

    const invoices = result.rows.map((row, idx) => ({
      id: row.id,
      number: result.rows.length - idx,
      invoiceNumber: row.invoice_number,
      branch: row.branch_name || 'Headquarters',
      invoiceDate: formatDate(row.issue_date),
      dueDate: formatDate(row.due_date),
      total: money(row.total),
      amount: money(row.amount),
      status: String(row.status || 'paid').toUpperCase(),
      orderId: row.order_id,
      orderNumber: row.order_number,
    }));

    res.json({ success: true, invoices });
  } catch (error: any) {
    console.error('❌ Error listing invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

// Full invoice detail for View action
router.get('/api/invoices/:id', async (req: any, res: any) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || req.authUser?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user must be authenticated.' });
    }

    const companyId = req.authUser?.company_id || (await resolveCompanyId(userId));
    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: company not found.' });
    }

    const { id } = req.params;

    const invoiceRes = await pool.query(
      `
      SELECT
        i.id,
        i.invoice_number,
        i.issue_date,
        i.due_date,
        i.amount,
        i.tax,
        i.discount,
        i.total,
        i.status,
        o.id AS order_id,
        o.order_number,
        o.created_at AS order_created_at,
        o.subtotal AS order_subtotal,
        o.tax_amount AS order_tax,
        o.discount_amount AS order_discount,
        o.total_amount AS order_total,
        o.currency,
        b.id AS branch_id,
        b.name AS branch_name,
        b.address AS branch_address,
        a.id AS applicant_id,
        a.first_name,
        a.middle_name,
        a.last_name,
        a.email AS applicant_email,
        a.phone AS applicant_phone,
        c.name AS company_name
      FROM invoices i
      JOIN orders o ON o.id = i.order_id
      JOIN companies c ON c.id = o.company_id
      LEFT JOIN branches b ON b.id = o.branch_id
      LEFT JOIN applicants a ON a.id = o.applicant_id
      WHERE (i.id::text = $1 OR i.invoice_number = $1)
        AND o.company_id = $2
      LIMIT 1
      `,
      [id, companyId]
    );

    if (invoiceRes.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const inv = invoiceRes.rows[0];

    const [servicesRes, addressRes, paymentsRes, txnRes] = await Promise.all([
      pool.query(
        `
        SELECT
          ov.id,
          ov.unit_price,
          ov.discount_amount,
          ov.tax_amount,
          ov.final_price,
          ov.status,
          s.name AS service_name,
          s.service_code
        FROM order_verifications ov
        LEFT JOIN services s ON s.id = ov.service_id
        WHERE ov.order_id = $1
        ORDER BY s.name ASC NULLS LAST
        `,
        [inv.order_id]
      ),
      pool.query(
        `
        SELECT street1, street2, city, state, country, zip_code, address_type, is_current
        FROM applicant_addresses
        WHERE applicant_id = $1
        ORDER BY is_current DESC NULLS LAST, created_at DESC
        LIMIT 1
        `,
        [inv.applicant_id]
      ),
      pool.query(
        `
        SELECT id, gateway, transaction_id, amount, currency, status, paid_at
        FROM payments
        WHERE invoice_id = $1
        ORDER BY paid_at DESC NULLS LAST
        `,
        [inv.id]
      ),
      pool.query(
        `
        SELECT id, gateway, payment_id, razorpay_order_id, payment_method, payment_status,
               gross_amount, deductions, net_amount, currency, paid_at, created_at
        FROM payment_transactions
        WHERE order_id = $1
        ORDER BY paid_at DESC NULLS LAST, created_at DESC
        `,
        [inv.order_id]
      ),
    ]);

    const address = addressRes.rows[0] || null;
    const datePaid =
      paymentsRes.rows[0]?.paid_at ||
      txnRes.rows[0]?.paid_at ||
      null;

    const services = servicesRes.rows.map((row) => ({
      id: row.id,
      name: row.service_name || row.service_code || 'Service',
      serviceCode: row.service_code,
      unitPrice: money(row.unit_price),
      discount: money(row.discount_amount),
      tax: money(row.tax_amount),
      finalPrice: money(row.final_price),
      status: row.status,
    }));

    const transactions = (paymentsRes.rows.length > 0 ? paymentsRes.rows : txnRes.rows).map((row: any) => ({
      transactionDate: formatDate(row.paid_at || row.created_at),
      gateway: row.gateway || row.payment_method || 'razorpay',
      transactionId: row.transaction_id || row.payment_id || '-',
      amount: money(row.amount ?? row.net_amount),
      method: row.payment_method || null,
      status: row.status || row.payment_status || 'completed',
      paidAt: formatDateTime(row.paid_at || row.created_at),
    }));

    const subTotal = money(inv.amount ?? inv.order_subtotal);
    const credit = money(inv.discount ?? inv.order_discount);
    const tax = money(inv.tax ?? inv.order_tax);
    const total = money(inv.total ?? inv.order_total);
    const balance = String(inv.status).toLowerCase() === 'paid' ? 0 : total;

    const addressLines = address
      ? [
          [address.street1, address.street2].filter(Boolean).join(', '),
          [address.city, address.state, address.zip_code].filter(Boolean).join(', '),
          address.country && String(address.country).toUpperCase() === 'USA'
            ? 'India'
            : (address.country || 'India'),
        ].filter(Boolean)
      : inv.branch_address
        ? [inv.branch_address]
        : [];

    res.json({
      success: true,
      invoice: {
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        status: String(inv.status || 'paid').toUpperCase(),
        invoiceDate: formatDate(inv.issue_date),
        dueDate: formatDate(inv.due_date),
        datePaid: formatDateTime(datePaid),
        currency: inv.currency || 'INR',
        subTotal,
        credit,
        tax,
        total,
        balance,
        order: {
          id: inv.order_id,
          orderNumber: inv.order_number,
          createdAt: formatDateTime(inv.order_created_at),
        },
        company: {
          name: inv.company_name || 'Client',
        },
        branch: {
          id: inv.branch_id,
          name: inv.branch_name || 'Headquarters',
          address: inv.branch_address || null,
        },
        applicant: {
          name: [inv.first_name, inv.middle_name, inv.last_name].filter(Boolean).join(' ').trim() || '-',
          email: inv.applicant_email || '-',
          phone: inv.applicant_phone || '-',
          addressLines,
          address: address
            ? {
                street1: address.street1,
                street2: address.street2,
                city: address.city,
                state: address.state,
                zipCode: address.zip_code,
                country: address.country && String(address.country).toUpperCase() === 'USA'
                  ? 'India'
                  : (address.country || 'India'),
                type: address.address_type,
              }
            : null,
        },
        billingCompany: {
          name: 'ER EvalRight',
          addressLines: ['EvalRight Background Verification', 'India'],
          phone: '1-800-935-9025',
          tollFree: '800-935-9218',
          email: 'support@evalright.com',
          website: 'www.evalright.com',
        },
        services,
        transactions,
        payment: txnRes.rows[0]
          ? {
              gateway: txnRes.rows[0].gateway || 'razorpay',
              method: txnRes.rows[0].payment_method || 'razorpay',
              transactionId: txnRes.rows[0].payment_id,
              razorpayOrderId: txnRes.rows[0].razorpay_order_id,
              grossAmount: money(txnRes.rows[0].gross_amount),
              deductions: money(txnRes.rows[0].deductions),
              netAmount: money(txnRes.rows[0].net_amount),
              paidAt: formatDateTime(txnRes.rows[0].paid_at),
              status: txnRes.rows[0].payment_status,
            }
          : paymentsRes.rows[0]
            ? {
                gateway: paymentsRes.rows[0].gateway || 'razorpay',
                method: 'razorpay',
                transactionId: paymentsRes.rows[0].transaction_id,
                razorpayOrderId: null,
                grossAmount: money(paymentsRes.rows[0].amount),
                deductions: 0,
                netAmount: money(paymentsRes.rows[0].amount),
                paidAt: formatDateTime(paymentsRes.rows[0].paid_at),
                status: paymentsRes.rows[0].status,
              }
            : null,
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching invoice detail:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
