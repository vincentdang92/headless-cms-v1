import type { Metadata } from 'next'
import { getFlexiblePage } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { LAW_SERVICES_FALLBACK } from '@/templates/law/fallback-services'
import BlockRenderer from '@/blocks/BlockRenderer'

export const metadata: Metadata = {
  title: 'Dịch vụ',
  description: 'Toàn bộ dịch vụ pháp lý, kế toán thuế và bảo hộ thương hiệu — trọn gói, minh bạch, nhanh chóng.',
}

export default async function DichVuPage() {
  const [blocks, settings] = await Promise.all([
    getFlexiblePage('dich-vu').catch(() => null),
    getSiteSettings().catch(() => null),
  ])

  const content = blocks ?? LAW_SERVICES_FALLBACK
  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS

  return <BlockRenderer blocks={content} settings={siteSettings} />
}
