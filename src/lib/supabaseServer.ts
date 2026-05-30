import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { env } from './env';

/**
 * Returns a Supabase admin client, or null if env vars are missing.
 */
function createAdminClient(): SupabaseClient | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      '[supabase] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. ' +
        'Database and storage features will be unavailable.'
    );
    return null;
  }

  try {
    return createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (e) {
    console.error('[supabase] Error creating admin client:', e);
    return null;
  }
}

export const supabaseAdmin = createAdminClient();
