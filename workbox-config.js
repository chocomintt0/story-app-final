// tes/workbox-config.js
export default {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,ico,woff,woff2,ttf,eot,json}'
  ],
  swDest: 'dist/sw.js', // File output akan berada di dalam folder dist
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'story-api-cache',
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/unpkg\.com\/leaflet/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'leaflet-cache',
      },
    },
    {
      urlPattern: /^https:\/\/picsum\.photos/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        },
      },
    },
  ],
  skipWaiting: true,
  clientsClaim: true,
};