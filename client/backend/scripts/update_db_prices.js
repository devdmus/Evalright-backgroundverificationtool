const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://Evalright:Evalright%24123@localhost:5432/evalright_db?schema=public"
});

const SERVICES_CATALOG = [
  { code: 'personal-details', name: 'Personal Details', price: 300.00 },
  { code: 'ssn-check', name: 'SSN Check', price: 300.00 },
  { code: 'id-verification-aadhar', name: 'ID Verification (Aadhar)', price: 300.00 },
  { code: 'id-verification-pan', name: 'ID Verification (PAN)', price: 300.00 },
  { code: 'id-verification-dl', name: 'ID Verification (DL)', price: 300.00 },
  { code: 'id-verification-voterid', name: 'ID Verification (Voter ID)', price: 300.00 },
  { code: 'id-verification-passport', name: 'ID Verification (Passport)', price: 300.00 },
  { code: 'uan-verification', name: 'UAN Verification', price: 350.00 },
  { code: 'indian-database-check', name: 'Indian Database Check', price: 600.00 },
  { code: 'global-database-check', name: 'Global Database Check', price: 600.00 },
  { code: 'ofac-check', name: 'OFAC Check', price: 600.00 },
  { code: 'criminal-record-check', name: 'Criminal Record Check', price: 600.00 },
  { code: 'police-verification-check', name: 'Police Verification Check', price: 700.00 },
  { code: 'nationwide-criminal-check', name: 'Nationwide Criminal Check', price: 600.00 },
  { code: 'national-sex-offender-registry-check', name: 'National Sex Offender Registry Check', price: 600.00 },
  { code: 'credit-check', name: 'Credit Check', price: 700.00 },
  { code: '26as-check', name: '26AS Check', price: 350.00 },
  { code: 'form-16-check', name: 'Form 16 Check', price: 350.00 },
  { code: 'itr-check', name: 'ITR Check', price: 350.00 },
  { code: 'employment-verification', name: 'Employment Verification', price: 600.00 },
  { code: 'education-verification', name: 'Education Verification', price: 900.00 },
  { code: 'reference-check', name: 'Reference Check', price: 450.00 },
  { code: 'freelancing-check', name: 'Freelancing Check', price: 600.00 },
  { code: 'directorship-check', name: 'Directorship Check', price: 750.00 },
  { code: 'cv-check', name: 'Cv Check', price: 200.00 },
  { code: 'gap-analysis', name: 'Gap Analysis', price: 200.00 },
  { code: 'address-verification', name: 'Address Verification', price: 650.00 },
  { code: 'supplier-address', name: 'Supplier Address', price: 650.00 },
  { code: 'drug-test', name: 'Drug test', price: 2500.00 },
  { code: 'medical-examination-test', name: 'Medical Examination Test', price: 600.00 },
  { code: 'social-media-check', name: 'Social Media Check', price: 675.00 },
  { code: 'right-to-work', name: 'Right to Work', price: 550.00 },
  { code: 'emergency', name: 'Emergency', price: 200.00 },
  { code: 'authorization', name: 'Authorization', price: 200.00 },
  { code: 'exit', name: 'Exit', price: 600.00 },
  // Existing database mappings
  { code: 'cdlis', name: 'CDLIS', price: 300.00 },
  { code: 'driving-history', name: 'Driving History', price: 300.00 },
  { code: 'labcorp-10-panel', name: 'LabCorp - 10 Panel Drug Screen', price: 2500.00 },
  { code: 'adhr-trace', name: 'ADHR Trace/Address History', price: 300.00 },
  { code: 'adhr-validation', name: 'ADHR Validation', price: 300.00 }
];

async function main() {
  const client = await pool.connect();
  try {
    console.log('⏳ Starting services catalog sync (safe mode)...');
    await client.query('BEGIN');
    
    for (const service of SERVICES_CATALOG) {
      // Check if service already exists
      const checkRes = await client.query('SELECT id FROM services WHERE service_code = $1;', [service.code]);
      if (checkRes.rows.length > 0) {
        // Update price
        await client.query('UPDATE services SET base_price = $1, name = $2 WHERE service_code = $3;', [service.price.toFixed(2), service.name, service.code]);
        console.log(`Updated service: ${service.code} -> ₹${service.price}`);
      } else {
        // Insert new service
        const id = require('crypto').randomUUID();
        await client.query('INSERT INTO services (id, name, service_code, base_price) VALUES ($1, $2, $3, $4);', [
          id,
          service.name,
          service.code,
          service.price.toFixed(2)
        ]);
        console.log(`Inserted new service: ${service.code} -> ₹${service.price}`);
      }
    }
    
    await client.query('COMMIT');
    console.log('✅ Services catalog sync completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error syncing services catalog:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
