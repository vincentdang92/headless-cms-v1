import type { Metadata } from 'next'
import { getFlexiblePage } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { LAW_HOME_FALLBACK } from '@/templates/law/fallback'
import BlockRenderer from '@/blocks/BlockRenderer'

export const metadata: Metadata = {
  title: 'Trang chủ',
}

export default async function HomePage() {
  const [blocks, settings] = await Promise.all([
    getFlexiblePage('trang-chu').catch(() => null),
    getSiteSettings().catch(() => null),
  ])

  // WP chưa có flexible content → dùng fallback data của law template
  const content = blocks ?? LAW_HOME_FALLBACK
  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS

  return <BlockRenderer blocks={content} settings={siteSettings} />
}
