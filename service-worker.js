/* English Colles in Lyon — service worker (offline support) */
const VERSION = 'eclyon-v1';
const CORE = [
  './', 'index.html', 'civilisation.html', 'resources.html',
  'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-180.png'
];

// Install: pre-cache the core files (tolerant: a missing file won't break install)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache =>
      Promise.allSettled(CORE.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    const copy = response.clone();
    caches.open(VERSION).then(cache => cache.put(request, copy));
  }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;                     // only cache GET
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);

  // Live news widget & external audio (BBC, NPR...) : always go to the network,
  // never cached — offline, they simply fail and the page handles it.
  if (!sameOrigin && !isFont) return;

  // Page navigations: network first, fall back to cache, then to the home page.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => { putInCache(req, res); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // Everything else (CSS/JS/images/fonts): cache first, then network.
  event.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => { putInCache(req, res); return res; }).catch(() => hit)
    )
  );
});
