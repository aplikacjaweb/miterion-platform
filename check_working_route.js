require('dotenv').config({ path: '.env' });

// Simulate what the working route uses
console.log('Working route (premium-request-shared.ts) from address:', process.env.RESEND_FROM_EMAIL);

// Check if there's a different env variable for working routes
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);