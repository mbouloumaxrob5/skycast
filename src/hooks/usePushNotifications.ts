'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier le support et l'état initial
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSupport = () => {
      const supported = 
        'serviceWorker' in navigator && 
        'PushManager' in window &&
        'Notification' in window;
      
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();
  }, []);

  // Vérifier l'état de la subscription existante
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        
        setIsSubscribed(!!existingSubscription);
        setSubscription(existingSubscription);
      } catch {
        // Silencieux - pas critique
      }
    };

    checkSubscription();
  }, [isSupported]);

  // S'inscrire aux notifications
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Les notifications push ne sont pas supportées sur ce navigateur');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Demander la permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        setError('Permission de notification refusée');
        setIsLoading(false);
        return;
      }

      // Récupérer l'enregistrement du service worker
      const registration = await navigator.serviceWorker.ready;

      // S'abonner au push manager
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      setSubscription(pushSubscription);
      setIsSubscribed(true);

      // Sauvegarder la subscription sur le serveur
      await saveSubscription(pushSubscription);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la subscription';
      setError(message);
      console.error('Push subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Se désabonner
  const unsubscribe = useCallback(async () => {
    if (!subscription) return;

    setIsLoading(true);
    setError(null);

    try {
      await subscription.unsubscribe();
      setIsSubscribed(false);
      setSubscription(null);

      // Supprimer la subscription du serveur
      await deleteSubscription(subscription);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du désabonnement';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  // Envoyer une notification de test (côté client seulement)
  const sendTestNotification = useCallback(async () => {
    if (!isSubscribed || !subscription) {
      setError('Vous devez être abonné pour recevoir des notifications');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification('SkyCast - Test', {
        body: 'Les notifications fonctionnent correctement ! 🎉',
        icon: '/icons/icon.svg',
        badge: '/icons/icon.svg',
        tag: 'test',
        requireInteraction: true,
      });
    } catch {
      setError('Impossible d\'envoyer la notification de test');
    }
  }, [isSubscribed, subscription]);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
    clearError: () => setError(null),
  };
}

// Helper: Convertir la clé VAPID
function urlBase64ToUint8Array(base64String: string): BufferSource {
  if (!base64String) {
    return new Uint8Array(0) as BufferSource;
  }

  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as BufferSource;
}

// Sauvegarder la subscription sur le serveur
async function saveSubscription(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, 
            Array.from(new Uint8Array(subscription.getKey('p256dh')!)))),
          auth: btoa(String.fromCharCode.apply(null, 
            Array.from(new Uint8Array(subscription.getKey('auth')!)))),
        },
      }),
    });
  } catch {
    // Silencieux - la subscription locale fonctionne même sans serveur
  }
}

// Supprimer la subscription du serveur
async function deleteSubscription(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });
  } catch {
    // Silencieux
  }
}
