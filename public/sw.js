const CACHE_NAME = 'calorie-week-view-v1.0.1';
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
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(async (response) => {
      const copy = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, copy);
      return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then(async (response) => {
    if (response.ok) {
      const copy = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, copy);
    }
    return response;
  })));
});
