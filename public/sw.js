// Service Worker (Versi Final yang Andal)
const CACHE_NAME = "story-explorer-v2"; // Naikkan versi cache untuk pembaruan
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Tambahkan aset-aset utama yang ingin selalu tersedia offline
  // Vite akan menghasilkan nama file yang berbeda setiap build, jadi kita akan cache saat runtime.
];

// 1. Install Service Worker dan Cache Aset Awal
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Aktifkan Service Worker dan Hapus Cache Lama
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Tangani Permintaan Jaringan (Fetch)
self.addEventListener('fetch', (event) => {
  // Gunakan strategi Cache First untuk semua permintaan GET
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request)
          .then((response) => {
            // Jika ada di cache, kembalikan dari cache
            if (response) {
              return response;
            }
            // Jika tidak, ambil dari jaringan, lalu simpan ke cache dan kembalikan
            return fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
      })
    );
  }
});


// 4. Tangani Event Push Notification
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');

  const notificationTitle = 'Story Explorer';
  const notificationOptions = {
    body: event.data.text() || 'Anda memiliki notifikasi baru!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: {
      url: '/', // URL yang akan dibuka saat notifikasi diklik
    },
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// 5. Tangani Klik pada Notifikasi
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});