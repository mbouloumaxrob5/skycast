'use client';

import { useSyncExternalStore, useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics/analyticsService';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot(): boolean {
  return typeof navigator !== 'undefined' ? !navigator.onLine : false;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useOffline() {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lastStateRef = useRef(isOffline);

  useEffect(() => {
    if (isOffline !== lastStateRef.current) {
      if (isOffline) {
        analytics.usage.offline();
      } else {
        analytics.usage.online();
      }
      lastStateRef.current = isOffline;
    }
  }, [isOffline]);

  return {
    isOffline,
    wasOffline: false, // Simplifié pour éviter la complexité
  };
}
