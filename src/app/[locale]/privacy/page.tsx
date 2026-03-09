import { Metadata } from 'next';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Privacy Policy | Miterion',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: January 2024</p>

      <div className="prose max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">1. Who We Are</h2>
          <p>
            Miterion provides clinical operations intelligence tools to support
            feasibility and site selection teams. Our platform aggregates publicly
            available trial registry data to surface actionable insights.
          </p>
          <p className="mt-2">
            Contact us at:{' '}
            <a href="mailto:contact@miterion.com" className="text-teal hover:underline">
              contact@miterion.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">2. Data We Collect</h2>
          <p>We collect the following personal data when you use our services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email address (when you request a report or join a waitlist)</li>
            <li>Company name (optional, when provided in forms)</li>
            <li>Files you upload (RFP documents or questionnaires)</li>
            <li>Usage data and cookies for improving the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">3. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To generate and deliver clinical landscape PDF reports</li>
            <li>To process RFP harmonization requests</li>
            <li>To notify you when the DCT Dashboard becomes available</li>
            <li>To send transactional emails related to your requests</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">4. Data Retention</h2>
          <p>
            We retain your data for as long as necessary to fulfill the purpose for
            which it was collected. You may request deletion at any time by emailing
            us at{' '}
            <a href="mailto:contact@miterion.com" className="text-teal hover:underline">
              contact@miterion.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">5. Cookies</h2>
          <p>
            We use cookies to remember your consent preferences. See our{' '}
            <Link href="/cookies" className="text-teal hover:underline">
              Cookie Policy
            </Link>{' '}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">6. Your Rights</h2>
          <p>
            Under applicable data protection law you have the right to access,
            rectify, erase, and port your personal data, and to object to or
            restrict its processing. To exercise these rights, contact us at{' '}
            <a href="mailto:contact@miterion.com" className="text-teal hover:underline">
              contact@miterion.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12">
        <Link href="/" className="text-teal hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
