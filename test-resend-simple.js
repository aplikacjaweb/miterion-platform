// Simple test to verify Resend configuration
const fs = require('fs');
const path = require('path');

console.log('Testing Resend configuration...\n');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Extract values
const resendApiKeyMatch = envContent.match(/^RESEND_API_KEY=([^\n#]+)/m);
const resendFromEmailMatch = envContent.match(/^RESEND_FROM_EMAIL=([^\n#]+)/m);

const resendApiKey = resendApiKeyMatch ? resendApiKeyMatch[1] : null;
const resendFromEmail = resendFromEmailMatch ? resendFromEmailMatch[1] : null;

console.log('Configuration found:');
console.log('RESEND_API_KEY:', resendApiKey ? '*****' : 'NOT SET');
console.log('RESEND_FROM_EMAIL:', resendFromEmail || 'NOT SET');

// Test the logic from route.ts
const resend = resendApiKey ? { mock: true } : null;

console.log('\nRoute logic simulation:');
console.log('resend variable:', resend ? 'Initialized (mock)' : 'null');

if (resend && resendFromEmail) {
  console.log('✓ Email sending would be attempted');
  console.log('  From:', resendFromEmail);
  console.log('  To: user@example.com');
} else {
  console.log('✗ Email sending would be skipped');
  if (!resend) console.log('  - resend is null (API key not set)');
  if (!resendFromEmail) console.log('  - RESEND_FROM_EMAIL not set');
}

console.log('\n✓ Configuration test completed!');