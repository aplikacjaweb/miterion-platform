import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
 locales: ['en', 'pl'],
 defaultLocale: 'en',
 localePrefix: 'always'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
 createNavigation(routing);

export const {locales, defaultLocale} = routing;
export type Locale = (typeof locales)[number];