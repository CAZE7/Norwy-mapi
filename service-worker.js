const CACHE = 'norwegen-mobile-v3';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.origin === self.location.origin) {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put('./index.html', response.clone()));
          return response;
        }).catch(() => caches.match('./index.html'))
      );
      return;
    }
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
      )
    );
    return;
  }

  if (/tile\.openstreetmap|upload\.wikimedia|cloudinary/.test(url.hostname)) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request, { mode: 'no-cors' }).then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        }).catch(() => cached)
      )
    );
  }
});