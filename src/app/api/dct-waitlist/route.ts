import { getFooter } from '../../../lib/email-footer';
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

  // 1. Treść maila dla UŻYTKOWNIKA
  const userEmailHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Thanks for Joining!</h2>
    <p>You're on the waitlist for early access to our Decentralized Clinical Trials dashboard.</p>
    <p>We'll notify you as soon as it's ready.</p>
    <br/>
    ${getFooter()}
  </div>
`;

  // 2. Treść maila dla ADMINISTRATORA (contact@miterion.com)
  const adminEmailHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>New Waitlist Sign-up! 🎉</h2>
    <p>A new user has just joined the DCT Dashboard waitlist.</p>
    <p><strong>User Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Submitted at:</strong> ${new Date().toLocaleString('pl-PL')}</p>
  </div>
`;

  if (!resend || !env.RESEND_FROM_EMAIL) {
    console.error('[/api/dct-waitlist] Resend configuration missing (API Key or From Email)');
  } else {
    try {
      // WYSYŁKA DO UŻYTKOWNIKA (używa userEmailHtml, brak bcc)
      const { data: userData, error: resendUserError } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: email,
        reply_to: 'contact@miterion.com',
        subject: 'Welcome to the DCT Dashboard Waitlist',
        html: userEmailHtml,
      });

      if (resendUserError) {
        console.error('[/api/dct-waitlist] Resend user email failed:', resendUserError.message);

        if (supabaseAdmin) {
          await supabaseAdmin.from('email_queue').insert({
            to_email: email,
            subject: 'Welcome to the DCT Dashboard Waitlist',
            html: userEmailHtml,
          });
        }
      } else {
        console.log('[/api/dct-waitlist] Confirmation email sent to user:', userData?.id);
      }

      // WYSYŁKA DO ADMINA (używa adminEmailHtml)
      const { data: adminData, error: resendAdminError } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: 'contact@miterion.com',
        subject: `[New Sign-up] DCT Waitlist: ${email}`,
        html: adminEmailHtml,
      });

      if (resendAdminError) {
        console.error('[/api/dct-waitlist] Resend admin notification failed:', resendAdminError.message);
      } else {
        console.log('[/api/dct-waitlist] Notification email sent to admin:', adminData?.id);
      }

    } catch (resendException) {
      console.error('[/api/dct-waitlist] Resend exception:', resendException);
      if (supabaseAdmin) {
        await supabaseAdmin.from('email_queue').insert({
          to_email: email,
          subject: 'Welcome to the DCT Dashboard Waitlist',
          html: userEmailHtml,
        });
      }
    }
  }

  return apiSuccess({ alreadyRegistered: false });
}