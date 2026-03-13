import puppeteer from 'puppeteer-core';
import type { Browser } from 'puppeteer-core';
import { generatePdfContent } from '@/lib/pdfTemplate';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { apiError, apiSuccess } from '@/lib/apiResponse';

export const runtime = "nodejs";

const PAGE_TIMEOUT_MS = 25_000;
const LAUNCH_TIMEOUT_MS = 15_000;
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60; // 1 hour

type PuppeteerLaunchOptions = Parameters<typeof puppeteer.launch>[0];

async function getLaunchOptions(): Promise<PuppeteerLaunchOptions> {
  const localExecutablePath = process.env.CHROMIUM_EXECUTABLE_PATH;

  if (localExecutablePath) {
    return {
      executablePath: localExecutablePath,
      headless: true,
      timeout: LAUNCH_TIMEOUT_MS,
    };
  }

  const chromium = (await import('@sparticuz/chromium-min')).default;
  const executablePath = await chromium.executablePath();

  return {
    args: chromium.args,
    executablePath,
    headless: true,
    defaultViewport: chromium.defaultViewport,
    timeout: LAUNCH_TIMEOUT_MS,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
  }

  const { email, company, indication, phase, country_name, country_code, user_question, data } =
    (body ?? {}) as Record<string, unknown>;

  if (!email || typeof email !== 'string') {
    return apiError('INVALID_REQUEST', 'Email is required', 400);
  }

  if (!indication || typeof indication !== 'string') {
    return apiError('INVALID_REQUEST', 'Indication is required', 400);
  }

  if (!phase || typeof phase !== 'string') {
    return apiError('INVALID_REQUEST', 'Phase is required', 400);
  }

  if (!country_name || typeof country_name !== 'string') {
    return apiError('INVALID_REQUEST', 'Country name is required', 400);
  }

  if (!data || typeof data !== 'object' || (data as { error?: boolean }).error) {
    return apiError('INVALID_REQUEST', 'Invalid trial data', 400);
  }

  if (!supabaseAdmin) {
    return apiError('SERVICE_UNAVAILABLE', 'Storage service is not configured', 503);
  }

  let browser: Browser | null = null;
  let uploadedFilename: string | null = null;

  try {
    const html = generatePdfContent(
      data as Parameters<typeof generatePdfContent>[0]
    );

    const launchOptions = await getLaunchOptions();
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(PAGE_TIMEOUT_MS);
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: true,
      timeout: PAGE_TIMEOUT_MS,
    });

    const slug = String(indication ?? 'report')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    uploadedFilename = `${slug}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('reports')
      .upload(uploadedFilename, pdf, {
        contentType: 'application/pdf',
        cacheControl: '3600',
      });

    if (uploadError) {
      uploadedFilename = null;
      throw Object.assign(new Error(`Storage upload failed: ${uploadError.message}`), {
        cause: uploadError,
      });
    }

    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('reports')
      .createSignedUrl(uploadedFilename, SIGNED_URL_EXPIRES_IN_SECONDS);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw Object.assign(
        new Error(
          `Signed URL creation failed: ${signedUrlError?.message ?? 'No signed URL returned'}`
        ),
        { cause: signedUrlError }
      );
    }

    try {
      const { error: leadSaveError } = await supabaseAdmin
        .from('leads')
        .insert({
          email,
          company: company || null,
          indication,
          phase,
          country: country_name, // Changed from geo
          country_code: country_code || null, // New field
          user_question: user_question || null, // New field
          pdf_path: uploadedFilename,
        });

      if (leadSaveError) {
        console.error('Lead save failed (non-fatal):', leadSaveError);
      }
    } catch (e) {
      console.error('Lead save failed (non-fatal):', e);
    }

    return apiSuccess({ downloadUrl: signedUrlData.signedUrl });
  } catch (error) {
    console.error('PDF generation error:', error);

    if (uploadedFilename && supabaseAdmin) {
      try {
        const { error: cleanupError } = await supabaseAdmin.storage
          .from('reports')
          .remove([uploadedFilename]);

        if (cleanupError) {
          console.error('Cleanup failed:', cleanupError);
        }
      } catch (e) {
        console.error('Cleanup failed:', e);
      }
    }

    const isTimeout =
      error instanceof Error &&
      (error.message.includes('timeout') || error.message.includes('Timeout'));

    if (isTimeout) {
      return apiError(
        'PDF_FAILED',
        'PDF generation timed out. Please try again. If this persists, try a narrower indication or geography.',
        504
      );
    }

    const debugMessage =
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? `Failed to generate PDF: ${error.message}`
          : 'Failed to generate PDF: unknown error'
        : 'Failed to generate PDF. Please try again.';

    return apiError('PDF_FAILED', debugMessage, 500);
  } finally {
    if (browser) {
      await browser.close().catch((e) => console.error('Browser close failed:', e));
    }
  }
}