'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dctWaitlistSchema } from '@/lib/validation';
import { unwrapApi } from '@/lib/apiResponse';
import type { DctWaitlistFormData } from '@/types';

export default function DctWaitlistForm() {
  const t = useTranslations('Index.dct.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DctWaitlistFormData>({
    resolver: zodResolver(dctWaitlistSchema),
  });

  const onSubmit = async (data: DctWaitlistFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/dct-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      unwrapApi(res, json); // throws on error
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center text-green-600 p-4">
        <p className="font-semibold">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>}
      <div className="space-y-4">
        <div>
          <label className="block mb-1">{t('email')}</label>
          <input {...register('email')} type="email" placeholder={t('emailPlaceholder')} className="input-field" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}
