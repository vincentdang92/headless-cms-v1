import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getFlexiblePage } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { LAW_HOME_FALLBACK } from '@/templates/law/fallback'
import BlockRenderer from '@/blocks/BlockRenderer'
import { getOrganizationSchema } from '@/lib/seo'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const s = await getSiteSettings(locale).catch(() => null)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return {
    title: locale === 'en' ? 'Home' : 'Trang chủ',
    description: s?.siteDescription
      ?? (locale === 'en'
        ? 'Full-service legal, accounting, and trademark protection for Vietnamese businesses. Fast, transparent, and reliable.'
        : 'Dịch vụ pháp lý, kế toán thuế và bảo hộ thương hiệu trọn gói cho doanh nghiệp Việt. Nhanh chóng, minh bạch, uy tín.'),
    alternates: {
      canonical: locale === 'en' ? `${siteUrl}/en` : siteUrl,
    },
  }
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const orgSchema = getOrganizationSchema({
    siteName: siteSettings.siteName,
    siteDescription: siteSettings.siteDescription ?? '',
    siteUrl,
    logoUrl: siteSettings.logo?.url,
    phone: siteSettings.contact.hotline || siteSettings.contact.phone,
    email: siteSettings.contact.email,
    address: siteSettings.contact.address,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <BlockRenderer blocks={content} settings={siteSettings} />
    </>
  )
}
