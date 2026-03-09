'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { snapshotFormSchema } from '@/lib/validation';
import { unwrapApi } from '@/lib/apiResponse';
import type { SnapshotFormData, FetchTrialsResponse } from '@/types';

function parseJsonSafely(raw: string): unknown | null {
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function SnapshotForm() {
  const t = useTranslations('Index.snapshot.form');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<FetchTrialsResponse | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SnapshotFormData>({
    resolver: zodResolver(snapshotFormSchema),
  });

  const onPreview = async (data: SnapshotFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/fetch-trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indication: data.indication,
          phase: data.phase,
          geo: data.geo,
        }),
      });

      const raw = await res.text();
      const json = parseJsonSafely(raw);

      // fetch-trials to wyjątek: zwraca FetchTrialsResponse bez wrappera apiSuccess.
      // Jeśli status HTTP jest błędny, próbujemy rozpakować nasz standardowy error shape.
      if (!res.ok) {
        unwrapApi(res, json);
      }

      if (!json) {
        throw new Error(
          `API /api/fetch-trials zwróciło pusty lub niepoprawny JSON (${res.status} ${res.statusText}).`
        );
      }

      setPreview(json as FetchTrialsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.preview'));
    } finally {
      setIsLoading(false);
    }
  };

  const onUnlock = async (data: SnapshotFormData) => {
    if (!preview || preview.error) return;

    if (!data.email?.trim()) {
      setError(t('errors.emailRequired'));
      return;
    }

    setIsPdfGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company,
          indication: preview.indication,
          phase: preview.phase,
          geo: preview.geo,
          data: preview,
        }),
      });

      const raw = await res.text();
      const json = parseJsonSafely(raw);

      if (!json) {
        throw new Error(
          `API /api/generate-pdf zwróciło pusty lub niepoprawny JSON (${res.status} ${res.statusText}). Fragment odpowiedzi: ${raw.slice(0, 300)}`
        );
      }

      const { downloadUrl } = unwrapApi<{ downloadUrl: string }>(res, json);
      setDownloadUrl(downloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.pdfGeneration'));
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow">
        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>}

        {!preview ? (
          <form onSubmit={handleSubmit(onPreview)} noValidate>
            <h3 className="text-xl font-semibold mb-6">{t('step1.title')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">{t('step1.indication')}</label>
                <input
                  {...register('indication')}
                  placeholder={t('step1.indicationPlaceholder')}
                  className="input-field"
                />
                {errors.indication && (
                  <p className="text-red-500 text-sm mt-1">{errors.indication.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">{t('step1.phase')}</label>
                <select {...register('phase')} className="input-field">
                  <option value="All">{t('step1.phases.all')}</option>
                  <option value="Phase 1">{t('step1.phases.phase1')}</option>
                  <option value="Phase 2">{t('step1.phases.phase2')}</option>
                  <option value="Phase 3">{t('step1.phases.phase3')}</option>
                  <option value="Phase 4">{t('step1.phases.phase4')}</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">{t('step1.geo')}</label>
                <select {...register('geo')} className="input-field">
                  <option value="Global">{t('step1.geos.global')}</option>
                  <option value="US">{t('step1.geos.us')}</option>
                  <option value="EU">{t('step1.geos.eu')}</option>
                  <option value="UK">{t('step1.geos.uk')}</option>
                </select>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? t('step1.loading') : t('step1.submit')}
              </button>
            </div>
          </form>
        ) : (
          <div>
            {preview.error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded mb-4">
                <p className="font-semibold">{preview.reason}</p>
                {preview.suggestion && <p className="mt-2">{preview.suggestion}</p>}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{t('preview.title')}</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">{t('preview.totalTrials')}</div>
                      <div className="text-2xl">{preview.preview.totalTrials}</div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">{t('preview.recruitingTrials')}</div>
                      <div className="text-2xl">
                        {preview.preview.recruitingTrials}
                        <span className="text-sm text-gray-600 ml-2">
                          ({preview.preview.recruitingPct}%)
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">{t('preview.topCountry')}</div>
                      <div className="text-xl">
                        {preview.preview.countryDistribution[0]?.country || 'N/A'}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">{t('preview.topSponsor')}</div>
                      <div className="text-xl">
                        {preview.preview.topSponsors[0]?.sponsor || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {downloadUrl ? (
                  <div className="text-center">
                    <a
                      href={downloadUrl}
                      className="btn-primary inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('step2.download')}
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onUnlock)} noValidate>
                    <h3 className="text-xl font-semibold mb-6">{t('step2.title')}</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1">{t('step2.email')}</label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder={t('step2.emailPlaceholder')}
                          className="input-field"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-1">{t('step2.company')}</label>
                        <input
                          {...register('company')}
                          placeholder={t('step2.companyPlaceholder')}
                          className="input-field"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isPdfGenerating}
                        className="btn-primary w-full"
                      >
                        {isPdfGenerating ? t('step2.generating') : t('step2.submit')}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}