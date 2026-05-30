import { z } from 'zod';

/**
 * Environment variable schema.
 * 
 * We use .catch() or .optional() for variables that, if invalid/missing, 
 * should not crash the entire application but instead be handled at the 
 * feature level (e.g., a route checking if 'resend' is null).
 */
const envSchema = z.object({
  // Resend
  RESEND_API_KEY: z.string().startsWith('re_').optional(),
  RESEND_FROM_EMAIL: z.string().min(1).optional(),
  
  // Supabase (Server Side)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Environment validation failed:', JSON.stringify(_env.error.format(), null, 2));
  throw new Error('FATAL: Invalid environment variables. Fix .env or shell environment.');
}

export const env = _env.data;

/**
 * Helper to check if email features can be used.
 */
export function isResendConfigured() {
  return !!(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);
}

/**
 * Helper to check if database features can be used.
 */
export function isSupabaseConfigured() {
  return !!(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}
