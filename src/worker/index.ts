/// <reference lib="webworker" />
// Custom service worker additions — compiled by @ducanh2912/next-pwa and
// merged into the generated sw.js (alongside Workbox caching).
// This file handles Firebase Cloud Messaging background messages.

import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

declare const self: ServiceWorkerGlobalScope

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Skip if Firebase isn't configured yet (env vars not set)
if (firebaseConfig.apiKey) {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  onBackgroundMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? 'Thông báo mới'
    const body  = payload.notification?.body  ?? ''
    const icon  = payload.notification?.image ?? '/icons/icon-192.png'
    const url   = (payload.data as Record<string, string> | undefined)?.url ?? '/'

    self.registration.showNotification(title, {
      body,
      icon,
      badge: '/icons/badge-96.png',
      tag:   'push-notification',
      data:  { url },
    })
  })
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data as { url?: string })?.url ?? '/'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing tab if already open
        const existing = windowClients.find(c => c.url === url)
        if (existing) return existing.focus()
        return self.clients.openWindow(url)
      })
  )
})
