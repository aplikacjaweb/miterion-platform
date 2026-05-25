'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import BasePremiumForm from './BasePremiumForm';

interface FullReportRequestDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FullReportRequestDialog({ trigger, open, onOpenChange }: FullReportRequestDialogProps) {
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
          <BasePremiumForm 
            endpoint="/api/full-report-request" 
            submitButtonText="Request Intelligence Report" 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
