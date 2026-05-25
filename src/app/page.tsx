import { Metadata } from 'next';
import SnapshotForm from '@/components/SnapshotForm';
import DctWaitlistForm from '@/components/DctWaitlistForm';
import FullReportRequestDialog from '@/components/FullReportRequestDialog';
import RfpHarmonizationDialog from '@/components/RfpHarmonizationDialog';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Miterion - Clinical Trial Intelligence & Decision Support',
  description: 'Transform public data into actionable recruitment and budget strategies.'
};

export default async function Home() {
  return (
    <div className="space-y-24 py-12">
      <section className="container mx-auto px-4 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-navy tracking-tight">
          Clinical Trial Intelligence & <span className="text-blue-600">Decision Support.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Unlock actionable clinical landscape data and budget insights. Instant Snapshots. Expert Intelligence Reports. RFP Harmonization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#snapshot" className="btn-primary px-8 py-3 text-lg">
            Generate Free Snapshot
          </a>
          <FullReportRequestDialog 
            trigger={<Button variant="outline" className="px-8 py-3 text-lg h-auto">View Premium Services</Button>} 
          />
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Clinical Landscape Snapshot */}
          <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-navy">Clinical Landscape Snapshot</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Instant, self-serve analysis of recruitment competition and geographic density based on public registry data. Perfect for initial feasibility.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Free & Instant</span>
              <a href="#snapshot" className="text-navy font-semibold hover:underline text-sm">Get Started →</a>
            </div>
          </div>

          {/* Full Trial Intelligence Report */}
          <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="h-14 w-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 002 2h4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9H8m4 4H8m4 4H8" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-navy">Full Trial Intelligence</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Analyst-led deep dive with international source cross-checking and tailored recruitment strategy. Goes beyond the automated snapshot.
            </p>
            <FullReportRequestDialog 
              trigger={<Button variant="outline" className="w-full font-bold">Request Expert Report</Button>} 
            />
          </div>

          {/* RFP & Quote Harmonization */}
          <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="h-14 w-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-navy">Budget Harmonization</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Standardized comparison of vendor proposals and quotes. Identify hidden costs and overlaps to optimize your clinical trial budget.
            </p>
            <RfpHarmonizationDialog 
              trigger={<Button variant="outline" className="w-full font-bold">Start Harmonization</Button>} 
            />
          </div>
        </div>
      </section>

      <section id="snapshot" className="container mx-auto px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-navy mb-4">Generate Your Free Snapshot</h2>
          <p className="text-gray-600">Enter your trial parameters below to receive an instant analysis of the current landscape.</p>
        </div>
        <SnapshotForm />
      </section>

      <section className="container mx-auto px-4">
        <div className="bg-navy rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">DCT Operations Dashboard</h2>
            <p className="text-blue-100 mb-10 text-lg opacity-80">
              Future-proof your operations with our upcoming Decentralized Clinical Trials dashboard. Join the waitlist for early access.
            </p>
            <div className="max-w-md mx-auto">
              <DctWaitlistForm />
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
}
