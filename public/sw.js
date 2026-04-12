// SkyCast Service Worker pour Push Notifications
const CACHE_NAME = 'skycast-v1';
const STATIC_ASSETS = [
  '/',
  '/icons/icon.svg',
  '/manifest.json',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Réception des push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nouvelle alerte météo',
      icon: data.icon || '/icons/icon.svg',
      badge: '/icons/icon.svg',
      tag: data.tag || 'skycast-alert',
      requireInteraction: data.requireInteraction || false,
      data: data.data || {},
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'SkyCast',
        options
      )
    );
  } catch {
    // Fallback si le JSON est invalide
    event.waitUntil(
      self.registration.showNotification('SkyCast', {
        body: 'Nouvelle alerte météo',
        icon: '/icons/icon.svg',
      })
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Ouvrir ou focaliser l'application
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si l'app est déjà ouverte, la focaliser
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Gestion des messages depuis le client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch avec cache pour offline
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Ignorer les requêtes API
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retourner la réponse
      if (response) {
        return response;
      }

      // Sinon faire la requête réseau
      return fetch(event.request).then((response) => {
        // Ne pas cacher si la réponse n'est pas valide
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cloner la réponse pour la mettre en cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }).catch(() => {
      // Offline fallback pour les pages HTML
      if (event.request.mode === 'navigate') {
        return caches.match('/offline');
      }
    })
  );
});
