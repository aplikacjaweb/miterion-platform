import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function uploadToSignedUrl(path: string, token: string, file: File): Promise<void> {
  const uploadRes = await fetch(path, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
      'Authorization': `Bearer ${token}`, // Supabase requires this for signed uploads
    },
  });

  if (!uploadRes.ok) {
    const errorBody = await uploadRes.text();
    throw new Error(`File upload failed to signed URL: ${uploadRes.status} ${uploadRes.statusText} - ${errorBody}`);
  }
}
