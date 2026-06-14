'use client';

import { useEffect, useMemo, useState } from 'react';
import conditions from '@/lib/data/clinicaltrials_conditions.json';
import countries from '@/lib/data/iso_countries.json';

// ✅ Zastąpiono bezpośredni createClient bezpiecznym importem współdzielonej instancji:
import { supabase } from '@/lib/supabaseClient';

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
import FullReportRequestDialog from './FullReportRequestDialog';
import RfpHarmonizationDialog from './RfpHarmonizationDialog';
import { Button } from './ui/button';

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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullReportModal, setShowFullReportModal] = useState(false);
  const [showRfpUploadModal, setShowRfpUploadModal] = useState(false);

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
    setValue: setValueUnlock,
    formState: { errors: errorsUnlock, isSubmitting },
  } = useForm<SnapshotUnlockFormData>({
    resolver: zodResolver(snapshotUnlockSchema),
    defaultValues: {
      email: '',
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

  const onGeneratePdf = async (data: SnapshotUnlockFormData) => {
    if (!preview || preview.error) return;

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
          indication: preview.indication,
          phase: preview.phase,
          geography: preview.country_name,
          data: preview,
        }),
      });

      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to generate PDF.');
      }

      if (contentType.includes('application/pdf')) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clinical-trial-snapshot.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (contentType.includes('application/json')) {
        const responseText = await res.text();
        const jsonResponse = JSON.parse(responseText);
        if (jsonResponse.success === true && jsonResponse.message === 'Snapshot report sent successfully via email.') {
          return;
        } else {
          throw new Error(`Unexpected JSON response: ${responseText}`);
        }
      } else {
        throw new Error(`Unexpected response type: ${contentType}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF.');
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
                  Geography
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
                        placeholder="Enter geography"
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
          <div className="space-y-6">
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

                <div className="space-y-6 mt-10">
                  <h3 className="text-2xl font-bold text-center text-navy">Your Clinical Trial Intelligence Options</h3>
                  
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
                    <h4 className="text-xl font-semibold mb-3 text-gray-800">Download Free Landscape Snapshot</h4>
                    <p className="text-gray-600 mb-4 text-sm">Get your instant PDF report with key market insights.</p>
                    <form onSubmit={handleSubmitUnlock(onGeneratePdf)} noValidate className="w-full max-w-sm">
                      <input
                        id="email-input-card1"
                        {...registerUnlock('email')}
                        type="email"
                        placeholder="Enter your email to download"
                        className="input-field mb-2"
                        autoComplete="email"
                      />
                      {errorsUnlock.email && (
                        <p className="mt-1 text-sm text-red-500">{errorsUnlock.email.message}</p>
                      )}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        {isSubmitting ? 'Generating PDF...' : 'Download Snapshot Report'} </Button>
                    </form>
                    {downloadUrl && !isSubmitting && (
                      <p className="mt-2 text-sm text-green-600">
                        PDF generated successfully! Check your downloads.
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center">
                    <h4 className="text-xl font-semibold mb-3 text-navy">Full Trial Intelligence Report</h4>
                    <p className="text-gray-600 mb-4 text-sm">Analyst-led deep dive including international public-source cross-checking.</p>
                    <div className="w-full mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">What's included:</h5>
                      <ul className="text-left text-sm text-gray-600 space-y-1">
                        <li>• Detailed competitive analysis</li>
                        <li>• Recruitment strategy optimization</li>
                        <li>• Risk assessment and mitigation</li>
                        <li>• Custom recommendations</li>
                      </ul>
                    </div>
                    <Button onClick={() => setShowFullReportModal(true)} className="w-full max-w-sm bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                      Request Full Report
                    </Button>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={() => setShowRfpUploadModal(true)}
                      className="text-sm text-gray-500 hover:text-navy underline"
                    >
                      Looking for RFP & Quote Harmonization?
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <FullReportRequestDialog open={showFullReportModal} onOpenChange={setShowFullReportModal} />
      <RfpHarmonizationDialog open={showRfpUploadModal} onOpenChange={setShowRfpUploadModal} />
    </div>
  );
}