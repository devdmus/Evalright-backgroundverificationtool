import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection on boot
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ [DATABASE] Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('⚡ [DATABASE] Connected to PostgreSQL successfully at', res.rows[0].now);
  }
});
