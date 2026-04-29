import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const WP_URL    = process.env.WORDPRESS_API_URL!
const WP_SECRET = process.env.WP_API_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${WP_URL}/headless/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-WP-Secret': WP_SECRET },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message ?? 'Đăng nhập thất bại.' },
      { status: res.status }
    )
  }

  const cookieStore = await cookies()
  cookieStore.set('wp_auth', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  return NextResponse.json({ user: data.user })
}
