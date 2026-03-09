import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/routing';

export default createMiddleware({
  defaultLocale,
  locales,
  // 'always' = explicit /en and /pl prefixes on every URL.
  // More predictable than 'as-needed' for SaaS MVP — no edge cases
  // where /en gets silently rewritten or skipped.
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)', '/'],
};
