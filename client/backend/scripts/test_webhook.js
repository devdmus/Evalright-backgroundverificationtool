const path = require('path');
const dotenv = require('dotenv');

// Load env variables from client/backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const webhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;

async function testWebhook() {
  console.log('--- Power Automate Webhook Test Script ---');
  console.log('Env loaded from:', path.resolve(__dirname, '../.env'));
  console.log('POWER_AUTOMATE_WEBHOOK_URL:', webhookUrl || '(Not configured)');

  if (!webhookUrl || webhookUrl.trim() === '') {
    console.error('❌ Error: POWER_AUTOMATE_WEBHOOK_URL is not set in your .env file.');
    process.exit(1);
  }

  const payload = {
    candidateEmail: 'test.candidate@example.com',
    candidateName: 'John Doe',
    inviteUrl: 'http://localhost:5173/#invite-form?id=INV-TEST12345',
    selectedProducts: ['County Criminal Search', 'Education Verification'],
    companyName: 'EvalRight Client Corp'
  };

  console.log('\nSending Payload:', JSON.stringify(payload, null, 2));
  console.log('\nSending request to Power Automate...');

  try {
    const startTime = Date.now();
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const duration = Date.now() - startTime;
    console.log(`\nResponse received in ${duration}ms`);
    console.log('HTTP Status:', response.status, response.statusText);

    const bodyText = await response.text();
    console.log('Response Body:', bodyText || '(Empty Response)');

    if (response.ok) {
      console.log('\n✅ Success! Webhook successfully reached and responded with OK.');
    } else {
      console.error('\n❌ Power Automate returned a non-OK status code.');
    }

  } catch (error) {
    console.error('\n❌ Connection Error: Failed to reach Power Automate.');
    console.error('Details:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause.message || error.cause);
    }
    console.log('\n💡 Tip: Check your internet connection or proxy settings.');
  }
}

testWebhook();
