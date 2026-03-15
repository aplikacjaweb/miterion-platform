import { z } from 'zod';

// ---------------------------------------------------------------------------
// Snapshot forms
// ---------------------------------------------------------------------------

export const snapshotPreviewSchema = z.object({
  indication: z.string().min(2, 'Indication must be at least 2 characters').max(100),
  phase: z.enum(['All', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4']),
  country_name: z.string().min(1, 'Country is required').max(100),
  country_code: z.string().length(2).optional(),
});

export const snapshotUnlockSchema = z.object({
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional().or(z.literal('')),
  user_question: z.string().max(1000).optional().or(z.literal('')),
});

export type SnapshotPreviewFormData = z.infer<typeof snapshotPreviewSchema>;
export type SnapshotUnlockFormData = z.infer<typeof snapshotUnlockSchema>;

// ---------------------------------------------------------------------------
// RFP form
// ---------------------------------------------------------------------------

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const rfpBaseSchema = z.object({
  email: z.string().email('Invalid email address'),
  company: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100)
    .optional()
    .nullable()
    .or(z.literal('')),
  message: z.string().max(1000).optional().nullable(),
});

export const rfpFormSchema = rfpBaseSchema.extend({
  file: z
    .custom<File>((val) => {
      if (typeof File === 'undefined') return false;
      return val instanceof File;
    })
    .refine((f) => f.size > 0, 'File cannot be empty')
    .refine((f) => f.size <= 20 * 1024 * 1024, 'File must be less than 20MB')
    .refine((f) => ALLOWED_FILE_TYPES.includes(f.type), 'File must be PDF or XLSX'),
});

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