/* English Colles in Lyon — network-first updates with exact offline fallbacks */
const VERSION = 'eclyon-v8-english-interface-20260722';
const CORE = [
  './', 'index.html', 'methodology.html', 'civilisation.html', 'vocabulary.html',
  'grammar.html', 'pronunciation.html', 'timelines.html', 'colle-trainer.html',
  'resources.html', 'jury-reports.html', 'flashcards.html', 'progress-backup.html', 'help.html',
  'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-180.png',
  'site-core.js', 'site-shell.js', 'site-shell.css',
  'daily-news.json', 'resources-feed.json', 'resources-link-status.json',
  'jury-reports-data.json', 'jury-reports-status.json', 'jury-reports-detected.json'
];
const DYNAMIC_JSON = /\/(?:daily-news|resources-feed|resources-link-status|jury-reports-status|jury-reports-detected)\.json$/i;

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

async function fetchWithTimeout(request, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(request, { signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

async function remember(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    const cache = await caches.open(VERSION);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, kind) {
  try {
    return await remember(request, await fetchWithTimeout(request));
  } catch (error) {
    const exact = await caches.match(request);
    if (exact) return exact;
    if (kind === 'navigation') {
      const home = await caches.match('index.html');
      if (home) return home;
    }
    if (kind === 'json') {
      return new Response(JSON.stringify({
        status: 'unavailable',
        message: 'No live or saved automatic content is available.'
      }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8' } });
    }
    return new Response('Temporarily unavailable', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);

  if (!sameOrigin && !isFont) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, 'navigation'));
    return;
  }

  if (sameOrigin && DYNAMIC_JSON.test(url.pathname)) {
    event.respondWith(networkFirst(request, 'json'));
    return;
  }

  if (sameOrigin && /\.(?:html|js|css|json)(?:$|\?)/i.test(url.pathname + url.search)) {
    event.respondWith(networkFirst(request, 'asset'));
    return;
  }

  event.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(response => remember(request, response)))
  );
});
