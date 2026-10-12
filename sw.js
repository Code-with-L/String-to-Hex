/**
 * HexKit service worker.
 *  · precache the shell so the app opens with no network
 *  · stale-while-revalidate for the shell, cache-first for icons
 *  · versioned cache, old caches pruned on activate
 */

const VERSION = 'hexkit-v1';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/core/convert.js',
  './js/data/units.js',
  './js/data/tools.js',
  './js/data/formats.js',
  './js/data/ascii.js',
  './js/ui/dom.js',
  './js/ui/router.js',
  './js/ui/views.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // addAll fails the whole install if any single request 404s — add
    // individually so one missing asset cannot break offline support.
    await Promise.all(PRECACHE.map((url) => cache.add(url).catch((err) => console.warn('[sw] skip', url, err.message))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: try the network briefly, fall back to the cached shell so
  // the single-page app still boots offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(SHELL);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(SHELL);
        return (await cache.match('./index.html')) ?? (await cache.match('./')) ?? Response.error();
      }
    })());
    return;
  }

  // Everything else: serve from cache, refresh in the background.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    const network = fetch(request).then(async (res) => {
      if (res && res.status === 200 && res.type === 'basic') {
        const cache = await caches.open(RUNTIME);
        cache.put(request, res.clone());
      }
      return res;
    }).catch(() => null);
    return cached ?? (await network) ?? Response.error();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
