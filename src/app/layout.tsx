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
    default: "Miterion Platform | Clinical Trial Feasibility Intelligence",
    template: "%s | Miterion Platform",
  },
  description:
    "Miterion Platform helps clinical teams assess trial feasibility, recruitment competition, country strategy and vendor risk before expensive clinical trial decisions.",
  keywords: [
    "clinical trial feasibility",
    "clinical trial intelligence",
    "clinical trial landscape analysis",
    "clinical trial country selection",
    "clinical trial recruitment competition",
    "clinical operations intelligence",
    "clinical trial vendor RFP",
    "decentralized clinical trials",
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
    siteName: "Miterion Platform",
    title: "Miterion Platform | Clinical Trial Feasibility Intelligence",
    description:
      "Clinical trial feasibility intelligence for landscape analysis, recruitment competition, country strategy and vendor decision support.",
    images: [
      {
        url: "/og-miterion.png",
        width: 1200,
        height: 630,
        alt: "Miterion Platform clinical trial intelligence dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miterion Platform | Clinical Trial Feasibility Intelligence",
    description:
      "Assess clinical trial feasibility, recruitment competition and vendor risk before expensive decisions.",
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
  // Dane strukturyzowane Schema.org dla Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Miterion Platform",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": "Clinical trial feasibility intelligence for landscape analysis, recruitment competition, country strategy and vendor decision support.",
    "publisher": {
      "@type": "Organization",
      "name": "Miterion",
      "url": "https://miterion.com"
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
        <FloatingCalWidget />
        <CalInitializer />
      </body>
    </html>
  );
}