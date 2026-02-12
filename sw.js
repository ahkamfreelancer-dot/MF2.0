const CACHE_NAME = 'mamboly-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Installation du Service Worker et mise en cache des fichiers
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des fichiers');
        return cache.addAll(ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Tous les fichiers sont mis en cache');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors de la mise en cache:', error);
      })
  );
});

// Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Stratégie : Cache First, puis Network (pour que l'app marche sans internet)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne depuis le cache si disponible
        if (response) {
          return response;
        }
        
        // Sinon, fait une requête réseau
        return fetch(event.request)
          .then((response) => {
            // Vérifie si la réponse est valide
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Clone la réponse car elle ne peut être utilisée qu'une fois
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Erreur de fetch:', error);
            // Retourne une réponse par défaut en cas d'erreur
            return caches.match('./index.html');
          });
      })
  );
});
