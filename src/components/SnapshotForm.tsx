'use client';

import { useEffect, useMemo, useState } from 'react';
import conditions from '@/lib/data/clinicaltrials_conditions.json';
import countries from '@/lib/data/iso_countries.json';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  snapshotPreviewSchema,
  snapshotUnlockSchema,
  type SnapshotPreviewFormData,
  type SnapshotUnlockFormData,
} from '@/lib/validation';
import { unwrapApi } from '@/lib/apiResponse';
import type { FetchTrialsResponse } from '@/types';

type CountryOption = { name: string; code: string };

function parseJsonSafely(raw: string): unknown | null {
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function SnapshotForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<FetchTrialsResponse | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [indicationInput, setIndicationInput] = useState('');
  const [selectedIndication, setSelectedIndication] = useState<string | null>(null);

  const [countryInput, setCountryInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const {
    control: previewControl,
    register: registerPreview,
    handleSubmit: handleSubmitPreview,
    setValue: setValuePreview,
    formState: { errors: errorsPreview },
  } = useForm<SnapshotPreviewFormData>({
    resolver: zodResolver(snapshotPreviewSchema),
    defaultValues: {
      indication: '',
      phase: 'All',
      country_name: '',
      country_code: undefined,
    },
  });

  const {
    register: registerUnlock,
    handleSubmit: handleSubmitUnlock,
    formState: { errors: errorsUnlock },
  } = useForm<SnapshotUnlockFormData>({
    resolver: zodResolver(snapshotUnlockSchema),
    defaultValues: {
      email: '',
      company: '',
      user_question: '',
    },
  });

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        window.URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const indicationSuggestions = useMemo(() => {
    if (indicationInput.trim().length < 1 || selectedIndication === indicationInput) {
      return [];
    }

    const lowerInput = indicationInput.toLowerCase();

    return (conditions as string[])
      .filter((condition) => condition.toLowerCase().startsWith(lowerInput))
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 10);
  }, [indicationInput, selectedIndication]);

  const countrySuggestions = useMemo(() => {
    if (countryInput.trim().length < 1 || selectedCountry?.name === countryInput) {
      return [];
    }

    const lowerInput = countryInput.toLowerCase();

    return (countries as CountryOption[])
      .filter((country) => country.name.toLowerCase().startsWith(lowerInput))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10);
  }, [countryInput, selectedCountry]);

  const onPreview = async (data: SnapshotPreviewFormData) => {
    if (!selectedIndication) {
      setError('Please select a valid indication from the suggestions.');
      return;
    }

    if (!selectedCountry) {
      setError('Please select a valid country from the suggestions.');
      return;
    }

    setIsLoading(true);
    setError(null);

    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    try {
      const res = await fetch('/api/fetch-trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indication: selectedIndication,
          phase: data.phase,
          country_name: selectedCountry.name,
          country_code: selectedCountry.code,
        }),
      });

      const raw = await res.text();
      const json = parseJsonSafely(raw);

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
      setError(err instanceof Error ? err.message : 'Failed to generate preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onUnlock = async (data: SnapshotUnlockFormData) => {
    if (!preview || preview.error) return;

    setIsPdfGenerating(true);
    setError(null);

    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company,
          indication: preview.indication,
          phase: preview.phase,
          country_name: preview.country_name,
          country_code: preview.country_code,
          user_question: data.user_question,
          data: preview,
        }),
      });

      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to generate PDF.');
      }

      if (!contentType.includes('application/pdf')) {
        const responseText = await res.text();
        throw new Error(`Unexpected response type: ${contentType}. ${responseText}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'snapshot-report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow">
        {error && <div className="mb-4 rounded bg-red-50 p-4 text-red-600">{error}</div>}

        {!preview ? (
          <form onSubmit={handleSubmitPreview(onPreview)} noValidate>
            <h3 className="mb-6 text-xl font-semibold">Generate Snapshot Preview</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="indication-input" className="mb-1 block">
                  Indication
                </label>

                <div className="relative">
                  <Controller
                    control={previewControl}
                    name="indication"
                    render={({ field }) => (
                      <input
                        id="indication-input"
                        value={indicationInput}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setIndicationInput(nextValue);
                          setSelectedIndication(null);
                          field.onChange(nextValue);
                        }}
                        placeholder="Enter indication"
                        className="input-field"
                        autoComplete="off"
                        onBlur={field.onBlur}
                      />
                    )}
                  />

                  {indicationSuggestions.length > 0 && (
                    <ul className="absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {indicationSuggestions.map((suggestion) => (
                        <li
                          key={suggestion}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIndicationInput(suggestion);
                            setSelectedIndication(suggestion);
                            setValuePreview('indication', suggestion, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {errorsPreview.indication && (
                  <p className="mt-1 text-sm text-red-500">{errorsPreview.indication.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phase-select" className="mb-1 block">
                  Phase
                </label>
                <select id="phase-select" {...registerPreview('phase')} className="input-field">
                  <option value="All">All</option>
                  <option value="Phase 1">Phase 1</option>
                  <option value="Phase 2">Phase 2</option>
                  <option value="Phase 3">Phase 3</option>
                  <option value="Phase 4">Phase 4</option>
                </select>
              </div>

              <div>
                <label htmlFor="country-input" className="mb-1 block">
                  Country
                </label>

                <div className="relative">
                  <Controller
                    control={previewControl}
                    name="country_name"
                    render={({ field }) => (
                      <input
                        id="country-input"
                        value={countryInput}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setCountryInput(nextValue);
                          setSelectedCountry(null);
                          field.onChange(nextValue);
                          setValuePreview('country_code', undefined, {
                            shouldValidate: false,
                            shouldDirty: true,
                          });
                        }}
                        placeholder="Enter country"
                        className="input-field"
                        autoComplete="off"
                        onBlur={field.onBlur}
                      />
                    )}
                  />

                  {countrySuggestions.length > 0 && (
                    <ul className="absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {countrySuggestions.map((country) => (
                        <li
                          key={country.code}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setCountryInput(country.name);
                            setSelectedCountry(country);
                            setValuePreview('country_name', country.name, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setValuePreview('country_code', country.code, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        >
                          {country.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {errorsPreview.country_name && (
                  <p className="mt-1 text-sm text-red-500">{errorsPreview.country_name.message}</p>
                )}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Generating Preview...' : 'Generate Preview'}
              </button>
            </div>

            {Object.keys(errorsPreview).length > 0 && (
              <div className="mt-4 rounded bg-red-100 p-4 text-red-700">
                <p className="font-semibold">Validation Errors:</p>
                <pre className="mt-2 text-sm">{JSON.stringify(errorsPreview, null, 2)}</pre>
              </div>
            )}
          </form>
        ) : (
          <div>
            {preview.error ? (
              <div className="mb-4 rounded bg-red-50 p-4 text-red-600">
                <p className="font-semibold">{preview.reason}</p>
                {preview.suggestion && <p className="mt-2">{preview.suggestion}</p>}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-semibold">Snapshot Preview</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded bg-gray-50 p-4">
                      <div className="font-semibold">Total Trials</div>
                      <div className="text-2xl">{preview.preview.totalTrials}</div>
                    </div>

                    <div className="rounded bg-gray-50 p-4">
                      <div className="font-semibold">Recruiting Trials</div>
                      <div className="text-2xl">
                        {preview.preview.recruitingTrials}
                        <span className="ml-2 text-sm text-gray-600">
                          ({preview.preview.recruitingPct}%)
                        </span>
                      </div>
                    </div>

                    <div className="rounded bg-gray-50 p-4">
                      <div className="font-semibold">Top Country</div>
                      <div className="text-xl">
                        {preview.preview.countryDistribution[0]?.country || 'N/A'}
                      </div>
                    </div>

                    <div className="rounded bg-gray-50 p-4">
                      <div className="font-semibold">Top Sponsor</div>
                      <div className="text-xl">
                        {preview.preview.topSponsors[0]?.sponsor || 'N/A'}
                      </div>
                    </div>

                    <div className="rounded bg-gray-50 p-4">
                      <div className="font-semibold">Recruitment Competition</div>
                      <div className="text-xl">
                        {(() => {
                          const totalTrials = preview.preview.totalTrials;
                          if (totalTrials > 10) return 'HIGH';
                          if (totalTrials >= 4) return 'MEDIUM';
                          return 'LOW';
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 mb-6">
                    <h4 className="mb-2 text-lg font-semibold">Country Distribution</h4>
                    <ul className="list-disc pl-5">
                      {preview.preview.countryDistribution.slice(0, 5).map((dist, index) => (
                        <li key={index}>
                          {dist.country}: {dist.count} trials
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="mb-2 text-lg font-semibold">Key Insight</h4>
                    <p>{preview.key_insight || 'No key insight available.'}</p>
                  </div>
                </div>

                {downloadUrl ? (
                  <div className="space-y-4 text-center">
                    <a
                      href={downloadUrl}
                      download="snapshot-report.pdf"
                      className="btn-primary inline-block w-full sm:w-auto"
                    >
                      Download Snapshot Report
                    </a>
                    <a
                      href="https://calendly.com/miterion/15min"
                      className="btn-secondary ml-0 inline-block w-full sm:ml-4 sm:w-auto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a 15-minute call
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitUnlock(onUnlock)} noValidate>
                    <h3 className="mb-6 text-xl font-semibold">Unlock Full Report</h3>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email-input" className="mb-1 block">
                          Email
                        </label>
                        <input
                          id="email-input"
                          {...registerUnlock('email')}
                          type="email"
                          placeholder="Enter your email"
                          className="input-field"
                          autoComplete="email"
                        />
                        {errorsUnlock.email && (
                          <p className="mt-1 text-sm text-red-500">{errorsUnlock.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="company-input" className="mb-1 block">
                          Company (optional)
                        </label>
                        <input
                          id="company-input"
                          {...registerUnlock('company')}
                          placeholder="Enter your company name"
                          className="input-field"
                          autoComplete="organization"
                        />
                      </div>

                      <div>
                        <label htmlFor="user-question-textarea" className="mb-1 block">
                          What decision are you trying to make? (optional)
                        </label>
                        <textarea
                          id="user-question-textarea"
                          {...registerUnlock('user_question')}
                          placeholder="Example: site selection, protocol feasibility, recruitment risk"
                          className="input-field min-h-[80px]"
                          autoComplete="off"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isPdfGenerating}
                        className="btn-primary w-full"
                      >
                        {isPdfGenerating ? 'Generating PDF...' : 'Unlock Report'}
                      </button>
                    </div>

                    {Object.keys(errorsUnlock).length > 0 && (
                      <div className="mt-4 rounded bg-red-100 p-4 text-red-700">
                        <p className="font-semibold">Validation Errors:</p>
                        <pre className="mt-2 text-sm">
                          {JSON.stringify(errorsUnlock, null, 2)}
                        </pre>
                      </div>
                    )}
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