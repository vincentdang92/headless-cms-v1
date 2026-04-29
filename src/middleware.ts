import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { type NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

// Paths that require a logged-in session (locale prefix stripped before comparison)
const PROTECTED = ['/tai-khoan']

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Strip /en prefix to get locale-agnostic path
  const bare = pathname.replace(/^\/en(\/|$)/, '/').replace(/\/$/, '') || '/'
  const isProtected = PROTECTED.some(p => bare === p || bare.startsWith(p + '/'))

  if (isProtected && !request.cookies.get('wp_auth')?.value) {
    const loginPath = pathname.startsWith('/en') ? '/en/dang-nhap' : '/dang-nhap'
    const url = new URL(loginPath, request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals, API routes, and static files
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
}
