'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { premiumRequestSchema, type PremiumRequestData } from '@/lib/validation';
import { unwrapApi } from '@/lib/apiResponse';
import { supabase } from '@/lib/supabaseClient';

interface BasePremiumFormProps {
  endpoint: string;
  submitButtonText: string;
  onSuccess?: () => void;
}

/**
 * Robust base form for premium requests (Full Report & RFP Harmonization).
 * Preserves Supabase signed upload flow and Resend notification logic.
 */
export default function BasePremiumForm({ endpoint, submitButtonText, onSuccess }: BasePremiumFormProps) {
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
  } = useForm<PremiumRequestData>({
    resolver: zodResolver(premiumRequestSchema),
    defaultValues: {
      email: '',
      company: '',
      message: '',
      file: null,
    }
  });

  const onSubmit = async (data: PremiumRequestData) => {
    setIsUploading(false);
    setIsSubmitting(false);
    setError(null);
    let filePath: string | null = null;

    try {
      // 1. Optional File Upload (Preserving Supabase Signed Upload logic)
      if (data.file && data.file.size > 0) {
        setIsUploading(true);
        const urlRes = await fetch(`/api/upload-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: data.file.name,
            type: data.file.type,
          }),
        });

        // unwrapApi handles non-200 and malformed JSON
        const payload = await unwrapApi<{ path: string; token: string; bucketName: string }>(urlRes);
        const { path, token, bucketName } = payload;

        const uploadResult = await supabase.storage
          .from(bucketName)
          .uploadToSignedUrl(path, token, data.file, {
            contentType: data.file.type || 'application/octet-stream',
          });

        if (uploadResult.error) {
          throw new Error(`File upload failed: ${uploadResult.error.message}`);
        }
        
        filePath = path;
        setIsUploading(false);
      }

      // 2. Submit Metadata to Backend
      setIsSubmitting(true);
      const submitRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company || undefined,
          message: data.message || undefined,
          filePath: filePath,
        }),
      });

      await unwrapApi(submitRes);

      setSuccess(true);
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('[BasePremiumForm] onSubmit error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-lg border border-green-100">
        <div className="text-green-600 font-bold text-xl mb-2">Request Received</div>
        <p className="text-green-700">Thank you for your interest. We will contact you shortly for a free scope review.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-600 underline hover:text-green-800"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Work Email <span className="text-red-500">*</span>
        </label>
        <input 
          {...register('email')} 
          type="email" 
          placeholder="you@company.com" 
          className={`input-field ${errors.email ? 'border-red-500' : ''}`} 
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Company Name (optional)
        </label>
        <input 
          {...register('company')} 
          placeholder="Miterion Health" 
          className="input-field" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          How can we help? (optional)
        </label>
        <textarea 
          {...register('message')} 
          placeholder="Briefly describe your trial, indication, or budget concerns..." 
          className="input-field min-h-[120px] resize-none" 
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Supporting Document (optional)
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            accept=".pdf,.xlsx"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-navy file:text-white hover:file:bg-opacity-90 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue('file', (file ?? null) as unknown as File, { shouldValidate: true });
            }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1">PDF or XLSX up to 20MB. For free scope review.</p>
        {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message as string}</p>}
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isUploading || isSubmitting} 
          className="btn-primary w-full py-3 text-lg"
        >
          {isUploading ? 'Uploading Document...' : isSubmitting ? 'Submitting Request...' : submitButtonText}
        </button>
        <p className="text-center text-[11px] text-gray-400 mt-3 italic">
          Submission includes a free scope review. No immediate charge.
        </p>
      </div>
    </form>
  );
}
