import { supabaseAdmin } from '@/lib/supabaseServer';
import { apiError, apiSuccess } from '@/lib/apiResponse';

export const runtime = 'nodejs';

const RFP_UPLOAD_BUCKET =
  process.env.SUPABASE_RFP_BUCKET_NAME || 'rfp_uploads';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

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

    if (error || !data?.token) {
      console.error('Signed upload URL generation failed:', { error, data }); // Preserve specific error logging
      return apiError(
        'UPLOAD_FAILED',
        error?.message || 'Failed to create upload URL',
        500
      );
    }

    console.log("[/api/upload-url] Returning success payload", { path, tokenStart: data.token?.substring(0, 10), bucketName: RFP_UPLOAD_BUCKET }); return apiSuccess({
      path,
      token: data.token,
      signedUrl: data.signedUrl ?? null, // Use null for signedUrl if not present, as in remote
      bucketName: RFP_UPLOAD_BUCKET, // Keep my addition of bucketName
    });
  } catch (error) {
    console.error('[/api/upload-url] Unhandled error:', error);
    return apiError('INTERNAL', 'Unexpected internal error', 500);
  }
}
