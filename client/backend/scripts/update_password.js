const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://Evalright:Evalright%24123@localhost:5432/evalright_db?schema=public"
});

async function main() {
  try {
    const passwordHash = '5e8837a09c291f5b5c61a599557ea919593117b309b1d667c051a2d76d756761'; // SHA-256 of "password"
    await pool.query("UPDATE users SET password_hash = $1 WHERE username = 'Demo';", [passwordHash]);
    console.log('✅ User Demo password hash updated to SHA-256 of "password".');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
