const APP = {
    version: "v1.7.0-beta",
    author: "Kevkidev",
}

const CACHE_NAME = 'kmanager-cache-' + APP.version;
const FILES_TO_CACHE = [ // liste des fichiers que le service worker doit mettre en cache au moment de l'installation.
    'index.html',
    'planning/index.html', // attention : il faut bien mettre le ...index.html dans la bar d'url
    'compta/index.html', // attention : il faut bien mettre le ...index.html dans la bar d'url
    'notes/index.html', // attention : il faut bien mettre le ...index.html dans la bar d'url
];

// installation
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME) // ouvrir le cache
            .then(cache => cache.addAll(FILES_TO_CACHE)) // ajoute dans le cache tous les fichiers listés
    );
    self.skipWaiting(); // active le Service Worker immédiatement sans attendre que l’ancien soit supprimé
});

// Nettoyer les anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList =>
            Promise.all(keyList.map(key => { // recuperer tous les caches en supprimant ceux != de CACHE_NAME
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }))
        )
    );
    self.clients.claim(); // prend le controle des pages
});

// interception des requetes http
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request) // parcourrir le cache
            .then(response => {
                // Si le fichier est dans le cache, on le retourne
                if (response) return response;
                // Sinon, on tente un fetch réseau
                return fetch(event.request).catch(err => {
                    // Si le fetch échoue et que c’est une requête de navigation (HTML), on retourne index.html
                    if (event.request.mode === 'navigate') {
                        return caches.match('index.html');
                    }
                    // Sinon on retourne une réponse vide ou une fallback (optionnelle)
                    return new Response('Offline', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
            })
    );
});