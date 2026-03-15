'use client';

import { useState, useEffect, useMemo } from 'react';
import conditions from '@/lib/data/clinicaltrials_conditions.json';
import countries from '@/lib/data/iso_countries.json';

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

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<FetchTrialsResponse | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Indication Autocomplete State
  const [indicationInput, setIndicationInput] = useState<string>('');
  const [indicationSuggestions, setIndicationSuggestions] = useState<string[]>([]);
  const [selectedIndication, setSelectedIndication] = useState<string | null>(null);

  // Country Autocomplete State
  const [countryInput, setCountryInput] = useState<string>('');
  const [countrySuggestions, setCountrySuggestions] = useState<Array<{ name: string; code: string }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string } | null>(null);

  // Fuzzy search function for conditions
  const filterConditions = useMemo(() => (input: string) => {
    if (input.length < 2) return [];
    const lowerInput = input.toLowerCase();
    return (conditions as string[])
      .filter((condition) => condition.toLowerCase().includes(lowerInput))
      .slice(0, 10);
  }, [conditions]);

  // Fuzzy search function for countries
  const filterCountries = useMemo(() => (input: string) => {
    if (input.length < 2) return [];
    const lowerInput = input.toLowerCase();
    return (countries as Array<{ name: string; code: string }>)
      .filter((country) => country.name.toLowerCase().includes(lowerInput))
      .slice(0, 10);
  }, [countries]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SnapshotFormData>({
    resolver: zodResolver(snapshotFormSchema),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'indication') {
        const input = value.indication || '';
        setIndicationInput(input);
        setIndicationSuggestions(filterConditions(input));
        if (selectedIndication && selectedIndication !== input) {
          setSelectedIndication(null);
        }
      }
      if (name === 'country_name') {
        const input = value.country_name || '';
        setCountryInput(input);
        setCountrySuggestions(filterCountries(input));
        if (selectedCountry && selectedCountry.name !== input) {
          setSelectedCountry(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, filterConditions, filterCountries, selectedIndication, selectedCountry, setValue]);

  const onPreview = async (data: SnapshotFormData) => {
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

    try {
      const res = await fetch('/api/fetch-trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indication: selectedIndication,
          phase: data.phase,
          country_name: selectedCountry?.name || '',
          country_code: selectedCountry?.code || '',
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
      setError(err instanceof Error ? err.message : 'Failed to generate preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onUnlock = async (data: SnapshotFormData) => {
    if (!preview || preview.error) return;

    if (!data.email?.trim()) {
      setError('Email is required.');
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
          country_name: preview.country_name,
          country_code: preview.country_code,
          user_question: data.user_question,
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
      setError(err instanceof Error ? err.message : 'Failed to generate PDF. Please try again.');
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
            <h3 className="text-xl font-semibold mb-6">Generate Snapshot Preview</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="indication-input" className="block mb-1">Indication</label>
                <div className="relative">
                  <input
                    id="indication-input"
                    {...register('indication')}
                    value={indicationInput}
                    onChange={(e) => {
                      setIndicationInput(e.target.value);
                      setValue('indication', e.target.value);
                    }}
                    placeholder="Enter indication"
                    className="input-field"
                    autoComplete="off"
                    onBlur={() => {
                      // Optional: clear suggestions if input doesn't match a selection
                      setTimeout(() => setIndicationSuggestions([]), 100);
                    }}
                  />
                  {indicationSuggestions.length > 0 && indicationInput.length >= 2 && !selectedIndication && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {indicationSuggestions.map((suggestion, index) => (
                        <li
                          key={suggestion}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            console.log('Suggestion clicked:', suggestion);
                            setIndicationInput(suggestion);
                            console.log('After setIndicationInput:', suggestion);
                            setSelectedIndication(suggestion);
                            console.log('After setSelectedIndication:', suggestion);
                            setValue('indication', suggestion, { shouldValidate: true });
                            setIndicationSuggestions([]);
                            console.log('After setIndicationSuggestions (should be empty):', []);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.indication && (
                  <p className="text-red-500 text-sm mt-1">{errors.indication.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phase-select" className="block mb-1">Phase</label>
                <select id="phase-select" {...register('phase')} className="input-field">
                  <option value="All">All</option>
                  <option value="Phase 1">Phase 1</option>
                  <option value="Phase 2">Phase 2</option>
                  <option value="Phase 3">Phase 3</option>
                  <option value="Phase 4">Phase 4</option>
                </select>
              </div>

              <div>
                <label htmlFor="country-input" className="block mb-1">Country</label>
                <div className="relative">
                  <input
                    id="country-input"
                    {...register('country_name')}
                    value={countryInput}
                    onChange={(e) => {
                      setCountryInput(e.target.value);
                      setValue('country_name', e.target.value);
                    }}
                    placeholder="Enter country"
                    className="input-field"
                    autoComplete="off"
                    onBlur={() => {
                      setTimeout(() => setCountrySuggestions([]), 100);
                    }}
                  />
                  {countrySuggestions.length > 0 && countryInput.length >= 2 && !selectedCountry && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {countrySuggestions.map((country, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setCountryInput(country.name);
                            setSelectedCountry(country);
                            setValue('country_name', country.name, { shouldValidate: true });
                            setValue('country_code', country.code, { shouldValidate: true });
                            setCountrySuggestions([]);
                          }}
                        >
                          {country.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.country_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.country_name.message}</p>
                )}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Generating Preview...' : 'Generate Preview'}
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
                  <h3 className="text-xl font-semibold mb-4">Snapshot Preview</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">Total Trials</div>
                      <div className="text-2xl">{preview.preview.totalTrials}</div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">Recruiting Trials</div>
                      <div className="text-2xl">
                        {preview.preview.recruitingTrials}
                        <span className="text-sm text-gray-600 ml-2">
                          ({preview.preview.recruitingPct}%)
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">Top Country</div>
                      <div className="text-xl">
                        {preview.preview.countryDistribution[0]?.country || 'N/A'}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-semibold">Top Sponsor</div>
                      <div className="text-xl">
                        {preview.preview.topSponsors[0]?.sponsor || 'N/A'}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
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

                  <div className="mb-6 mt-6">
                    <h4 className="text-lg font-semibold mb-2">Country Distribution</h4>
                    <ul className="list-disc pl-5">
                      {preview.preview.countryDistribution.slice(0, 5).map((dist, index) => (
                        <li key={index}>{dist.country}: {dist.count} trials</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Key Insight</h4>
                    <p>{preview.key_insight || 'No key insight available.'}</p>
                  </div>
                </div>

                {downloadUrl ? (
                  <div className="text-center space-y-4">
                    <a
                      href={downloadUrl}
                      className="btn-primary inline-block w-full sm:w-auto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Snapshot Report
                    </a>
                    <a
                      href="https://calendly.com/miterion/15min"
                      className="btn-secondary inline-block w-full sm:w-auto ml-0 sm:ml-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a 15-minute call
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onUnlock)} noValidate>
                    <h3 className="text-xl font-semibold mb-6">Unlock Full Report</h3>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email-input" className="block mb-1">Email</label>
                        <input
                          id="email-input"
                          {...register('email')}
                          type="email"
                          placeholder="Enter your email"
                          className="input-field"
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="company-input" className="block mb-1">Company (optional)</label>
                        <input
                          id="company-input"
                          {...register('company')}
                          placeholder="Enter your company name"
                          className="input-field"
                          autoComplete="organization"
                        />
                      </div>

                      <div>
                        <label htmlFor="user-question-textarea" className="block mb-1">What decision are you trying to make? (optional)</label>
                        <textarea
                          id="user-question-textarea"
                          {...register('user_question')}
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