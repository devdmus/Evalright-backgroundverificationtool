import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { pool } from './config/db';
import orderRouter from './Order';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(orderRouter);

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

// Client authentication route: validates username & password
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

    // 4. Return user metadata on success
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
    console.error('❌ Error executing client login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Client Backend is running on http://localhost:${PORT}`);
});
