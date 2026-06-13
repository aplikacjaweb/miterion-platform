// Check all possible environment sources
const fs = require('fs');
const path = require('path');

// Load .env
require('dotenv').config({ path: '.env' });
console.log('.env RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);

// Load .env.local (overrides .env)
require('dotenv').config({ path: '.env.local', override: true });
console.log('.env.local RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);

// Check if there's a .vercel/env file
const vercelEnvPath = path.join('.vercel', 'env');
if (fs.existsSync(vercelEnvPath)) {
  require('dotenv').config({ path: vercelEnvPath, override: true });
  console.log('.vercel/env RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
}

// Final value
console.log('\nFinal RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);