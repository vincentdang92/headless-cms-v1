import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.WORDPRESS_API_URL!
const WP_API_SECRET = process.env.WP_API_SECRET

function wpHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (WP_API_SECRET) h['X-WP-Secret'] = WP_API_SECRET
  return h
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { postId, authorName, authorEmail, content, rating } = body

    if (!postId || !authorName || !authorEmail || !content || !rating) {
      return NextResponse.json({ code: 'missing_fields', message: 'Missing required fields.' }, { status: 400 })
    }

    const res = await fetch(`${API_URL}/headless/v1/reviews`, {
      method: 'POST',
      headers: wpHeaders(),
      body: JSON.stringify({
        post_id: postId,
        author_name: authorName,
        author_email: authorEmail,
        content,
        rating,
      }),
      signal: AbortSignal.timeout(8_000),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ code: 'network_error', message: 'Network error.' }, { status: 500 })
  }
}
