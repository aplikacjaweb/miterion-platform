import { supabaseAdmin } from '@/lib/supabaseServer';
import { apiError, apiSuccess } from '@/lib/apiResponse';

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
  }

  if (!supabaseAdmin) {
    return apiError('SERVICE_UNAVAILABLE', 'Storage service is not configured', 503);
  }

  const { filename } = (body ?? {}) as Record<string, unknown>;

  if (!filename || typeof filename !== 'string') {
    return apiError('INVALID_REQUEST', 'Filename is required', 400);
  }

  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${Date.now()}-${safeFilename}`;

  const { data, error } = await supabaseAdmin.storage
    .from('rfp_uploads')
    .createSignedUploadUrl(path);

  if (error || !data?.signedUrl || !data?.token) {
    console.error('Signed upload URL generation failed:', error);
    return apiError('UPLOAD_FAILED', 'Failed to create upload URL', 500);
  }

  return apiSuccess({
    path,
    token: data.token,
    signedUrl: data.signedUrl,
  });
}