import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const { indication, phase, geography, email, data: previewData } = await req.json();
    const totalTrials = previewData?.preview?.totalTrials || 0;
    const recruitingTrials = previewData?.preview?.recruitingTrials || 0;
    const recruitingPct = previewData?.preview?.recruitingPct || 0;
    const topSponsors = previewData?.preview?.topSponsors || [];
    const countryDistribution = previewData?.preview?.countryDistribution || [];

    const finalScore = Math.max(15, Math.min(95, 100 - (totalTrials * 3)));
    const htmlContent = `<html><body><h1>Snapshot</h1><p>Indication: ${indication}</p></body></html>`;

    if (resend && process.env.RESEND_FROM_EMAIL) {
      await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL, to: email, subject: "Snapshot", html: htmlContent }).catch(e => console.error(e));
    }

    let browser;
    if (process.env.NODE_ENV === "development" || !process.env.VERCEL) {
      const puppeteerLocal = require("puppeteer");
      browser = await puppeteerLocal.launch({ args: ["--no-sandbox"] });
    } else {
      browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    return new NextResponse(pdfBuffer, { status: 200, headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=\"snapshot-report.pdf\"" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
