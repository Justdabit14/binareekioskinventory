self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("stock-app-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./service-worker.js"
      ]);
    })
  );
});
const CACHE_NAME = "inventory-cache-v2";  // bump version number
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});
self.addEventListener("install", event => {
  self.skipWaiting(); // activate new SW right away
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});
