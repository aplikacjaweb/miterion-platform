import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { premiumSubmitSchema } from '@/lib/validation';
import { apiError, apiSuccess } from '@/lib/apiResponse';
import { env } from '@/lib/env';

export const runtime = "nodejs";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const isRfp = url.pathname.includes('rfp-harmonization');
    const typeLabel = isRfp ? 'RFP Harmonization' : 'Full Trial Intelligence';
    
    // 1. Parse & validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch (e) {
      return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
    }

    const parsed = premiumSubmitSchema.safeParse(body);
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
          indication: isRfp ? 'RFP_HARMONIZATION_REQUEST' : 'FULL_REPORT_REQUEST',
          phase: 'PREMIUM_REQUEST_RECEIVED',
          user_question: message || null,
        })
        .select('id')
        .single();

      if (leadError) {
        console.error(`[${url.pathname}] DB insert failed:`, leadError);
        // If file was uploaded but DB failed, we attempt cleanup but continue (or return error)
        // Previous behavior returned 500 on DB error.
        return apiError('DB_ERROR', 'Failed to save your request', 500);
      }

      leadId = lead?.id ?? null;

      if (leadId && filePath) {
        try {
          const { error: uploadLinkError } = await supabaseAdmin
            .from('uploads')
            .insert({ lead_id: leadId, file_path: filePath });

          if (uploadLinkError) {
            console.error(`[${url.pathname}] uploads link failed:`, uploadLinkError);
          }
        } catch (err) {
          console.error(`[${url.pathname}] uploads link exception:`, err);
        }
      }
    }

    // 3. Send notification email
    const subject = `[Miterion] ${typeLabel} Request from ${email}`;
    const emailHtml = `
      <h2>New ${typeLabel} Request</h2>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      ${filePath ? `<p><strong>File:</strong> ${filePath}</p>` : '<p><em>No file provided</em></p>'}
    `;

    if (!resend || !env.RESEND_FROM_EMAIL) {
      console.error(`[${url.pathname}] Resend configuration missing`);
    } else {
        const { data, error: resendError } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: 'contact@miterion.com',
        reply_to: email,
        subject: subject,
        html: emailHtml,
      });

      if (resendError) {
        console.error(`[${url.pathname}] Resend failed:`, resendError);
        if (supabaseAdmin) {
          await supabaseAdmin.from('email_queue').insert({
            to_email: 'contact@miterion.com',
            subject: subject,
            html: emailHtml,
            error_log: `${resendError.name}: ${resendError.message}`
          });
        }
      } else {
        console.log(`[${url.pathname}] Notification email sent:`, data?.id);
      }
    }

    return apiSuccess({ leadId });
  } catch (outerError) {
    console.error(`[Premium Shared] Unhandled error:`, outerError);
    return apiError('INTERNAL', 'An unexpected internal error occurred', 500);
  }
}
