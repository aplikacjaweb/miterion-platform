require('dotenv').config({ path: '.env' });

console.log('Current RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
console.log('Current RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');