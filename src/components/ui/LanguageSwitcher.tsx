'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Locale = 'fr' | 'en';

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const COOKIE_NAME = 'NEXT_LOCALE';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

export function LanguageSwitcher() {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = getCookie(COOKIE_NAME);
    if (saved === 'en' || saved === 'fr') {
      setLocaleState(saved);
    }
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);
    setCookie(COOKIE_NAME, newLocale);
    setLocaleState(newLocale);
    window.location.reload();
  };

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 p-2 rounded-xl",
          "bg-white/10 dark:bg-white/10 light:bg-white/80",
          "border border-white/20 dark:border-white/20 light:border-gray-300",
          "text-white dark:text-white light:text-gray-700",
          "hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-gray-100",
          "transition-colors"
        )}
        title={currentLocale.label}
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLocale.code.toUpperCase()}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute right-0 mt-2 py-2 rounded-xl z-50 min-w-35",
                "bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95",
                "backdrop-blur-xl",
                "border border-white/20 dark:border-white/20 light:border-gray-200",
                "shadow-2xl"
              )}
            >
              {locales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => handleLocaleChange(loc.code)}
                  className={cn(
                    "w-full px-4 py-2 flex items-center gap-3 transition-colors",
                    "hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100",
                    locale === loc.code && "bg-white/10 dark:bg-white/10 light:bg-blue-100"
                  )}
                >
                  <span className="text-lg">{loc.flag}</span>
                  <span className={cn(
                    "flex-1 text-left text-sm",
                    "text-white dark:text-white light:text-gray-900"
                  )}>
                    {loc.label}
                  </span>
                  {locale === loc.code && (
                    <Check size={16} className="text-blue-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
