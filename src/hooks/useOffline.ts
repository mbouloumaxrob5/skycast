'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot(): boolean {
  return !navigator.onLine;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useOffline() {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    isOffline,
    wasOffline: false, // Simplifié pour éviter la complexité
  };
}
