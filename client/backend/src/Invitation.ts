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
// Encryption configuration for identity documents (matches Order.ts)
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

function parseDateMMYYYY(val: string | undefined | null): string {
  if (!val?.trim()) return new Date().toISOString().slice(0, 10);
  const trimmed = val.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-01`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function parseEndDateMMYYYY(val: string | undefined | null): string | null {
  if (!val?.trim()) return null;
  const trimmed = val.trim().toLowerCase();
  if (trimmed === 'present' || trimmed === 'current') return null;
  
  const match = trimmed.match(/^(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-01`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return null;
}

// 1. Initialize schema additions for invitations table
async function initializeSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Add columns to invitations table
    await client.query(`
      ALTER TABLE invitations ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
      ALTER TABLE invitations ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
      ALTER TABLE invitations ADD COLUMN IF NOT EXISTS selected_services JSONB;
      ALTER TABLE invitations ADD COLUMN IF NOT EXISTS branch_id UUID;
    `);

    await client.query('COMMIT');
    console.log('⚡ [SCHEMA] Database invitations table updated to support candidate workflows.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during schema update for invitations:', error);
  } finally {
    client.release();
  }
}

// Initialize tables on load
initializeSchema();

// POST /api/invitations
// Endpoint to create a candidate invitation and dispatch it to Power Automate
router.post('/api/invitations', async (req: any, res: any) => {
  const {
    firstName,
    lastName,
    email,
    branchId,
    selectedProducts,
    orderedBy, // UUID of authenticated client user
    emailTemplateName,
    emailSubject,
    emailContent,
    replyTo,
    fromName,
    copyTo
  } = req.body;

  if (!firstName || !lastName || !email || !selectedProducts || !Array.isArray(selectedProducts)) {
    return res.status(400).json({ error: 'Missing required details for invitation' });
  }

  const userId = req.headers['x-user-id'] as string || orderedBy;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: user must be authenticated' });
  }

  try {
    // Verify user and get company_id
    const userRes = await pool.query(
      'SELECT id, company_id, branch_id, is_active FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized: user not found' });
    }

    const authUser = userRes.rows[0];
    if (!authUser.is_active) {
      return res.status(403).json({ error: 'Your account is deactivated' });
    }

    const companyId = authUser.company_id;
    const resolvedBranchId = branchId || authUser.branch_id || null;

    // Generate safe unique invitation token e.g. INV-123456
    const inviteToken = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expires in 7 days

    const invitationId = crypto.randomUUID();

    // Insert into DB inside a transaction
    const dbClient = await pool.connect();
    try {
      await dbClient.query('BEGIN');

      // 1. Insert Invitation
      await dbClient.query(
        `INSERT INTO invitations (id, company_id, email, status, invite_token, expires_at, created_by, first_name, last_name, selected_services, branch_id, created_at)
         VALUES ($1, $2, $3, 'sent', $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [
          invitationId,
          companyId,
          email,
          inviteToken,
          expiresAt,
          userId,
          firstName,
          lastName,
          JSON.stringify(selectedProducts),
          resolvedBranchId
        ]
      );

      // Resolve subject
<<<<<<< HEAD
      const resolvedSubject = emailSubject || 'Background Verification Process – Action Required';
=======
      const resolvedSubject = emailSubject || `Background Check Invitation - ${firstName} ${lastName}`;
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308

      // 2. Insert into email_logs
      const emailLogId = crypto.randomUUID();
      await dbClient.query(
        `INSERT INTO email_logs (id, recipient, subject, provider, status, sent_at)
         VALUES ($1, $2, $3, 'Power Automate', 'sent', NOW())`,
        [emailLogId, email, resolvedSubject]
      );

      await dbClient.query('COMMIT');

      // 3. Trigger Power Automate flow asynchronously
      const webhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
      const inviteUrl = `http://localhost:5173/#invite-form?id=${inviteToken}`;

<<<<<<< HEAD
      const checksList = (selectedProducts || [])
        .map((id: string) => {
          const name = SERVICE_NAMES[id] || id;
          return `<li>${name}</li>`;
        })
        .join('');

=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
      let emailBody = '';
      if (emailContent && emailContent.trim() !== '') {
        const fullName = `${firstName} ${lastName}`.trim();
        let formattedBody = emailContent
          .replaceAll("[applicant_first_name]", firstName)
          .replaceAll("[applicant_last_name]", lastName)
          .replaceAll("[applicant_name]", fullName)
          .replaceAll("[company_name]", "EvalRight Client Corp")
          .replaceAll("[FCRA_URL]", "https://www.evalright.com/fcra")
<<<<<<< HEAD
          .replaceAll("[company_info]", "EvalRight Client Corp, 100 Main St, Chicago, IL")
          .replaceAll("[CHECKS_TO_BE_COMPLETED]", checksList);
=======
          .replaceAll("[company_info]", "EvalRight Client Corp, 100 Main St, Chicago, IL");
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308

        const linkHtml = `<div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: rgb(199, 0, 57); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Start Background Check Form</a>
        </div>`;

        if (formattedBody.includes("[INVITATION_URL]")) {
          emailBody = formattedBody.replaceAll("[INVITATION_URL]", linkHtml);
        } else {
          emailBody = formattedBody + `<p style="margin-top: 24px;"><b>Please click the button below to fill out your background check authorization form:</b></p>${linkHtml}`;
        }
      } else {
        // Fallback default body
<<<<<<< HEAD
        const fullName = `${firstName} ${lastName}`.trim();
        emailBody = `
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
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: rgb(199, 0, 57); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Start Background Check Form</a>
          </div>
          <p style="margin-top: 24px;">Thanks & Regards,<br/>
          <strong>Evalright Background Verification Team</strong></p>
=======
        emailBody = `
          <p>Hello ${firstName},</p>
          <p style="margin-top: 16px;">Below you will find a link to authorize and initiate a background check, which is required as a condition of employment.</p>
          <p style="margin-top: 16px;">Please save this email and keep it handy as it contains instructions for entering information to process the background check.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: rgb(199, 0, 57); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Start Background Check Form</a>
          </div>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
        `;
      }
      
      console.log(`✉️ Sending candidate invitation webhook via Power Automate. Token: ${inviteToken}`);
      
      if (webhookUrl && webhookUrl.trim() !== '') {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateEmail: email,
            candidateName: `${firstName} ${lastName}`,
            inviteUrl: inviteUrl,
            selectedProducts: selectedProducts,
            companyName: 'EvalRight Client Corp',
            emailSubject: resolvedSubject,
            emailBody: emailBody,
            fromName: fromName || 'EvalRight Support',
            replyTo: replyTo || 'support@evalright.us',
            copyTo: copyTo || ''
          })
        }).then(response => {
          if (!response.ok) {
            console.error('❌ Power Automate Webhook returned error status:', response.status);
          } else {
            console.log('✅ Power Automate Webhook successfully triggered.');
          }
        }).catch(err => {
          console.error('❌ Error hitting Power Automate Webhook:', err.message);
        });
      } else {
        console.warn('⚠️ [WARNING] POWER_AUTOMATE_WEBHOOK_URL is not configured in backend .env. Skipping email trigger. Local link: ' + inviteUrl);
      }

      return res.status(201).json({
        success: true,
        message: 'Invitation created successfully',
        invitationId,
        inviteToken,
        inviteUrl
      });

    } catch (txErr: any) {
      await dbClient.query('ROLLBACK');
      throw txErr;
    } finally {
      dbClient.release();
    }

  } catch (err: any) {
    console.error('❌ Error creating invitation:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/invitations/:token
// Retrieves invitation details for loading candidate form dynamically
router.get('/api/invitations/:token', async (req: any, res: any) => {
  const { token } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, company_id, email, status, first_name, last_name, selected_services, branch_id, expires_at 
       FROM invitations 
       WHERE invite_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const invitation = result.rows[0];

    // Check expiration
    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Invitation has expired' });
    }

    res.json({
      success: true,
      invitation: {
        inviteId: token,
        name: `${invitation.first_name} ${invitation.last_name}`,
        email: invitation.email,
        selectedProducts: invitation.selected_services,
        branchId: invitation.branch_id,
        companyId: invitation.company_id,
        status: invitation.status
      }
    });

  } catch (err: any) {
    console.error('❌ Error fetching invitation details:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/invitations/:token/submit
// Receives questionnaire submission and registers applicant, consent, histories, and orders in the DB
router.post('/api/invitations/:token/submit', async (req: any, res: any) => {
  const { token } = req.params;
  const formData = req.body;

  try {
    // 1. Fetch current invitation details
    const inviteRes = await pool.query(
      `SELECT id, company_id, email, first_name, last_name, selected_services, branch_id, created_by 
       FROM invitations 
       WHERE invite_token = $1 AND status != 'completed'`,
      [token]
    );

    if (inviteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Invitation not found, completed, or expired' });
    }

    const invitation = inviteRes.rows[0];
    const companyId = invitation.company_id;
    const branchId = invitation.branch_id;
    const orderedBy = invitation.created_by; // the client user who ordered it
    const selectedServices = invitation.selected_services || [];

    const parsedDob = parseDateOfBirth(formData.dob);
    if (!parsedDob) {
      return res.status(400).json({ error: 'Invalid date of birth format. Use MM/DD/YYYY.' });
    }

    // 2. Perform authoritative pricing lookup for selected products
    let subtotal = 0;
    const servicePriceList: Array<{ id: string; price: number }> = [];

    if (selectedServices && selectedServices.length > 0) {
      const mappedIds = selectedServices.map((id: string) => {
        if (id === 'adhr-trace-address' || id === 'ssn-trace-address') return 'adhr-trace';
        if (id === 'adhr-validation' || id === 'ssn-validation') return 'adhr-validation';
        return id;
      });

      const servicesRes = await pool.query(
        'SELECT id, base_price FROM services WHERE service_code = ANY($1::text[]) OR id::text = ANY($1::text[])',
        [mappedIds]
      );
      servicesRes.rows.forEach(row => {
        const price = parseFloat(row.base_price) || 0.00;
        subtotal += price;
        servicePriceList.push({ id: row.id, price });
      });
    }

    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Begin database storage transaction
    const dbClient = await pool.connect();
    try {
      await dbClient.query('BEGIN');

      // A. Create/Update Applicant
      const adhrNumber = formData.adhr;
      const encryptedAdhr = adhrNumber ? encrypt(adhrNumber) : 'ENCRYPTED';
      
      let applicantId = '';
      const findApplicant = await dbClient.query(
        'SELECT id FROM applicants WHERE company_id = $1 AND email = $2',
        [companyId, formData.email]
      );

      if (findApplicant.rows.length > 0) {
        applicantId = findApplicant.rows[0].id;
        // Update details
        await dbClient.query(
          `UPDATE applicants 
           SET first_name = $1, last_name = $2, dob = $3, phone = $4, ssn_encrypted = $5, updated_at = NOW() 
           WHERE id = $6`,
          [formData.firstName, formData.lastName, parsedDob, formData.phone || null, encryptedAdhr, applicantId]
        );
      } else {
        applicantId = crypto.randomUUID();
        await dbClient.query(
          `INSERT INTO applicants (id, company_id, created_by, dob, email, phone, status, ssn_encrypted, first_name, middle_name, last_name, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'Active', $7, $8, $9, $10, NOW(), NOW())`,
          [
            applicantId,
            companyId,
            orderedBy || null,
            parsedDob,
            formData.email,
            formData.phone || null,
            encryptedAdhr,
            formData.firstName,
            formData.middleName || null,
            formData.lastName
          ]
        );
      }

      // B. Save Address
      if (formData.street) {
        const addressId = crypto.randomUUID();
        await dbClient.query(
          `INSERT INTO applicant_addresses (id, applicant_id, is_current, street1, city, state, country, zip_code, address_type, created_at)
           VALUES ($1, $2, true, $3, $4, $5, $6, $7, 'current', NOW())`,
          [
            addressId,
            applicantId,
            formData.street,
            formData.city || 'Unknown',
            formData.state || 'Unknown',
            'IN',
            formData.zip || '000000'
          ]
        );
      }

      // C. Save Identity Documents
      // Aadhaar
      if (adhrNumber) {
        const docId = crypto.randomUUID();
        const numHash = crypto.createHash('sha256').update(adhrNumber).digest('hex');
        const lastFour = adhrNumber.slice(-4);
        await dbClient.query(
          `INSERT INTO identity_documents (id, applicant_id, document_type, document_number_encrypted, document_number_hash, last_four, country_code, created_at, updated_at)
           VALUES ($1, $2, 'AADHAAR', $3, $4, $5, 'IN', NOW(), NOW())`,
          [docId, applicantId, encryptedAdhr, numHash, lastFour]
        );
      }

      // Driver's License
      if (formData.licenseNumber) {
        const docId = crypto.randomUUID();
        const encryptedLicense = encrypt(formData.licenseNumber);
        const numHash = crypto.createHash('sha256').update(formData.licenseNumber).digest('hex');
        const lastFour = formData.licenseNumber.slice(-4);
        await dbClient.query(
          `INSERT INTO identity_documents (id, applicant_id, document_type, document_number_encrypted, document_number_hash, last_four, country_code, created_at, updated_at)
           VALUES ($1, $2, 'DRIVING_LICENSE', $3, $4, $5, $6, NOW(), NOW())`,
          [docId, applicantId, encryptedLicense, numHash, lastFour, formData.licenseState || 'IN']
        );
      }

      // D. Save Education History
      if (formData.schoolName) {
        const eduId = crypto.randomUUID();
        const gradDateParsed = parseDateMMYYYY(formData.gradDate);
        await dbClient.query(
          `INSERT INTO education_histories (id, applicant_id, school_name, degree, field_of_study, end_date, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())`,
          [eduId, applicantId, formData.schoolName, formData.degree, formData.major || null, gradDateParsed]
        );
      }

      // E. Save Employment History
      if (formData.employerName) {
        const empId = crypto.randomUUID();
        const empStartParsed = parseDateMMYYYY(formData.empStart);
        const empEndParsed = parseEndDateMMYYYY(formData.empEnd);
        await dbClient.query(
          `INSERT INTO employment_histories (id, applicant_id, employer_name, job_title, start_date, end_date, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())`,
          [empId, applicantId, formData.employerName, formData.jobTitle, empStartParsed, empEndParsed]
        );
      }

      // F. Generate safe unique order number
      const year = new Date().getFullYear();
      const countRes = await dbClient.query('SELECT COUNT(*) FROM orders');
      const orderSeq = parseInt(countRes.rows[0].count, 10) + 1;
      const orderNumber = `EVR-${year}-${orderSeq.toString().padStart(6, '0')}`;

      // H. Create main order
      const orderId = crypto.randomUUID();
      await dbClient.query(
        `INSERT INTO orders (id, company_id, branch_id, applicant_id, ordered_by, order_number, status, priority, currency, subtotal, discount_amount, tax_amount, total_amount, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'standard', 'INR', $7, 0.00, $8, $9, NOW(), NOW())`,
        [
          orderId,
          companyId,
          branchId,
          applicantId,
          orderedBy || null,
          orderNumber,
          subtotal,
          taxAmount,
          totalAmount
        ]
      );

      // I. Create order verifications
      for (const item of servicePriceList) {
        const verId = crypto.randomUUID();
        const itemTax = item.price * taxRate;
        const finalPrice = item.price + itemTax;

        await dbClient.query(
          `INSERT INTO order_verifications (id, order_id, service_id, status, result, unit_price, discount_amount, tax_amount, final_price, started_at)
           VALUES ($1, $2, $3, 'pending', 'pending', $4, 0.00, $5, $6, NOW())`,
          [verId, orderId, item.id, item.price, itemTax, finalPrice]
        );
      }

      // J. Create Consent record
      const consentId = crypto.randomUUID();
      const ipAddress = req.ip || '127.0.0.1';
      await dbClient.query(
        `INSERT INTO consents (id, applicant_id, order_id, consent_type, ip_address, signed_at)
         VALUES ($1, $2, $3, 'Candidate Screen Consent', $4, NOW())`,
        [consentId, applicantId, orderId, ipAddress]
      );

      // K. Create status history
      const historyId = crypto.randomUUID();
      await dbClient.query(
        `INSERT INTO order_status_history (id, order_id, old_status, new_status, changed_by, changed_at, reason)
         VALUES ($1, $2, 'pending', 'pending', $3, NOW(), 'Completed by Candidate via Invite Portal')`,
        [historyId, orderId, orderedBy || null]
      );

      // L. Update invitation status to completed
      await dbClient.query(
        `UPDATE invitations SET status = 'completed' WHERE id = $1`,
        [invitation.id]
      );

      // M. Create Activity Log
      const logId = crypto.randomUUID();
      await dbClient.query(
        `INSERT INTO activity_logs (id, user_id, company_id, action, module, record_id, created_at)
         VALUES ($1, $2, $3, 'candidate_complete_invitation', 'invitations', $4, NOW())`,
        [logId, orderedBy || null, companyId, invitation.id]
      );

      await dbClient.query('COMMIT');
      
      console.log(`✅ Candidate invitation token ${token} successfully submitted and stored as Order ${orderNumber}.`);
      
      res.status(201).json({
        success: true,
        message: 'Invitation details successfully submitted and saved',
        orderId,
        orderNumber
      });

    } catch (txErr: any) {
      await dbClient.query('ROLLBACK');
      console.error('❌ DB Transaction error submitting invitation details:', txErr);
      throw txErr;
    } finally {
      dbClient.release();
    }

  } catch (err: any) {
    console.error('❌ Error submitting invitation details:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
