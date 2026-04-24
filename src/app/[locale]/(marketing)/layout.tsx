import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { NavItem } from '@/components/layout/Header'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function MarketingLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [settings, t] = await Promise.all([
    getSiteSettings(locale).catch(() => null),
    getTranslations('Nav'),
  ])

  const DEFAULT_NAV: NavItem[] = [
    { label: t('home'), href: '/' },
    { label: t('about'), href: '/gioi-thieu' },
    {
      label: t('services'),
      href: '/dich-vu',
      children: [
        { label: t('establish'), href: '/dich-vu#thanh-lap' },
        { label: t('accounting'), href: '/dich-vu#ke-toan' },
        { label: t('trademark'), href: '/dich-vu#thuong-hieu' },
      ],
    },
    { label: t('news'), href: '/tin-tuc' },
    { label: t('contact'), href: '/lien-he' },
  ]

  // TODO: fetch WP Menus khi đã cài WP-API-Menus plugin
  const nav = DEFAULT_NAV

  return (
    <>
      <Header settings={settings ?? DEFAULT_SITE_SETTINGS} nav={nav} locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings ?? DEFAULT_SITE_SETTINGS} nav={nav} />
    </>
  )
}
