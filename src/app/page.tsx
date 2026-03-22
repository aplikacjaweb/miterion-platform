import { Metadata } from 'next';
import SnapshotForm from '@/components/SnapshotForm';
import RfpForm from '@/components/RfpForm';
import DctWaitlistForm from '@/components/DctWaitlistForm';

export const metadata: Metadata = {
  title: 'Miterion - Clinical Trial Intelligence & Decision Support',
  description: 'Transform public data into actionable recruitment and budget strategies.'
};

export default async function Home() {
  return (
    <div className="space-y-24 py-12">
      <section className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Clinical Trial Intelligence & Decision Support.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform public data into actionable recruitment and budget strategies. Instant Snapshot. Expert Intelligence. Budget Control.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              Recruitment Competition Analysis
            </h3>
            <p className="text-gray-600">
              Identify crowded therapeutic areas and optimize patient recruitment strategies.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              Geographic Density Insights
            </h3>
            <p className="text-gray-600">
              Discover regions with high trial activity and strategic partnership opportunities.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              Protocol Feasibility Review
            </h3>
            <p className="text-gray-600">
              Assess the viability of your study design against existing trial data.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="section-title">Get Your Free Clinical Trial Snapshot</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Instantly analyze key metrics for your target indication and phase.
        </p>
        <SnapshotForm />
      </section>

      <section className="container mx-auto px-4">
        <h2 className="section-title">Request Full Trial Intelligence Report</h2>
        <p className="text-center text-gray-600 mb-2 max-w-2xl mx-auto">
          Get a comprehensive analysis tailored to your specific needs.
        </p>
        <p className="text-center text-sm text-teal mb-8">
          Custom pricing based on scope.
        </p>
        <div className="max-w-xl mx-auto">
          <RfpForm />
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="section-title">DCT Operations Dashboard</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our waitlist for early access to our Decentralized Clinical Trials dashboard.
        </p>
        <div className="max-w-xl mx-auto">
          <DctWaitlistForm />
        </div>
      </section>
    </div>
  );
}
