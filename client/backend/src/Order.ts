import { Router } from 'express';
import crypto from 'crypto';
import { pool } from './config/db';

const router = Router();

<<<<<<< HEAD
const SERVICE_NAMES: Record<string, string> = {
  "personal-details": "Personal Details",
  "ssn-check": "SSN Check",
  "id-verification-aadhar": "ID Verification (Aadhar)",
  "id-verification-pan": "ID Verification (PAN)",
  "id-verification-dl": "ID Verification (DL)",
  "id-verification-voterid": "ID Verification (Voter ID)",
  "id-verification-passport": "ID Verification (Passport)",
  "uan-verification": "UAN Verification",
  "indian-database-check": "Indian Database Check",
  "global-database-check": "Global Database Check",
  "ofac-check": "OFAC Check",
  "criminal-record-check": "Criminal Record Check",
  "police-verification-check": "Police Verification Check",
  "nationwide-criminal-check": "Nationwide Criminal Check",
  "national-sex-offender-registry-check": "National Sex Offender Registry Check",
  "credit-check": "Credit Check",
  "26as-check": "26AS Check",
  "form-16-check": "Form 16 Check",
  "itr-check": "ITR Check",
  "employment-verification": "Employment Verification",
  "education-verification": "Education Verification",
  "reference-check": "Reference Check",
  "freelancing-check": "Freelancing Check",
  "directorship-check": "Directorship Check",
  "cv-check": "Cv Check",
  "gap-analysis": "Gap Analysis",
  "address-verification": "Address Verification",
  "supplier-address": "Supplier Address",
  "drug-test": "Drug test",
  "medical-examination-test": "Medical Examination Test",
  "social-media-check": "Social Media Check",
  "right-to-work": "Right to Work",
  "emergency": "Emergency",
  "authorization": "Authorization",
  "exit": "Exit"
};

=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
// Encryption key for identity documents (mock key for development purposes)
const ENCRYPTION_KEY = crypto.scryptSync('evalright_secure_key_123', 'salt', 32);
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function parseDateOfBirth(dob: string | undefined | null): string | null {
  if (!dob?.trim()) return null;

  const trimmed = dob.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const mdyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdyMatch) {
    const [, month, day, year] = mdyMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return null;
}

// Initialize tables and columns to support the updated process
async function initializeSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Create identity_documents table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS identity_documents (
        id UUID PRIMARY KEY,
        applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
        document_type VARCHAR(50) NOT NULL,
        document_number_encrypted TEXT NOT NULL,
        document_number_hash VARCHAR(64) NOT NULL,
        last_four VARCHAR(4),
        country_code VARCHAR(10),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Add columns to orders table
    await client.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255) UNIQUE;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0.00;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) DEFAULT 0.00;
    `);

    // Ensure orders currency defaults to INR (Indian Rupees)
    await client.query(`
      ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'INR';
      UPDATE orders SET currency = 'INR' WHERE currency IS NULL OR currency = 'USD';
    `);

    // 3. Add columns to order_verifications table
    await client.query(`
      ALTER TABLE order_verifications ADD COLUMN IF NOT EXISTS unit_price NUMERIC(12,2) DEFAULT 0.00;
      ALTER TABLE order_verifications ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0.00;
      ALTER TABLE order_verifications ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
      ALTER TABLE order_verifications ADD COLUMN IF NOT EXISTS final_price NUMERIC(12,2) DEFAULT 0.00;
    `);

    await client.query('COMMIT');
    console.log('⚡ [SCHEMA] Database tables and columns updated to match the process specification.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during schema update:', error);
  } finally {
    client.release();
  }
}

// Call initialization
initializeSchema();

router.post('/api/orders', async (req: any, res: any) => {
  const {
    applicantDetails, // { firstName, middleName, lastName, email, phone, dob, adhr (Aadhaar), street1, street2, city, state, zipCode }
    branchId,
    packageId,
    serviceIds, // array of UUIDs
    priority,
    notes,
    idempotencyKey
  } = req.body;

  // Derive company from the authenticated user — never trust client-supplied company_id
  const orderedBy = req.headers['x-user-id'] as string || req.body.orderedBy;

  if (!applicantDetails || !applicantDetails.firstName || !applicantDetails.lastName || !applicantDetails.email) {
    return res.status(400).json({ error: 'Missing applicant details' });
  }

  if (!orderedBy) {
    return res.status(401).json({ error: 'Unauthorized: user must be authenticated' });
  }

  let companyId: string;
  let resolvedBranchId: string | null = branchId || null;

  try {
    const userRes = await pool.query(
      'SELECT id, company_id, branch_id, is_active FROM users WHERE id = $1',
      [orderedBy]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized: user not found' });
    }

    const authUser = userRes.rows[0];
    if (!authUser.is_active) {
      return res.status(403).json({ error: 'Your account is deactivated' });
    }

    companyId = authUser.company_id;

    if (resolvedBranchId) {
      const branchRes = await pool.query(
        'SELECT id FROM branches WHERE id = $1 AND company_id = $2',
        [resolvedBranchId, companyId]
      );
      if (branchRes.rows.length === 0) {
        resolvedBranchId = authUser.branch_id || null;
      }
    } else {
      resolvedBranchId = authUser.branch_id || null;
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Error verifying authenticated user: ' + err.message });
  }

  const parsedDob = parseDateOfBirth(applicantDetails.dob);
  if (!parsedDob) {
    return res.status(400).json({ error: 'Invalid date of birth format. Use MM/DD/YYYY.' });
  }

  // Idempotency check
  if (idempotencyKey) {
    try {
      const existingOrder = await pool.query('SELECT id, order_number, status FROM orders WHERE idempotency_key = $1', [idempotencyKey]);
      if (existingOrder.rows.length > 0) {
        return res.json({
          success: true,
          message: 'Order already exists (Idempotent response)',
          orderId: existingOrder.rows[0].id,
          orderNumber: existingOrder.rows[0].order_number,
          status: existingOrder.rows[0].status
        });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Load authoritative prices for selected services
  let subtotal = 0;
  const servicePriceList: Array<{ id: string; price: number }> = [];

  if (serviceIds && serviceIds.length > 0) {
    // Map frontend service IDs to database service codes
    const mappedIds = serviceIds.map((id: string) => {
      if (id === 'adhr-trace-address' || id === 'ssn-trace-address') return 'adhr-trace';
      if (id === 'adhr-validation' || id === 'ssn-validation') return 'adhr-validation';
      return id;
    });

    try {
      const servicesRes = await pool.query(
        'SELECT id, base_price FROM services WHERE service_code = ANY($1::text[]) OR id::text = ANY($1::text[])',
        [mappedIds]
      );
      servicesRes.rows.forEach(row => {
        const price = parseFloat(row.base_price) || 0.00;
        subtotal += price;
        servicePriceList.push({ id: row.id, price });
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Error loading service pricing catalog: ' + err.message });
    }
  }

  const taxRate = 0.08; // 8% mock tax
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const clientConnection = await pool.connect();
  try {
    await clientConnection.query('BEGIN');

    // Prepare encrypted value for applicants.ssn_encrypted column (stores ADHR/Aadhaar)
    const adhrNumber = applicantDetails.adhr || applicantDetails.ssn;
    const encryptedAdhr = adhrNumber ? encrypt(adhrNumber) : 'ENCRYPTED';

    // 1. Find or create applicant within company
    let applicantId = '';
    const findApplicant = await clientConnection.query(
      'SELECT id FROM applicants WHERE company_id = $1 AND email = $2',
      [companyId, applicantDetails.email]
    );

    if (findApplicant.rows.length > 0) {
      applicantId = findApplicant.rows[0].id;
    } else {
      applicantId = crypto.randomUUID();
      await clientConnection.query(
        `INSERT INTO applicants (id, company_id, created_by, dob, email, phone, status, ssn_encrypted, first_name, middle_name, last_name, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          applicantId,
          companyId,
          orderedBy || null,
          parsedDob,
          applicantDetails.email,
          applicantDetails.phone || null,
          'Active',
          encryptedAdhr,
          applicantDetails.firstName,
          applicantDetails.middleName || null,
          applicantDetails.lastName
        ]
      );
    }

    // 2. Store Applicant Address
    if (applicantDetails.street1) {
      const addressId = crypto.randomUUID();
      await clientConnection.query(
        `INSERT INTO applicant_addresses (id, applicant_id, is_current, street1, street2, city, state, country, zip_code, address_type, created_at)
         VALUES ($1, $2, true, $3, $4, $5, $6, $7, $8, 'current', NOW())`,
        [
          addressId,
          applicantId,
          applicantDetails.street1,
          applicantDetails.street2 || null,
          applicantDetails.city?.trim() || 'Unknown',
          applicantDetails.state || 'Unknown',
          applicantDetails.country || 'USA',
          applicantDetails.zipCode?.trim() || '00000'
        ]
      );
    }

    // 3. Store Identity Document (Aadhaar / ADHR) safely encrypted
    if (adhrNumber) {
      const docId = crypto.randomUUID();
      const numHash = crypto.createHash('sha256').update(adhrNumber).digest('hex');
      const lastFour = adhrNumber.slice(-4);

      await clientConnection.query(
        `INSERT INTO identity_documents (id, applicant_id, document_type, document_number_encrypted, document_number_hash, last_four, country_code, created_at, updated_at)
         VALUES ($1, $2, 'AADHAAR', $3, $4, $5, 'IN', NOW(), NOW())`,
        [
          docId,
          applicantId,
          encryptedAdhr,
          numHash,
          lastFour
        ]
      );
    }

    // 4. Generate safe unique order number (e.g. EVR-YYYY-XXXXXX)
    const year = new Date().getFullYear();
    const countRes = await clientConnection.query('SELECT COUNT(*) FROM orders');
    const orderSeq = parseInt(countRes.rows[0].count, 10) + 1;
    const orderNumber = `EVR-${year}-${orderSeq.toString().padStart(6, '0')}`;

    // 5. Create Main Order with pricing snapshots
    const orderId = crypto.randomUUID();
    let finalPriority = 'standard';
    if (priority) {
      const p = priority.toLowerCase();
      if (p === 'high' || p === 'rush') {
        finalPriority = 'rush';
      } else if (p === 'low') {
        finalPriority = 'low';
      }
    }
    await clientConnection.query(
      `INSERT INTO orders (id, company_id, branch_id, applicant_id, package_id, ordered_by, order_number, idempotency_key, status, priority, currency, subtotal, discount_amount, tax_amount, total_amount, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, 'INR', $10, 0.00, $11, $12, $13, NOW(), NOW())`,
      [
        orderId,
        companyId,
        resolvedBranchId,
        applicantId,
        packageId || null,
        orderedBy || null,
        orderNumber,
        idempotencyKey || null,
        finalPriority,
        subtotal,
        taxAmount,
        totalAmount,
        notes || null
      ]
    );

    // 6. Create Order Verifications with pricing snapshots
    for (const item of servicePriceList) {
      const verId = crypto.randomUUID();
      const itemTax = item.price * taxRate;
      const finalPrice = item.price + itemTax;

      await clientConnection.query(
        `INSERT INTO order_verifications (id, order_id, service_id, status, result, unit_price, discount_amount, tax_amount, final_price, started_at)
         VALUES ($1, $2, $3, 'pending', 'pending', $4, 0.00, $5, $6, NOW())`,
        [
          verId,
          orderId,
          item.id,
          item.price,
          itemTax,
          finalPrice
        ]
      );
    }

    // 7. Create Consent entry
    const consentId = crypto.randomUUID();
    const ipAddress = req.ip || '127.0.0.1';
    await clientConnection.query(
      `INSERT INTO consents (id, applicant_id, order_id, consent_type, ip_address, signed_at)
       VALUES ($1, $2, $3, 'Aadhaar Verification Consent', $4, NOW())`,
      [consentId, applicantId, orderId, ipAddress]
    );

    // 8. Create Status History entry
    const historyId = crypto.randomUUID();
    await clientConnection.query(
      `INSERT INTO order_status_history (id, order_id, old_status, new_status, changed_by, changed_at, reason)
       VALUES ($1, $2, 'pending', 'pending', $3, NOW(), 'Order placed by client')`,
      [historyId, orderId, orderedBy || null]
    );

    // 9. Create Activity Log
    const logId = crypto.randomUUID();
    await clientConnection.query(
      `INSERT INTO activity_logs (id, user_id, company_id, action, module, record_id, created_at)
       VALUES ($1, $2, $3, 'create_order', 'orders', $4, NOW())`,
      [logId, orderedBy || null, companyId, orderId]
    );

<<<<<<< HEAD
=======
    // 9b. Create Email Log for candidate notification
    const emailLogId = crypto.randomUUID();
    const emailSubject = `Background Check Process Initiated - ${applicantDetails.firstName} ${applicantDetails.lastName}`;
    await clientConnection.query(
      `INSERT INTO email_logs (id, recipient, subject, provider, status, sent_at)
       VALUES ($1, $2, $3, 'Power Automate', 'sent', NOW())`,
      [emailLogId, applicantDetails.email, emailSubject]
    );

>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    // 9c. Create corresponding completed invitation entry to generate inviteToken and inviteUrl
    const inviteToken = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const invitationId = crypto.randomUUID();
    
    await clientConnection.query(
      `INSERT INTO invitations (id, company_id, email, status, invite_token, expires_at, created_by, first_name, last_name, selected_services, branch_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
      [
        invitationId,
        companyId,
        applicantDetails.email,
        'completed',
        inviteToken,
        expiresAt,
        orderedBy || null,
        applicantDetails.firstName,
        applicantDetails.lastName,
        JSON.stringify(serviceIds || []),
        resolvedBranchId
      ]
    );

<<<<<<< HEAD
    const inviteUrl = `http://localhost:5173/#invite-form?id=${inviteToken}`;
    const linkHtml = `<div style="text-align: center; margin: 30px 0;">
      <a href="${inviteUrl}" style="background-color: rgb(199, 0, 57); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Start Background Check Form</a>
    </div>`;

    const fullName = `${applicantDetails.firstName} ${applicantDetails.lastName}`.trim();
    const emailSubject = 'Background Verification Process – Action Required';
    const checksList = (serviceIds || [])
      .map((id: string) => {
        const name = SERVICE_NAMES[id] || id;
        return `<li>${name}</li>`;
      })
      .join('');

    const emailBody = `
      <p>Hi ${fullName},</p>
      <p style="margin-top: 16px;">Greetings from Evalright.</p>
      <p style="margin-top: 16px;">As the next step of the hiring process, your Background Verification needs to be initiated. We, Demo Client, are partnered with Evalright (BGV Agency) for this activity, and they will connect with you via email/phone to complete the process. You are requested to coordinate with the Evalright team and share the required information and documents through the Evalright Background Verification Portal.</p>
      <p style="margin-top: 16px;">Kindly follow the below steps to fill in the details and upload the documents:</p>
      <ul style="margin-top: 8px; padding-left: 20px; list-style-type: disc;">
        <li>Use the Portal URL, User ID, and Password mentioned at the bottom of this email to log in.</li>
        <li>Complete all the required verification sections on the portal.</li>
        <li>Please ensure that all required information is submitted within 48 hours of receiving this email.</li>
      </ul>
      <p style="margin-top: 16px;"><strong>Checks to be Completed</strong></p>
      <ul style="margin-top: 8px; padding-left: 20px; list-style-type: disc;">
        ${checksList}
      </ul>
      <p style="margin-top: 16px;"><strong>Important Notes</strong></p>
      <ul style="margin-top: 8px; padding-left: 20px; list-style-type: disc;">
        <li>After completing all the required details and uploading the requested documents, click the Final Submission button to receive an acknowledgment email.</li>
        <li>Please ensure that each uploaded document is less than 2 MB in size.</li>
      </ul>
      <p style="margin-top: 16px;">If you have any questions while filling out the information or experience any issues with the portal, please contact the Evalright Support Team at:</p>
      <p style="margin-top: 8px;"><a href="mailto:support@evalright.com" style="color: rgb(199, 0, 57);">support@evalright.com</a></p>
      <p style="margin-top: 16px;">You may also contact us at:</p>
      <p style="margin-top: 8px;">
        +91 XXXXXXXXXX<br/>
        <a href="mailto:testingit@gmail.com" style="color: rgb(199, 0, 57);">testingit@gmail.com</a>
      </p>
      <p style="margin-top: 16px;">To contact Demo Client, please write to:</p>
      <p style="margin-top: 8px;">Fetesh – <a href="mailto:fatesh@yopmail.com" style="color: rgb(199, 0, 57);">fatesh@yopmail.com</a></p>
      ${linkHtml}
      <p style="margin-top: 24px;">Thanks & Regards,<br/>
      <strong>Evalright Background Verification Team</strong></p>
    `;

    // 9b. Create Email Log for candidate notification
    const emailLogId = crypto.randomUUID();
    await clientConnection.query(
      `INSERT INTO email_logs (id, recipient, subject, provider, status, sent_at)
       VALUES ($1, $2, $3, 'Power Automate', 'sent', NOW())`,
      [emailLogId, applicantDetails.email, emailSubject]
    );

=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    await clientConnection.query('COMMIT');

    // 10. Trigger Power Automate flow asynchronously for Candidate Notification
    const webhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
<<<<<<< HEAD
=======
    const inviteUrl = `http://localhost:5173/#invite-form?id=${inviteToken}`;
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    console.log(`✉️ Sending candidate order confirmation webhook via Power Automate. Candidate: ${applicantDetails.email}, URL: ${inviteUrl}`);
    
    if (webhookUrl && webhookUrl.trim() !== '') {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateEmail: applicantDetails.email,
          candidateName: `${applicantDetails.firstName} ${applicantDetails.lastName}`,
          inviteUrl: inviteUrl,
          selectedProducts: serviceIds || [],
<<<<<<< HEAD
          companyName: 'EvalRight Client Corp',
          emailSubject: emailSubject,
          emailBody: emailBody,
          fromName: 'EvalRight Support',
          replyTo: 'support@evalright.us',
          copyTo: ''
=======
          companyName: 'EvalRight Client Corp'
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
        })
      }).then(response => {
        if (!response.ok) {
          console.error('❌ Power Automate Webhook (Order) returned error status:', response.status);
        } else {
          console.log('✅ Power Automate Webhook (Order) successfully triggered.');
        }
      }).catch(err => {
        console.error('❌ Error hitting Power Automate Webhook (Order):', err.message);
      });
    } else {
      console.warn('⚠️ [WARNING] POWER_AUTOMATE_WEBHOOK_URL is not configured in backend .env. Skipping email trigger.');
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId,
      orderNumber,
      status: 'pending',
      inviteToken,
      inviteUrl
    });

  } catch (err: any) {
    await clientConnection.query('ROLLBACK');
    console.error('❌ Error executing database transaction for order:', err);
    res.status(500).json({ error: err.message });
  } finally {
    clientConnection.release();
  }
});

export default router;
