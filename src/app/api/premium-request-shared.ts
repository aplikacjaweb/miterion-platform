import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { z } from 'zod';
import { apiError, apiSuccess } from '@/lib/apiResponse';
import { env } from '@/lib/env';

const localPremiumSubmitSchema = z.object({
  email: z.string().email(),
  company: z.string().optional().or(z.string().nullable()),
  message: z.string().optional().or(z.string().nullable()),
  filePath: z.string().optional().nullable(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // KROK OSTATECZNY: Wklejasz tutaj swój pełny, prawdziwy klucz w cudzysłowie.
    // Generator ani Windows nie mają już nic do gadania!
    const apiKey = process.env.RESEND_API_KEY;
    
    // --- BLOK DEBUGOWANIA ---
    console.log("======= DETEKTYW RESEND =======");
    console.log("Czy klucz w ogóle istnieje?:", !!apiKey);
    console.log("Długość klucza (znaki):", apiKey ? apiKey.length : 0);
    console.log("Jak się zaczyna?:", apiKey ? apiKey.substring(0, 7) : "brak");
    console.log("===============================");

    const fromEmail = process.env.RESEND_FROM_EMAIL || env.RESEND_FROM_EMAIL;
    const resend = apiKey ? new Resend(apiKey) : null;

    const url = new URL(request.url);

    let typeLabel = 'Custom Support';
    let messageLabel = 'Operational Bottleneck';
    let dbIndication = 'GENERAL_EXPERT_SUPPORT';

    if (url.pathname.includes('rfp-harmonization')) {
      typeLabel = 'RFP Harmonization';
      messageLabel = 'Compared Vendors / CROs';
      dbIndication = 'RFP_HARMONIZATION_REQUEST';
    } else if (url.pathname.includes('full-report-request')) {
      typeLabel = 'Full Trial Intelligence';
      messageLabel = 'Indication & Geography';
      dbIndication = 'FULL_REPORT_REQUEST';
    }

    let body: any;
    let filePath: string | null = null;
    let captchaToken: string | null = null;

    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const email = formData.get('email') as string;
      const company = formData.get('company') as string;
      const message = formData.get('message') as string;
      const file = formData.get('file') as File | null;
      captchaToken = formData.get('token') as string | null;

      if (!email) {
        return apiError('INVALID_REQUEST', 'Email is required', 400);
      }

      if (file) {
        if (supabaseAdmin) {
          const RFP_UPLOAD_BUCKET = process.env.SUPABASE_RFP_BUCKET_NAME || 'rfp_uploads';
          const fileName = `uploads/${Date.now()}_${file.name}`;

          try {
            const { error: uploadError } = await supabaseAdmin.storage
              .from(RFP_UPLOAD_BUCKET)
              .upload(fileName, file);

            if (uploadError) {
              console.error(`[${url.pathname}] File upload failed:`, uploadError);
              return apiError('UPLOAD_FAILED', 'Failed to upload file', 500);
            }

            filePath = fileName;
          } catch (uploadException) {
            console.error(`[${url.pathname}] File upload exception:`, uploadException);
            return apiError('UPLOAD_FAILED', 'Failed to upload file', 500);
          }
        }
      }

      body = { email, company, message, filePath };
    } else {
      try {
        body = await request.json();
        captchaToken = body.token || null;
      } catch (e) {
        return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
      }
    }

    // ---> CLOUDFLARE TURNSTILE VERIFICATION <---
    const cloudflareSecret = process.env.CLOUDFLARE_SECRET_KEY;
    if (cloudflareSecret) {
      if (!captchaToken) {
        return apiError('INVALID_REQUEST', 'Security token is missing. Please try again.', 400);
      }

      const verifyForm = new URLSearchParams();
      verifyForm.append('secret', cloudflareSecret);
      verifyForm.append('response', captchaToken);

      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: verifyForm.toString(),
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          console.error(`[${url.pathname}] Captcha verification failed:`, verifyData);
          return apiError('INVALID_REQUEST', 'Security verification failed. Please try again.', 403);
        }
      } catch (captchaError) {
        console.error(`[${url.pathname}] Captcha network error:`, captchaError);
        return apiError('INTERNAL', 'Failed to verify security token.', 500);
      }
    } else {
      console.warn('CLOUDFLARE_SECRET_KEY is not defined. Skipping Captcha verification.');
    }

    const parsed = localPremiumSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        'INVALID_REQUEST',
        parsed.error.errors.map((e) => e.message).join('; '),
        400
      );
    }

    const { email, company, message } = parsed.data as any;
    if (filePath === null) {
      filePath = parsed.data.filePath || null;
    }

    let leadId: string | null = null;

    if (supabaseAdmin) {
      const { data: lead, error: leadError } = await supabaseAdmin
        .from('leads')
        .insert({
          email,
          company: company || null,
          indication: dbIndication,
          phase: 'PREMIUM_REQUEST_RECEIVED',
          user_question: message || null,
        })
        .select('id')
        .single();

      if (leadError) {
        console.error(`[${url.pathname}] DB insert failed:`, leadError);
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

    let fileDownloadUrl: string | null = null;
    if (supabaseAdmin && filePath) {
      const RFP_UPLOAD_BUCKET = process.env.SUPABASE_RFP_BUCKET_NAME || 'rfp_uploads';
      try {
        const { data: signedData, error: signedError } = await supabaseAdmin.storage
          .from(RFP_UPLOAD_BUCKET)
          .createSignedUrl(filePath, 60 * 60 * 24 * 7);

        if (signedError) {
          console.error(`[${url.pathname}] Failed to generate signed URL for download:`, signedError);
        } else {
          fileDownloadUrl = signedData.signedUrl;
        }
      } catch (storageError) {
        console.error(`[${url.pathname}] Storage operation failed (non-fatal):`, storageError);
        fileDownloadUrl = null;
      }
    }

    const subject = `[Miterion] ${typeLabel} Request from ${email}`;
    const emailHtml = `
      <h2>New ${typeLabel} Request</h2>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      ${message ? `<p><strong>${messageLabel}:</strong> ${message}</p>` : ''}
      ${fileDownloadUrl
        ? `<p><strong>Supporting Document:</strong> <a href="${fileDownloadUrl}">Download File</a></p>`
        : filePath
          ? `<p><strong>File Path:</strong> ${filePath} (Signed URL generation failed)</p>`
          : '<p><em>No file provided</em></p>'
      }
    `;

    if (!resend || !fromEmail) {
      console.error(`[${url.pathname}] Resend configuration missing. API Key present: ${!!apiKey}`);
    } else {
      console.log(`[${url.pathname}] Attempting notification to contact@miterion.com`);

      const { data: notifyData, error: resendError } = await resend.emails.send({
        from: fromEmail,
        to: 'contact@miterion.com',
        reply_to: email,
        subject: subject,
        html: emailHtml,
      });

      if (resendError) {
        console.error(`[${url.pathname}] Resend notification failed:`, resendError);
        if (supabaseAdmin) {
          await supabaseAdmin.from('email_queue').insert({
            to_email: 'contact@miterion.com',
            subject: subject,
            html: emailHtml,
          });
        }
      }

      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: `We received your ${typeLabel} request`,
          html: `
            <h3>Thank you for your request</h3>
            <p>We have received your details for <strong>${typeLabel}</strong>.</p>
            <p>Our principal analysts will review your information and come back to you shortly with a suggested scope.</p>
            <p><strong>Important Note:</strong> Please do not email sensitive trial protocols or confidential vendor proposals directly unless we confirm the appropriate secure sharing route.</p>
            <hr/>
            <p><small>Miterion Clinical Operations Intelligence</small></p>
          `,
        });
      } catch (confirmEx) {
        console.error(`[${url.pathname}] Requester confirmation exception:`, confirmEx);
      }
    }

    return apiSuccess({ leadId });
  } catch (outerError) {
    console.error(`[Premium Shared] Unhandled error:`, outerError);
    return apiError('INTERNAL', 'An unexpected internal error occurred', 500);
  }
}
