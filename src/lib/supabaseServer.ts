import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase admin client, or null if env vars are missing.
 * API routes guard against null before use, so the dev server stays
 * runnable even without a real Supabase project configured.
 */
function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      '[supabase] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. ' +
        'Database and storage features will be unavailable.' +
        ` (URL: ${url || 'not set'}, Key present: ${!!key})`
    );
    return null;
  }

  console.info(
    '[supabase] Initializing admin client with:' +
      ` URL: ${url}` +
      ` Key: ${key.substring(0, 5)}...${key.substring(key.length - 5)}`
  );

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabaseAdmin = createAdminClient();
