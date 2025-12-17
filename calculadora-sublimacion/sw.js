const CACHE_NAME = 'calculadora-sublimacion-v1';
const urlsToCache = [
  '/calculadora-sublimacion/',
  '/calculadora-sublimacion/index.html',
  '/calculadora-sublimacion/css/styles.css',
  '/calculadora-sublimacion/js/app.js',
  '/calculadora-sublimacion/js/calculator.js',
  '/calculadora-sublimacion/js/bulk-discount.js',
  '/calculadora-sublimacion/js/history.js',
  '/calculadora-sublimacion/js/ink-calculator.js',
  '/calculadora-sublimacion/js/presets.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Error al cachear archivos:', err);
        });
      })
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia: Cache First, fallback a Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, devuelve desde caché
        if (response) {
          return response;
        }
        // Si no, intenta obtener de la red
        return fetch(event.request)
          .then(response => {
            // Si la respuesta es válida, guárdala en caché
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          });
      })
  );
});
