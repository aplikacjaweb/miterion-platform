import Link from "next/link";
import { Button } from "@/components/ui/button";
import SnapshotForm from "@/components/SnapshotForm";
import DctWaitlistForm from "@/components/DctWaitlistForm";
import ExpertSupportDialog from "@/components/ExpertSupportDialog";

export default function Home() {
  return (
    <div className="space-y-32 pb-32">
      {/* HERO SECTION */}
      <section className="container mx-auto px-4 pt-20 text-center">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full">
          CLINICAL TRIAL DECISION INTELLIGENCE
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-navy mt-6 tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Don’t Buy Feasibility Blind.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
          Before you commit budget to formal feasibility, country selection or vendor contracts, see what public trial data and proposal assumptions already reveal.
        </p>
        <div className="mt-8 max-w-3xl mx-auto bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
          <h2 className="font-bold text-navy text-lg mb-2">De-Risk Country, Protocol and Vendor Decisions</h2>
          <p className="text-sm text-gray-600">
            Start with a free public-data snapshot. Go deeper with a pre-feasibility decision report. Compare CRO and vendor proposals before signing.
          </p>
        </div>
      </section>

      {/* SERVICE CARDS SECTION */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Ścieżka 1: Clinical Landscape Snapshot */}
          <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-navy">Clinical Landscape Snapshot</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Free first-pass view of visible clinical trial activity in your indication, phase and geography. Use public registry data to see where similar studies are active, which countries show signal, where the landscape looks crowded and where the data is too thin.
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Free & Instant</span>
              <a href="#snapshot" className="text-navy font-semibold hover:underline text-sm flex items-center gap-1">Generate Snapshot →</a>
            </div>
          </div>

          {/* Ścieżka 2: Pre-Feasibility Decision Report */}
          <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="h-14 w-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 002 2h4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9H8m4 4H8m4 4H8" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-navy">Pre-Feasibility Decision Report</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Analyst-led decision memo before formal feasibility. We review public registries, CTIS, national sources, publications and visible competition signals to help you decide where deeper feasibility is worth doing.
              </p>
            </div>
            <div className="mt-4">
              <ExpertSupportDialog
                initialTab="expert"
                trigger={<Button className="w-full font-bold bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm">Request Report →</Button>}
              />
            </div>
          </div>

          {/* Ścieżka 3: RFP & Budget Harmonization */}
          <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="h-14 w-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-navy">RFP & Budget Harmonization</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Compare CRO and vendor proposals before you choose a partner. We normalize scope, assumptions, pass-through costs and budget risks so you can see which quote is clearer, more complete and easier to defend.
              </p>
            </div>
            <div className="mt-4">
              <ExpertSupportDialog
                initialTab="quote"
                trigger={<Button className="w-full font-bold bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm">Start Harmonization →</Button>}
              />
            </div>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-navy mb-2">Pricing</h2>
          <p className="text-gray-600 text-lg">Start free. Go deeper when the decision matters.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-navy text-base">Free Snapshot</h4>
              <p className="text-xs text-gray-500 mt-1">First-pass public registry signal.</p>
            </div>
            <p className="font-extrabold text-navy text-lg mt-4">Free</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-navy text-base">Pre-Feasibility Decision Report</h4>
              <p className="text-xs text-gray-500 mt-1">Analyst-led memo before formal feasibility.</p>
            </div>
            <p className="font-bold text-gray-700 text-sm mt-4">Fixed fee after scope review</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-navy text-base">RFP & Budget Harmonization</h4>
              <p className="text-xs text-gray-500 mt-1">CRO/vendor proposal comparison before signature.</p>
            </div>
            <p className="font-bold text-gray-700 text-sm mt-4">Fixed fee after document review</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-navy text-base">Custom Trial Decision Support</h4>
              <p className="text-xs text-gray-500 mt-1">For complex planning questions.</p>
            </div>
            <p className="font-bold text-gray-700 text-sm mt-4">Custom quote</p>
          </div>
        </div>
      </section>

      {/* SEKCOJA FORMULARZA SNAPSHOT Z SŁOWNIKIEM CAN/CANNOT */}
      <section id="snapshot" className="container mx-auto px-4 scroll-mt-24 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-navy mb-4">Generate Your Free Snapshot</h2>
          <p className="text-gray-600">Enter your trial parameters below to receive an instant analysis of the current landscape.</p>
        </div>
        
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm">
          <SnapshotForm />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-sm border-t border-slate-100 pt-12">
          <div>
            <h4 className="font-bold text-navy text-base mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              What the Free Snapshot Can Tell You
            </h4>
            <p className="text-gray-600 leading-relaxed">
              The snapshot shows visible activity in structured public registry data. It can help you see whether your indication and geography look crowded, thin, sponsor-heavy or worth deeper review. It can also help your team prepare better questions before speaking with a CRO, site or local feasibility partner.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-navy text-base mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              What the Free Snapshot Cannot Tell You
            </h4>
            <p className="text-gray-600 leading-relaxed">
              The snapshot does not show actual site enrollment performance, investigator capacity, contract timelines, coordinator availability, local patient refusal rates or operational readiness. These questions require manual validation, local expertise or formal feasibility work.
            </p>
          </div>
        </div>
      </section>

      {/* DOWNGRADED WAITLIST DASHBOARD */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 md:p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Coming Next: DCT Operations Dashboard</h2>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
              Miterion is developing selected modules for decentralized and hybrid clinical trial operations. Join the waitlist for early access.
            </p>
            <div className="max-w-md mx-auto">
              <DctWaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
