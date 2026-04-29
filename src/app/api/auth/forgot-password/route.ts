import { type NextRequest, NextResponse } from 'next/server'

const WP_URL    = process.env.WORDPRESS_API_URL!
const WP_SECRET = process.env.WP_API_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${WP_URL}/headless/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-WP-Secret': WP_SECRET },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
