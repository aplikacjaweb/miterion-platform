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
    let filePath: string | null = null;
    
    // Check if the request is multipart form data (file upload)
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle multipart form data for file uploads
      const formData = await request.formData();
      const email = formData.get('email') as string;
      const company = formData.get('company') as string;
      const message = formData.get('message') as string;
      const file = formData.get('file') as File | null;
      
      // Validate required fields
      if (!email) {
        return apiError('INVALID_REQUEST', 'Email is required', 400);
      }
      
      // Handle file upload if present
      if (file) {
        // Upload the file to Supabase Storage
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
      
      // Construct the body object for validation
      body = { email, company, message, filePath };
    } else {
      // Handle JSON body for non-file requests
      try {
        body = await request.json();
      } catch (e) {
        return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
      }
    }

    const parsed = premiumSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        'INVALID_REQUEST',
        parsed.error.errors.map((e) => e.message).join('; '),
        400
      );
    }

    const { email, company, message } = parsed.data;
    // Use the filePath from multipart handling if it was set
    if (filePath === null) {
      filePath = parsed.data.filePath || null;
    }

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
    let fileDownloadUrl: string | null = null;
    if (supabaseAdmin && filePath) {
      const RFP_UPLOAD_BUCKET = process.env.SUPABASE_RFP_BUCKET_NAME || 'rfp_uploads';
      try {
        const { data: signedData, error: signedError } = await supabaseAdmin.storage
          .from(RFP_UPLOAD_BUCKET)
          .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

        if (signedError) {
          console.error(`[${url.pathname}] Failed to generate signed URL for download:`, signedError);
        } else {
          fileDownloadUrl = signedData.signedUrl;
        }
      } catch (storageError) {
        console.error(`[${url.pathname}] Storage operation failed (non-fatal):`, storageError);
        fileDownloadUrl = null; // Explicitly set to null to continue execution
      }
    }

    const subject = `[Miterion] ${typeLabel} Request from ${email}`;
    const emailHtml = `
      <h2>New ${typeLabel} Request</h2>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      ${fileDownloadUrl 
        ? `<p><strong>Supporting Document:</strong> <a href="${fileDownloadUrl}">Download File</a></p>` 
        : filePath 
          ? `<p><strong>File Path:</strong> ${filePath} (Signed URL generation failed)</p>`
          : '<p><em>No file provided</em></p>'
      }
    `;

    if (!resend || !env.RESEND_FROM_EMAIL) {
      console.error(`[${url.pathname}] Resend configuration missing. RESEND_API_KEY: ${env.RESEND_API_KEY ? 'Present' : 'Missing'}, FROM: ${env.RESEND_FROM_EMAIL || 'Missing'}`);
    } else {
      console.log(`[${url.pathname}] Resend configured. Attempting notification to contact@miterion.com`);
      
      // Internal notification
      const { data: notifyData, error: resendError } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
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
      } else {
        console.log(`[${url.pathname}] Notification email sent:`, notifyData?.id);
      }

      // Requester confirmation email
      try {
        console.log(`[${url.pathname}] Attempting confirmation to ${email}`);
        const { data: confirmData, error: confirmError } = await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: email,
          subject: `Request Received: ${typeLabel}`,
          html: `
            <h3>Thank you for your request</h3>
            <p>We have received your request for <strong>${typeLabel}</strong>.</p>
            <p>Our team will review your information and get back to you shortly.</p>
            <hr/>
            <p><small>This is an automated confirmation.</small></p>
          `,
        });
        if (confirmError) {
          console.error(`[${url.pathname}] Requester confirmation failed:`, confirmError);
        } else {
          console.log(`[${url.pathname}] Requester confirmation sent to: ${email}, ID: ${confirmData?.id}`);
        }
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
