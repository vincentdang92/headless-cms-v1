// Firebase Admin SDK — server-side only.
// Never import this in client components or pages with 'use client'.

import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getMessaging, type Message } from 'firebase-admin/messaging'

function isConfigured(): boolean {
  return !!(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  )
}

let _adminApp: App | null = null

function getAdminApp(): App | null {
  if (!isConfigured()) return null
  if (_adminApp) return _adminApp
  if (getApps().length) {
    _adminApp = getApps()[0]
    return _adminApp
  }
  _adminApp = initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Private key from env contains literal \n — replace with real newlines
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
  return _adminApp
}

interface SendOptions {
  topic:    string   // e.g. 'all' or 'tin-tuc'
  title:    string
  body:     string
  url:      string
  imageUrl?: string
}

export async function sendPushToTopic(opts: SendOptions): Promise<{ success: boolean; error?: string }> {
  const app = getAdminApp()
  if (!app) return { success: false, error: 'Firebase Admin not configured' }

  const message: Message = {
    topic: opts.topic,
    notification: {
      title: opts.title,
      body:  opts.body,
      ...(opts.imageUrl ? { imageUrl: opts.imageUrl } : {}),
    },
    data: { url: opts.url },
    webpush: {
      notification: {
        icon:  '/icons/icon-192.png',
        badge: '/icons/badge-96.png',
        ...(opts.imageUrl ? { image: opts.imageUrl } : {}),
      },
      fcmOptions: { link: opts.url },
    },
    android: {
      notification: { clickAction: 'FLUTTER_NOTIFICATION_CLICK' },
    },
  }

  try {
    await getMessaging(app).send(message)
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function subscribeToTopic(token: string, topic: string): Promise<{ success: boolean; error?: string }> {
  const app = getAdminApp()
  if (!app) return { success: false, error: 'Firebase Admin not configured' }
  try {
    await getMessaging(app).subscribeToTopic(token, topic)
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export { isConfigured as isFirebaseAdminConfigured }
