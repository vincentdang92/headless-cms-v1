import { type NextRequest, NextResponse } from 'next/server'
import { subscribeToTopic, isFirebaseAdminConfigured } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Push notifications not configured' }, { status: 503 })
  }

  const { token, topic } = await request.json() as { token?: string; topic?: string }
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  // Sanitize topic: allow only alphanumeric + - _ ~
  const safeTopic = (topic ?? 'all').replace(/[^a-zA-Z0-9\-_.~]/g, '')
  const result = await subscribeToTopic(token, safeTopic)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true, topic: safeTopic })
}
