'use client';

import { useEffect } from 'react';
import { swLogger } from '@/lib/utils/logger';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Enregistrer le service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          swLogger.debug('Service Worker enregistré:', registration.scope);
        })
        .catch((error) => {
          swLogger.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    }
  }, []);

  return null;
}
