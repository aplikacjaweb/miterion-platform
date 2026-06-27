import { getFooter } from '../../../lib/email-footer';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const TURNSTILE_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;
if (!TURNSTILE_SECRET_KEY) {
  throw new Error("Missing CLOUDFLARE_SECRET_KEY in environment variables");
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = body.data || body;
    const token = body.token || payload.token || '';

    const userEmail = payload.email || 'no-email-provided';
    const userName = payload.name || payload.firstName || payload.fullName || 'User';
    const companyName = payload.company || payload.companyName || 'Not provided';
    const userMessage = payload.message || payload.text || 'No message content.';
    const filePathFromFrontend = payload.filePath || payload.file || payload.attachment || '';

    // WERYFIKACJA CLOUDFLARE TURNSTILE
    

    if (token === 'mock-vercel-development-token') {
      console.log("??? [Localhost Mode] Wykryto automatyczny token testowy. Pomijam sprawdzanie API Cloudflare.");
    } else {
      if (!token) {
        return NextResponse.json({ error: 'Security token is missing' }, { status: 400 });
      }
      
      const formData = new URLSearchParams();
      formData.append('secret', TURNSTILE_SECRET_KEY || '');
      formData.append('response', token);

      const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      
      const verifyResult = await verifyResponse.json().catch(() => ({ success: false }));
      
      if (!verifyResult.success) {
        console.error("? Cloudflare odrzuciĂ„Ä…Ă˘â‚¬Ĺˇo token produkcyjny:", verifyResult);
        return NextResponse.json({ error: 'Failed to verify security token.' }, { status: 403 });
      }
    }

    // SUPABASE STORAGE LINK
    let fileUrl = null;
    if (filePathFromFrontend && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: urlData } = await supabase.storage
          .from('uploads') 
          .createSignedUrl(filePathFromFrontend, 7 * 24 * 60 * 60);

        if (urlData?.signedUrl) fileUrl = urlData.signedUrl;
      } catch (sbErr: any) {
        console.error("BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d Supabase:", sbErr.message);
      }
    }

    // WYSYĂ„Ä…Ă‚ÂKA RESEND
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("Missing RESEND_API_KEY in .env.local");
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Miterion <contact@miterion.com>';

    await resend.emails.send({
      from: fromEmail,
      to: 'contact@miterion.com',
      reply_to: userEmail,
      subject: `[Miterion] Form Submission: ${companyName}`,
      html: `
        <h2>New Submission</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p style="background: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${userMessage}</p>
        <br/>
        ${fileUrl ? `<p><strong>Attachment:</strong> <a href="${fileUrl}">Download Client File</a></p>` : '<p>No attachment or link failed.</p>'}
      `,
    });

    if (userEmail && userEmail !== 'no-email-provided') {
      await resend.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: `We received your request`,
        html: `<p>Hello ${userName}, thank you for contacting Miterion. We received your request for ${companyName}.</p>`,
      });
    }

    return NextResponse.json({ success: true, status: "success", ok: true, data: { message: "Success" } });

  } catch (error: any) {
    console.error("Critical API Route Error:", error.message || error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



