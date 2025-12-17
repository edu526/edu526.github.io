const CACHE_NAME = 'piano-app-v1';
const urlsToCache = [
  '/piano/',
  '/piano/index.html',
  '/piano/css/styles.css',
  '/piano/css/modules/animations.css',
  '/piano/css/modules/audio-controls.css',
  '/piano/css/modules/chord-cards.css',
  '/piano/css/modules/finger-indicators.css',
  '/piano/css/modules/piano.css',
  '/piano/css/modules/utilities.css',
  '/piano/js/app.js',
  '/piano/js/audio.js',
  '/piano/js/audio-utils.js',
  '/piano/js/piano.js',
  '/piano/js/ui-init.js',
  '/piano/js/ui-utils.js',
  '/piano/js/utils.js',
  '/piano/data/chords.js',
  '/piano/config/audio-config.js'
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

// Estrategia: Network First para archivos locales, Cache First para CDN
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Para recursos externos (CDN), usa Cache First
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
    return;
  }

  // Para archivos locales, usa Network First
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
