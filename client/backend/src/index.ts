import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { pool } from './config/db';
import orderRouter from './Order';
import invitationRouter from './Invitation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(orderRouter);
app.use(invitationRouter);

// API Health Check
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'Client Backend Server is running',
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

// Sample Query: Get Applicants
app.get('/api/applicants', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, status, created_at FROM applicants ORDER BY created_at DESC LIMIT 10;');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Sample Query: Get Invitations
app.get('/api/invitations', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, status, invite_token, expires_at FROM invitations ORDER BY created_at DESC LIMIT 10;');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Database schema initialization for OTP verification
async function initializeOtpSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_otps (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        otp_code VARCHAR(6) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE NOT NULL
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_otps_user_id ON user_otps(user_id);
    `);
    await client.query('COMMIT');
    console.log('⚡ [SCHEMA] Database user_otps table initialized/verified.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during schema initialization for user_otps:', error);
  } finally {
    client.release();
  }
}

// Run schema initialization
initializeOtpSchema();

// Client authentication route: validates username & password, generates and sends OTP
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // 1. Fetch user by username
    const query = `
      SELECT id, company_id, branch_id, username, email, password_hash, first_name, last_name, is_active 
      FROM users 
      WHERE username = $1 LIMIT 1
    `;
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];

    // 2. Check if the user is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'Your account is deactivated. Please contact support.' });
    }

    // 3. Compare SHA-256 password hash
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    if (inputHash !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 4. Generate 6-digit numeric OTP and set expiry (5 minutes)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP to DB
    await pool.query(
      `INSERT INTO user_otps (id, user_id, otp_code, expires_at) VALUES ($1, $2, $3, $4)`,
      [otpId, user.id, otpCode, expiresAt]
    );

    // 5. Send OTP via Power Automate Webhook
    const webhookUrl = process.env.POWER_AUTOMATE_OTP_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.trim() !== '') {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
          clientEmail: user.email,
          otp: otpCode
        })
      }).then(response => {
        if (!response.ok) {
          console.error('❌ Power Automate OTP Webhook returned error status:', response.status);
        } else {
          console.log('✅ Power Automate OTP Webhook successfully triggered for client login.');
        }
      }).catch(err => {
        console.error('❌ Error hitting Power Automate OTP Webhook:', err.message);
      });
    } else {
      console.warn('⚠️ [WARNING] POWER_AUTOMATE_WEBHOOK_URL is not configured. OTP was generated but could not be sent. OTP Code:', otpCode);
    }

    // 6. Return response indicating OTP is required to complete authentication
    res.json({
      success: true,
      otpRequired: true,
      userId: user.id,
      email: user.email,
      message: 'OTP has been sent to your registered email address'
    });
  } catch (error: any) {
    console.error('❌ Error executing client login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to verify OTP and complete client authentication
app.post('/api/auth/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ error: 'User ID and OTP are required' });
  }

  try {
    // 1. Fetch latest active OTP for user
    const otpQuery = `
      SELECT id, otp_code, expires_at 
      FROM user_otps 
      WHERE user_id = $1 AND is_verified = FALSE AND expires_at > NOW() 
      ORDER BY created_at DESC LIMIT 1
    `;
    const otpRes = await pool.query(otpQuery, [userId]);

    if (otpRes.rows.length === 0) {
      return res.status(400).json({ error: 'OTP has expired or is invalid. Please request a new one.' });
    }

    const dbOtp = otpRes.rows[0];

    // 2. Validate code
    if (dbOtp.otp_code !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }

    // 3. Mark OTP as verified
    await pool.query('UPDATE user_otps SET is_verified = TRUE WHERE id = $1', [dbOtp.id]);

    // 4. Fetch and return user metadata
    const userRes = await pool.query(
      `SELECT id, company_id, branch_id, username, email, first_name, last_name, is_active 
       FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRes.rows[0];

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        company_id: user.company_id,
        branch_id: user.branch_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error: any) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to resend OTP code
app.post('/api/auth/resend-otp', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // 1. Fetch user
    const userRes = await pool.query(
      `SELECT id, email, username, first_name, last_name, is_active 
       FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRes.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Your account is deactivated' });
    }

    // 2. Generate and save new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO user_otps (id, user_id, otp_code, expires_at) VALUES ($1, $2, $3, $4)`,
      [otpId, user.id, otpCode, expiresAt]
    );

    // 3. Send via Power Automate
    const webhookUrl = process.env.POWER_AUTOMATE_OTP_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.trim() !== '') {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
          clientEmail: user.email,
          otp: otpCode
        })
      }).then(response => {
        if (!response.ok) {
          console.error('❌ Power Automate OTP Webhook returned error status on resend:', response.status);
        } else {
          console.log('✅ Power Automate OTP Webhook successfully triggered for resend.');
        }
      }).catch(err => {
        console.error('❌ Error hitting Power Automate OTP Webhook on resend:', err.message);
      });
    } else {
      console.warn('⚠️ [WARNING] POWER_AUTOMATE_WEBHOOK_URL is not configured. OTP was generated but could not be sent. OTP Code:', otpCode);
    }

    res.json({
      success: true,
      message: 'A new OTP has been sent to your registered email address'
    });
  } catch (error: any) {
    console.error('❌ Error resending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Client Backend is running on http://localhost:${PORT}`);
});
