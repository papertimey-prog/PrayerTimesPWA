const CACHE_NAME = 'salah-ksa-v1';

// List of files to save for offline use
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Caching the external library so it works without internet
  'https://cdnjs.cloudflare.com/ajax/libs/adhan/3.0.0/Adhan.min.js'
];

// 1. Install Event: Saves the files into the browser's storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets for offline use');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Cleans up old versions of the app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Intercepts network requests and serves cached files
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached file if found, otherwise try the network
      return response || fetch(event.request);
    })
  );
});
