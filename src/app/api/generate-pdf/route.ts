import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key not provided. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed", message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method Not Allowed", message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method Not Allowed", message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: "Method Not Allowed", message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}

export async function HEAD() {
  return NextResponse.json(
    { error: "Method Not Allowed", message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { indication, phase, geography, email, data: previewData } = await req.json();

    const numberOfActiveTrials = previewData?.preview?.totalTrials || 0;
    const totalTrials = previewData?.preview?.totalTrials || 0;
    const recruitingTrials = previewData?.preview?.recruitingTrials || 0;
    const topSponsors = previewData?.preview?.topSponsors || [];
    const countryDistribution = previewData?.preview?.countryDistribution || [];
    const recruitingPct = previewData?.preview?.recruitingPct || 0;

    // TASK 2: IMPLEMENT "TRIAL FEASIBILITY SCORE" (TFS)
    const baseScore = 100;
    const penalty = numberOfActiveTrials * 3;
    const rawScore = baseScore - penalty;
    const finalScore = Math.max(15, Math.min(95, rawScore));

    let riskLabel: string;
    if (finalScore < 40) {
      riskLabel = "HIGH RISK";
    } else if (finalScore >= 40 && finalScore <= 70) {
      riskLabel = "MEDIUM RISK";
    } else {
      riskLabel = "LOW RISK";
    }

    // Derived metrics for PAGE 3 of the new SNAPSHOT PDF
    const topRisk = "Unexpected Complexity Detected. Your chosen market shows recruitment pressure that historically leads to 9–14 month delays."; // Hardcoded from new instructions
    const geoGap = "1 Geo-Gap identified where competitor activity is < 15%."; // Hardcoded for now, if dynamic, need to fetch/calculate
    const decisionPressure = "High site competition usually forces CROs to underbid initially and recover margins via Change Orders."; // Hardcoded from new instructions

    // Simple HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Miterion Clinical Landscape Snapshot</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 12px; color: #333; }
              .page { width: 210mm; height: 297mm; padding: 40px; box-sizing: border-box; }
              h1 { font-size: 28px; color: #1a202c; margin-bottom: 15px; }
              h2 { font-size: 22px; color: #2d3748; margin-top: 20px; margin-bottom: 10px; }
              h3 { font-size: 18px; color: #4a5568; margin-top: 15px; margin-bottom: 8px; }
              p { line-height: 1.6; margin-bottom: 10px; }
              ul { list-style: none; padding: 0; margin-bottom: 10px; }
              li { margin-bottom: 5px; }
              hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
              .bold-score { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          </style>
      </head>
      <body>
          <div class="page">
              <h1>Miterion Clinical Landscape Snapshot</h1>
              <p><strong>Indication:</strong> ${indication}</p>
              <p><strong>Phase:</strong> ${phase}</p>
              <p><strong>Geography:</strong> ${geography}</p>
              <hr />
              <h2>Feasibility Signal</h2>
              <p class="bold-score">
                  ${finalScore} / 100
              </p>
              <p>
                  This score reflects trial density, recruitment pressure, and competitive overlap.
              </p>
              <hr />
              <h2>Market Overview</h2>
              <ul>
                  <li>Total active trials: <strong>${totalTrials}</strong></li>
                  <li>Recruiting trials: <strong>${recruitingTrials}</strong></li>
                  <li>Recruiting ratio: <strong>${recruitingPct}%</strong></li>
              </ul>
              <h3>Top Sponsors</h3>
              <ul>
                  ${topSponsors.slice(0, 5).map((s: any) => `<li>${s.sponsor} — ${s.count} trials</li>`).join('')}
              </ul>
              <h3>Top Countries</h3>
              <ul>
                  ${countryDistribution.slice(0, 5).map((c: any) => `<li>${c.country} — ${c.count} trials</li>`).join('')}
              </ul>
              <hr />
              <h2>Immediate Risk Signal</h2>
              <p>
                  <strong>Top Risk:</strong><br/>
                  ${topRisk}
              </p>
              <p>
                  <strong>Hidden Opportunity:</strong><br/>
                  ${geoGap}
              </p>
              <p>
                  <strong>Decision Pressure:</strong><br/>
                  ${decisionPressure}
              </p>
              <hr />
              <h2>What This Means</h2>
              <p>
                  You are entering a competitive landscape where recruitment delays and site saturation
                  can significantly impact timelines and capital efficiency.
              </p>
              <hr />
              <h2>Next Step</h2>
              <p>
                  If you need a clear decision on:
              </p>
              <ul>
                  <li>Where to run your trial</li>
                  <li>How to avoid recruitment bottlenecks</li>
                  <li>Which markets offer the highest probability of success</li>
              </ul>
              <p>
                  <strong>→ Request Clinical Intelligence Report</strong>
              </p>
          </div>
      </body>
      </html>
    `;

    // TASK 3: FORM INPUT & SUPABASE UPGRADE - Flow A: Free Snapshot
    // Save snapshot request to Supabase (degraded grace on failure)
    try {
        const { data, error } = await supabase
          .from('leads') // Assuming 'leads' is the table for free snapshots
          .insert([{ indication, phase, geography, email, final_score: finalScore, risk_label: riskLabel }])
          .select();

        if (error) {
          console.error('Supabase insert error for Free Snapshot:', error);
          // Do NOT crash the app, log it and proceed
        } else {
          console.log('Free Snapshot data saved to Supabase:', data);
        }
    } catch (dbError) {
        console.error('Unexpected error during Supabase insert for Free Snapshot:', dbError);
        // Do NOT crash the app, log it and proceed
    }

    // Send the HTML content via email using Resend
    try {
      if (resend && process.env.RESEND_FROM_EMAIL) {
        console.log('Attempting to send email via Resend...');
        console.log('From:', process.env.RESEND_FROM_EMAIL);
        console.log('To:', email);
        
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: email,
          subject: 'Your Clinical Trial Snapshot Report',
          html: htmlContent,
        });

        if (emailError) {
          console.error('Error sending email with Resend:', emailError);
          console.error('Email error details:', JSON.stringify(emailError, null, 2));
        } else {
          console.log('Email sent successfully to:', email);
          console.log('Email response:', emailData);
        }
      } else {
        console.warn('Resend not configured properly. RESEND_API_KEY:', !!process.env.RESEND_API_KEY);
        console.warn('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      if (emailError instanceof Error) {
        console.error('Email error stack:', emailError.stack);
      }
      // Do not fail the entire request if email sending fails
    }

    // Configure puppeteer to generate the PDF
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Clinical_Landscape_Snapshot.pdf"',
      },
    });

  } catch (error) {
    console.error('PDF generation API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    let errorMessage = 'Failed to generate PDF';
    let errorDetails = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    );
  }
}
