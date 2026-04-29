// Firebase client — runs in the browser only.
// Import this only from client components / client-side code.

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getMessaging, getToken, type Messaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function isConfigured(): boolean {
  return !!firebaseConfig.apiKey && !!firebaseConfig.messagingSenderId
}

let _app: FirebaseApp | null = null
let _messaging: Messaging | null = null

function getApp(): FirebaseApp | null {
  if (!isConfigured()) return null
  if (!_app) _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  return _app
}

function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null
  const app = getApp()
  if (!app) return null
  if (!_messaging) _messaging = getMessaging(app)
  return _messaging
}

export type SubscribeResult =
  | { ok: true;  token: string }
  | { ok: false; reason: 'unsupported' | 'denied' | 'no_config' | 'error'; message?: string }

// Request permission → get FCM token → subscribe to /topics/all via API
export async function subscribePushNotifications(): Promise<SubscribeResult> {
  if (!isConfigured()) return { ok: false, reason: 'no_config' }
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return { ok: false, reason: 'unsupported' }
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { ok: false, reason: 'denied' }

  try {
    const messaging = getFirebaseMessaging()
    if (!messaging) return { ok: false, reason: 'no_config' }

    // Use the SW registered by @ducanh2912/next-pwa (sw.js contains FCM code)
    const swReg = await navigator.serviceWorker.ready
    const token = await getToken(messaging, {
      vapidKey:                    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration:   swReg,
    })
    if (!token) return { ok: false, reason: 'error', message: 'No token received' }

    // Subscribe token to /topics/all server-side
    const res = await fetch('/api/notifications/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, topic: 'all' }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { ok: false, reason: 'error', message: data.error ?? 'Subscribe failed' }
    }

    return { ok: true, token }
  } catch (err) {
    return { ok: false, reason: 'error', message: String(err) }
  }
}

export { isConfigured as isFirebaseConfigured }
