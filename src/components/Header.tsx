'use client';

import { usePathname, Link, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-navy">
          Miterion
        </Link>

        <div className="flex items-center space-x-4">
          {/* Locale switcher using next-intl router instead of manual href building */}
          <Link
            href={pathname}
            locale="en"
            className={`text-sm ${locale === 'en' ? 'font-bold text-teal' : 'text-gray-600 hover:text-navy'}`}
          >
            EN
          </Link>
          <Link
            href={pathname}
            locale="pl"
            className={`text-sm ${locale === 'pl' ? 'font-bold text-teal' : 'text-gray-600 hover:text-navy'}`}
          >
            PL
          </Link>
        </div>
      </div>
    </header>
  );
}
