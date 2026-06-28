const CACHE_NAME = "pro-document-v2";

const files = [
  "./dashboard.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache each file individually (not addAll) so a single missing
      // asset can't fail the whole install — which is what was silently
      // blocking the service worker (and the install button) before.
      return Promise.all(
        files.map(url =>
          cache.add(url).catch(err => console.warn("SW: could not cache", url, err))
        )
      );
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => response || fetch(event.request))
  );
});
