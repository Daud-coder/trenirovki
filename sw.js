const CACHE = 'trenirovki-v4';
const FILES = ['./', 'index.html', 'styles.css', 'lib.js', 'app.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'img/abwheel-0.jpg', 'img/abwheel-1.jpg', 'img/arnold-0.jpg', 'img/arnold-1.jpg', 'img/bench_dips-0.jpg', 'img/bench_dips-1.jpg', 'img/bss-0.jpg', 'img/bss-1.jpg', 'img/calf-0.jpg', 'img/calf-1.jpg', 'img/calf_seated-0.jpg', 'img/calf_seated-1.jpg', 'img/chin-0.jpg', 'img/chin-1.jpg', 'img/conc_curl-0.jpg', 'img/conc_curl-1.jpg', 'img/crunch-0.jpg', 'img/crunch-1.jpg', 'img/curl-0.jpg', 'img/curl-1.jpg', 'img/db_squat-0.jpg', 'img/db_squat-1.jpg', 'img/dbpress-0.jpg', 'img/dbpress-1.jpg', 'img/dips_bw-0.jpg', 'img/dips_bw-1.jpg', 'img/dips_chest-0.jpg', 'img/dips_chest-1.jpg', 'img/dips_w-0.jpg', 'img/dips_w-1.jpg', 'img/farmer-0.jpg', 'img/farmer-1.jpg', 'img/fly-0.jpg', 'img/fly-1.jpg', 'img/french-0.jpg', 'img/french-1.jpg', 'img/front_raise-0.jpg', 'img/front_raise-1.jpg', 'img/glute_bridge-0.jpg', 'img/glute_bridge-1.jpg', 'img/goblet-0.jpg', 'img/goblet-1.jpg', 'img/hammer-0.jpg', 'img/hammer-1.jpg', 'img/hang-0.jpg', 'img/hang-1.jpg', 'img/hlr-0.jpg', 'img/hlr-1.jpg', 'img/kickback-0.jpg', 'img/kickback-1.jpg', 'img/knees-0.jpg', 'img/knees-1.jpg', 'img/lateral-0.jpg', 'img/lateral-1.jpg', 'img/oblique-0.jpg', 'img/oblique-1.jpg', 'img/oh_ext1-0.jpg', 'img/oh_ext1-1.jpg', 'img/ohp-0.jpg', 'img/ohp-1.jpg', 'img/plank-0.jpg', 'img/plank-1.jpg', 'img/pull_wide-0.jpg', 'img/pull_wide-1.jpg', 'img/pullover-0.jpg', 'img/pullover-1.jpg', 'img/pullup_w-0.jpg', 'img/pullup_w-1.jpg', 'img/pushup_d-0.jpg', 'img/pushup_d-1.jpg', 'img/pushup_n-0.jpg', 'img/pushup_n-1.jpg', 'img/pushup_wide-0.jpg', 'img/pushup_wide-1.jpg', 'img/rdl-0.jpg', 'img/rdl-1.jpg', 'img/reardelt-0.jpg', 'img/reardelt-1.jpg', 'img/rlunge-0.jpg', 'img/rlunge-1.jpg', 'img/row-0.jpg', 'img/row-1.jpg', 'img/row2-0.jpg', 'img/row2-1.jpg', 'img/russian-0.jpg', 'img/russian-1.jpg', 'img/scap-0.jpg', 'img/scap-1.jpg', 'img/shrug-0.jpg', 'img/shrug-1.jpg', 'img/side_plank-0.jpg', 'img/side_plank-1.jpg', 'img/sl_glute-0.jpg', 'img/sl_glute-1.jpg', 'img/sl_rdl-0.jpg', 'img/sl_rdl-1.jpg', 'img/stepup-0.jpg', 'img/stepup-1.jpg', 'img/superman-0.jpg', 'img/superman-1.jpg', 'img/walk_lunge-0.jpg', 'img/walk_lunge-1.jpg', 'img/wrist_curl-0.jpg', 'img/wrist_curl-1.jpg', 'img/zottman-0.jpg', 'img/zottman-1.jpg'];

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
