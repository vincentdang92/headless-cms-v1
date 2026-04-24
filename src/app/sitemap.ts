import type { MetadataRoute } from 'next'
import { getAllPostSlugs, getCategories } from '@/lib/wordpress'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const LOCALES = ['vi', 'en'] as const

function prefixUrl(path: string, locale: string) {
  const base = locale === 'vi' ? SITE_URL : `${SITE_URL}/en`
  return `${base}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/gioi-thieu', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/dich-vu', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/tin-tuc', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/lien-he', changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map(({ path, changeFrequency, priority }) => ({
      url: prefixUrl(path, locale),
      lastModified: new Date(),
      changeFrequency,
      priority: locale === 'en' ? priority * 0.9 : priority,
    }))
  )

  const [slugs, categories] = await Promise.all([
    getAllPostSlugs().catch(() => [] as string[]),
    getCategories().catch(() => []),
  ])

  const postPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({
      url: prefixUrl(`/tin-tuc/${slug}`, locale),
      changeFrequency: 'monthly' as const,
      priority: locale === 'en' ? 0.54 : 0.6,
    }))
  )

  const categoryPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    categories.map((cat) => ({
      url: prefixUrl(`/tin-tuc?category=${cat.slug}`, locale),
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? 0.45 : 0.5,
    }))
  )

  return [...staticPages, ...postPages, ...categoryPages]
}
