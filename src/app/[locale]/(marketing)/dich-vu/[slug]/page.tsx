import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getFlexiblePage } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { SERVICE_DETAIL_FALLBACKS, SERVICE_META } from '@/templates/law/fallback-service-detail'
import BlockRenderer from '@/blocks/BlockRenderer'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(SERVICE_DETAIL_FALLBACKS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const meta = SERVICE_META[slug]
  if (!meta) return { title: 'Dịch vụ' }
  return {
    title: locale === 'en' ? meta.title : meta.title,
    description: meta.description,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const fallback = SERVICE_DETAIL_FALLBACKS[slug]

  // WP content first, fallback to our template; unknown slugs → 404
  const [blocks, settings] = await Promise.all([
    getFlexiblePage(slug, locale).catch(() => null),
    getSiteSettings(locale).catch(() => null),
  ])

  const content = blocks ?? fallback
  if (!content) notFound()

  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS
  const meta = SERVICE_META[slug]

  return (
    <div>
      {/* Page breadcrumb + header */}
      <div className="py-12 px-4" style={{ background: 'var(--cp-pale)' }}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: '#9ca3af' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--cp)' }}>
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/dich-vu" className="hover:underline" style={{ color: 'var(--cp)' }}>
              Dịch vụ
            </Link>
            <span>/</span>
            <span>{meta?.title ?? slug}</span>
          </nav>

          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--cp)' }}
          >
            Dịch Vụ
          </span>
          <h1
            className="text-3xl md:text-4xl font-bold mb-3 max-w-3xl"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
          >
            {meta?.title ?? slug}
          </h1>
          {meta?.description && (
            <p className="text-sm max-w-2xl" style={{ color: '#6b7280' }}>
              {meta.description}
            </p>
          )}
        </div>
      </div>

      <BlockRenderer blocks={content} settings={siteSettings} />
    </div>
  )
}
