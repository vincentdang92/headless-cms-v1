import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const WP_URL    = process.env.WORDPRESS_API_URL!
const WP_SECRET = process.env.WP_API_SECRET!

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('wp_auth')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(`${WP_URL}/headless/v1/auth/me`, {
    headers: {
      'X-WP-Secret': WP_SECRET,
      'X-WP-Auth-Token': token,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    cookieStore.delete('wp_auth')
    return NextResponse.json({ error: 'Session expired' }, { status: 401 })
  }

  const user = await res.json()
  return NextResponse.json(user)
}
