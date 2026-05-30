import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
  console.log('--- Starting End-to-End Verification ---');
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testCompany = 'Verification Corp';
    const testMessage = 'Testing linked upload after migration.';
    const testFilePath = 'rfp_uploads/test-verification.pdf';

    console.log(`1. Testing lead creation for: ${testEmail}`);
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        email: testEmail,
        company: testCompany,
        indication: 'RFP_SUBMITTED',
        phase: 'RFP_RECEIVED',
        user_question: testMessage,
      })
      .select('id')
      .single();

    if (leadError) {
      console.log(`FAILED: Lead creation error: ${leadError.message}`);
      return;
    }
    const leadId = lead.id;
    console.log(`SUCCESS: Lead created with ID: ${leadId}`);

    console.log(`2. Testing link in "uploads" table for lead: ${leadId}`);
    const { data: upload, error: uploadError } = await supabaseAdmin
      .from('uploads')
      .insert({
        lead_id: leadId,
        file_path: testFilePath,
      })
      .select('*')
      .single();

    if (uploadError) {
      console.log(`FAILED: Link in "uploads" table error: ${uploadError.message}`);
    } else {
      console.log(`SUCCESS: File linked in "uploads" table. Record ID: ${upload.id}`);
    }
  } catch (err: any) {
    console.log(`CRITICAL ERROR: ${err.message}`);
  }
  console.log('--- Verification Complete ---');
}

verify().catch(console.error);
