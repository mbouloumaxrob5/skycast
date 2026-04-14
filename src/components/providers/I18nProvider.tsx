'use client';

import { useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import frMessages from '../../../messages/fr.json';
import enMessages from '../../../messages/en.json';

const COOKIE_NAME = 'NEXT_LOCALE';

const messagesMap = {
  fr: frMessages,
  en: enMessages,
};

type Locale = keyof typeof messagesMap;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Toujours commencer avec 'fr' pour éviter le mismatch SSR/hydratation
  const [locale, setLocale] = useState<Locale>('fr');
  const [messages, setMessages] = useState<typeof frMessages>(frMessages);

  // Synchroniser avec le cookie uniquement après montage client
  useEffect(() => {
    const savedLocale = getCookie(COOKIE_NAME);
    if (savedLocale && savedLocale !== 'fr') {
      const currentLocale = savedLocale === 'en' ? 'en' : 'fr';
      // Utiliser requestAnimationFrame pour éviter setState synchrone
      requestAnimationFrame(() => {
        setLocale(currentLocale);
        setMessages(messagesMap[currentLocale]);
      });
    }
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}