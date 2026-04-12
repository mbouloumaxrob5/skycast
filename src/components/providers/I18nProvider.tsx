"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import frMessages from "../../../messages/fr.json";
import enMessages from "../../../messages/en.json";

const COOKIE_NAME = 'NEXT_LOCALE';

const messagesMap = {
  fr: frMessages,
  en: enMessages,
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<keyof typeof messagesMap>('fr');
  const [messages, setMessages] = useState<typeof frMessages>(frMessages);

  useEffect(() => {
    const savedLocale = getCookie(COOKIE_NAME);
    const currentLocale = savedLocale === 'en' ? 'en' : 'fr';
    
    if (currentLocale !== locale) {
      requestAnimationFrame(() => {
        setLocale(currentLocale);
        setMessages(messagesMap[currentLocale]);
      });
    }
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
