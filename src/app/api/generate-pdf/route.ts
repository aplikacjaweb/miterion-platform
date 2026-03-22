import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key not provided. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  let browser = null;
  try {
    const { indication, phase, geography, email, data: previewData } = await req.json();

    const numberOfActiveTrials = previewData?.preview?.totalTrials || 0;
    const totalTrials = previewData?.preview?.totalTrials || 0;
    const recruitingTrials = previewData?.preview?.recruitingTrials || 0;
    const topSponsors = previewData?.preview?.topSponsors || [];
    const countryDistribution = previewData?.preview?.countryDistribution || [];
    const recruitingPct = previewData?.preview?.recruitingPct || 0;

    // VERCEL DEPLOYMENT GUARDRAILS
    if (process.env.VERCEL_ENV === 'production') {
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      });
    } else {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
        // For local development, you might need to specify the path to your Chrome/Chromium executable
        // executablePath: 'C:\Program Files\Google\Chrome\Application\chrome.exe', // Example for Windows
      });
    }

    const page = await browser.newPage();

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

    // UPDATED SNAPSHOT PDF TEMPLATE (3 PAGES)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Miterion Clinical Landscape Snapshot</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; font-size: 12px; color: #333; }
              .page { width: 210mm; height: 297mm; padding: 40px; box-sizing: border-box; page-break-after: always; }
              .page:last-child { page-break-after: avoid; }
              h1 { font-size: 28px; color: #1a202c; margin-bottom: 15px; }
              h2 { font-size: 22px; color: #2d3748; margin-top: 20px; margin-bottom: 10px; }
              h3 { font-size: 18px; color: #4a5568; margin-top: 15px; margin-bottom: 8px; }
              p { line-height: 1.6; margin-bottom: 10px; }
              ul { list-style: none; padding: 0; margin-bottom: 10px; }
              li { margin-bottom: 5px; }
              hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
              th { background-color: #f7fafc; }
              .bold-score { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          </style>
      </head>
      <body>
          <!-- PAGE 1 — HEADER + CONTEXT -->
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
          </div>

          <!-- PAGE 2 — DATA + TENSION -->
          <div class="page">
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
          </div>

          <!-- PAGE 3 — CRITICAL (HOOK + CTA) -->
          <div class="page">
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

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

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

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="clinical-trial-snapshot.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
