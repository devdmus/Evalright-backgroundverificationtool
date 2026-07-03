import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { pool } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'Admin Backend Server is running',
      database: 'connected',
      timestamp: dbResult.rows[0].now,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Admin Query: Get Orders with Applicant Details (JOIN query)
app.get('/api/orders', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id as order_id, 
        o.order_number, 
        o.status as order_status, 
        o.priority,
        a.first_name, 
        a.last_name, 
        a.email as applicant_email,
        o.created_at
      FROM orders o
      JOIN applicants a ON o.applicant_id = a.id
      ORDER BY o.created_at DESC
      LIMIT 20;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Query: Get Invoices
app.get('/api/billing/invoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, invoice_number, amount, tax, discount, total, status, issue_date FROM invoices ORDER BY issue_date DESC LIMIT 10;');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Query: Get API Logs
app.get('/api/audit/api-logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, request_id, api_version, endpoint, method, status_code, created_at FROM api_logs ORDER BY created_at DESC LIMIT 15;');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Query: Add New Client (Create Company, Branch, User, Settings, Role Assignment, logs in one transaction)
app.post('/api/clients', async (req, res) => {
  const {
    companyName,
    address1,
    address2,
    city,
    state,
    postcode,
    phoneNumber,
    firstName,
    lastName,
    email,
    username,
    password,
    status,
    dontApplyLateFees,
    dontSendOverdueEmails,
    dontApplyTax,
    clientGroup,
    creditBalance,
    adminNotes,
    sendAccountMessage
  } = req.body;

  // Basic validation
  if (!companyName || !email || !username || !password || !firstName) {
    return res.status(400).json({ error: 'Missing required fields: companyName, email, username, password, firstName' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Generate UUIDs for references
    const companyId = crypto.randomUUID();
    const branchId = crypto.randomUUID();
    const userId = crypto.randomUUID();

    // Generate sequential ID like COM-01, COM-02... for numeric_id column
    const maxIdRes = await client.query("SELECT numeric_id FROM companies WHERE numeric_id LIKE 'COM-%'");
    let nextNum = 1;
    if (maxIdRes.rows.length > 0) {
      const nums = maxIdRes.rows.map(row => {
        const parts = row.numeric_id.split('-');
        const n = parseInt(parts[1], 10);
        return isNaN(n) ? 0 : n;
      });
      nextNum = Math.max(...nums) + 1;
    }
    const numericId = `COM-${nextNum < 10 ? '0' + nextNum : nextNum}`;

    // 1. Insert Company
    const insertCompanyQuery = `
      INSERT INTO companies (id, name, legal_name, status, numeric_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `;
    const companyStatus = status ? status.toLowerCase() : 'active';
    await client.query(insertCompanyQuery, [companyId, companyName, companyName, companyStatus, numericId]);

    // 2. Insert Company Settings (handling not-null constraints)
    const insertSettingsQuery = `
      INSERT INTO company_settings (id, company_id, currency, timezone, date_format, created_at, updated_at)
      VALUES ($1, $2, 'USD', 'UTC', 'YYYY-MM-DD', NOW(), NOW())
    `;
    await client.query(insertSettingsQuery, [crypto.randomUUID(), companyId]);

    // 3. Insert Branch
    const fullAddress = [address1, address2, city, state, postcode].filter(Boolean).join(', ');
    const insertBranchQuery = `
      INSERT INTO branches (id, company_id, name, address, status, created_at, updated_at)
      VALUES ($1, $2, 'Headquarters', $3, 'active', NOW(), NOW())
    `;
    await client.query(insertBranchQuery, [branchId, companyId, fullAddress || null]);

    // 4. Hash password with SHA-256 and insert User
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const insertUserQuery = `
      INSERT INTO users (id, company_id, branch_id, username, email, password_hash, first_name, last_name, phone, is_active, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, false, NOW(), NOW())
    `;
    await client.query(insertUserQuery, [
      userId,
      companyId,
      branchId,
      username,
      email,
      passwordHash,
      firstName,
      lastName || null,
      phoneNumber || null
    ]);

    // 5. Ensure client_admin role exists in roles table and link it in user_roles
    const checkRoleQuery = `SELECT id FROM roles WHERE name = 'client_admin'`;
    const roleRes = await client.query(checkRoleQuery);
    let roleId;
    if (roleRes.rows.length === 0) {
      roleId = crypto.randomUUID();
      const insertRoleQuery = `
        INSERT INTO roles (id, name, description, created_at)
        VALUES ($1, 'client_admin', 'Client Administrator Role', NOW())
      `;
      await client.query(insertRoleQuery, [roleId]);
    } else {
      roleId = roleRes.rows[0].id;
    }

    const insertUserRoleQuery = `
      INSERT INTO user_roles (id, user_id, role_id, created_at)
      VALUES ($1, $2, $3, NOW())
    `;
    await client.query(insertUserRoleQuery, [crypto.randomUUID(), userId, roleId]);

    // 6. Log the Admin creation in activity logs
    const insertLogQuery = `
      INSERT INTO activity_logs (id, user_id, company_id, action, module, created_at)
      VALUES ($1, null, $2, 'create_client', 'clients', NOW())
    `;
    await client.query(insertLogQuery, [crypto.randomUUID(), companyId]);

    // 7. Welcome Email message logging if requested
    if (sendAccountMessage) {
      const insertEmailLogQuery = `
        INSERT INTO email_logs (id, recipient, subject, provider, status, sent_at)
        VALUES ($1, $2, 'Welcome to EvalRight - Your Account Details', 'smtp', 'sent', NOW())
      `;
      await client.query(insertEmailLogQuery, [crypto.randomUUID(), email]);
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Client created successfully', companyId: numericId, userId });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating client:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Admin Query: Get all Clients (retrieves companies, primary users, and addresses from the database)
app.get('/api/clients', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.numeric_id,
        c.name AS "companyName",
        c.status AS status,
        c.created_at AS created,
        u.first_name || ' ' || u.last_name AS "primaryUser",
        u.email,
        u.phone,
        b.address
      FROM companies c
      LEFT JOIN users u ON u.company_id = c.id
      LEFT JOIN branches b ON b.company_id = c.id AND b.name = 'Headquarters'
      ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query);

    const dbClients = result.rows.map(row => ({
      id: row.numeric_id || row.id,
      companyName: row.companyName,
      salesRep: 'Admin', // Default sales rep for administrative clients
      created: row.created ? new Date(row.created).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: row.status ? row.status.toUpperCase() : 'ACTIVE',
      address: row.address || '',
      cityStateZip: '',
      country: '',
      primaryUser: row.primaryUser || '',
      email: row.email || '',
      phone: row.phone || '',
      clientGroup: 'New Sign-Ups EvalRight',
      taxExempt: 'No',
      signupDate: row.created ? new Date(row.created).toLocaleDateString() : new Date().toLocaleDateString(),
      lastLogin: 'Never'
    }));

    res.json(dbClients);
  } catch (error: any) {
    console.error('❌ Error fetching clients:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Admin Backend is running on http://localhost:${PORT}`);
});
