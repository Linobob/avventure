// Service worker: l'app funziona anche senza connessione (cache versionata da pubblica.py).
const CACHE = 'avventure-__VERSIONE__';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const font = /(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname);
  if (u.origin !== location.origin && !font) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(r, { ignoreSearch: r.mode === 'navigate' }) || (r.mode === 'navigate' ? await c.match('index.html') : null);
    const rete = fetch(r).then(x => { if (x && (x.ok || x.type === 'opaque')) c.put(r, x.clone()); return x; });
    if (hit) { rete.catch(() => {}); return hit; }
    return rete;
  }));
});
