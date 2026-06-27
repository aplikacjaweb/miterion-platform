import { getFooter } from '../../../lib/email-footer';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { apiError } from '@/lib/apiResponse';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    if (!email || !message) {
      return apiError('INVALID_REQUEST', 'Email and message are required', 400);
    }

    // 1. Zapis do bazy danych
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('premium_leads')
        .insert([{ 
          email, 
          company, 
          message: `Name: ${name}\n${message}`,
          created_at: new Date().toISOString()
        }]);
    }

    // 2. WYSYŁKA MAILI PRZEZ RESEND
    try {
      // Mail do zespołu Miterion
      const miterionEmail = await resend.emails.send({
        from: 'Miterion Platform <contact@miterion.com>',
        to: 'contact@miterion.com',
        subject: `🚨 New Lead Submission: ${company || name}`,
        html: `
          <h2>New Request from Miterion Platform</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <hr />
          <h3>Submission Details:</h3>
          <pre style="white-space: pre-wrap; font-family: sans-serif; background: #f4f4f5; padding: 15px; border-radius: 8px;">${message}</pre>
        `,
      });

      if (miterionEmail.error) {
        throw new Error(`Resend Miterion Email Error: ${JSON.stringify(miterionEmail.error)}`);
      }

      // Mail potwierdzający dla użytkownika
      const userEmail = await resend.emails.send({
        from: 'Miterion Support <contact@miterion.com>',
        to: email,
        subject: 'We have received your Miterion request',
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a8a;">Hello ${name},</h2>
            <p>Thank you for submitting your request on the Miterion Platform.</p>
            <p>Our operational analysts have received your details and are already reviewing the parameters of your study case.</p>
            <p>An expert from our team will contact you shortly with the next steps.</p>
           ${getFooter()} </div>
        `,
      });

      if (userEmail.error) {
        throw new Error(`Resend User Email Error: ${JSON.stringify(userEmail.error)}`);
      }

    } catch (mailError: any) {
      console.error('❌ Resend failed to deliver:', mailError);
      return apiError('SERVER_ERROR', `Email dispatch failed: ${mailError.message}`, 500);
    }

    return NextResponse.json({ success: true, message: 'Lead processed and emails sent successfully.' });
  } catch (error: any) {
    console.error('Error in submit-lead API:', error);
    return apiError('SERVER_ERROR', error.message || 'Internal Server Error', 500);
  }
}


