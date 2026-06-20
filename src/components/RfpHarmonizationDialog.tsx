'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import BasePremiumForm from './BasePremiumForm';
import CaptchaWrapper from './CaptchaWrapper';

interface RfpHarmonizationDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function RfpHarmonizationDialog({ trigger, open, onOpenChange }: RfpHarmonizationDialogProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>RFP & Quote Harmonization</DialogTitle>
          <DialogDescription>
            Comparison and optimization of vendor proposals, budgets, and operational quotes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="text-sm text-gray-600 space-y-2 mb-6 bg-slate-50 p-4 rounded-lg">
            <li>• Standardized comparison of vendor budgets</li>
            <li>• Identification of hidden costs and overlaps</li>
            <li>• Data-driven vendor proposal optimization</li>
            <li>• Upload your RFP/proposals for a free scope review</li>
          </ul>
          
          {/* Niewidoczna Captcha działająca w tle */}
          <CaptchaWrapper onVerify={(token) => setCaptchaToken(token)} />

          <BasePremiumForm 
            endpoint="/api/rfp-harmonization-request" 
            submitButtonText="Request RFP Harmonization" 
            // Przekazanie tokenu z Captchy do formularza bazowego
            captchaToken={captchaToken}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}