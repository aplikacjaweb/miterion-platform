import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { dctWaitlistSchema } from '@/lib/validation';
import { apiError, apiSuccess } from '@/lib/apiResponse';
import { env } from '@/lib/env';

export const runtime = "nodejs";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
  }

  const parsed = dctWaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      'INVALID_REQUEST',
      parsed.error.errors.map((e) => e.message).join('; '),
      400
    );
  }

  const { email } = parsed.data;

  if (supabaseAdmin) {
    const { error: dbError } = await supabaseAdmin
      .from('dct_waitlist')
      .insert({ email });

    if (dbError) {
      if (dbError.code === '23505') {
        return apiSuccess({ alreadyRegistered: true });
      }
      console.error('[/api/dct-waitlist] DB error:', dbError);
      return apiError('DB_ERROR', 'Failed to join waitlist', 500);
    }
  }

  // Send confirmation email
  // DIAGNOSTIC: Log exact runtime RESEND_FROM_EMAIL value
  console.log('[DIAGNOSTIC] RESEND_FROM_EMAIL runtime value:', JSON.stringify(env.RESEND_FROM_EMAIL));
  const emailHtml = `
    <h2>Thanks for Joining!</h2>
    <p>You're on the waitlist for early access to our Decentralized Clinical Trials dashboard.</p>
    <p>We'll notify you as soon as it's ready.</p>
  `;

  if (!resend || !env.RESEND_FROM_EMAIL) {
    console.error('[/api/dct-waitlist] Resend configuration missing (API Key or From Email)');
  } else {
    const { data, error: resendError } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: email,
      bcc: 'contact@miterion.com',
      reply_to: 'contact@miterion.com',
      subject: 'Welcome to the DCT Dashboard Waitlist',
      html: emailHtml,
    });

    if (resendError) {
      const isDomainError = resendError.message?.toLowerCase().includes('domain is not verified');
      console.error('[/api/dct-waitlist] Resend failed:', {
        name: resendError.name,
        message: resendError.message,
        isDomainError
      });

      if (supabaseAdmin) {
        await supabaseAdmin.from('email_queue').insert({
          to_email: email,
          subject: 'Welcome to the DCT Dashboard Waitlist',
          html: emailHtml,
        });
      }
    } else {
      console.log('[/api/dct-waitlist] Confirmation email sent:', data?.id);
    }
  }

  return apiSuccess({ alreadyRegistered: false });
}
