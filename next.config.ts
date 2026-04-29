import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withPWAInit from '@ducanh2912/next-pwa'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withPWA = withPWAInit({
  dest:            'public',
  // Disable SW in dev — use `NEXT_PUBLIC_PWA_ENABLED=true` to force-enable
  disable:         process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_PWA_ENABLED !== 'true',
  // FCM background handler merged into generated sw.js
  customWorkerSrc: 'src/worker',
  register:        true,
  // Offline fallback
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    skipWaiting: true,
  },
})

// Tự động thêm WP hostname từ env vào remotePatterns
function wpRemotePatterns() {
  const url = process.env.WORDPRESS_API_URL
  if (!url) return []
  try {
    const { protocol, hostname } = new URL(url)
    const proto = protocol.replace(':', '') as 'http' | 'https'
    return [
      { protocol: proto, hostname },
      { protocol: proto, hostname: `*.${hostname}` },
    ]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/category/:slug', destination: '/danh-muc/:slug', permanent: true },
      { source: '/en/category/:slug', destination: '/en/danh-muc/:slug', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      ...wpRemotePatterns(),
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'http',  hostname: '127.0.0.1' },
      { protocol: 'https', hostname: '**.gravatar.com' },
    ],
  },
}

export default withPWA(withNextIntl(nextConfig))
