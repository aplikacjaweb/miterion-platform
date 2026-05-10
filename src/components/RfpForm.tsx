'use client';

import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rfpFormSchema } from '@/lib/validation';
import { unwrapApi } from '@/lib/apiResponse';
import { supabase } from '@/lib/supabaseClient'; // Added import
import type { RfpFormData } from '@/types';

// Added type definition
type UploadUrlResponse = {
  signedUrl: string;
  path: string;
  token: string;
};

export default function RfpForm() {

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RfpFormData>({
    resolver: zodResolver(rfpFormSchema),
  });

  const onSubmit = async (data: RfpFormData) => {
    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Backend gives path + token
      const urlRes = await fetch(
        `/api/upload-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: data.file.name,
            type: data.file.type,
          }),
        }
      );

      const { path, token } = await unwrapApi<UploadUrlResponse>(urlRes);

      // Step 2: Upload through supabase-js, not raw fetch(signedUrl)
      const { error: uploadError } = await supabase.storage
        .from('rfp_uploads') // Ensure this bucket name is correct
        .uploadToSignedUrl(path, token, data.file, {
          contentType: data.file.type || 'application/pdf',
        });

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // Step 3: Submit metadata
      setIsUploading(false);
      setIsSubmitting(true);

      const submitRes = await fetch('/api/rfp-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company || undefined,
          message: data.message || undefined,
          filePath: path,
        }),
      });
      await unwrapApi(submitRes); // throws on error

      setSuccess(true);
      reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center text-green-600 p-4">
        <p className="font-semibold">Your request has been submitted successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input {...register('email')} type="email" placeholder="Your email address" className="input-field" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Company (optional)</label>
          <input {...register('company')} placeholder="Your company name" className="input-field" />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Message (optional)</label>
          <textarea {...register('message')} placeholder="Any specific requests or questions?" className="input-field min-h-[100px]" />
        </div>
        <div>
          <label className="block mb-1">File Upload (PDF or XLSX, max 20MB)</label>
          <input
            type="file"
            accept=".pdf,.xlsx"
            className="block w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue('file', (file ?? null) as unknown as File, { shouldValidate: true });
            }}
          />

          {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message as string}</p>}
        </div>
        <button type="submit" disabled={isUploading || isSubmitting} className="btn-primary w-full">
          {isUploading ? 'Uploading file...' : isSubmitting ? 'Submitting request...' : 'Request Full Trial Intelligence Report'}
        </button>
      </div>
    </form>
  );
}
