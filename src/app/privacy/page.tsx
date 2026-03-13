import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Miterion',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy for Miterion</h1>
      <p className="text-gray-500 mb-8">Effective Date: March 13, 2026</p>

      <div className="prose max-w-none space-y-6 text-gray-700">
        <p>This Privacy Policy explains how Miterion ("we," "us," or "our"), operated by Senolix Longevity P.S.A., located at ul. Strzałowa 17p/3, 87-100 Toruń, Poland, email: contact@miterion.com, NIP: 9562386305, collects, uses, and discloses your personal data in connection with your use of our website (miterion.com) and services. We are committed to protecting your privacy and handling your personal data in an open and transparent manner, in accordance with the General Data Protection Regulation (GDPR) (EU) 2016/679.</p>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">1. Personal Data We Collect</h2>
          <p>We collect personal data that you provide to us directly, as well as data automatically collected during your use of our website.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">Data you provide:</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>For order processing:</strong> Name, surname, shipping address, billing address, email address, phone number, payment information.</li>
            <li><strong>For marketing purposes:</strong> Email address, name, interests (if provided), to send you newsletters, promotional offers, and updates.</li>
            <li><strong>For analytics:</strong> Information about your interaction with our website.</li>
          </ul>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">Automatically collected data:</h3>
          <p>IP address, browser type, operating system, referral URLs, pages visited, and other browsing activity. This data is primarily collected through cookies and similar technologies for analytics and website functionality.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">2. Legal Basis for Processing (Art. 6 GDPR)</h2>
          <p>We process your personal data based on the following legal grounds:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Performance of a contract (Art. 6(1)(b) GDPR):</strong> When you place an order or request services from us, we process your data to fulfill our contractual obligations.</li>
            <li><strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> We process data for our legitimate business interests, such as improving our website, preventing fraud, and conducting analytics, provided that these interests do not override your fundamental rights and freedoms.</li>
            <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> For certain marketing activities and the use of specific types of cookies, we rely on your explicit consent. You have the right to withdraw your consent at any time.</li>
            <li><strong>Legal obligation (Art. 6(1)(c) GDPR):</strong> We process data to comply with legal obligations, such as tax and accounting requirements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">3. How We Use Your Personal Data</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Order Processing:</strong> To process and fulfill your orders, manage payments, and provide customer support related to your purchases.</li>
            <li><strong>Marketing:</strong> To send you marketing communications about our products, services, and promotions, if you have given us your consent.</li>
            <li><strong>Analytics:</strong> To understand how users interact with our website, identify trends, and improve our services and user experience.</li>
            <li><strong>Website Functionality:</strong> To ensure the proper functioning of our website and personalize your experience.</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">4. Cookies and Similar Technologies</h2>
          <p>Our website uses cookies and similar technologies (like Google Analytics and Facebook Pixel) to enhance your experience, analyze site usage, and support our marketing efforts.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Session Cookies:</strong> These are temporary and expire when you close your browser. They are essential for the proper functioning of the website (e.g., keeping you logged in).</li>
            <li><strong>Google Analytics:</strong> Used to collect information about how visitors use our site, including the number of visitors, where they have come from, and the pages they visited. This helps us improve our website.</li>
            <li><strong>Facebook Pixel:</strong> Used to track conversions from Facebook ads, optimize ads, build targeted audiences, and re-market to people who have already taken some action on our website.</li>
          </ul>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">Managing Your Cookies:</h3>
          <p>Most web browsers allow you to control cookies through their settings. You can usually:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>View what cookies are set and delete them.</li>
            <li>Block third-party cookies.</li>
            <li>Block cookies from specific sites.</li>
            <li>Block all cookies from being set.</li>
          </ul>
          <p className="mt-2">Please note that disabling cookies may affect the functionality of our website and your ability to use certain features. For more information on how to manage cookies, refer to your browser's help documentation. You can also visit websites like www.allaboutcookies.org for comprehensive guides.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">5. Sharing Your Personal Data</h2>
          <p>We may share your personal data with the following categories of third parties:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Payment Processors:</strong> To facilitate secure payment transactions (e.g., Stripe, PayPal). These entities process your payment details directly and are subject to their own privacy policies.</li>
            <li><strong>Hosting Providers:</strong> Our website data and infrastructure are hosted by third-party providers such as Vercel and Supabase. They process data on our behalf to ensure the availability and performance of our services.</li>
            <li><strong>Analytics Providers:</strong> Google Analytics helps us analyze website traffic and user behavior. The data shared is typically anonymized or aggregated where possible.</li>
            <li><strong>Marketing and Advertising Partners:</strong> Facebook Pixel is used to deliver targeted advertisements and measure the effectiveness of our marketing campaigns.</li>
            <li><strong>Email Communication Services:</strong> We use Resend to send transactional and marketing emails.</li>
          </ul>
          <p className="mt-2">We ensure that all third parties with whom we share your data are committed to protecting your privacy and handle your data in accordance with GDPR requirements.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">6. International Data Transfers</h2>
          <p>Some of our third-party service providers, such as Google Analytics and Facebook Pixel, may transfer data outside the European Union (EU), particularly to the United States. In such cases, we ensure that appropriate safeguards are in place to protect your personal data, such as reliance on <strong>Standard Contractual Clauses (SCCs)</strong> approved by the European Commission, or other legally recognized mechanisms providing an adequate level of data protection.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">7. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Financial records:</strong> Data related to financial transactions (e.g., orders, invoices) will be stored for a period of <strong>5 years</strong> from the end of the tax year in which the transaction occurred, in accordance with Polish tax and accounting regulations.</li>
            <li><strong>Marketing data:</strong> Data used for marketing purposes will be stored for up to <strong>3 years</strong> after your last interaction with us or until you withdraw your consent, whichever comes first.</li>
            <li><strong>Other data:</strong> Other personal data will be retained for periods necessary to fulfill the specific purposes of processing, after which it will be securely deleted or anonymized.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">8. Your GDPR Rights</h2>
          <p>Under the GDPR, you have the following rights concerning your personal data:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Right to Access (Art. 15 GDPR):</strong> You have the right to request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Rectification (Art. 16 GDPR):</strong> You have the right to request that we correct any inaccurate or incomplete personal data.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten") (Art. 17 GDPR):</strong> You have the right to request the deletion of your personal data under certain circumstances.</li>
            <li><strong>Right to Restriction of Processing (Art. 18 GDPR):</strong> You have the right to request that we restrict the processing of your personal data under certain conditions.</li>
            <li><strong>Right to Data Portability (Art. 20 GDPR):</strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit that data to another controller.</li>
            <li><strong>Right to Object (Art. 21 GDPR):</strong> You have the right to object to the processing of your personal data, particularly when processing is based on legitimate interests or for direct marketing purposes.</li>
            <li><strong>Right to Withdraw Consent (Art. 7(3) GDPR):</strong> Where processing is based on your consent, you have the right to withdraw your consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, please contact us at contact@miterion.com. We will respond to your request in accordance with applicable data protection laws.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">9. Security Measures</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, accidental loss, destruction, alteration, or disclosure. These measures include data encryption, access controls, secure server infrastructure, and regular security assessments. While we strive to protect your personal data, no method of transmission over the internet or method of electronic storage is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">10. Contact Details for the Supervisory Authority</h2>
          <p>If you have concerns about our processing of your personal data, you have the right to lodge a complaint with the competent supervisory authority in Poland:</p>
          <address className="not-italic mt-2">
            <strong>President of the Personal Data Protection Office (Prezes Urzędu Ochrony Danych Osobowych)</strong><br />
            Stawki 2<br />
            00-193 Warsaw<br />
            Poland<br />
            Phone: +48 22 531 03 00<br />
            Website: <a href="https://www.uodo.gov.pl" className="text-teal hover:underline">www.uodo.gov.pl</a>
          </address>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">11. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new Privacy Policy on our website and updating the "Effective Date" at the top of this policy.</p>
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
