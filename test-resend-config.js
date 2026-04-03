// Test script to verify Resend configuration is loaded correctly
const dotenv = require('dotenv');
const path = require('path');

console.log('Testing Resend configuration loading...\n');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

console.log('Environment variables loaded:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '*****' : 'NOT SET');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'NOT SET');

// Verify Resend would be initialized correctly
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

if (resendApiKey && resendFromEmail) {
  console.log('\n✓ Resend configuration is complete:');
  console.log('  - API Key: Present');
  console.log('  - From Email: Present');
  console.log('\nResend client would be initialized successfully.');
} else {
  console.log('\n✗ Resend configuration is incomplete:');
  if (!resendApiKey) console.log('  - Missing: RESEND_API_KEY');
  if (!resendFromEmail) console.log('  - Missing: RESEND_FROM_EMAIL');
  console.log('\nResend client would NOT be initialized.');
}

// Test the same logic as in the route.ts
const resend = resendApiKey ? { mock: true } : null;

console.log('\nTesting route logic:');
console.log('resend variable:', resend ? 'Initialized (mock)' : 'null');

if (resend && resendFromEmail) {
  console.log('✓ Email sending would be attempted');
} else {
  console.log('✗ Email sending would be skipped');
  if (!resend) console.log('  - Reason: resend is null');
  if (!resendFromEmail) console.log('  - Reason: RESEND_FROM_EMAIL not set');
}