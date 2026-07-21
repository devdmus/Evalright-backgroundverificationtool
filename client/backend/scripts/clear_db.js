const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://Evalright:Evalright%24123@localhost:5432/evalright_db?schema=public"
});

const TABLES_TO_TRUNCATE = [
  'user_otps',
  'invitations',
  'applicant_addresses',
  'applicant_contacts',
  'education_histories',
  'employment_histories',
  'orders',
  'order_status_history',
  'documents',
  'consents',
  'bgv_api_requests',
  'invoices',
  'disputes',
  'payments',
  'activity_logs',
  'notifications',
  'api_logs',
  'adverse_actions',
  'applicants',
  'identity_documents',
  'order_verifications',
  'verification_results',
  'email_logs',
  'webhook_events'
];

async function main() {
  const client = await pool.connect();
  try {
    console.log('⏳ Starting database cleanup...');
    await client.query('BEGIN');
    
    // Disable triggers to prevent foreign key or reference check issues during truncate
    await client.query('SET CONSTRAINTS ALL DEFERRED');
    
    const truncateQuery = `TRUNCATE TABLE ${TABLES_TO_TRUNCATE.map(t => `"${t}"`).join(', ')} CASCADE;`;
    await client.query(truncateQuery);
    
    await client.query('COMMIT');
    console.log('✅ All transactional and test data truncated successfully.');

    // Print new counts
    console.log('\n📊 Updated Table Row Counts:');
    const res = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);
    const tables = res.rows.map(r => r.tablename);
    
    for (const table of tables) {
      const countRes = await client.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`Table: ${table} - Count: ${countRes.rows[0].count}`);
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error clearing database:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
