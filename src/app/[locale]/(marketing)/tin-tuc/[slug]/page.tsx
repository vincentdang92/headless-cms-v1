import { notFound } from 'next/navigation'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  getPostBySlug,
  getAllPostSlugs,
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostCategories,
  getPostAuthor,
} from '@/lib/wordpress'
import { formatDateLong } from '@/lib/utils'
import { getArticleSchema } from '@/lib/seo'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Không tìm thấy' }

  return {
    title: `${post.title.rendered} — CôngTy.vn`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      images: [getFeaturedImageUrl(post)],
    },
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [post, t] = await Promise.all([
    getPostBySlug(slug, locale),
    getTranslations('News'),
  ])

  if (!post) notFound()

  const imageUrl = getFeaturedImageUrl(post)
  const imageAlt = getFeaturedImageAlt(post)
  const categories = getPostCategories(post)
  const author = getPostAuthor(post)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const articleSchema = getArticleSchema(post, siteUrl, 'CôngTy.vn')

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-700">{t('home')}</Link>
        <span>/</span>
        <Link href="/tin-tuc" className="hover:text-blue-700">{t('news')}</Link>
        <span>/</span>
        <span className="text-gray-600 truncate" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </nav>

      {categories.length > 0 && (
        <Link
          href={`/tin-tuc?category=${categories[0].slug}`}
          className="inline-block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-4 hover:underline"
        >
          {categories[0].name}
        </Link>
      )}

      <h1
        className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
        <span>{author}</span>
        <span>·</span>
        <time dateTime={post.date}>{formatDateLong(post.date)}</time>
      </div>

      {imageUrl !== '/images/placeholder.jpg' && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 bg-gray-100">
          <Image
            src={imageUrl}
            alt={imageAlt || post.title.rendered}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-700"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
        >
          {t('backToList')}
        </Link>
      </div>
    </article>
  )
}
