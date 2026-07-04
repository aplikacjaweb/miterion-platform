'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dctWaitlistSchema } from '@/lib/validation';
import { unwrapApi } from '@/lib/apiResponse';
import type { DctWaitlistFormData } from '@/types';
import CaptchaWrapper from './CaptchaWrapper';

export default function DctWaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DctWaitlistFormData>({
    resolver: zodResolver(dctWaitlistSchema),
  });

  const onSubmit = async (data: DctWaitlistFormData) => {
    if (!captchaToken) {
      setError('Please complete the security check.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/dct-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, captchaToken }),
      });

      const json = await res.json();
      unwrapApi(res, json);

      setSuccess(true);
      reset();
      setCaptchaToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 text-center text-green-600">
        <p className="font-semibold">You've been added to the waitlist!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="mb-4 rounded bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-1 block">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="Your email address"
            className="input-field"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isSubmitting ? 'Adding to waitlist...' : 'Join Waitlist'}
        </button>

        <div className="mt-3 flex justify-center">
          <CaptchaWrapper onVerify={(token) => setCaptchaToken(token)} />
        </div>
      </div>
    </form>
  );
}