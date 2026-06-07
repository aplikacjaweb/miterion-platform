import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Miterion',
  description: 'Privacy Policy for Miterion platform, operated by Senolix Longevity P.S.A.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy for Miterion</h1>
      <p className="text-sm text-slate-500 mb-8">Effective Date: March 13, 2026</p>
      <p className="mb-6">
        This Privacy Policy explains how Miterion ("we," "us," or "our"), operated by Senolix Longevity P.S.A., located at ul. Strzałowa 17p/3, 87-100 Toruń, Poland, email: contact@miterion.com, NIP: 9562386305, collects, uses, and discloses your personal data in connection with your use of our website (miterion.com) and services. We are committed to protecting your privacy and handling your personal data in an open and transparent manner, in accordance with the General Data Protection Regulation (GDPR) (EU) 2016/679.
      </p>
      <hr className="my-8 border-slate-200 dark:border-slate-800" />
      <h2 className="text-xl font-semibold mt-6 mb-3">1. Personal Data We Collect</h2>
      <p className="mb-4">We collect personal data that you provide to us directly, as well as data automatically collected during your use of our website.</p>
      <p className="font-medium mb-2">Data you provide:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li><strong>For Service Provision and Account Management:</strong> Name, surname, company name, billing/invoice address, email address, phone number, payment information.</li>
        <li><strong>For marketing purposes:</strong> Email address, name, interests (if provided), to send you newsletters, promotional offers, and updates.</li>
        <li><strong>For analytics:</strong> Information about your interaction with our website.</li>
      </ul>
      <p className="font-medium mb-2">Automatically collected data:</p>
      <p className="mb-6">IP address, browser type, operating system, referral URLs, pages visited, and other browsing activity. This data is primarily collected through cookies and similar technologies for analytics and website functionality.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">2. Legal Basis for Processing (Art. 6 GDPR)</h2>
      <p className="mb-4">We process your personal data based on the following legal grounds:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li><strong>Performance of a contract (Art. 6(1)(b) GDPR):</strong> When you request services or set up an account with us, we process your data to fulfill our contractual obligations.</li>
        <li><strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> We process data for our legitimate business interests, such as improving our website, preventing fraud, and conducting analytics, provided that these interests do not override your fundamental rights and freedoms.</li>
        <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> For certain marketing activities and the use of specific types of cookies, we rely on your explicit consent. You have the right to withdraw your consent at any time.</li>
        <li><strong>Legal obligation (Art. 6(1)(c) GDPR):</strong> We process data to comply with legal obligations, such as tax and accounting requirements.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Personal Data</h2>
      <p className="mb-4">We use your personal data for the following purposes:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li><strong>Service Provision:</strong> To process payments, manage subscriptions, deliver reports, manage user accounts, and provide customer support related to your platform access.</li>
        <li><strong>Marketing:</strong> To send you marketing communications about our products, services, and promotions, if you have given us your consent.</li>
        <li><strong>Analytics:</strong> To understand how users interact with our website, identify trends, and improve our services and user experience.</li>
        <li><strong>Website Functionality:</strong> To ensure the proper functioning of our website and personalize your experience.</li>
        <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-4 mb-2">3a. Profiling</h3>
      <p className="mb-6">We may use your personal data to create a profile of your interests and preferences so that we can contact you with information relevant to you. We may make use of additional information about you when it is available from external sources to help us do this effectively. We do not use automated decision-making that has legal effects on you or similarly significantly affects you.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">4. Cookies and Similar Technologies</h2>
      <p className="mb-4">Our website uses cookies and similar technologies (like Google Analytics and Facebook Pixel) to enhance your experience, analyze site usage, and support our marketing efforts.</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Session Cookies:</strong> These are temporary and expire when you close your browser. They are essential for the proper functioning of the website (e.g., keeping you logged in).</li>
        <li><strong>Google Analytics:</strong> Used to collect information about how visitors use our site, including the number of visitors, where they have come from, and the pages they visited. This helps us improve our website.</li>
        <li><strong>Facebook Pixel:</strong> Used to track conversions from Facebook ads, optimize ads, build targeted audiences, and re-market to people who have already taken some action on our website.</li>
      </ul>
      <p className="mb-6">
        Most web browsers allow you to control cookies through their settings. You can usually view what cookies are set and delete them, block third-party cookies, or block cookies from specific sites. Please note that disabling cookies may affect the functionality of our website. For more details, see our <Link href="/cookies" className="text-blue-600 underline">Cookie Policy</Link>.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">5. Analytics (Google Analytics)</h2>
      <p className="mb-4">We use Google Analytics, a web analysis service provided by Google Ireland Limited ("Google"). Google Analytics uses cookies to analyze how users use the site. The information generated about your use of the website (including your IP address) will be transmitted to and stored by Google on servers in the United States.</p>
      <p className="mb-4">In accordance with GDPR and ePrivacy regulations, we only utilize Google Analytics after you have explicitly provided your consent via our Cookie Consent Banner. You have the right to withdraw this consent at any time. We have configured Google Analytics to ensure that your IP address is anonymized (IP masking) before it is transmitted.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Sharing Your Personal Data</h2>
      <p className="mb-4">We may share your personal data with the following categories of third parties:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li><strong>Payment Processors:</strong> To facilitate secure payment transactions (e.g., Stripe, PayPal). These entities process your payment details directly and are subject to their own privacy policies.</li>
        <li><strong>Hosting Providers:</strong> Our website data and infrastructure are hosted by third-party providers such as Vercel and Supabase. They process data on our behalf to ensure the availability and performance of our services.</li>
        <li><strong>Analytics Providers:</strong> Google Analytics helps us analyze website traffic and user behavior.</li>
        <li><strong>Marketing and Advertising Partners:</strong> Facebook Pixel is used to deliver targeted advertisements and measure the effectiveness of our marketing campaigns.</li>
        <li><strong>Email Communication Services:</strong> We use Resend to send transactional and marketing emails.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">7. International Data Transfers</h2>
      <p className="mb-6">Some of our third-party service providers, such as Google Analytics and Facebook Pixel, may transfer data outside the European Union (EU), particularly to the United States. In such cases, we ensure that appropriate safeguards are in place to protect your personal data, such as reliance on Standard Contractual Clauses (SCCs) approved by the European Commission, or the EU-U.S. Data Privacy Framework (DPF) for providers certified under this program.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">8. Data Retention</h2>
      <p className="mb-4">We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li><strong>Financial records:</strong> Data related to financial transactions (e.g., subscription invoices) will be stored for a period of 5 years from the end of the tax year in which the transaction occurred, in accordance with Polish tax and accounting regulations.</li>
        <li><strong>Marketing data:</strong> Data used for marketing purposes will be stored for up to 3 years after your last interaction with us or until you withdraw your consent, whichever comes first.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">9. Your GDPR Rights</h2>
      <p className="mb-4">Under the GDPR, you have the following rights concerning your personal data:</p>
      <p className="mb-4">Right to Access (Art. 15), Right to Rectification (Art. 16), Right to Erasure / to be Forgotten (Art. 17), Right to Restriction of Processing (Art. 18), Right to Data Portability (Art. 20), Right to Object (Art. 21), and Right to Withdraw Consent (Art. 7(3)).</p>
      <p className="mb-6">To exercise any of these rights, please contact us at <strong>contact@miterion.com</strong>.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">10. Security Measures</h2>
      <p className="mb-6">We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, accidental loss, destruction, alteration, or disclosure. These measures include data encryption, access controls, secure server infrastructure, and regular security assessments.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">11. Supervisory Authority Contact</h2>
      <p className="mb-6">
        If you have concerns, you have the right to lodge a complaint with the competent supervisory authority in Poland:<br />
        <strong>President of the Personal Data Protection Office (Prezes Urzędu Ochrony Danych Osobowych)</strong><br />
        Stawki 2, 00-193 Warsaw, Poland | Website: www.uodo.gov.pl
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">12. Governing Law</h2>
      <p className="mb-6">This Privacy Policy and all matters relating to your personal data are governed by the laws of Poland, including the GDPR and the Polish Act on the Protection of Personal Data.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">13. Changes to This Privacy Policy</h2>
      <p className="mb-6">We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on our website and updating the "Effective Date" at the top of this policy.</p>
    </div>
  );
}