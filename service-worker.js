const CACHE_NAME = "inventory-cache-v3"; // bump version every deploy

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./script.js"
  // ⚠️ do NOT cache service-worker.js or CDN libs like jsPDF
];

// Install event - cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // activate new SW immediately
});

// Activate event - clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve cached files, fallback to network
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Always fetch CDN libraries (like jsPDF) fresh
  if (url.origin.includes("cdnjs")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
