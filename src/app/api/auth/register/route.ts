import { type NextRequest, NextResponse } from 'next/server'

const WP_URL    = process.env.WORDPRESS_API_URL!
const WP_SECRET = process.env.WP_API_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${WP_URL}/headless/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-WP-Secret': WP_SECRET },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message ?? 'Đăng ký thất bại.' },
      { status: res.status }
    )
  }

  return NextResponse.json({ success: true })
}
