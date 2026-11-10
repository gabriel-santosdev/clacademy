/* Handlers de Web Push, importados pelo service worker gerado pelo Workbox.
   Mostram a notificação na barra do celular (Android, iPhone com o app instalado, desktop). */
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { title: 'CL Academy', body: event.data && event.data.text() }
  }

  const show = self.registration.showNotification(data.title || 'CL Academy', {
    body: data.body || '',
    icon: '/pwa-192.png',
    badge: '/pwa-192.png',
    tag: data.tag || undefined,
    // mesma tag: substitui a anterior mas ainda toca/vibra
    renotify: !!data.tag,
    vibrate: [80, 40, 80],
    timestamp: Date.now(),
    data: { url: data.url || '/app' },
  })

  // número de não lidas no ícone do app (Android, iOS 16.4+ instalado, desktop)
  const badge =
    typeof data.badgeCount === 'number' && self.navigator && 'setAppBadge' in self.navigator
      ? self.navigator.setAppBadge(data.badgeCount).catch(() => {})
      : Promise.resolve()

  event.waitUntil(Promise.all([show, badge]))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/app'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})
