import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { NavItem } from '@/components/layout/Header'

// Default nav — override bằng WP Menus khi có plugin WP-API-Menus
const DEFAULT_NAV: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  {
    label: 'Dịch vụ',
    href: '/dich-vu',
    children: [
      { label: 'Thành lập doanh nghiệp', href: '/dich-vu#thanh-lap' },
      { label: 'Kế toán & Thuế', href: '/dich-vu#ke-toan' },
      { label: 'Bảo hộ thương hiệu', href: '/dich-vu#thuong-hieu' },
    ],
  },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Liên hệ', href: '/lien-he' },
]

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null)

  // TODO: fetch WP Menus khi đã cài WP-API-Menus plugin
  // const nav = await getWpMenu('primary').catch(() => DEFAULT_NAV)
  const nav = DEFAULT_NAV

  return (
    <>
      <Header settings={settings ?? DEFAULT_SITE_SETTINGS} nav={nav} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings ?? DEFAULT_SITE_SETTINGS} nav={nav} />
    </>
  )
}
