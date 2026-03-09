import { Metadata } from 'next';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Cookie Policy | Miterion',
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: January 2024</p>

      <div className="prose max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They are used to remember your preferences and improve your
            experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">Cookies We Use</h2>

          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-navy mb-1">cookie_consent</h3>
              <p className="text-sm">
                <strong>Purpose:</strong> Remembers your cookie consent decision.
              </p>
              <p className="text-sm mt-1">
                <strong>Duration:</strong> 365 days
              </p>
              <p className="text-sm mt-1">
                <strong>Type:</strong> Strictly necessary
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-navy mb-1">NEXT_LOCALE</h3>
              <p className="text-sm">
                <strong>Purpose:</strong> Remembers your language preference (EN/PL).
              </p>
              <p className="text-sm mt-1">
                <strong>Duration:</strong> Session
              </p>
              <p className="text-sm mt-1">
                <strong>Type:</strong> Functional
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">Managing Cookies</h2>
          <p>
            You can control and delete cookies through your browser settings. Note
            that disabling strictly necessary cookies may affect the functionality
            of the site.
          </p>
          <p className="mt-3">
            You can also update your preferences at any time using the cookie banner
            at the bottom of the page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">Third-Party Cookies</h2>
          <p>
            We do not currently use any third-party tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">Contact</h2>
          <p>
            If you have questions about our cookie use, contact us at{' '}
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
