/* English Colles in Lyon — service worker (offline support without stale update traps) */
const VERSION = 'eclyon-v6-shared-shell-20260722';
const CORE = [
  './', 'index.html', 'methodology.html', 'civilisation.html', 'vocabulary.html',
  'grammar.html', 'pronunciation.html', 'timelines.html', 'colle-trainer.html',
  'resources.html', 'jury-reports.html', 'progress-backup.html', 'help.html',
  'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-180.png',
  'site-core.js', 'site-shell.js', 'site-shell.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => Promise.allSettled(CORE.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function cacheResponse(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    caches.open(VERSION).then(cache => cache.put(request, response.clone()));
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);

  // Live news, podcasts and external resources must never be frozen in the cache.
  if (!sameOrigin && !isFont) return;

  const networkFirst = () => fetch(request)
    .then(response => cacheResponse(request, response))
    .catch(() => caches.match(request));

  // Pages and code/data files: network first so fixes appear immediately after upload.
  if (request.mode === 'navigate' || /\.(?:html|js|css|json)(?:\?|$)/i.test(url.pathname + url.search)) {
    event.respondWith(
      networkFirst().then(response => response || caches.match('index.html'))
    );
    return;
  }

  // Images and fonts: cache first for speed, network as fallback.
  event.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(response => cacheResponse(request, response)))
  );
});
