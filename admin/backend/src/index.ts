import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Admin Backend is running on http://localhost:${PORT}`);
});
