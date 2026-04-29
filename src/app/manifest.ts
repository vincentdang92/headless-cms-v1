import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'

// Dynamic manifest — picks up primary color + site name from WP ACF without redeploy.
// Icons must be placed at public/icons/icon-192.png and public/icons/icon-512.png.
// Generate them from your logo at: https://realfavicongenerator.net
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS)

  return {
    name:             s.siteName,
    short_name:       s.siteName,
    description:      s.siteDescription ?? s.siteName,
    start_url:        '/',
    display:          'standalone',
    orientation:      'portrait',
    background_color: '#ffffff',
    theme_color:      s.colors.primary,
    categories:       ['news', 'business'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name:      'Tin tức',
        short_name: 'Tin tức',
        url:       '/tin-tuc',
        icons:     [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}
