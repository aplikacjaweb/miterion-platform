import { supabaseAdmin } from '@/lib/supabaseServer';
import { apiError, apiSuccess } from '@/lib/apiResponse';

export const runtime = 'nodejs';

const RFP_UPLOAD_BUCKET =
  process.env.SUPABASE_RFP_BUCKET_NAME || 'rfp_uploads';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null); // Simplified JSON parsing

    const filename = body?.filename;
    if (!filename || typeof filename !== 'string') {
      return apiError('INVALID_REQUEST', 'Filename is required', 400);
    }

    if (!supabaseAdmin) {
      return apiError('SERVICE_UNAVAILABLE', 'Storage service is not configured', 503);
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${Date.now()}-${safeFilename}`;

    const { data, error } = await supabaseAdmin.storage
      .from(RFP_UPLOAD_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data?.token) { // Changed condition to check data?.token
      return apiError(
        'UPLOAD_FAILED',
        error?.message || 'Failed to create upload URL',
        500
      );
    }

    return apiSuccess({
      path,
      token: data.token,
      signedUrl: data.signedUrl ?? null, // Ensure signedUrl is explicitly null if undefined
    });
  } catch (error) {
    console.error('[/api/upload-url] Unhandled error:', error);
    return apiError('INTERNAL', 'Unexpected internal error', 500);
  }
}
