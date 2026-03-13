import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Miterion',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Terms & Conditions for Miterion</h1>
      <p className="text-gray-500 mb-8">Effective Date: March 13, 2026</p>

      <div className="prose max-w-none space-y-6 text-gray-700">
        <p>These Terms & Conditions ("Terms") govern your use of the services provided by Miterion, operated by Senolix Longevity P.S.A., located at ul. Strzałowa 17p/3, 87-100 Toruń, Poland, email: contact@miterion.com ("Miterion", "we", "us", or "our"). By accessing or using our services, you agree to be bound by these Terms.</p>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">1. Services Provided</h2>
          <p>Miterion offers the following services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Clinical Landscape Snapshots:</strong> Comprehensive reports providing an overview of the clinical landscape for specified areas.</li>
            <li><strong>RFP Harmonization:</strong> Services aimed at streamlining and harmonizing Request for Proposal (RFP) processes.</li>
            <li><strong>DCT Dashboard (Upcoming):</strong> A forthcoming dashboard for managing and monitoring Decentralized Clinical Trials.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">2. User Obligations and Prohibited Activities</h2>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">2.1. User Obligations:</h3>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate and complete information when requested.</li>
            <li>Use the services only for lawful purposes and in accordance with these Terms.</li>
            <li>Maintain the confidentiality of any access credentials provided to you.</li>
            <li>Comply with all applicable local, national, and international laws and regulations.</li>
          </ul>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">2.2. Prohibited Activities:</h3>
          <p>You are expressly prohibited from:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Attempting to gain unauthorized access to our systems or services.</li>
            <li>Interfering with or disrupting the integrity or performance of the services.</li>
            <li>Reproducing, duplicating, copying, selling, reselling, or exploiting any portion of the services or content without our express written permission.</li>
            <li>Using the services to transmit any harmful, unlawful, defamatory, or obscene material.</li>
            <li>Engaging in any activity that could damage, disable, overburden, or impair any Miterion server or the networks connected to any Miterion server.</li>
            <li>Reverse engineering, decompiling, or disassembling any software or proprietary information used in connection with the services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">3. Payment Terms for RFP Harmonization</h2>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">3.1. Fees:</h3>
          <p>Fees for RFP Harmonization services will be communicated to you prior to the commencement of work and are subject to a separate agreement or quotation.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">3.2. Invoicing and Payment:</h3>
          <p>Invoices will be issued in accordance with the agreed payment schedule. Payment is due within the period specified on the invoice.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">3.3. Late Payments:</h3>
          <p>Miterion reserves the right to charge interest on overdue amounts at the maximum rate permitted by Polish law. Services may be suspended or terminated for non-payment.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">4. Intellectual Property Rights</h2>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">4.1. Miterion IP:</h3>
          <p>All intellectual property rights in and to the Miterion platform, services, content (excluding your data), trademarks, logos, and any underlying technology are and shall remain the exclusive property of Senolix Longevity P.S.A.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">4.2. License to User:</h3>
          <p>Miterion grants you a limited, non-exclusive, non-transferable, revocable license to access and use the services and any deliverables solely for your internal business purposes, subject to these Terms.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">4.3. Your Data:</h3>
          <p>You retain all intellectual property rights in the data, information, or content that you provide or upload to our services. You grant Miterion a worldwide, royalty-free license to use, process, and store your data solely for the purpose of providing the services to you.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">5. Liability Limitations</h2>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">5.1. Disclaimer:</h3>
          <p>The services are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">5.2. Limitation of Liability:</h3>
          <p>To the fullest extent permitted by applicable law, Miterion, its affiliates, directors, employees, or agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the services; (ii) any conduct or content of any third party on the services; (iii) any content obtained from the services; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">5.3. Maximum Liability:</h3>
          <p>In no event shall the aggregate liability of Miterion for all claims relating to the services exceed the amount you paid to Miterion for the services in the twelve (12) months preceding the claim.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">6. Termination Conditions</h2>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">6.1. Termination by User:</h3>
          <p>You may terminate your use of the services at any time by notifying Miterion via email.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">6.2. Termination by Miterion:</h3>
          <p>We may terminate or suspend your access to all or part of the services, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach these Terms.</p>
          <h3 className="text-xl font-semibold text-navy mt-4 mb-2">6.3. Effect of Termination:</h3>
          <p>Upon termination, your right to use the services will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">7. Governing Law and Jurisdiction</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of <strong>Poland</strong>, without regard to its conflict of law provisions. Any dispute, controversy, or claim arising out of or in connection with these Terms or the services shall be subject to the exclusive jurisdiction of the courts located in <strong>Toruń, Poland</strong>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-navy mb-3">8. Amendment Process</h2>
          <p>Miterion reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the services.</p>
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
