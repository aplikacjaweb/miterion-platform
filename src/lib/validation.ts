import { z } from 'zod';

// ---------------------------------------------------------------------------
// Snapshot form
// ---------------------------------------------------------------------------

export const snapshotFormSchema = z.object({
  indication: z.string().min(3, 'Indication must be at least 3 characters').max(100),
  phase: z.enum(['All', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4']),
  geo: z.enum(['Global', 'US', 'EU', 'UK']),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  company: z.string().min(2).max(100).optional().or(z.literal('')),
});

// ---------------------------------------------------------------------------
// RFP form — split into client (browser) and server schemas.
//
// Why two schemas?
//   - The browser schema validates a real File object (can't exist server-side)
//   - The server schema validates the JSON payload at /api/rfp-submit
//   - They share rfpBaseSchema so field definitions never drift apart
// ---------------------------------------------------------------------------

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const rfpBaseSchema = z.object({
  email: z.string().email('Invalid email address'),
  // Explicitly optional — never required by the DB insert
  company: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100)
    .optional()
    .nullable()
    .or(z.literal('')),
  message: z.string().max(1000).optional().nullable(),
});

/**
 * Used by RfpForm (browser only).
 * Validates the File object before upload begins.
 */
export const rfpFormSchema = rfpBaseSchema.extend({
  file: z.custom((val) => { if (typeof File === 'undefined') return false; return val instanceof File; })
    .refine((f) => f.size > 0, 'File cannot be empty')
    .refine((f) => f.size <= 20 * 1024 * 1024, 'File must be less than 20MB')
    .refine(
      (f) => ALLOWED_FILE_TYPES.includes(f.type),
      'File must be PDF or XLSX'
    ),
});

/**
 * Used by /api/rfp-submit to validate the incoming JSON payload.
 * No File here — file was already uploaded to storage before this call.
 */
export const rfpSubmitSchema = rfpBaseSchema.extend({
  filePath: z.string().min(1, 'File path is required'),
});

export type RfpSubmitPayload = z.infer<typeof rfpSubmitSchema>;

// ---------------------------------------------------------------------------
// DCT waitlist
// ---------------------------------------------------------------------------

export const dctWaitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
});
