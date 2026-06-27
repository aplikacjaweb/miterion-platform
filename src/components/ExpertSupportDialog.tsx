'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabaseClient';
import CaptchaWrapper from './CaptchaWrapper';

interface ExpertSupportDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialTab?: 'selection' | 'expert' | 'quote' | 'notsure';
}

export default function ExpertSupportDialog({ trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange, initialTab = 'selection' }: ExpertSupportDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'selection' | 'expert' | 'quote' | 'notsure'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [commonFields, setCommonFields] = useState({ fullName: '', workEmail: '', companyName: '', additionalContext: '' });
  const [preFeasFields, setPreFeasFields] = useState({ indication: '', phase: '', geography: '', decision: '', timeline: '', protocolSynopsis: 'Not yet' });
  const [quoteFields, setQuoteFields] = useState({ proposalType: 'CRO', proposalCount: '2', decision: '', targetDate: '', secureUpload: 'No' });
  const [situationFields, setSituationFields] = useState({ decisionFacing: '', riskIfWrong: '', timeline: '' });

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const onOpenChange = (val: boolean) => {
    if (controlledOnOpenChange) controlledOnOpenChange(val);
    else setInternalOpen(val);
    if (!val) {
      setActiveTab(initialTab);
      setSuccess(false);
      setError(null);
      setCaptchaToken(null);
    }
  };

  const handleSelectTab = (tab: 'expert' | 'quote' | 'notsure') => {
    setActiveTab(tab);
    setCaptchaToken(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Please complete the security check.');
      return;
    }

    setLoading(true);
    setError(null);

    let combinedMessage = '';

    if (activeTab === 'expert') {
      combinedMessage = `
--- PRE-FEASIBILITY REPORT REQUEST ---
Indication: ${preFeasFields.indication}
Phase: ${preFeasFields.phase}
Geography/Countries: ${preFeasFields.geography}
What decision are you preparing: ${preFeasFields.decision}
Timeline: ${preFeasFields.timeline}
Do you have a protocol synopsis: ${preFeasFields.protocolSynopsis}

--- ADDITIONAL CONTEXT ---
${commonFields.additionalContext}
`;
    } else if (activeTab === 'quote') {
      combinedMessage = `
--- QUOTE REVIEW REQUEST ---
Type of proposal: ${quoteFields.proposalType}
Number of proposals: ${quoteFields.proposalCount}
What decision are you preparing: ${quoteFields.decision}
Target decision date: ${quoteFields.targetDate}
Need secure upload link: ${quoteFields.secureUpload}

--- ADDITIONAL CONTEXT ---
${commonFields.additionalContext}
`;
    } else if (activeTab === 'notsure') {
      combinedMessage = `
--- DESCRIBE MY SITUATION REQUEST ---
What decision are you facing: ${situationFields.decisionFacing}
What would happen if wrong: ${situationFields.riskIfWrong}
Timeline: ${situationFields.timeline}
`;
    }

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: commonFields.fullName,
          email: commonFields.workEmail,
          company: commonFields.companyName,
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
            <h3 className="text-xl font-bold text-navy mb-2">Request Submitted Successfully</h3>
            <p className="text-sm text-gray-600">Our analysts are reviewing your case. We will get back to you shortly.</p>
            <Button className="mt-6 bg-navy text-white hover:opacity-90 px-6 py-2 rounded-xl" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : activeTab === 'selection' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-navy text-center">What do you need to check?</DialogTitle>
              <DialogDescription className="text-center text-gray-500 mt-1">
                Select the operational decision support path required for your study.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <button
                onClick={() => handleSelectTab('expert')}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50/30 transition-all group flex flex-col"
              >
                <span className="font-bold text-lg text-navy group-hover:text-purple-700">Request Pre-Feasibility Report</span>
                <span className="text-xs text-gray-600 mt-1">Country screening, visible competition, protocol friction and public-data gaps before formal feasibility.</span>
              </button>

              <button
                onClick={() => handleSelectTab('quote')}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50/30 transition-all group flex flex-col"
              >
                <span className="font-bold text-lg text-navy group-hover:text-green-700">Start Quote Review</span>
                <span className="text-xs text-gray-600 mt-1">CRO or vendor proposal comparison before choosing a partner.</span>
              </button>

              <button
                onClick={() => handleSelectTab('notsure')}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-teal hover:bg-slate-50 transition-all group flex flex-col"
              >
                <span className="font-bold text-lg text-navy group-hover:text-teal">Describe My Situation</span>
                <span className="text-xs text-gray-600 mt-1">Not sure which path fits? Tell us what decision you are facing.</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-navy">
                {activeTab === 'expert' && 'Request Pre-Feasibility Report'}
                {activeTab === 'quote' && 'Start Quote Review'}
                {activeTab === 'notsure' && 'Describe My Situation'}
              </DialogTitle>
            </DialogHeader>

            {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-semibold">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                <input required type="text" value={commonFields.fullName} onChange={e => setCommonFields({...commonFields, fullName: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Work Email</label>
                <input required type="email" value={commonFields.workEmail} onChange={e => setCommonFields({...commonFields, workEmail: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Company Name</label>
              <input required type="text" value={commonFields.companyName} onChange={e => setCommonFields({...commonFields, companyName: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
            </div>

            {activeTab === 'expert' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Indication</label>
                    <input required type="text" placeholder="e.g. Oncology, Rare disease" value={preFeasFields.indication} onChange={e => setPreFeasFields({...preFeasFields, indication: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Phase</label>
                    <input required type="text" placeholder="e.g. Phase II, III" value={preFeasFields.phase} onChange={e => setPreFeasFields({...preFeasFields, phase: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Geography / Countries under consideration</label>
                  <input required type="text" value={preFeasFields.geography} onChange={e => setPreFeasFields({...preFeasFields, geography: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">What decision are you preparing?</label>
                  <input required type="text" placeholder="e.g. Country selection budget sign-off" value={preFeasFields.decision} onChange={e => setPreFeasFields({...preFeasFields, decision: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Timeline</label>
                    <input required type="text" placeholder="e.g. Next 3 months" value={preFeasFields.timeline} onChange={e => setPreFeasFields({...preFeasFields, timeline: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Do you have a protocol synopsis?</label>
                    <select value={preFeasFields.protocolSynopsis} onChange={e => setPreFeasFields({...preFeasFields, protocolSynopsis: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Not yet">Not yet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Additional context</label>
                  <textarea value={commonFields.additionalContext} onChange={e => setCommonFields({...commonFields, additionalContext: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy h-16 resize-none" />
                </div>
              </>
            )}

            {activeTab === 'quote' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Type of proposal</label>
                    <select value={quoteFields.proposalType} onChange={e => setQuoteFields({...quoteFields, proposalType: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy bg-white">
                      <option value="CRO">CRO</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Not sure">Not sure</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Number of proposals to compare</label>
                    <input required type="number" min="1" value={quoteFields.proposalCount} onChange={e => setQuoteFields({...quoteFields, proposalCount: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">What decision are you preparing?</label>
                  <input required type="text" placeholder="e.g. Vendor selection board presentation" value={quoteFields.decision} onChange={e => setQuoteFields({...quoteFields, decision: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Target decision date</label>
                    <input required type="text" placeholder="e.g. Oct 15, 2026" value={quoteFields.targetDate} onChange={e => setQuoteFields({...quoteFields, targetDate: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Do you need secure upload link?</label>
                    <select value={quoteFields.secureUpload} onChange={e => setQuoteFields({...quoteFields, secureUpload: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Additional context</label>
                  <textarea value={commonFields.additionalContext} onChange={e => setCommonFields({...commonFields, additionalContext: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy h-16 resize-none" />
                </div>

                <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-100 leading-normal">
                  Please do not upload patient-level data, special category personal data or confidential trial documents unless we have confirmed the appropriate sharing route.
                </p>
              </>
            )}

            {activeTab === 'notsure' && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">What decision are you facing?</label>
                  <textarea required value={situationFields.decisionFacing} onChange={e => setSituationFields({...situationFields, decisionFacing: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy h-20 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">What would happen if this decision is wrong?</label>
                  <textarea required value={situationFields.riskIfWrong} onChange={e => setSituationFields({...situationFields, riskIfWrong: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy h-20 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Timeline</label>
                  <input required type="text" placeholder="e.g. Immediate, critical path" value={situationFields.timeline} onChange={e => setSituationFields({...situationFields, timeline: e.target.value})} className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-navy" />
                </div>
              </>
            )}

            <p className="text-[10px] text-gray-400 leading-normal">
              By submitting this form, you acknowledge that Miterion will process the information provided to respond to your request and, if relevant, prepare a scope proposal. See our Privacy Policy.
            </p>

            <div className="flex justify-center py-1">
              <CaptchaWrapper onVerify={(token) => setCaptchaToken(token)} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="w-1/3 rounded-xl py-2" onClick={() => handleSelectTab('selection')}>← Back</Button>
              <Button type="submit" disabled={loading || !captchaToken} className="w-2/3 rounded-xl py-2 font-bold text-white bg-navy hover:opacity-90 disabled:opacity-50">
                {loading ? 'Processing...' : !captchaToken ? 'Verify Security...' : activeTab === 'expert' ? 'Request Scope Review' : activeTab === 'quote' ? 'Start Document Review' : 'Send Request'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
