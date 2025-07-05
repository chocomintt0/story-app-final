// Service Worker for PWA functionality
const CACHE_NAME = "story-explorer-v1";
const STATIC_CACHE = "story-explorer-static-v1";
const DYNAMIC_CACHE = "story-explorer-dynamic-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/main.js",
  "/src/styles/main.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === "https://story-api.dicoding.dev") {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  const networkResponse = await fetch(request);
  const cache = await caches.open(DYNAMIC_CACHE);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
}

// =======================================================
// BAGIAN PUSH NOTIFICATION YANG DIPERBAIKI
// =======================================================

// Event listener untuk push notification
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');

  let notificationData;
  try {
    // Tombol Push dari DevTools mengirim teks biasa, bukan JSON
    const message = event.data.text();
    notificationData = {
      title: 'Push Notification',
      options: {
        body: message || 'Ini adalah notifikasi tes!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      }
    };
  } catch (e) {
    notificationData = {
      title: 'Push Notification',
      options: {
        body: 'Gagal mem-parsing data notifikasi.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      }
    };
  }

  const title = notificationData.title;
  const options = notificationData.options;

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Event listener untuk klik notifikasi
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});