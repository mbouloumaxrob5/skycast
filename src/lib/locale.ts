'use server';

import { cookies } from 'next/headers';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';
const DEFAULT_LOCALE = 'fr';
const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export async function getUserLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME)?.value;
  
  if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
    return locale as Locale;
  }
  
  return DEFAULT_LOCALE;
}

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
}
