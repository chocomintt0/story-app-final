// Service Worker for PWA functionality
const CACHE_NAME = "story-explorer-v1"
const STATIC_CACHE = "story-explorer-static-v1"
const DYNAMIC_CACHE = "story-explorer-dynamic-v1"

// Static assets to cache
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/main.js",
  "/src/styles/main.css",
  "/src/app/App.js",
  "/src/models/StoryModel.js",
  "/src/services/IndexedDBService.js",
  "/src/services/PushNotificationService.js",
  "/src/services/PWAService.js",
  "/src/utils/Icons.js",
  "/src/views/AppView.js",
  "/src/views/HomeView.js",
  "/src/views/AddStoryView.js",
  "/src/views/LoginView.js",
  "/src/views/FavoritesView.js",
  "/src/views/NotFoundView.js",
  "/src/presenters/HomePresenter.js",
  "/src/presenters/AddStoryPresenter.js",
  "/src/presenters/LoginPresenter.js",
  "/src/presenters/FavoritesPresenter.js",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("Static assets cached successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Failed to cache static assets:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Handle API requests with Network First strategy
  if (url.origin === "https://story-api.dicoding.dev") {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Handle static assets with Cache First strategy
  if (STATIC_ASSETS.includes(request.url) || url.pathname.includes("/src/")) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Handle images with Cache First strategy
  if (request.destination === "image") {
    event.respondWith(cacheFirstStrategy(request, DYNAMIC_CACHE))
    return
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      caches
        .match("/index.html")
        .then((response) => {
          return response || fetch(request)
        })
        .catch(() => {
          return caches.match("/index.html")
        }),
    )
    return
  }

  // Default: try cache first, then network
  event.respondWith(cacheFirstStrategy(request, DYNAMIC_CACHE))
})

// Network First Strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("Network failed, trying cache:", request.url)

    // Fallback to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page for failed API requests
    return new Response(
      JSON.stringify({
        error: true,
        message: "You are offline. Please check your connection.",
        offline: true,
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// Cache First Strategy (for static assets)
async function cacheFirstStrategy(request, cacheName = STATIC_CACHE) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fallback to network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(cacheName)
