const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('--- Resend Verification ---');
  console.log('Using From Email:', process.env.RESEND_FROM_EMAIL);
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: 'contact@miterion.com',
      subject: 'E2E Verification - Email Component',
      html: '<p>If you see this, the Resend component of the RFP flow is working.</p>'
    });

    if (error) {
      console.log('EMAIL_SEND: FAILED', error);
    } else {
      console.log('EMAIL_SEND: SUCCESS', data.id);
    }
  } catch (err) {
    console.log('EMAIL_CRITICAL_ERROR:', err.message);
  }
}

testEmail();
