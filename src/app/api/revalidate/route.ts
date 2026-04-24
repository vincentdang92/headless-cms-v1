import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { post_type, post_slug, scope } = body as {
      post_type?: string
      post_slug?: string
      // scope: 'settings' → chỉ revalidate site settings (logo, màu, menu)
      scope?: 'settings' | 'all'
    }

    const revalidated: string[] = []

    // Revalidate site-wide settings (ACF Options thay đổi)
    if (scope === 'settings' || scope === 'all') {
      revalidateTag('site-settings', 'max')
      revalidatePath('/', 'layout')
      revalidated.push('site-settings', 'layout')
    }

    // Revalidate post/page content
    if (post_type === 'post') {
      if (post_slug) {
        revalidatePath(`/tin-tuc/${post_slug}`)
        revalidated.push(`/tin-tuc/${post_slug}`)
      }
      revalidatePath('/tin-tuc')
      revalidatePath('/')
      revalidated.push('/tin-tuc', '/')
    } else if (post_type === 'page') {
      if (post_slug) {
        revalidatePath(`/${post_slug}`)
        revalidated.push(`/${post_slug}`)
      }
      revalidatePath('/', 'layout')
      revalidated.push('layout')
    } else if (!scope) {
      // Fallback: full revalidation
      revalidatePath('/', 'layout')
      revalidateTag('site-settings', 'max')
      revalidated.push('full-site')
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ message: 'Revalidation failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'revalidate' })
}
