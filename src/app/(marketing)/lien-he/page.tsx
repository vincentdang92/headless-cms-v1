import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import ContactBlock from '@/blocks/ContactBlock'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ để nhận tư vấn miễn phí từ đội ngũ chuyên gia. Phản hồi trong vòng 30 phút.',
}

export default async function LienHePage() {
  const settings = await getSiteSettings().catch(() => null) ?? DEFAULT_SITE_SETTINGS

  const block = {
    acf_fc_layout: 'contact_form' as const,
    section_label: 'Liên Hệ',
    section_title: 'Nhận Tư Vấn Miễn Phí Ngay Hôm Nay',
    dark_background: true,
  }

  return (
    <div>
      {/* Page hero */}
      <div
        className="py-14 px-4 text-center"
        style={{ background: 'var(--cp-pale)' }}
      >
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--cp)' }}
        >
          Liên Hệ
        </span>
        <h1
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
        >
          Chúng Tôi Lắng Nghe Bạn
        </h1>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#6b7280' }}>
          Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn trong vòng <strong>30 phút</strong>. Liên hệ ngay để nhận tư vấn miễn phí.
        </p>
      </div>

      <ContactBlock block={block} settings={settings} />
    </div>
  )
}
