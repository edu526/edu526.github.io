// Versión automática basada en timestamp - se actualizará en cada deploy
const BUILD_VERSION = '20251218.033923-736eec0'; // Será reemplazado por GitHub Actions
const VERSION = BUILD_VERSION !== '20251218.033923-736eec0' ? BUILD_VERSION : new Date().toISOString();
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
  console.log('[SW] Instalando Service Worker versión:', VERSION);
  // NO hacer skipWaiting automáticamente, esperar mensaje del usuario
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando archivos versión:', VERSION);
        return cache.addAll(urlsToCache).catch(err => {
          console.error('[SW] Error al cachear archivos:', err);
        });
      })
  );
});

// Escuchar mensaje para activar la nueva versión
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Recibido mensaje SKIP_WAITING, activando nueva versión');
    self.skipWaiting();
  }
  
  // Responder con información de versión
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ 
      type: 'VERSION_INFO', 
      version: VERSION 
    }) || event.source?.postMessage({ 
      type: 'VERSION_INFO', 
      version: VERSION 
    });
  }
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker versión:', VERSION);
  // Tomar control inmediatamente
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar control de todos los clientes inmediatamente
      console.log('[SW] Tomando control de todos los clientes');
      return self.clients.claim();
    })
  );
});

// Estrategia: Network First con timeout para HTML/CSS/JS (mejor para Android)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Para archivos HTML, CSS, JS: Network First con timeout
  if (url.pathname.match(/\.(html|css|js)$/) || url.pathname === '/calculadora-sublimacion/' || url.pathname === '/calculadora-sublimacion') {
    event.respondWith(
      // Intentar red con timeout de 3 segundos
      Promise.race([
        fetch(event.request)
          .then(response => {
            // Si la red responde, actualiza caché
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          }),
        new Promise((resolve, reject) => 
          setTimeout(() => reject(new Error('timeout')), 3000)
        )
      ])
      .catch(() => {
        // Si falla la red o timeout, usa caché
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // Si tampoco hay caché, intentar red sin timeout
            return fetch(event.request);
          });
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
