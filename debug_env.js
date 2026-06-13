require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

console.log('RESEND_FROM_EMAIL after loading .env:', process.env.RESEND_FROM_EMAIL);
console.log('Process env RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);

// Check all environment variables
const envKeys = Object.keys(process.env).filter(key => key.includes('RESEND') || key.includes('EMAIL'));
console.log('\nAll email/resend related env vars:');
envKeys.forEach(key => {
  console.log(`${key}=${process.env[key]}`);
});