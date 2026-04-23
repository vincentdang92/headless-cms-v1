import type { Metadata } from 'next'
import type { WPPost, WPPage } from '@/types/wordpress'
import type { UnifiedSeoData } from '@/types/site-settings'

// ─── Extractors ────────────────────────────────────────────────────────────

export function extractYoastSeo(post: WPPost | WPPage): UnifiedSeoData {
  const y = post.yoast_head_json
  if (!y) return {}
  return {
    title: y.title,
    description: y.description,
    robots: y.robots,
    canonical: y.canonical,
    ogTitle: y.og_title,
    ogDescription: y.og_description,
    ogImage: y.og_image?.[0]
      ? { url: y.og_image[0].url, width: y.og_image[0].width, height: y.og_image[0].height, alt: y.og_image[0].alt }
      : undefined,
    twitterCard: y.twitter_card,
    twitterTitle: y.twitter_title,
    twitterDescription: y.twitter_description,
    schema: y.schema,
    isNoIndex: y.robots?.index === 'noindex',
  }
}

export function extractRankMathSeo(post: WPPost | WPPage): UnifiedSeoData {
  const rm = post.rank_math_seo
  if (!rm) return {}
  return {
    title: rm.title,
    description: rm.description,
    robots: rm.robots,
    canonical: rm.canonical_url,
    ogTitle: rm.og_title,
    ogDescription: rm.og_description,
    ogImage: rm.og_image?.[0]
      ? { url: rm.og_image[0].url, width: rm.og_image[0].width, height: rm.og_image[0].height }
      : undefined,
    twitterCard: rm.twitter_card,
    twitterTitle: rm.twitter_title,
    twitterDescription: rm.twitter_description,
    schema: rm.schema,
    isNoIndex: rm.robots?.index === 'noindex',
  }
}

// Auto-detect: RankMath trước, fallback Yoast
export function extractSeoData(post: WPPost | WPPage): UnifiedSeoData {
  const rm = extractRankMathSeo(post)
  if (rm.title) return rm
  const yoast = extractYoastSeo(post)
  if (yoast.title) return yoast
  return {}
}

// ─── Next.js Metadata builder ──────────────────────────────────────────────

interface FallbackMeta {
  title: string
  description: string
  url: string
  siteName: string
}

export function seoToMetadata(seo: UnifiedSeoData, fallback: FallbackMeta): Metadata {
  const title = seo.title || fallback.title
  const description = seo.description || fallback.description

  return {
    title,
    description,
    ...(seo.isNoIndex && { robots: { index: false, follow: false } }),
    ...(seo.canonical && { alternates: { canonical: seo.canonical } }),
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      siteName: fallback.siteName,
      ...(seo.ogImage && {
        images: [
          {
            url: seo.ogImage.url,
            width: seo.ogImage.width ?? 1200,
            height: seo.ogImage.height ?? 630,
            alt: seo.ogImage.alt ?? title,
          },
        ],
      }),
    },
    twitter: {
      card: (seo.twitterCard as 'summary_large_image') ?? 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || description,
      ...(seo.twitterImage
        ? { images: [seo.twitterImage.url] }
        : seo.ogImage
          ? { images: [seo.ogImage.url] }
          : {}),
    },
  }
}

// ─── JSON-LD helpers ───────────────────────────────────────────────────────
// Sử dụng trong <script type="application/ld+json"> của từng page

export function getArticleSchema(post: WPPost, siteUrl: string, siteName: string) {
  const seo = extractSeoData(post)
  // Nếu plugin đã có schema thì dùng luôn
  if (seo.schema) return seo.schema

  // Fallback: tự build Article schema cơ bản
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
    datePublished: post.date,
    dateModified: post.modified,
    url: `${siteUrl}/tin-tuc/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  }
}

export function getOrganizationSchema(settings: {
  siteName: string
  siteDescription: string
  siteUrl: string
  logoUrl?: string
  phone?: string
  email?: string
  address?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    description: settings.siteDescription,
    url: settings.siteUrl,
    ...(settings.logoUrl && { logo: settings.logoUrl }),
    ...(settings.phone && { telephone: settings.phone }),
    ...(settings.email && { email: settings.email }),
    ...(settings.address && {
      address: { '@type': 'PostalAddress', streetAddress: settings.address },
    }),
  }
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
