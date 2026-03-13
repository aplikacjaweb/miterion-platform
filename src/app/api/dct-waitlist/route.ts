import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { dctWaitlistSchema } from '@/lib/validation';
import { apiError, apiSuccess } from '@/lib/apiResponse';

export const runtime = "nodejs";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
      // Unique constraint violation — already on the list, treat as success
      if (dbError.code === '23505') {
        return apiSuccess({ alreadyRegistered: true });
      }
      console.error('DCT waitlist DB error:', dbError);
      return apiError('DB_ERROR', 'Failed to join waitlist', 500);
    }
  }

  // Send confirmation email (non-fatal)
  if (resend && process.env.RESEND_FROM_EMAIL) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Welcome to the DCT Dashboard Waitlist',
        html: `
          <h2>Thanks for Joining!</h2>
          <p>You're on the waitlist for early access to our Decentralized Clinical Trials dashboard.</p>
          <p>We'll notify you as soon as it's ready.</p>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email failed (non-fatal):', emailError);
      if (supabaseAdmin) {
        await supabaseAdmin.from('email_queue').insert({
          to_email: email,
          subject: 'Welcome to the DCT Dashboard Waitlist',
          html: '<h2>Thanks for Joining!</h2><p>You\'re on the waitlist.</p>',
        });
      }
    }
  }

  return apiSuccess({ alreadyRegistered: false });
}
