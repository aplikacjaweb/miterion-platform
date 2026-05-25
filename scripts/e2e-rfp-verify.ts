import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'contact@miterion.com';

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
const resend = new Resend(RESEND_API_KEY!);

async function verifyFullFlow() {
    console.log('--- RFP Flow End-to-End Verification ---');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPath = `test-files/${Date.now()}-test.pdf`;

    try {
        // 1. Simulate /api/rfp-submit logic
        console.log('1. Creating Lead in "leads" table...');
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .insert({
                email: testEmail,
                company: 'Test Corp',
                indication: 'RFP_SUBMITTED',
                phase: 'RFP_RECEIVED',
                user_question: 'E2E Verification Test',
            })
            .select('id')
            .single();

        if (leadError) throw new Error(`Lead creation failed: ${leadError.message}`);
        const leadId = lead.id;
        console.log(`   Success! Lead ID: ${leadId}`);

        // 2. Test the "uploads" table link
        console.log('2. Linking file in "uploads" table...');
        const { error: uploadError } = await supabase
            .from('uploads')
            .insert({ lead_id: leadId, file_path: testPath });

        if (uploadError) {
            console.error(`   FAILED: ${uploadError.message} (Is the migration applied?)`);
        } else {
            console.log('   Success! Upload record created.');
        }

        // 3. Test Email Notification
        console.log('3. Sending Notification Email via Resend...');
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: 'contact@miterion.com',
            subject: 'E2E RFP Verification Test',
            html: `<p>Verification test for Lead ${leadId}</p><p>File: ${testPath}</p>`
        });

        if (emailError) {
            console.error(`   FAILED: ${emailError.message}`);
        } else {
            console.log(`   Success! Resend ID: ${emailData?.id}`);
        }

        console.log('\n--- VERIFICATION SUMMARY ---');
        console.log(`Lead Created:   ${leadError ? '❌' : '✅'}`);
        console.log(`Upload Linked:  ${uploadError ? '❌' : '✅'}`);
        console.log(`Email Sent:     ${emailError ? '❌' : '✅'}`);

    } catch (err) {
        console.error('CRITICAL ERROR during verification:', err);
    }
}

verifyFullFlow();
