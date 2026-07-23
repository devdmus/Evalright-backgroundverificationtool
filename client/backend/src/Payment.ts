import { Router } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { pool } from './config/db';

dotenv.config();

const router = Router();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

async function initializePaymentSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id UUID PRIMARY KEY,
        order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        razorpay_order_id VARCHAR(100),
        payment_id VARCHAR(100),
        payment_method VARCHAR(50),
        payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
        gross_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
        deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
        net_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        gateway VARCHAR(50) NOT NULL DEFAULT 'razorpay',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        paid_at TIMESTAMP WITH TIME ZONE
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_by ON payment_transactions(created_by);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_id ON payment_transactions(payment_id);
    `);
    await client.query('COMMIT');
    console.log('⚡ [SCHEMA] Database payment_transactions table initialized/verified.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing payment_transactions schema:', error);
  } finally {
    client.release();
  }
}

initializePaymentSchema();

// Create Razorpay order for checkout
router.post('/api/payments/create-order', async (req: any, res: any) => {
  try {
    if (!razorpay || !razorpayKeyId) {
      return res.status(500).json({ error: 'Razorpay is not configured on the server.' });
    }

    const { grossAmount, deductions = 0, currency = 'INR', notes } = req.body;
    const createdBy = (req.headers['x-user-id'] as string) || req.body.createdBy || null;

    const gross = Number(grossAmount);
    const deductionAmt = Number(deductions) || 0;

    if (!gross || Number.isNaN(gross) || gross <= 0) {
      return res.status(400).json({ error: 'Valid grossAmount is required.' });
    }

    const netAmount = Math.max(gross - deductionAmt, 0);
    const amountInPaise = Math.round(netAmount * 100);

    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Minimum payable amount is ₹1.00' });
    }

    const receipt = `evr_${Date.now()}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt,
      notes: {
        created_by: createdBy || 'unknown',
        ...(notes || {}),
      },
    });

    const txnId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO payment_transactions
        (id, created_by, razorpay_order_id, payment_status, gross_amount, deductions, net_amount, currency, gateway, created_at)
       VALUES ($1, $2, $3, 'created', $4, $5, $6, $7, 'razorpay', NOW())`,
      [txnId, createdBy, razorpayOrder.id, gross, deductionAmt, netAmount, currency || 'INR']
    );

    res.json({
      success: true,
      keyId: razorpayKeyId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: razorpayOrder.currency,
      transactionId: txnId,
      grossAmount: gross,
      deductions: deductionAmt,
      netAmount,
    });
  } catch (error: any) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment order' });
  }
});

// Verify Razorpay payment and attach it to a created BGV order
router.post('/api/payments/verify', async (req: any, res: any) => {
  const client = await pool.connect();
  try {
    if (!razorpayKeySecret) {
      return res.status(500).json({ error: 'Razorpay secret is not configured on the server.' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      transactionId,
      paymentMethod,
      grossAmount,
      deductions = 0,
      netAmount,
    } = req.body;

    const createdBy = (req.headers['x-user-id'] as string) || req.body.createdBy || null;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment verification fields.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment signature verification failed.' });
    }

    let method = paymentMethod || 'razorpay';
    try {
      if (razorpay) {
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        method = (payment as any).method || method;
      }
    } catch (fetchErr) {
      console.warn('⚠️ Could not fetch Razorpay payment method details:', fetchErr);
    }

    const gross = Number(grossAmount) || 0;
    const deductionAmt = Number(deductions) || 0;
    const net = Number(netAmount) || Math.max(gross - deductionAmt, 0);

    await client.query('BEGIN');

    // Update existing pending transaction or insert a new completed one
    if (transactionId) {
      await client.query(
        `UPDATE payment_transactions
         SET order_id = COALESCE($2, order_id),
             payment_id = $3,
             payment_method = $4,
             payment_status = 'completed',
             gross_amount = COALESCE(NULLIF($5, 0), gross_amount),
             deductions = COALESCE($6, deductions),
             net_amount = COALESCE(NULLIF($7, 0), net_amount),
             paid_at = NOW(),
             created_by = COALESCE(created_by, $8)
         WHERE id = $1`,
        [transactionId, orderId || null, razorpay_payment_id, method, gross, deductionAmt, net, createdBy]
      );
    } else {
      await client.query(
        `INSERT INTO payment_transactions
          (id, order_id, created_by, razorpay_order_id, payment_id, payment_method, payment_status,
           gross_amount, deductions, net_amount, currency, gateway, created_at, paid_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'completed', $7, $8, $9, 'INR', 'razorpay', NOW(), NOW())`,
        [
          crypto.randomUUID(),
          orderId || null,
          createdBy,
          razorpay_order_id,
          razorpay_payment_id,
          method,
          gross,
          deductionAmt,
          net,
        ]
      );
    }

    // Also create invoice + payments row when an order exists (idempotent)
    let invoiceId: string | null = null;
    let invoiceNumber: string | null = null;

    if (orderId) {
      const existingInvoice = await client.query(
        `SELECT id, invoice_number FROM invoices WHERE order_id = $1 LIMIT 1`,
        [orderId]
      );

      if (existingInvoice.rows.length > 0) {
        invoiceId = existingInvoice.rows[0].id;
        invoiceNumber = existingInvoice.rows[0].invoice_number;
      } else {
        // Prefer authoritative order totals from DB
        const orderTotals = await client.query(
          `SELECT subtotal, tax_amount, discount_amount, total_amount FROM orders WHERE id = $1 LIMIT 1`,
          [orderId]
        );
        const ot = orderTotals.rows[0] || {};
        const invoiceAmount = Number(ot.subtotal) || gross;
        const invoiceTax = Number(ot.tax_amount) || 0;
        const invoiceDiscount = Number(ot.discount_amount) || deductionAmt;
        const invoiceTotal = Number(ot.total_amount) || net;

        invoiceId = crypto.randomUUID();
        invoiceNumber = `INV-${Date.now()}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15);

        await client.query(
          `INSERT INTO invoices (id, order_id, invoice_number, amount, tax, discount, total, status, issue_date, due_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', CURRENT_DATE, $8)`,
          [
            invoiceId,
            orderId,
            invoiceNumber,
            invoiceAmount,
            invoiceTax,
            invoiceDiscount,
            invoiceTotal,
            dueDate.toISOString().slice(0, 10),
          ]
        );

        await client.query(
          `INSERT INTO payments (id, invoice_id, gateway, transaction_id, amount, currency, status, paid_at, created_at)
           VALUES ($1, $2, 'razorpay', $3, $4, 'INR', 'completed', NOW(), NOW())`,
          [crypto.randomUUID(), invoiceId, razorpay_payment_id, invoiceTotal]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Payment verified and transaction saved.',
      paymentId: razorpay_payment_id,
      paymentMethod: method,
      paymentStatus: 'completed',
      grossAmount: gross,
      deductions: deductionAmt,
      netAmount: net,
      invoiceId,
      invoiceNumber,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('❌ Error verifying Razorpay payment:', error);
    res.status(500).json({ error: error.message || 'Payment verification failed' });
  } finally {
    client.release();
  }
});

export default router;
