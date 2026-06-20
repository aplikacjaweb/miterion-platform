
import { NextResponse } from 'next/server';



export async function POST(req: Request) {

  const { data, token } = await req.json();



  const secretKey = process.env.CLOUDFLARE_SECRET_KEY;

  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({ secret: secretKey, response: token }),

  });



  const verifyResult = await verifyResponse.json();



  if (!verifyResult.success) {

    return NextResponse.json({ error: 'Invalid CAPTCHA verification' }, { status: 400 });

  }



  // PLACEHOLDER: Add your email sending or database logic here

  return NextResponse.json({ success: true });

}

