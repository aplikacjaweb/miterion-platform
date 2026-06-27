import { z } from 'zod';

export const snapshotPreviewSchema = z.object({
  indication: z.string().min(2, "Indication must be at least 2 characters").max(100),
  phase: z.enum(["All", "Phase 1", "Phase 2", "Phase 3", "Phase 4"]),
  country_name: z.string().min(1, "Country is required").max(100),
  country_code: z.string().length(2).optional(),
});

export const snapshotUnlockSchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
});

export const dctWaitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type SnapshotPreviewFormData = z.infer<typeof snapshotPreviewSchema>;
export type SnapshotUnlockFormData = z.infer<typeof snapshotUnlockSchema>;