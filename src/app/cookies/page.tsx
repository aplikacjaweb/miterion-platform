import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | Miterion',
  description: 'Cookie Policy for Miterion platform, operated by Senolix Longevity P.S.A.',
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Cookie Policy for Miterion</h1>
      <p className="text-sm text-slate-500 mb-8">Effective Date: March 13, 2026</p>
      <p className="mb-6">
        This Cookie Policy explains how Miterion ("we," "us," or "our"), operated by Senolix Longevity P.S.A., uses cookies and similar technologies on our website (miterion.com). This policy should be read in conjunction with our <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link>.
      </p>
      <hr className="my-8 border-slate-200 dark:border-slate-800" />
      <h2 className="text-xl font-semibold mt-6 mb-3">1. What Are Cookies?</h2>
      <p className="mb-6">
        Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Cookies</h2>
      <p className="mb-4">We use cookies for the following purposes:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.</li>
        <li><strong>Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.</li>
        <li><strong>Marketing Cookies:</strong> These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">3. Types of Cookies We Use</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser. They are essential for the proper functioning of the website (e.g., keeping you logged in).</li>
        <li><strong>Persistent Cookies:</strong> These cookies remain on your device for a set period or until you delete them. They are used to remember your preferences and actions across multiple sessions.</li>
        <li><strong>First-Party Cookies:</strong> These cookies are set by the website you are visiting and can only be read by that site.</li>
        <li><strong>Third-Party Cookies:</strong> These cookies are set by a domain other than the one you are visiting. They are used for tracking and online advertising.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">4. Specific Cookies We Use</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Google Analytics:</strong> Used to collect information about how visitors use our site, including the number of visitors, where they have come from, and the pages they visited. This helps us improve our website.</li>
        <li><strong>Facebook Pixel:</strong> Used to track conversions from Facebook ads, optimize ads, build targeted audiences, and re-market to people who have already taken some action on our website.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">5. Managing Cookies</h2>
      <p className="mb-4">
        You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can usually view what cookies are set and delete them, block third-party cookies, or block cookies from specific sites.</li>
        <li><strong>Cookie Consent Tool:</strong> When you visit our website, you will see a cookie consent banner. You can use this tool to customize your cookie preferences.</li>
        <li><strong>Opt-Out Tools:</strong> You can opt out of Google Analytics by installing the Google Analytics opt-out browser add-on. You can also opt out of interest-based advertising by visiting the Network Advertising Initiative opt-out page or the Digital Advertising Alliance opt-out page.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes to This Cookie Policy</h2>
      <p className="mb-6">
        We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting the new Cookie Policy on our website and updating the "Effective Date" at the top of this policy.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
      <p className="mb-6">
        If you have any questions about our use of cookies or this Cookie Policy, please contact us at <strong>contact@miterion.com</strong>.
      </p>
    </div>
  );
}