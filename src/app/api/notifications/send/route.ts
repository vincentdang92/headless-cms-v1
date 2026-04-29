// POST /api/notifications/send
// Called by WordPress on post publish (same auth pattern as /api/revalidate).
// Body: { title, body, url, imageUrl?, topic? }

import { type NextRequest, NextResponse } from 'next/server'
import { sendPushToTopic, isFirebaseAdminConfigured } from '@/lib/firebase-admin'

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET

export async function POST(request: NextRequest) {
  // Auth: same secret used for cache revalidation
  const secret = request.nextUrl.searchParams.get('secret')
  if (!secret || secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Push notifications not configured' }, { status: 503 })
  }

  const body = await request.json() as {
    title?:    string
    body?:     string
    url?:      string
    imageUrl?: string
    topic?:    string
  }

  if (!body.title || !body.body || !body.url) {
    return NextResponse.json({ error: 'Missing required fields: title, body, url' }, { status: 400 })
  }

  const topic = (body.topic ?? 'all').replace(/[^a-zA-Z0-9\-_.~]/g, '')
  const result = await sendPushToTopic({
    topic,
    title:    body.title,
    body:     body.body,
    url:      body.url,
    imageUrl: body.imageUrl,
  })

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true, topic })
}
