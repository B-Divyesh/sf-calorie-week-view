const CACHE_NAME = 'calorie-week-view-v1.0.6';
const SHELL = [
  '/', '/app', '/demo', '/privacy', '/terms', '/offline.html', '/static.css',
  '/manifest.webmanifest', '/icons/favicon.svg', '/icons/icon-192.png',
  '/icons/icon-512.png', '/fonts/atkinson-regular.woff2', '/fonts/atkinson-bold.woff2',
  '/art/weekly-terrain.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(SHELL.map(async (path) => {
      const response = await fetch(path, { cache: 'reload' });
      if (!response.ok) throw new Error(`Could not cache ${path}`);
      await cache.put(path, response);
    }));
    const html = await (await fetch('/', { cache: 'reload' })).text();
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
    await Promise.all(builtAssets.map(async (path) => {
      const response = await fetch(path, { cache: 'reload' });
      if (!response.ok) throw new Error(`Could not cache ${path}`);
      await cache.put(path, response);
    }));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    // The cache key is the stable path, not the browser's conditional request.
    // That makes a controlled reload deterministic when the browser is offline.
    const cached = await cache.match(event.request, { ignoreSearch: true, ignoreVary: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') {
        return (await cache.match('/', { ignoreVary: true })) || (await cache.match('/offline.html', { ignoreVary: true }));
      }
      throw error;
    }
  })());
});
