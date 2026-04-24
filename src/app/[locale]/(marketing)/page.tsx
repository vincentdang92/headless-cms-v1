import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getFlexiblePage } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { LAW_HOME_FALLBACK } from '@/templates/law/fallback'
import BlockRenderer from '@/blocks/BlockRenderer'

interface Props {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Trang chủ',
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [blocks, settings] = await Promise.all([
    getFlexiblePage('trang-chu', locale).catch(() => null),
    getSiteSettings(locale).catch(() => null),
  ])

  const content = blocks ?? LAW_HOME_FALLBACK
  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS

  return <BlockRenderer blocks={content} settings={siteSettings} />
}
