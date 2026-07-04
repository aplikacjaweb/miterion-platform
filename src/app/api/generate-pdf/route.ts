import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { Resend } from 'resend';
import { getFooter } from '../../../lib/email-footer';

// Inicjalizacja Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Pobieramy Secret Key z pliku .env (lub używamy oficjalnego testowego klucza Cloudflare, który zawsze przepuszcza)
const TURNSTILE_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;

if (!TURNSTILE_SECRET_KEY) {
  throw new Error("Missing CLOUDFLARE_SECRET_KEY in environment variables");
}

function escapeHtml(value: unknown) {
  return String(value ?? "N/A")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderList(items: string[]) {
  if (!items.length) {
    return '<p style="color:#718096;">No visible signal found.</p>';
  }
  return "<ul>" + items.map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>";
}

export async function POST(request: Request) {
  try {
    // 1. Odczytujemy body TYLKO RAZ
    const body = await request.json();
    const { email, indication, phase, geography, data, captchaToken } = body;

    // 2. WERYFIKACJA CAPTCHA (BACKEND)
    if (!captchaToken) {
      return NextResponse.json({ error: 'Missing security token' }, { status: 400 });
    }

    // Przygotowanie żądania do API Cloudflare
    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY || '');
    formData.append('response', captchaToken);

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {
      method: 'POST',
      body: formData,
    });

    const verifyResult = await verifyResponse.json();

    // Jeśli token jest niepoprawny (lub podrobiony przez bota) - wyrzucamy błąd 403
    if (!verifyResult.success) {
      return NextResponse.json({ error: 'Security check failed. Invalid token.' }, { status: 403 });
    }

    // 3. ORYGINALNA LOGIKA ENDPOINTU (Wykonuje się tylko, gdy Captcha jest OK)
    if (!email || !indication) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const previewData = data?.preview || data || {};
    const totalTrials = previewData.totalTrials ?? 0;
    const recruitingTrials = previewData.recruitingTrials ?? 0;
    const recruitingPct = previewData.recruitingPct ?? 0;
    const topSponsors = previewData.topSponsors || [];
    const countryDistribution = previewData.countryDistribution || [];

    const hasAnyTrials = totalTrials > 0;
    const hasRecruitingTrials = recruitingTrials > 0;

    const publicRegistrySignal = hasAnyTrials ? "Visible public registry activity" : "No visible signal";
    const visibleCompetitionSignal = hasRecruitingTrials ? "Recruiting activity visible" : "None detected";
    const dataConfidence = hasAnyTrials ? "Public registry signal only" : "Low — manual review recommended";

    const executiveSignal = hasAnyTrials
      ? "Visible public registry activity was found for this query. This indicates that related trial activity is present in ClinicalTrials.gov, but it does not replace formal feasibility or site-level validation."
      : "No visible public registry signal was found for this query. This may indicate no visible competition in ClinicalTrials.gov, but it does not support a full feasibility conclusion. Manual review is recommended.";

    const whatThisMeans = hasRecruitingTrials
      ? "Recruiting trials were found in ClinicalTrials.gov for this query. This may indicate visible competition in this source and should be reviewed before formal feasibility."
      : "No recruiting trials were found in ClinicalTrials.gov for this query. This may indicate low visible competition in this source, but it can also mean that the query is too narrow, the indication is listed under different terms, or relevant evidence is available outside ClinicalTrials.gov.";

    const sponsorItems = topSponsors.slice(0, 5).map((s: any) => String(s.sponsor || "Unknown sponsor") + " - " + String(s.count || 0) + " trials");
    const countryItems = countryDistribution.slice(0, 5).map((c: any) => String(c.country || "Unknown country") + " - " + String(c.count || 0) + " trials");

    const htmlContent = [
      "<html>",
      '<body style="font-family: Arial, sans-serif; padding: 40px; color: #1a202c; line-height: 1.5; min-height: 90vh; position: relative; padding-bottom: 80px;">',
      '<div style="font-size: 11px; letter-spacing: 1px; color: #2563eb; font-weight: 700; text-transform: uppercase;">Miterion Clinical Trial Decision Intelligence</div>',
      '<h1 style="color: #111827; margin-bottom: 8px;">Clinical Landscape Snapshot</h1>',
      '<p style="color: #4b5563; margin-top: 0;">First-pass public registry signal. Not a full feasibility study.</p>',
      '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;"/>',
      '<h2 style="color: #111827; font-size: 18px;">Query Summary</h2>',
      "<p><strong>Indication:</strong> " + escapeHtml(indication) + "</p>",
      "<p><strong>Phase:</strong> " + escapeHtml(phase) + "</p>",
      "<p><strong>Geography:</strong> " + escapeHtml(geography) + "</p>",
      "<p><strong>Source:</strong> ClinicalTrials.gov public registry data</p>",
      '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;"/>',
      '<h2 style="color: #111827; font-size: 18px;">Executive Signal</h2>',
      "<p>" + escapeHtml(executiveSignal) + "</p>",
      '<h2 style="color: #111827; font-size: 18px;">Signal Summary</h2>',
      '<table style="width: 100%; border-collapse: collapse; margin-top: 12px;">',
      "<tr>",
      '<td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>Public Registry Signal</strong><br/>' + escapeHtml(publicRegistrySignal) + "</td>",
      '<td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>Visible Trial Activity</strong><br/>' + escapeHtml(totalTrials) + " matched studies</td>",
      "</tr>",
      "<tr>",
      '<td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>Recruiting Trials Found</strong><br/>' + escapeHtml(recruitingTrials) + " (" + escapeHtml(recruitingPct) + "%)</td>",
      '<td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>Visible CT.gov Competition</strong><br/>' + escapeHtml(visibleCompetitionSignal) + "</td>",
      "</tr>",
      "<tr>",
      '<td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>Data Confidence</strong><br/>' + escapeHtml(dataConfidence) + "</td>",
      '<td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>Selected Geography</strong><br/>' + escapeHtml(geography) + "</td>",
      "</tr>",
      "</table>",
      '<h2 style="color: #111827; font-size: 18px; margin-top: 28px;">What This Means</h2>',
      "<p>" + escapeHtml(whatThisMeans) + "</p>",
      '<h2 style="color: #111827; font-size: 18px; margin-top: 28px;">Sponsor Signal</h2>',
      renderList(sponsorItems),
      '<h2 style="color: #111827; font-size: 18px; margin-top: 28px;">Country Signal</h2>',
      renderList(countryItems),
      getFooter(),
      '</body></html>'
    ].join("");

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    const pdfBufferNode = Buffer.from(pdfBuffer);

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Miterion Platform <platform@miterion.com>',
        to: email,
        subject: `Your Clinical Landscape Snapshot: ${indication}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <p>Hello,</p>
            <p>Thank you for using Miterion. Attached to this email, you will find your clinical landscape snapshot report for <strong>${escapeHtml(indication)}</strong>.</p>
            <p>We hope this report provides valuable insights for your research.</p>
            <br/>
            ${getFooter()}
          </div>
        `,
        text: `Thank you for using Miterion. Attached is your clinical landscape snapshot report for ${indication}.`,
        attachments: [
          {
            filename: `Miterion-Snapshot-${indication.replace(/\s+/g, '-')}.pdf`,
            content: pdfBufferNode,
          },
        ],
      });

      await resend.emails.send({
        from: 'Miterion Platform <platform@miterion.com>',
        to: 'contact@miterion.com',
        subject: `[LEAD] Snapshot Downloaded: ${email}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <p>User ${escapeHtml(email)} generated a snapshot.</p>
            <p><strong>Query Details:</strong></p>
            <p>Indication: ${escapeHtml(indication)}<br/>
            Phase: ${escapeHtml(phase)}<br/>
            Geography: ${escapeHtml(geography)}<br/>
            Total Studies Found: ${totalTrials}</p>
            ${getFooter()}
          </div>
        `,
        text: `User ${email} generated a snapshot.\n\nQuery Details:\nIndication: ${indication}\nPhase: ${phase}\nGeography: ${geography}\nTotal Studies Found: ${totalTrials}`,
      });
    }

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Miterion-Snapshot-${indication.replace(/\s+/g, '-')}.pdf"`,
      },
    });

  } catch (error: any) {
    return new NextResponse(error?.message || 'Internal Server Error', { status: 500 });
  }
}