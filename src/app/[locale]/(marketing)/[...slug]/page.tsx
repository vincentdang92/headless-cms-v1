import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { getFlexiblePage, getPageBySlug } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { extractSeoData, seoToMetadata } from '@/lib/seo'
import { stripHtml } from '@/lib/utils'
import BlockRenderer from '@/blocks/BlockRenderer'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string; slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const lastSlug = slug[slug.length - 1]

  const [page, settings] = await Promise.all([
    getPageBySlug(lastSlug, locale).catch(() => null),
    getSiteSettings(locale).catch(() => null),
  ])

  if (!page) return {}

  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS
  const seo = extractSeoData(page)
  const prefix = locale !== 'vi' ? `${locale}/` : ''

  return seoToMetadata(seo, {
    title: stripHtml(page.title.rendered),
    description: siteSettings.siteDescription,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${prefix}${slug.join('/')}`,
    siteName: siteSettings.siteName,
  })
}

export default async function CatchAllPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const lastSlug = slug[slug.length - 1]

  const [blocks, page, settings] = await Promise.all([
    getFlexiblePage(lastSlug, locale).catch(() => null),
    getPageBySlug(lastSlug, locale).catch(() => null),
    getSiteSettings(locale).catch(() => null),
  ])

  if (!blocks?.length && !page) notFound()

  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS

  // ACF Flexible Content → block rendering (blocks tự quản lý layout)
  if (blocks?.length) {
    return <BlockRenderer blocks={blocks} settings={siteSettings} />
  }

  // Regular WP page → prose layout
  const featuredImageUrl = page!._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
  const featuredImageAlt = page!._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? ''

  // Breadcrumb từ slug segments: ['dich-vu', 'thanh-lap-co-phan'] → Home / Dịch vụ / <title>
  const parentCrumbs = slug.slice(0, -1).map((segment, i) => ({
    label: segment.replace(/-/g, ' '),
    href: '/' + slug.slice(0, i + 1).join('/'),
  }))

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">

      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:underline transition-colors" style={{ color: 'var(--cp)' }}>
          {locale === 'en' ? 'Home' : 'Trang chủ'}
        </Link>

        {parentCrumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            <span>/</span>
            <Link href={crumb.href} className="hover:underline capitalize" style={{ color: 'var(--cp)' }}>
              {crumb.label}
            </Link>
          </span>
        ))}

        <span>/</span>
        <span
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: page!.title.rendered }}
        />
      </nav>

      {/* Title */}
      <h1
        className="text-4xl font-bold mb-8 leading-tight"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
        dangerouslySetInnerHTML={{ __html: page!.title.rendered }}
      />

      {/* Featured image */}
      {featuredImageUrl && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
          <Image
            src={featuredImageUrl}
            alt={featuredImageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg prose-gray max-w-none prose-headings:font-bold"
        style={{ '--tw-prose-links': 'var(--cp)' } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: page!.content.rendered }}
      />
    </article>
  )
}
