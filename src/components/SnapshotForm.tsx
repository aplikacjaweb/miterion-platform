'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import conditions from '@/lib/data/clinicaltrials_conditions.json';
import countries from '@/lib/data/iso_countries.json';
import { supabase } from '@/lib/supabaseClient';
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

export default function SnapshotForm() {
  const [preview, setPreview] = useState<FetchTrialsResponse | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullReportModal, setShowFullReportModal] = useState(false);
  const [showRfpUploadModal, setShowRfpUploadModal] = useState(false);

  // Stany dla autouzupełniania (pozostają w useState, bo to UI pomocnicze)
  const [indicationInput, setIndicationInput] = useState('');
  const [selectedIndication, setSelectedIndication] = useState<string | null>(null);
  const [countryInput, setCountryInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const {
    control: previewControl,
    handleSubmit: handleSubmitPreview,
    setValue: setValuePreview,
    formState: { errors: errorsPreview, isSubmitting: isPreviewing },
  } = useForm<SnapshotPreviewFormData>({
    resolver: zodResolver(snapshotPreviewSchema),
    defaultValues: { indication: '', phase: 'All', country_name: '', country_code: undefined },
  });

  const {
    register: registerUnlock,
    handleSubmit: handleSubmitUnlock,
    formState: { errors: errorsUnlock, isSubmitting: isPdfSubmitting },
  } = useForm<SnapshotUnlockFormData>({
    resolver: zodResolver(snapshotUnlockSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    return () => { if (downloadUrl) window.URL.revokeObjectURL(downloadUrl); };
  }, [downloadUrl]);

  const onPreview = async (data: SnapshotPreviewFormData) => {
    if (!selectedIndication || !selectedCountry) {
      setError('Please select valid options from the suggestions.');
      return;
    }
    setError(null);
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
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch');
      setPreview(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating preview.');
    }
  };

  const onGeneratePdf = async (data: SnapshotUnlockFormData) => {
    if (!preview) return;
    setError(null);

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...preview }),
      });

      if (!res.ok) throw new Error('Failed to generate PDF.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clinical-trial-snapshot.pdf';
      a.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF generation failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>}

      {!preview ? (
        <form onSubmit={handleSubmitPreview(onPreview)} className="space-y-4">
          <h3 className="text-xl font-semibold">Generate Snapshot Preview</h3>
          {/* Indication Input */}
          <div className="relative">
             <label>Indication</label>
             <Controller name="indication" control={previewControl} render={({ field }) => (
                <input {...field} value={indicationInput} onChange={(e) => {
                   setIndicationInput(e.target.value);
                   setSelectedIndication(null);
                   field.onChange(e.target.value);
                }} className="input-field" placeholder="Search..." />
             )}/>
          </div>
          
          <Button type="submit" disabled={isPreviewing} className="w-full">
            {isPreviewing ? 'Generating...' : 'Generate Preview'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Wyniki preview tutaj... */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold mb-3">Download Snapshot</h4>
            <form onSubmit={handleSubmitUnlock(onGeneratePdf)}>
              <input {...registerUnlock('email')} type="email" placeholder="Email" className="input-field mb-2" />
              <Button 
                type="submit" 
                disabled={isPdfSubmitting || !!downloadUrl} 
                className="w-full"
              >
                {isPdfSubmitting ? 'Generating...' : downloadUrl ? 'Downloaded' : 'Download Report'}
              </Button>
            </form>
          </div>
        </div>
      )}
      
      <FullReportRequestDialog open={showFullReportModal} onOpenChange={setShowFullReportModal} />
      <RfpHarmonizationDialog open={showRfpUploadModal} onOpenChange={setShowRfpUploadModal} />
    </div>
  );
}