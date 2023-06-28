const cacheName = "offline-cache"
const assets = [
    "/",
    "/index.html",
    "/manifest/icon-192x192.png",
    "/manifest/icon-512x512.png",
]

self.addEventListener("install", e => e.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    await cache.addAll(assets)
})()))

self.addEventListener("fetch", e => e.respondWith((async () => {
    const r = await caches.match(e.request)
    if (r) return r
    const res = await fetch(e.request)
    const cache = await caches.open(cacheName)
    await cache.put(e.request, res.clone())
    return res
})()))

self.addEventListener("activate", e => {
    e.waitUntil(caches.keys().then(keyList =>
        Promise.all(keyList.map(key => {
            if (key == cacheName) return
            return caches.delete(key)
        }))
    ))
})