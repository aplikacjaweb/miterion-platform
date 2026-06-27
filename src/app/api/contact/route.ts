import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { getFooter } from '../../../lib/email-footer';

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
      console.log("✓ [Localhost Mode] Wykryto automatyczny token testowy. Pomijam sprawdzanie API Cloudflare.");
    } else {
      if (!token) {
        return NextResponse.json({ error: true, code: 'INVALID_REQUEST', message: 'Security token is missing' }, { status: 400 });
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
        console.error("❌ Cloudflare odrzuciło token produkcyjny:", verifyResult);
        return NextResponse.json({ error: true, code: 'INVALID_REQUEST', message: 'Failed to verify security token.' }, { status: 403 });
      }
    }

    // SUPABASE STORAGE LINK (POPRAWIONY BUCKET NA 'rfp_uploads')
    let fileUrl = null;
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_RFP_BUCKET_NAME || 'rfp_uploads';

    if (filePathFromFrontend && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        console.log("DEBUG: Próba wygenerowania linku dla ścieżki:", filePathFromFrontend, "z bucketu:", bucketName);
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        
        const { data: urlData, error: urlError } = await supabase.storage
          .from(bucketName) 
          .createSignedUrl(filePathFromFrontend, 7 * 24 * 60 * 60);

        if (urlError) {
          console.error("❌ Supabase storage error:", urlError.message);
        }

        if (urlData?.signedUrl) {
          fileUrl = urlData.signedUrl;
          console.log("✓ Wygenerowano link do pliku:", fileUrl);
        }
      } catch (sbErr: any) {
        console.error("❌ Krytyczny błąd Supabase:", sbErr.message);
      }
    } else {
      console.log("DEBUG: Pominięto generowanie linku. filePath:", filePathFromFrontend);
    }

    // WYSYŁKA RESEND
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
        <div style="font-family: Arial, sans-serif;">
          <h2>New Submission</h2>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p style="background: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-      wrap;">${userMessage}</p>
          <br/>
          ${fileUrl ? `<p><strong>Attachment:</strong> <a href="${fileUrl}">Download Client File</a></p>` : '<p>No attachment or link failed.</p>'}
          ${getFooter()}
    </div>
  `,
});

    if (userEmail && userEmail !== 'no-email-provided') {
  await resend.emails.send({
    from: fromEmail,
    to: userEmail,
    subject: `We received your request`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <p>Hello ${userName}, thank you for contacting Miterion. We received your request for ${companyName}.</p>
        <p>Our team will review the details and get back to you shortly.</p>
        ${getFooter()}
      </div>
    `,
  });
}

    return NextResponse.json({ error: false, data: { message: "Success" } });

  } catch (error: any) {
    console.error("Critical API Route Error:", error.message || error);
    // Poprawiony format błędu catch, aby pasował do unwrapApi
    return NextResponse.json({ error: true, code: 'INTERNAL', message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
