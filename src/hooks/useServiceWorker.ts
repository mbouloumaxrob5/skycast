'use client';

import { useEffect, useState } from 'react';

interface UseServiceWorkerReturn {
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  error: Error | null;
  update: () => void;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setIsUpdateAvailable(true);
              setWaitingWorker(newWorker);
            }
          });
        });

        if (registration.active) {
          setIsRegistered(true);
        }

        // Check for updates every hour
        intervalId = setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to register service worker'));
      }
    };

    registerSW();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const update = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return { isRegistered, isUpdateAvailable, error, update };
}
