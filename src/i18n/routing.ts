import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'pl'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
