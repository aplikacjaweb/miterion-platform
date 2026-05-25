import { Resend } from 'resend';

async function testResend() {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = 'contact@miterion.com';
    
    console.log('Testing Resend with:');
    console.log('API Key:', apiKey ? 'FOUND' : 'MISSING');
    console.log('From Email:', fromEmail);

    if (!apiKey) {
        console.error('RESEND_API_KEY is missing');
        process.exit(1);
    }

    const resend = new Resend(apiKey);

    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: 'contact@miterion.com',
            subject: 'RFP Flow Test - Resend Verification',
            html: '<p>This is a test email to verify Resend is working for the RFP flow.</p>'
        });

        if (error) {
            console.error('Resend Error:', error);
        } else {
            console.log('Resend Success! ID:', data?.id);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testResend();
