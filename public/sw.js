const CACHE_NAME = 'app-cache-v1'
const ASSETS_TO_CACHE = ['/', '/manifest.webmanifest', '/icons/icon-192x192.png', '/icons/icon-512x512.png']

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key)
        })
      )
    )
  )
})

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    )
  } else {
    e.respondWith(
      caches.match(e.request).then(resp => resp || fetch(e.request))
    )
  }
})
