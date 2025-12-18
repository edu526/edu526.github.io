// Versión automática basada en timestamp - se actualizará en cada deploy
const BUILD_VERSION = '__BUILD_VERSION__'; // Será reemplazado por GitHub Actions
const VERSION = BUILD_VERSION !== '__BUILD_VERSION__' ? BUILD_VERSION : new Date().toISOString();
const CACHE_NAME = `calculadora-sublimacion-v${VERSION}`;
const urlsToCache = [
  '/calculadora-sublimacion/',
  '/calculadora-sublimacion/index.html',
  '/calculadora-sublimacion/css/styles.css',
  '/calculadora-sublimacion/js/app.js',
  '/calculadora-sublimacion/js/calculator.js',
  '/calculadora-sublimacion/js/bulk-discount.js',
  '/calculadora-sublimacion/js/history.js',
  '/calculadora-sublimacion/js/presets.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  // NO hacer skipWaiting automáticamente, esperar mensaje del usuario
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando archivos versión:', VERSION);
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Error al cachear archivos:', err);
        });
      })
  );
});

// Escuchar mensaje para activar la nueva versión
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  // Tomar control inmediatamente
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar control de todos los clientes inmediatamente
      return self.clients.claim();
    })
  );
});

// Estrategia: Network First para HTML/CSS/JS, Cache First para el resto
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Para archivos HTML, CSS, JS: Network First
  if (url.pathname.match(/\.(html|css|js)$/)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Si la red responde, actualiza caché
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, usa caché
          return caches.match(event.request);
        })
    );
  } else {
    // Para otros archivos: Cache First
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseToCache));
              }
              return response;
            });
        })
    );
  }
});
