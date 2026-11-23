// Keeps the app and photos on the phone after the first visit, so the board still works on weak signal.
const V = "bydesign-v3";
const SHELL = ["./", "index.html", "styles.css", "fonts.css", "config.js", "looks.js", "art.js", "engine.js", "app.js", "bank/bank.json"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.includes("/bank/full/") || u.pathname.includes("/bank/thumb/") || u.pathname.includes("/fonts/")) {
    // photos and fonts never change: cache first
    e.respondWith(caches.open(V).then((c) => c.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }))));
    return;
  }
  // app files: network first so updates arrive, cache when offline
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(V).then((c) => c.put(e.request, copy)); } return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match("index.html"))));
});
