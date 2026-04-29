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

  const isEn = locale === 'en'

  return (
    <div>
      <div className="py-14 px-4 text-center" style={{ background: 'var(--cp-pale)' }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--cp)' }}
        >
          {isEn ? 'About Us' : 'Về Chúng Tôi'}
        </span>
        <h1
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
        >
          {isEn ? '10+ Years Alongside Vietnamese Businesses' : 'Hơn 10 Năm Đồng Hành Cùng Doanh Nghiệp'}
        </h1>
        <p className="text-sm max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
          {isEn
            ? 'From day one of establishment to sustainable growth — we are your long-term legal partner.'
            : 'Từ ngày đầu thành lập đến hành trình phát triển bền vững — chúng tôi là đối tác pháp lý lâu dài của bạn.'}
        </p>
      </div>
      <BlockRenderer blocks={content} settings={siteSettings} />
    </div>
  )
}
