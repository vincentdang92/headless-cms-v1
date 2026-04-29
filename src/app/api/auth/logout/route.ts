import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const WP_URL    = process.env.WORDPRESS_API_URL!
const WP_SECRET = process.env.WP_API_SECRET!

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('wp_auth')?.value

  // Destroy WP session so the token can't be reused even if stolen
  if (token) {
    await fetch(`${WP_URL}/headless/v1/auth/logout`, {
      method:  'POST',
      headers: { 'X-WP-Secret': WP_SECRET, 'X-WP-Auth-Token': token },
    }).catch(() => { /* fire-and-forget, cookie still gets deleted */ })
  }

  cookieStore.delete('wp_auth')
  return NextResponse.json({ success: true })
}
