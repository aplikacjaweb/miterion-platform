import { NextResponse } from 'next/server';
import { fetchTrials } from '@/lib/clinicaltrials';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { apiError } from '@/lib/apiResponse';

export const runtime = "nodejs";

/**
 * NOTE — intentional exception to the apiSuccess() wrapper pattern.
 *
 * fetch-trials returns FetchTrialsResponse directly (not wrapped in { error, data }).
 * Why: FetchTrialsResponse already carries a domain-level discriminated union
 * { error: true/false } that the SnapshotForm reads and branches on.
 * Wrapping it inside { error: false, data: { error: false, ... } } would
 * create ugly double-nesting with no benefit.
 *
 * All other routes use apiSuccess(). This one is the documented exception.
 * See ARCHITECTURE.md — "API response shapes".
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError('INVALID_REQUEST', 'Request body must be valid JSON', 400);
  }

  const { indication, phase, country_name, country_code } = (body ?? {}) as Record<string, unknown>;

  if (!indication || typeof indication !== 'string' || indication.trim().length < 2) {
    return apiError('INVALID_REQUEST', 'Indication must be at least 2 characters', 400);
  }

  if (!phase || typeof phase !== 'string') {
    return apiError('INVALID_REQUEST', 'Phase is required', 400);
  }

  if (!country_name || typeof country_name !== 'string') {
    return apiError('INVALID_REQUEST', 'Country name is required', 400);
  }

  const cacheKey = `${indication.trim()}:${phase}:${country_name}:${country_code || ''}`;
  // Check cache
  if (supabaseAdmin) {
    const { data: cached, error: cacheReadError } = await supabaseAdmin
      .from('api_cache')
      .select('payload')
      .eq('cache_key', cacheKey)
      .single();

    if (cacheReadError && cacheReadError.code !== 'PGRST116') {
      console.error('Cache read failed (non-fatal):', cacheReadError);
    }

    if (cached?.payload) {
      // Return cached payload in same shape as live response
      return NextResponse.json(cached.payload);
    }
  }

  const result = await fetchTrials({
    indication: indication.trim(),
    phase: phase as string,
    country_name: country_name as string,
    country_code: (country_code as string) || undefined,
  });

  // Cache on success (non-fatal)
  if (!result.error && supabaseAdmin) {
    try {
      const { error: cacheWriteError } = await supabaseAdmin
        .from('api_cache')
        .upsert({ cache_key: cacheKey, payload: result });

      if (cacheWriteError) {
        console.error('Cache write failed (non-fatal):', cacheWriteError);
      }
    } catch (e) {
      console.error('Cache write failed (non-fatal):', e);
    }
  }

  return NextResponse.json(result);
}