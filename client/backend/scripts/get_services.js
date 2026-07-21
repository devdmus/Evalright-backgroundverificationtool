const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://Evalright:Evalright%24123@localhost:5432/evalright_db?schema=public"
});

async function main() {
  try {
    const res = await pool.query('SELECT id, name, service_code, base_price FROM services;');
    console.log('Services in database:');
    console.log(res.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
