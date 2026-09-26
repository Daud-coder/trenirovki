const CACHE = 'trenirovki-v3';
const FILES = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'img/bss-0.jpg', 'img/bss-1.jpg', 'img/chin-0.jpg', 'img/chin-1.jpg', 'img/curl-0.jpg', 'img/curl-1.jpg', 'img/dbpress-0.jpg', 'img/dbpress-1.jpg', 'img/dips_bw-0.jpg', 'img/dips_bw-1.jpg', 'img/dips_w-0.jpg', 'img/dips_w-1.jpg', 'img/french-0.jpg', 'img/french-1.jpg', 'img/goblet-0.jpg', 'img/goblet-1.jpg', 'img/hammer-0.jpg', 'img/hammer-1.jpg', 'img/hang-0.jpg', 'img/hang-1.jpg', 'img/hlr-0.jpg', 'img/hlr-1.jpg', 'img/knees-0.jpg', 'img/knees-1.jpg', 'img/ohp-0.jpg', 'img/ohp-1.jpg', 'img/plank-0.jpg', 'img/plank-1.jpg', 'img/pull_wide-0.jpg', 'img/pull_wide-1.jpg', 'img/pullup_w-0.jpg', 'img/pullup_w-1.jpg', 'img/pushup_d-0.jpg', 'img/pushup_d-1.jpg', 'img/pushup_n-0.jpg', 'img/pushup_n-1.jpg', 'img/rdl-0.jpg', 'img/rdl-1.jpg', 'img/reardelt-0.jpg', 'img/reardelt-1.jpg', 'img/rlunge-0.jpg', 'img/rlunge-1.jpg', 'img/row-0.jpg', 'img/row-1.jpg', 'img/shrug-0.jpg', 'img/shrug-1.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Сначала сеть (чтобы обновления доходили), без сети — кэш
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
