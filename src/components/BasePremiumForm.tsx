'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { unwrapApi } from '@/lib/apiResponse';
import { supabase } from '@/lib/supabaseClient';

// Tworzymy lokalny schemat, żeby uniknąć problemów z plikiem validation.ts
const localFormSchema = z.object({
  email: z.string().email({ message: "Valid work email is required" }),
  company: z.string().optional(),
  message: z.string().optional(),
  file: z.any().optional(),
});

type LocalFormData = z.infer<typeof localFormSchema>;

interface BasePremiumFormProps {
  endpoint: string;
  submitButtonText: string;
  onSuccess?: () => void;
  captchaToken: string | null;
  formType?: 'expert' | 'quote' | 'custom';
}

export default function BasePremiumForm({ endpoint, submitButtonText, onSuccess, captchaToken, formType = 'custom' }: BasePremiumFormProps) {
  const [fullName, setFullName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFieldConfig = () => {
    switch (formType) {
      case 'expert':
        return {
          label: 'Indication & Geography *',
          placeholder: 'e.g., Non-small cell lung cancer, EU5 & US',
          fileLabel: 'Supporting Document (Protocol Synopsis / Study Brief)'
        };
      case 'quote':
        return {
          label: 'What vendors or CROs are you comparing? (Optional)',
          placeholder: 'e.g., Comparing IQVIA with a local European boutique CRO',
          fileLabel: 'Supporting Document (RFP / Vendor Proposals)'
        };
      case 'custom':
      default:
        return {
          label: 'Tell us about your operational bottleneck *',
          placeholder: 'Briefly describe the challenge or clinical decision you are facing...',
          fileLabel: 'Supporting Document (Optional)'
        };
    }
  };

  const config = getFieldConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<LocalFormData>({
    resolver: zodResolver(localFormSchema),
    defaultValues: {
      email: '',
      company: '',
      message: '',
      file: null,
    }
  });

  const onSubmit = async (data: LocalFormData) => {
    if (!captchaToken) {
      setError("Security verification is still loading. Please wait a second.");
      return;
    }

    if (formType !== 'quote' && (!data.message || !data.message.trim())) {
      setError("Please answer the specific question about your trial or operational challenge.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    let filePath: string | null = null;

    try {
      if (data.file && data.file.size > 0) {
        setIsUploading(true);
        
        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_RFP_BUCKET_NAME || 'rfp_uploads';
        const fileName = `uploads/${Date.now()}_${data.file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, data.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Supabase Storage Error: ${uploadError.message}`);
        }

        filePath = fileName;
        setIsUploading(false);
      }

      const finalMessage = fullName.trim() 
        ? `[Sender Name: ${fullName.trim()}]\n\n${data.message}`
        : data.message;

      const submitRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company || undefined,
          message: finalMessage || undefined,
          filePath: filePath,
          token: captchaToken,
        }),
      });

      const jsonResult = await submitRes.json().catch(() => null);
      await unwrapApi(submitRes, jsonResult);

      setSuccess(true);
      setFullName('');
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('[BasePremiumForm] onSubmit error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-lg border border-green-100">
        <div className="text-green-600 font-bold text-xl mb-2">Request Received</div>
        <p className="text-green-700">Thank you for your interest. We will review your details and contact you shortly.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-green-600 underline hover:text-green-800">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
        <input 
          type="text" 
          placeholder="John Doe" 
          className="input-field"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Work Email *</label>
        <input {...register('email')} type="email" placeholder="you@company.com" className="input-field" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
        <input {...register('company')} placeholder="Miterion Health" className="input-field" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{config.label}</label>
        <textarea {...register('message')} placeholder={config.placeholder} className="input-field min-h-[100px] resize-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{config.fileLabel}</label>
        <input
          type="file"
          accept=".pdf,.xlsx"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-navy file:text-white cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setValue('file', (file ?? null) as unknown as File, { shouldValidate: true });
          }}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isUploading || isSubmitting || !captchaToken}
          className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading document...' :
           isSubmitting ? 'Submitting request...' :
           !captchaToken ? 'Verifying security...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}