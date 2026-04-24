import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import ContactBlock from '@/blocks/ContactBlock'

interface Props {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ để nhận tư vấn miễn phí từ đội ngũ chuyên gia. Phản hồi trong vòng 30 phút.',
}

export default async function LienHePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [settings, t] = await Promise.all([
    getSiteSettings(locale).catch(() => null),
    getTranslations('Contact'),
  ])

  const block = {
    acf_fc_layout: 'contact_form' as const,
    section_label: locale === 'en' ? 'Contact' : 'Liên Hệ',
    section_title: locale === 'en'
      ? 'Get Free Consultation Today'
      : 'Nhận Tư Vấn Miễn Phí Ngay Hôm Nay',
    dark_background: true,
  }

  return (
    <div>
      <div
        className="py-14 px-4 text-center"
        style={{ background: 'var(--cp-pale)' }}
      >
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--cp)' }}
        >
          {locale === 'en' ? 'Contact' : 'Liên Hệ'}
        </span>
        <h1
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
        >
          {locale === 'en' ? 'We Are Listening' : 'Chúng Tôi Lắng Nghe Bạn'}
        </h1>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#6b7280' }}>
          {locale === 'en'
            ? 'Our expert team is ready to support you within 30 minutes. Contact us for a free consultation.'
            : <>Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn trong vòng <strong>30 phút</strong>. Liên hệ ngay để nhận tư vấn miễn phí.</>}
        </p>
      </div>

      <ContactBlock block={block} settings={settings ?? DEFAULT_SITE_SETTINGS} />
    </div>
  )
}
