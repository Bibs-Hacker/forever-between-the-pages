// Forever Between the Pages — service worker
// Caches the APP SHELL only. Actual offline BOOK content lives in IndexedDB
// (see src/offline.js) — a shell cache is deliberately NOT treated as offline
// book reading.
const CACHE = 'fbtp-shell-v1';
const SHELL = [
  './', './index.html', './config.js',
  './src/app.js', './src/db.js', './src/auth.js', './src/reader.js', './src/offline.js',
  './manifest.webmanifest', './icons/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

// Network-first for navigation (so updates land), cache-first for shell assets.
// Supabase/API calls are never cached here — the app handles their offline path.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== location.origin) return; // let Supabase/CDN go to network
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => hit))
  );
});
