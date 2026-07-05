'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import CaptchaWrapper from './CaptchaWrapper';

interface ExpertSupportDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialTab?: string; // Zachowane dla wstecznej kompatybilności propsów, ale nieużywane w logice tabów
}

export default function ExpertSupportDialog({ trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange }: ExpertSupportDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Zunifikowany stan formularza dla Custom Review
  const [fields, setFields] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    indication: '',
    phase: '',
    geography: '',
    decision: ''
  });

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const onOpenChange = (val: boolean) => {
    if (controlledOnOpenChange) controlledOnOpenChange(val);
    else setInternalOpen(val);
    if (!val) {
      setSuccess(false);
      setError(null);
      setCaptchaToken(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Please complete the security check.');
      return;
    }

    setLoading(true);
    setError(null);

    // Formatowanie wiadomości tekstowej w sposób czytelny dla maila i backendu,
    // bez zmiany struktury payloadu (klucz 'message')
    const combinedMessage = `
--- CUSTOM REVIEW REQUEST ---
Indication / therapeutic area: ${fields.indication}
Trial phase: ${fields.phase}
Geography: ${fields.geography}
What decision are you trying to de-risk?: ${fields.decision}
`;

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.fullName,
          email: fields.workEmail,
          company: fields.companyName,
          message: combinedMessage,
          captchaToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit form requests.');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[90vh] bg-white text-slate-900 p-6 rounded-2xl">
        
        {success ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">✓</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Request Submitted Successfully</h3>
            <p className="text-sm text-gray-600">Our analysts are reviewing your case. We will get back to you shortly.</p>
            <Button className="mt-6 bg-slate-900 text-white hover:opacity-90 px-6 py-2 rounded-xl" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Custom Review Request
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Use this form for a custom pre-feasibility, country selection, CRO proposal or trial planning question that is not covered by the free snapshot.
              </DialogDescription>
            </DialogHeader>

            {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-semibold">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                <input required type="text" value={fields.fullName} onChange={e => setFields({...fields, fullName: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Work Email</label>
                <input required type="email" value={fields.workEmail} onChange={e => setFields({...fields, workEmail: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Company</label>
              <input required type="text" value={fields.companyName} onChange={e => setFields({...fields, companyName: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Indication / therapeutic area</label>
                <input required type="text" placeholder="e.g. Oncology, Rare disease" value={fields.indication} onChange={e => setFields({...fields, indication: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Trial phase</label>
                <input required type="text" placeholder="e.g. Phase II, III" value={fields.phase} onChange={e => setFields({...fields, phase: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Geography</label>
              <input required type="text" placeholder="e.g. EU, North America" value={fields.geography} onChange={e => setFields({...fields, geography: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">What decision are you trying to de-risk?</label>
              <textarea required placeholder="e.g. Country selection budget sign-off, CRO timeline validation" value={fields.decision} onChange={e => setFields({...fields, decision: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900 h-20 resize-none" />
            </div>

            <p className="text-[10px] text-gray-400 leading-normal">
              By submitting this form, you acknowledge that Miterion will process the information provided to respond to your request and, if relevant, prepare a scope proposal. See our Privacy Policy.
            </p>

            <div className="flex justify-center py-1">
              <CaptchaWrapper onVerify={(token) => setCaptchaToken(token)} />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading || !captchaToken} className="w-full rounded-xl py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50">
                {loading ? 'Processing...' : !captchaToken ? 'Verify Security...' : 'Submit Custom Request'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}