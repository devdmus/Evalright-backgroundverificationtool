import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Client Backend is running on http://localhost:${PORT}`);
});
