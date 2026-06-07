import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Miterion',
  description: 'Terms of Service for Miterion platform, operated by Senolix Longevity P.S.A.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service for Miterion</h1>
      <p className="text-sm text-slate-500 mb-8">Effective Date: March 13, 2026</p>
      <p className="mb-6">
        Welcome to Miterion! These Terms of Service ("Terms") govern your access to and use of the services provided by Miterion ("we," "us," or "our"), operated by Senolix Longevity P.S.A., located at ul. Strzałowa 17p/3, 87-100 Toruń, Poland, email: contact@miterion.com, NIP: 9562386305.
      </p>
      <hr className="my-8 border-slate-200 dark:border-slate-800" />
      <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
      <p className="mb-6">
        By accessing or using our services, you agree to be bound by these Terms and our <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link>. If you do not agree to these Terms, you may not access or use our services.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Services</h2>
      <p className="mb-6">
        Miterion provides a platform for longevity research and services. Our services include access to research reports, data analysis tools, and other related services. We reserve the right to modify or discontinue our services at any time without notice.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">3. User Responsibilities</h2>
      <p className="mb-4">You agree to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Provide accurate and complete information when creating an account and updating your account information.</li>
        <li>Keep your account credentials secure and confidential.</li>
        <li>Use our services in compliance with all applicable laws and regulations.</li>
        <li>Not use our services for any illegal or unauthorized purpose.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">4. Payment and Subscription</h2>
      <p className="mb-4">
        Some of our services may require payment. By providing payment information, you represent and warrant that you are authorized to use the payment method and that there are sufficient funds or credit available to complete the transaction.
      </p>
      <p className="mb-6">
        We use third-party payment processors to handle payments. The processing of payments will be subject to the terms, conditions, and privacy policies of the payment processor.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">5. Intellectual Property</h2>
      <p className="mb-6">
        All content and materials available on our platform, including but not limited to text, graphics, logos, button icons, images, audio clips, and software, are the property of Miterion or its licensors and are protected by copyright, trademark, and other intellectual property laws.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Termination</h2>
      <p className="mb-6">
        We may terminate or suspend your access to our services at any time, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use our services will immediately cease.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">7. Disclaimer of Warranties</h2>
      <p className="mb-6">
        Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or free of viruses or other harmful components.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
      <p className="mb-6">
        In no event shall Miterion, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of our services.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">9. Governing Law</h2>
      <p className="mb-6">
        These Terms shall be governed by and construed in accordance with the laws of Poland, without regard to its conflict of law principles.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">10. Changes to These Terms</h2>
      <p className="mb-6">
        We reserve the right to modify these Terms at any time. We will notify you of any significant changes by posting the new Terms on our website and updating the "Effective Date" at the top of this page.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">11. Contact Us</h2>
      <p className="mb-6">
        If you have any questions about these Terms, please contact us at <strong>contact@miterion.com</strong>.
      </p>
    </div>
  );
}