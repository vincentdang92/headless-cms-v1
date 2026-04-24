import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getFlexiblePage } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { LAW_ABOUT_FALLBACK } from '@/templates/law/fallback-about'
import BlockRenderer from '@/blocks/BlockRenderer'

interface Props {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Hơn 10 năm đồng hành cùng doanh nghiệp Việt Nam trong hành trình thành lập và phát triển bền vững.',
}

export default async function GioiThieuPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [blocks, settings] = await Promise.all([
    getFlexiblePage('gioi-thieu', locale).catch(() => null),
    getSiteSettings(locale).catch(() => null),
  ])

  const content = blocks ?? LAW_ABOUT_FALLBACK
  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS

  return <BlockRenderer blocks={content} settings={siteSettings} />
}
