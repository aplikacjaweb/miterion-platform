import FloatingCalWidget from '@/components/FloatingCalWidget';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/symbol-miterion.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <CookieBanner />
        <FloatingCalWidget />
      </body>
    </html>
  );
}