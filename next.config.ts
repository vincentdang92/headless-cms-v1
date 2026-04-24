import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // WordPress media uploads — adjust hostname to match your WP install
        protocol: 'https',
        hostname: '**.congty.vn',
      },
      {
        // Local WordPress (XAMPP / LocalWP / Laragon)
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        // Gravatar (author avatars)
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
