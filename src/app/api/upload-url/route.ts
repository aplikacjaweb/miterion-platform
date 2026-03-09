import { supabaseAdmin } from '@/lib/supabaseServer';
import { apiError, apiSuccess } from '@/lib/apiResponse';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return apiError('SERVICE_UNAVAILABLE', 'Storage service is not configured', 503);
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const type = searchParams.get('type');

  if (!filename || !type) {
    return apiError('INVALID_REQUEST', 'filename and type query params are required', 400);
  }
  if (!ALLOWED_TYPES.includes(type)) {
    return apiError('INVALID_REQUEST', 'File must be PDF or XLSX', 400);
  }

  // Sanitise filename — strip path traversal attempts
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${Date.now()}-${safeName}`;

  const { data, error } = await supabaseAdmin.storage
    .from('rfp-uploads')
    .createSignedUploadUrl(path, { expiresIn: 120 });

  if (error || !data?.signedUrl) {
    console.error('Signed URL generation failed:', error);
    return apiError('UPLOAD_FAILED', 'Failed to generate upload URL', 500);
  }

  return apiSuccess({ signedUrl: data.signedUrl, path: data.path });
}
