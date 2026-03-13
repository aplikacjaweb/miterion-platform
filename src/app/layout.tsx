import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CookieBanner />
        </div>
        {/* Crisp Chat Widget */}
        <script type="text/javascript">
          window.$crisp = [];
          window.CRISP_WEBSITE_ID = "YOUR_CRISP_WEBSITE_ID"; // IMPORTANT: Replace with your actual Crisp Website ID
          (function() {
            d = document;
            s = d.createElement("script");
            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);
          })();
        </script>
      </body>
    </html>
  );
}
