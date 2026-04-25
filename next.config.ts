import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Tự động thêm WP hostname từ env vào remotePatterns
function wpRemotePatterns() {
  const url = process.env.WORDPRESS_API_URL
  if (!url) return []
  try {
    const { protocol, hostname } = new URL(url)
    const proto = protocol.replace(':', '') as 'http' | 'https'
    // Thêm cả subdomain (cms.site.vn) và www
    return [
      { protocol: proto, hostname },
      { protocol: proto, hostname: `*.${hostname}` },
    ]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // WP domain tự động từ WORDPRESS_API_URL
      ...wpRemotePatterns(),
      // Local WP (XAMPP / LocalWP / Laragon)
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'http',  hostname: '127.0.0.1' },
      // Gravatar (author avatars)
      { protocol: 'https', hostname: '**.gravatar.com' },
    ],
  },
}

export default withNextIntl(nextConfig)
