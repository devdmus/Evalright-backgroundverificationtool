const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://Evalright:Evalright%24123@localhost:5432/evalright_db?schema=public"
});

async function main() {
  try {
    const res = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);
    const tables = res.rows.map(r => r.tablename);
    console.log('Tables in database:', tables);
    
    for (const table of tables) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`Table: ${table} - Count: ${countRes.rows[0].count}`);
      } catch (err) {
        console.error(`Error querying table ${table}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
