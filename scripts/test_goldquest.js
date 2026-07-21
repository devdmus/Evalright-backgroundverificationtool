/**
 * GoldQuest BGV API Test Script
 * 
 * This script tests the GoldQuest Background Verification (BGV) API endpoints
 * documented in 'GoldQuest API.pdf'.
 * 
 * Usage:
 *   node scripts/test_goldquest.js [access_token] [action]
 * 
 * Examples:
 *   node scripts/test_goldquest.js YOUR_TOKEN services
 *   node scripts/test_goldquest.js YOUR_TOKEN candidate
 *   node scripts/test_goldquest.js YOUR_TOKEN client
 *   node scripts/test_goldquest.js YOUR_TOKEN all
 */

const BASE_URL = 'https://api.goldquestglobal.in/branch/api';

// ==========================================
// 🔑 PUT YOUR ACCESS KEY / TOKEN HERE
// ==========================================
const GOLDQUEST_ACCESS_TOKEN = 'c3794a74a31ed04b69cb66aa6cb9eee2.72bca278b41e96fdeaab9d1df4f4b9c0'; // <-- Paste your key inside the quotes, e.g., 'your_actual_token'

// ANSI terminal colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// 1x1 transparent pixel base64 PNG
const MINIMAL_BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Parse arguments
const args = process.argv.slice(2);

// Resolve access token (priority: 1. Hardcoded constant, 2. CLI argument, 3. Env variable)
const accessToken = GOLDQUEST_ACCESS_TOKEN || args[0] || process.env.GOLDQUEST_ACCESS_TOKEN;
const action = GOLDQUEST_ACCESS_TOKEN ? (args[0] || 'all') : (args[1] || 'all');

if (!accessToken) {
  console.error(`${colors.red}${colors.bright}Error: Access token is required.${colors.reset}`);
  console.log(`\n${colors.bright}Ways to supply the access token:${colors.reset}`);
  console.log(`  1. Open this file and paste it in the GOLDQUEST_ACCESS_TOKEN constant at the top`);
  console.log(`  2. Pass it as a command line argument:`);
  console.log(`     node scripts/test_goldquest.js <access_token> [action]`);
  console.log(`  3. Set a GOLDQUEST_ACCESS_TOKEN environment variable`);
  console.log(`\n${colors.bright}Actions:${colors.reset}`);
  console.log(`  services   - Get allocated services`);
  console.log(`  candidate  - Create candidate application`);
  console.log(`  client     - Create client application (with base64 documents)`);
  console.log(`  all        - Test all endpoints (default)`);
  process.exit(1);
}

console.log(`${colors.cyan}${colors.bright}=====================================================`);
console.log(`     GoldQuest BGV API Test Suite`);
console.log(`=====================================================${colors.reset}`);
console.log(`${colors.bright}Base URL:${colors.reset} ${BASE_URL}`);
console.log(`${colors.bright}Token:${colors.reset}    ${accessToken}`);
console.log(`${colors.bright}Action:${colors.reset}   ${action}\n`);

// Helper to log responses nicely
async function logResponse(response, startTime) {
  const duration = Date.now() - startTime;
  const isOk = response.status >= 200 && response.status < 300;
  const statusColor = isOk ? colors.green : colors.red;

  console.log(`${colors.bright}Response Status:${colors.reset} ${statusColor}${response.status} ${response.statusText}${colors.reset} (took ${duration}ms)`);

  // Headers
  console.log(`${colors.bright}Response Headers:${colors.reset}`);
  const headerObj = {};
  response.headers.forEach((val, key) => {
    headerObj[key] = val;
  });
  console.log(JSON.stringify(headerObj, null, 2));

  // Body
  const text = await response.text();
  console.log(`${colors.bright}Response Body:${colors.reset}`);
  try {
    const json = JSON.parse(text);
    console.log(JSON.stringify(json, null, 2));
    return json;
  } catch {
    console.log(text || '(empty response)');
    return text;
  }
}

// 1. Get Allocated Services
async function testGetServices() {
  console.log(`\n${colors.yellow}${colors.bright}--- [GET] Fetching Allocated Services ---${colors.reset}`);
  const url = `${BASE_URL}/services?access_token=${encodeURIComponent(accessToken)}`;
  console.log(`${colors.bright}Request URL:${colors.reset} ${url}`);

  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    return await logResponse(response, start);
  } catch (error) {
    console.error(`${colors.red}Request failed:${colors.reset}`, error);
  }
}

// 2. Create Candidate Application
async function testCreateCandidate() {
  console.log(`\n${colors.yellow}${colors.bright}--- [POST] Creating Candidate Application ---${colors.reset}`);
  const url = `${BASE_URL}/candidate-application/create`;
  console.log(`${colors.bright}Request URL:${colors.reset} ${url}`);

  const payload = {
    access_token: accessToken,
    name: 'John Doe',
    employee_id: 'EMP12345',
    mobile_number: '8888888888',
    email: 'johndoe@example.com',
    services: '1,2,3', // Commas separated service IDs as per PDF
    nationality: 'Indian',
    purpose_of_application: 'NORMAL BGV (EMPLOYMENT)'
  };

  console.log(`${colors.bright}Request Payload:${colors.reset}`);
  console.log(JSON.stringify(payload, null, 2));

  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return await logResponse(response, start);
  } catch (error) {
    console.error(`${colors.red}Request failed:${colors.reset}`, error);
  }
}

// 3. Create Client Application
async function testCreateClient() {
  console.log(`\n${colors.yellow}${colors.bright}--- [POST] Creating Client Application ---${colors.reset}`);
  const url = `${BASE_URL}/client-application/create`;
  console.log(`${colors.bright}Request URL:${colors.reset} ${url}`);

  const payload = {
    access_token: accessToken,
    name: 'John Doe',
    employee_id: 'EMP12345',
    spoc: 'Jane Smith',
    location: 'Bangalore Office',
    batch_number: 'BATCH-2026-Q3',
    sub_client: 'Acme Corp',
    services: ['1', '2', '3'], // Array of service IDs as per PDF
    nationality: 'Indian',
    attach_documents: [
      MINIMAL_BASE64_IMAGE,
      MINIMAL_BASE64_IMAGE
    ],
    photo: MINIMAL_BASE64_IMAGE
  };

  // Mask base64 strings in logs to keep terminal clean
  const logPayload = {
    ...payload,
    attach_documents: payload.attach_documents.map(d => `${d.substring(0, 30)}... [truncated]`),
    photo: `${payload.photo.substring(0, 30)}... [truncated]`
  };

  console.log(`${colors.bright}Request Payload:${colors.reset}`);
  console.log(JSON.stringify(logPayload, null, 2));

  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return await logResponse(response, start);
  } catch (error) {
    console.error(`${colors.red}Request failed:${colors.reset}`, error);
  }
}

// Main execution
async function main() {
  try {
    if (action === 'services') {
      await testGetServices();
    } else if (action === 'candidate') {
      await testCreateCandidate();
    } else if (action === 'client') {
      await testCreateClient();
    } else if (action === 'all') {
      await testGetServices();
      console.log('\n=====================================================');
      await testCreateCandidate();
      console.log('\n=====================================================');
      await testCreateClient();
    } else {
      console.error(`${colors.red}Unknown action: ${action}${colors.reset}`);
    }
  } catch (err) {
    console.error('Execution error:', err);
  }
  console.log(`\n${colors.cyan}${colors.bright}=====================================================`);
  console.log(`     Test Suite Execution Finished`);
  console.log(`=====================================================${colors.reset}\n`);
}

main();
