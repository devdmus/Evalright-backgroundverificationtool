import crypto from 'crypto';
import { Pool } from 'pg';

/** Default catalog aligned with client ala-carte searches (INR). */
export const SERVICE_CATALOG: Array<{
  serviceCode: string;
  name: string;
  salePrice: number;
  yourCost: number;
}> = [
  { serviceCode: 'personal-details', name: 'Personal Details', salePrice: 300, yourCost: 210 },
  { serviceCode: 'ssn-check', name: 'SSN Check', salePrice: 300, yourCost: 210 },
  { serviceCode: 'id-verification-aadhar', name: 'ID Verification (Aadhar)', salePrice: 300, yourCost: 210 },
  { serviceCode: 'id-verification-pan', name: 'ID Verification (PAN)', salePrice: 300, yourCost: 210 },
  { serviceCode: 'id-verification-dl', name: 'ID Verification (DL)', salePrice: 300, yourCost: 210 },
  { serviceCode: 'id-verification-voterid', name: 'ID Verification (Voter ID)', salePrice: 300, yourCost: 210 },
  { serviceCode: 'id-verification-passport', name: 'ID Verification (Passport)', salePrice: 300, yourCost: 210 },
  { serviceCode: 'uan-verification', name: 'UAN Verification', salePrice: 350, yourCost: 245 },
  { serviceCode: 'indian-database-check', name: 'Indian Database Check', salePrice: 600, yourCost: 420 },
  { serviceCode: 'global-database-check', name: 'Global Database Check', salePrice: 600, yourCost: 420 },
  { serviceCode: 'ofac-check', name: 'OFAC Check', salePrice: 600, yourCost: 420 },
  { serviceCode: 'criminal-record-check', name: 'Criminal Record Check', salePrice: 600, yourCost: 420 },
  { serviceCode: 'police-verification-check', name: 'Police Verification Check', salePrice: 700, yourCost: 490 },
  { serviceCode: 'nationwide-criminal-check', name: 'Nationwide Criminal Check', salePrice: 600, yourCost: 420 },
  { serviceCode: 'national-sex-offender-registry-check', name: 'National Sex Offender Registry Check', salePrice: 600, yourCost: 420 },
  { serviceCode: 'credit-check', name: 'Credit Check', salePrice: 700, yourCost: 490 },
  { serviceCode: '26as-check', name: '26AS Check', salePrice: 350, yourCost: 245 },
  { serviceCode: 'form-16-check', name: 'Form 16 Check', salePrice: 350, yourCost: 245 },
  { serviceCode: 'itr-check', name: 'ITR Check', salePrice: 350, yourCost: 245 },
  { serviceCode: 'employment-verification', name: 'Employment Verification', salePrice: 600, yourCost: 420 },
  { serviceCode: 'education-verification', name: 'Education Verification', salePrice: 900, yourCost: 630 },
  { serviceCode: 'reference-check', name: 'Reference Check', salePrice: 450, yourCost: 315 },
  { serviceCode: 'freelancing-check', name: 'Freelancing Check', salePrice: 600, yourCost: 420 },
  { serviceCode: 'directorship-check', name: 'Directorship Check', salePrice: 750, yourCost: 525 },
  { serviceCode: 'cv-check', name: 'Cv Check', salePrice: 200, yourCost: 140 },
  { serviceCode: 'gap-analysis', name: 'Gap Analysis', salePrice: 200, yourCost: 140 },
  { serviceCode: 'address-verification', name: 'Address Verification', salePrice: 650, yourCost: 455 },
  { serviceCode: 'supplier-address', name: 'Supplier Address', salePrice: 650, yourCost: 455 },
  { serviceCode: 'drug-test', name: 'Drug test', salePrice: 2500, yourCost: 1750 },
  { serviceCode: 'medical-examination-test', name: 'Medical Examination Test', salePrice: 600, yourCost: 420 },
  { serviceCode: 'social-media-check', name: 'Social Media Check', salePrice: 675, yourCost: 473 },
  { serviceCode: 'right-to-work', name: 'Right to Work', salePrice: 550, yourCost: 385 },
  { serviceCode: 'emergency', name: 'Emergency', salePrice: 200, yourCost: 140 },
  { serviceCode: 'authorization', name: 'Authorization', salePrice: 200, yourCost: 140 },
  { serviceCode: 'exit', name: 'Exit', salePrice: 600, yourCost: 420 },
  { serviceCode: 'cdlis', name: 'CDLIS', salePrice: 300, yourCost: 210 },
  { serviceCode: 'driving-history', name: 'Driving History', salePrice: 300, yourCost: 210 },
  { serviceCode: 'adhr-trace', name: 'ADHR Trace', salePrice: 300, yourCost: 210 },
  { serviceCode: 'adhr-validation', name: 'ADHR Validation', salePrice: 300, yourCost: 210 },
];

export async function ensureServicesPricingSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        service_code VARCHAR(100),
        base_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
        sale_price NUMERIC(12, 2),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS sale_price NUMERIC(12, 2)`);
    await client.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`);

    await client.query(`
      UPDATE services
      SET sale_price = COALESCE(sale_price, base_price, 0)
      WHERE sale_price IS NULL
    `);

    for (const item of SERVICE_CATALOG) {
      const existing = await client.query(
        'SELECT id FROM services WHERE service_code = $1 LIMIT 1',
        [item.serviceCode]
      );

      if (existing.rows.length === 0) {
        await client.query(
          `
          INSERT INTO services (id, name, description, service_code, base_price, sale_price, is_active, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW())
          `,
          [
            crypto.randomUUID(),
            item.name,
            item.name,
            item.serviceCode,
            item.yourCost,
            item.salePrice,
          ]
        );
      } else {
        // Keep existing sale_price; refresh display name and default cost only if cost was 0
        await client.query(
          `
          UPDATE services
          SET name = $2::varchar,
              description = COALESCE(description, $3::text),
              base_price = CASE WHEN base_price = 0 OR base_price IS NULL THEN $4::numeric ELSE base_price END,
              sale_price = COALESCE(sale_price, $5::numeric)
          WHERE service_code = $1::varchar
          `,
          [item.serviceCode, item.name, item.name, item.yourCost, item.salePrice]
        );
      }
    }

    await client.query('COMMIT');
    console.log('⚡ [SCHEMA] Services pricing catalog initialized/verified.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing services pricing schema:', error);
    throw error;
  } finally {
    client.release();
  }
}
