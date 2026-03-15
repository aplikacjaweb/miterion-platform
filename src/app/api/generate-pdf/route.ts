import { apiError, apiSuccess } from '@/lib/apiResponse';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { renderToBuffer } from '@react-pdf/renderer';
import { PdfDocument } from '@/lib/pdfDocument'; // New import for the PDF component
import React from 'react'; // Dodano import React

export const runtime = "nodejs";

const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60; // 1 hour

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

  // Ensure data structure matches expected PdfDocument props
  if (
    !data ||
    typeof data !== 'object' ||
    (data as { error?: boolean }).error ||
    !('preview' in (data as any)) || // Basic check for preview
    !('studies' in (data as any)) // Basic check for studies
  ) {
    return apiError('INVALID_REQUEST', 'Invalid or incomplete trial data for PDF generation', 400);
  }

  if (!supabaseAdmin) {
    return apiError('SERVICE_UNAVAILABLE', 'Storage service is not configured', 503);
  }

  let uploadedFilename: string | null = null;

  try {
    // Generate PDF using @react-pdf/renderer
    const pdfBuffer = await renderToBuffer(React.createElement(PdfDocument, { data: data as any }) as any); // Użyto React.createElement

    const slug = String(indication ?? 'report')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    uploadedFilename = `${slug}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('reports')
      .upload(uploadedFilename, pdfBuffer, {
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
          country: country_name,
          country_code: country_code || null,
          user_question: user_question || null,
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

    const debugMessage =
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? `Failed to generate PDF: ${error.message}`
          : 'Failed to generate PDF: unknown error'
        : 'Failed to generate PDF. Please try again.';

    return apiError('PDF_FAILED', debugMessage, 500);
  }
}
