const CACHE_NAME = 'cups-manager-cache-v1.0.4';

const precache_list = [
  '/Store/',
  '/Store/index.html',
  '/Store/store.html',
  '/Store/manifest.json',
  '/Store/icon-192.png',
  '/Store/icon-512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker caching files:', precache_list);
        return cache.addAll(precache_list);
      })
      .catch(function(error) {
        console.error('Service Worker cache addAll failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  event.waitUntil(clients.claim());
  console.log('Service Worker activated and claimed clients.');
});

// 監聽訊息，處理跳過等待
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('SKIP_WAITING message received, calling self.skipWaiting()...');
    self.skipWaiting();
  }
}); 