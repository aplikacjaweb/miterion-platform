import type { Metadata } from "next";
import CalInitializer from '@/components/CalInitializer';
import FloatingCalWidget from '@/components/FloatingCalWidget';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL("https://miterion.com"),
  title: {
    default: "Miterion | Independent Pre-Feasibility Intelligence for Biotech Sponsors",
    template: "%s | Miterion",
  },
  description:
    "Independent pre-feasibility intelligence for biotech sponsors before CRO assumptions become expensive mistakes. Review public trial data, recruitment competition and vendor proposal assumptions before country selection, formal feasibility or CRO contracts.",
  keywords: [
    "clinical trial feasibility intelligence",
    "clinical trial landscape analysis",
    "clinical trial site feasibility report",
    "clinical trial country selection",
    "clinical trial recruitment competition analysis",
    "clinical operations intelligence",
    "clinical trial vendor RFP comparison",
    "independent pre-feasibility intelligence",
    "CRO proposal review",
    "clinical trial risk assessment",
    "before CRO feasibility",
    "biotech feasibility report",
    "CRO RFP comparison",
    "public trial registry analysis",
  ],
  authors: [{ name: "Miterion" }],
  creator: "Miterion",
  publisher: "Miterion",
  alternates: {
    canonical: "https://miterion.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://miterion.com",
    siteName: "Miterion",
    title: "Miterion | Independent Pre-Feasibility Intelligence for Biotech Sponsors",
    description:
      "Independent pre-feasibility intelligence for biotech sponsors. Review public trial data, visible recruitment competition and vendor proposal assumptions before country selection, formal feasibility or CRO contracts.",
    images: [
      {
        url: "/og-miterion.png",
        width: 1200,
        height: 630,
        alt: "Miterion - Independent Clinical Trial Intelligence Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miterion | Independent Pre-Feasibility Intelligence for Biotech Sponsors",
    description:
      "Independent intelligence before CRO assumptions become expensive mistakes. Review public trial data, visible recruitment competition and vendor proposal assumptions.",
    images: ["/og-miterion.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Miterion",
    "url": "https://miterion.com",
    "description": "Independent pre-feasibility intelligence for biotech sponsors before CRO assumptions become expensive mistakes. Review public trial data, recruitment competition and vendor proposal assumptions before country selection, formal feasibility or CRO contracts.",
    "serviceType": [
      "Pre-Feasibility Decision Memo",
      "CRO Proposal Risk Review",
      "Clinical Trial Landscape Analysis"
    ],
    "areaServed": {
      "@type": "Country",
      "name": ["United States", "European Union", "United Kingdom", "Global"]
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/symbol-miterion.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <CookieBanner />
        <CalInitializer />
      </body>
    </html>
  );
}