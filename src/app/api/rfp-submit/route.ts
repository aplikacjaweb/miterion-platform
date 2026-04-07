import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { rfpSubmitSchema } from '@/lib/validation';
import { apiError, apiSuccess } from '@/lib/apiResponse';

export const runtime = "nodejs";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  // 1. Parse & validate
  let body: unknown;
  let rawBodyText: string | null = null;
  try {
    rawBodyText = await request.text();
    console.log('[/api/rfp-submit] Received raw body:', rawBodyText);
    body = rawBodyText ? JSON.parse(rawBodyText) : {};
  } catch (e) {
    console.error(
      '[/api/rfp-submit] JSON parse error, raw body was:', rawBodyText, 'Error:', e
    );
    return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
  }

  const parsed = rfpSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      'INVALID_REQUEST',
      parsed.error.errors.map((e) => e.message).join('; '),
      400
    );
  }

  const { email, company, message, filePath } = parsed.data;

  // 2. Save lead to DB
  let leadId: string | null = null;

  if (supabaseAdmin) {
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        email,
        company: company || null,
        indication: 'RFP_SUBMITTED', // Default for RFP leads to satisfy NOT NULL
        phase: 'RFP_RECEIVED', // Default for RFP leads to satisfy NOT NULL
        country: null, // RFP leads do not have this initially
        country_code: null, // RFP leads do not have this initially
        user_question: message || null, // Map message to user_question
        pdf_path: null, // RFP leads do not have this initially
      })
      .select('id')
      .single();

    if (leadError) {
      console.error('leads_rfp insert failed:', leadError);
      // Lead insert failed — clean up the already-uploaded file so storage
      // doesn't accumulate orphans.
      await cleanupFile(filePath, 'rfp_uploads');
      return apiError('DB_ERROR', 'Failed to save your request', 500);
    }

    leadId = lead?.id ?? null;

    // 3. Link uploaded file to lead
    if (leadId) {
      const { error: uploadLinkError } = await supabaseAdmin
        .from('uploads')
        .insert({ lead_id: leadId, file_path: filePath });

      if (uploadLinkError) {
        // Lead is saved; only the DB link failed.
        // File is retained in storage — it can be re-linked manually.
        // This is a non-fatal partial failure: lead saved, file retained, link failed.
        console.error(
          `uploads link failed for lead ${leadId} / file ${filePath}:`,
          uploadLinkError
        );
        // Continue — do not return error to user, lead was captured successfully
      }
    }
  }

  // 4. Send notification email (non-fatal)
  if (resend && process.env.RESEND_FROM_EMAIL) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: 'sales@miterion.com',
        subject: 'New RFP Request',
        html: buildNotificationHtml({ email, company, message, filePath }),
      });
    } catch (emailError) {
      console.error('Email notification failed (non-fatal):', emailError);
      if (supabaseAdmin) {
        await supabaseAdmin.from('email_queue').insert({
          to_email: 'sales@miterion.com',
          subject: 'New RFP Request',
          html: buildNotificationHtml({ email, company, message, filePath }),
        });
      }
    }
  }

  return apiSuccess({ leadId });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function cleanupFile(filePath: string, bucket: string): Promise<void> {
  if (!supabaseAdmin) return;
  try {
    await supabaseAdmin.storage.from(bucket).remove([filePath]);
    console.info(`Cleaned up orphaned file: ${bucket}/${filePath}`);
  } catch (err) {
    console.error(`Cleanup failed for ${bucket}/${filePath}:`, err);
  }
}

function buildNotificationHtml(p: {
  email: string;
  company?: string | null;
  message?: string | null;
  filePath?: string;
}): string {
  return `
    <h2>New RFP Request</h2>
    <p><strong>Email:</strong> ${p.email}</p>
    ${p.company ? `<p><strong>Company:</strong> ${p.company}</p>` : ''}
    ${p.message ? `<p><strong>Message:</strong> ${p.message}</p>` : ''}
    ${p.filePath ? `<p><strong>File:</strong> ${p.filePath}</p>` : ''}
  `;
}
