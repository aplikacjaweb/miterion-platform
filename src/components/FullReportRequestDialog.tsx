'use client';

import { useState, useCallback } from 'react'; // 1. Dodajemy useCallback do importu z React
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import BasePremiumForm from './BasePremiumForm';
import CaptchaWrapper from './CaptchaWrapper';

interface FullReportRequestDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FullReportRequestDialog({ trigger, open, onOpenChange }: FullReportRequestDialogProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // 2. Owijamy funkcję w useCallback. Dzięki temu React zapamięta jej referencję
  // i nie wyrenderuje Captchy na nowo, gdy stan 'captchaToken' się zmieni.
  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Full Trial Intelligence Report</DialogTitle>
          <DialogDescription>
            Get an analyst-led, comprehensive landscape review beyond the automated snapshot.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="text-sm text-gray-600 space-y-2 mb-6 bg-slate-50 p-4 rounded-lg">
            <li>• Broader international public-source cross-checking</li>
            <li>• Expert analyst-led interpretation of competitive density</li>
            <li>• Recruitment strategy & risk assessment</li>
            <li>• Free scope review and tailored pricing</li>
          </ul>

          {/* 3. Przekazujemy zapamiętaną funkcję 'handleCaptchaVerify' */}
          <CaptchaWrapper onVerify={handleCaptchaVerify} />

          <BasePremiumForm 
            endpoint="/api/full-report-request" 
            submitButtonText="Request Intelligence Report" 
            captchaToken={captchaToken} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
