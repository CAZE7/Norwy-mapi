// Service Worker für Norwy-mapi
// Version 26.2.1 - Konservatives Caching für kritische Dateien

const CACHE_VERSION = 'norwy-v26.2.1';
const CRITICAL_CACHE = 'norwy-critical-v26.2.1';
const DATA_CACHE = 'norwy-data-v26.2.1';

// Kritische App-Dateien (werden immer gecacht)
const CRITICAL_FILES = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './boot.js',
  './a11y-overrides.css'
];

// Datendateien (größere Dateien, separater Cache)
const DATA_FILES = [
  './places-data.js',
  './camper_layers.js'
];

// Installation
self.addEventListener('install', function(event) {
  console.log('[SW] Installation gestartet...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CRITICAL_CACHE).then(function(cache) {
        console.log('[SW] Cache kritische Dateien');
        return cache.addAll(CRITICAL_FILES).catch(function(err) {
          console.warn('[SW] Einige kritische Dateien konnten nicht gecacht werden:', err);
        });
      }),
      caches.open(DATA_CACHE).then(function(cache) {
        console.log('[SW] Cache Datendateien');
        return cache.addAll(DATA_FILES).catch(function(err) {
          console.warn('[SW] Einige Datendateien konnten nicht gecacht werden:', err);
        });
      })
    ]).then(function() {
      console.log('[SW] Installation erfolgreich');
      return self.skipWaiting();
    })
  );
});

// Aktivierung - Alte Caches löschen
self.addEventListener('activate', function(event) {
  console.log('[SW] Aktivierung gestartet...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Lösche alle alten Caches
          if (cacheName !== CRITICAL_CACHE && 
              cacheName !== DATA_CACHE && 
              cacheName !== CACHE_VERSION) {
            console.log('[SW] Lösche alten Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('[SW] Aktivierung erfolgreich');
      return self.clients.claim();
    })
  );
});

// Fetch - Network First für kritische Dateien, Cache Fallback für Rest
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  // Nur same-origin Requests cachen
  if (url.origin !== location.origin) {
    return;
  }
  
  // Für kritische App-Dateien: Network First (immer frisch versuchen)
  const isCritical = CRITICAL_FILES.some(function(file) {
    return url.pathname === file || url.pathname.endsWith(file);
  });
  
  if (isCritical) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Erfolgreiche Netzwerk-Antwort → Update Cache
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CRITICAL_CACHE).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(function() {
          // Netzwerk-Fehler → Fallback auf Cache
          return caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) {
              console.log('[SW] Verwende gecachte Version für:', url.pathname);
              return cachedResponse;
            }
            // Kein Cache verfügbar
            return new Response('Offline - Datei nicht verfügbar', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
        })
    );
    return;
  }
  
  // Für Datendateien: Cache First (Performance)
  const isDataFile = DATA_FILES.some(function(file) {
    return url.pathname === file || url.pathname.endsWith(file);
  });
  
  if (isDataFile) {
    event.respondWith(
      caches.match(event.request).then(function(cachedResponse) {
        if (cachedResponse) {
          // Cache vorhanden → sofort zurückgeben
          // Im Hintergrund aktualisieren
          fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
              caches.open(DATA_CACHE).then(function(cache) {
                cache.put(event.request, response);
              });
            }
          }).catch(function() {
            // Hintergrund-Update fehlgeschlagen, ignorieren
          });
          
          return cachedResponse;
        }
        
        // Kein Cache → Netzwerk
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DATA_CACHE).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }
  
  // Für alle anderen Requests: Network only (z.B. externe APIs, Tiles)
  // Kein Caching von Karten-Tiles oder externen Ressourcen
});

// Nachrichten von der App empfangen
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('[SW] Lösche Cache auf Anfrage:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        console.log('[SW] Alle Caches gelöscht');
      })
    );
  }
});
