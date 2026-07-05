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
  metadataBase: new URL("https://www.miterion.com"),
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
    canonical: "https://www.miterion.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.miterion.com",
    siteName: "Miterion",
    title: "Miterion | Independent Pre-Feasibility Intelligence for Biotech Sponsors",
    description:
      "Independent pre-feasibility intelligence for biotech sponsors. Review public trial data, visible recruitment competition and vendor proposal assumptions before country selection, formal feasibility or CRO contracts.",
    images: [
      {
        url: "/landingshot",
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
    images: ["/landingshot.png"],
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
    "url": "https://www.miterion.com",
    "description":
      "Independent pre-feasibility intelligence for biotech sponsors before CRO assumptions become expensive mistakes. Review public trial data, recruitment competition and vendor proposal assumptions before country selection, formal feasibility or CRO contracts.",
    "serviceType": "Clinical trial pre-feasibility intelligence",
    "audience": {
      "@type": "Audience",
      "audienceType": "Biotech sponsors, clinical operations teams, medtech sponsors",
    },
    "areaServed": [
      { "@type": "Country", "name": "United States" },
      { "@type": "AdministrativeArea", "name": "European Union" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Place", "name": "Global" },
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Miterion review options",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Free Trial Landscape Snapshot",
          "itemOffered": {
            "@type": "Service",
            "name": "Free Trial Landscape Snapshot",
            "description":
              "A first-pass public registry signal for visible clinical trial activity, recruitment competition and landscape density.",
          },
        },
        {
          "@type": "Offer",
          "name": "Pre-Feasibility Decision Memo",
          "price": "2500",
          "priceCurrency": "EUR",
          "itemOffered": {
            "@type": "Service",
            "name": "Pre-Feasibility Decision Memo",
            "description":
              "A board-ready decision memo for sponsors before country selection, CRO feasibility or vendor commitment.",
          },
        },
        {
          "@type": "Offer",
          "name": "CRO Proposal Risk Review",
          "price": "3500",
          "priceCurrency": "EUR",
          "itemOffered": {
            "@type": "Service",
            "name": "CRO Proposal Risk Review",
            "description":
              "Independent review of CRO or vendor proposals before signature, including scope gaps, assumption risks and timeline realism.",
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/symbol-miterion" type="image/png" />
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
