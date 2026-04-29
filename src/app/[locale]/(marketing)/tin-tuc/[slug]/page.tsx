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
  getPostTags,
  getPostAuthor,
  getPostAuthorAvatar,
  getRelatedPosts,
  getPostReviews,
  getAdjacentPosts,
} from '@/lib/wordpress'
import { formatDate, formatDateLong, calcReadingTime, extractToc, injectHeadingIds } from '@/lib/utils'
import { getArticleSchema, extractSeoData, seoToMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import NewsCard from '@/components/news/NewsCard'
import TableOfContents from '@/components/news/TableOfContents'
import ReadingProgress from '@/components/news/ReadingProgress'
import PostNavigation from '@/components/news/PostNavigation'
import BackToTop from '@/components/news/BackToTop'
import ArticleRating from '@/components/news/ArticleRating'
import SocialShare from '@/components/news/SocialShare'
import RecentPostsWidget from '@/components/news/widgets/RecentPostsWidget'
import CategoriesWidget from '@/components/news/widgets/CategoriesWidget'
import CtaWidget from '@/components/news/widgets/CtaWidget'
import WeatherWidget from '@/components/news/widgets/WeatherWidget'
import CalendarWidget from '@/components/news/widgets/CalendarWidget'
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
  const { locale, slug } = await params
  const [post, settings] = await Promise.all([
    getPostBySlug(slug, locale),
    getSiteSettings(locale).catch(() => DEFAULT_SITE_SETTINGS),
  ])
  if (!post) return { title: 'Không tìm thấy' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const imageUrl = getFeaturedImageUrl(post)
  const plainTitle = post.title.rendered.replace(/<[^>]*>/g, '')
  const plainExcerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160)
  const fullUrl = `${siteUrl}/tin-tuc/${slug}`

  const seo = extractSeoData(post)
  const base = seoToMetadata(seo, {
    title: plainTitle,
    description: plainExcerpt,
    url: fullUrl,
    siteName: settings?.siteName ?? DEFAULT_SITE_SETTINGS.siteName,
  })

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      url: fullUrl,
      ...(base.openGraph?.images
        ? {}
        : imageUrl !== '/images/placeholder.jpg'
          ? { images: [{ url: imageUrl }] }
          : {}),
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [post, settings, t] = await Promise.all([
    getPostBySlug(slug, locale),
    getSiteSettings(locale).catch(() => DEFAULT_SITE_SETTINGS),
    getTranslations('News'),
  ])

  if (!post) notFound()

  const imageUrl = getFeaturedImageUrl(post)
  const imageAlt = getFeaturedImageAlt(post)
  const categories = getPostCategories(post)
  const tags = getPostTags(post)
  const author = getPostAuthor(post)
  const authorAvatar = getPostAuthorAvatar(post)
  const categoryIds = categories.map((c) => c.id)

  const [relatedPosts, initialReviews, adjacent] = await Promise.all([
    getRelatedPosts(categoryIds, post.id, 3, locale).catch(() => []),
    getPostReviews(post.id).catch(() => []),
    getAdjacentPosts(post.date, locale).catch(() => ({ prev: null, next: null })),
  ])

  const readingMin = calcReadingTime(post.content.rendered)
  const toc = extractToc(post.content.rendered)
  const contentWithIds = injectHeadingIds(post.content.rendered)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const fullUrl = `${siteUrl}/tin-tuc/${slug}`
  const plainTitle = post.title.rendered.replace(/<[^>]*>/g, '')

  const articleSchema = getArticleSchema(post, siteUrl, settings.siteName)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('home'), item: siteUrl },
      { '@type': 'ListItem', position: 2, name: t('news'), item: `${siteUrl}/tin-tuc` },
      { '@type': 'ListItem', position: 3, name: plainTitle, item: fullUrl },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <ReadingProgress />
      <BackToTop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-[var(--cp)] transition-colors">{t('home')}</Link>
        <span>/</span>
        <Link href="/tin-tuc" className="hover:text-[var(--cp)] transition-colors">{t('news')}</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </nav>

      {/* Category + reading time */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {categories.length > 0 && (
          <Link
            href={`/danh-muc/${categories[0].slug}`}
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-colors"
            style={{ background: 'color-mix(in srgb, var(--cp) 12%, transparent)', color: 'var(--cp)' }}
          >
            {categories[0].name}
          </Link>
        )}
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('readingTime', { min: readingMin })}
        </span>
      </div>

      {/* Title */}
      <h1
        className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5"
        style={{ fontFamily: 'var(--font-heading)' }}
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      {/* Author + date */}
      <div className="flex items-center gap-3 mb-8">
        {authorAvatar ? (
          <Image src={authorAvatar} alt={author} width={36} height={36} className="rounded-full" />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: 'var(--cp)' }}>
            {author.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-700">{author}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <time dateTime={post.date}>{formatDateLong(post.date)}</time>
            {post.modified !== post.date && (
              <>
                <span>·</span>
                <span>{t('updatedAt')} {formatDate(post.modified)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured image */}
      
      {settings.showPostFeaturedImage && imageUrl !== '/images/placeholder.jpg' && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 bg-gray-100">
          <Image
            src={imageUrl}
            alt={imageAlt || plainTitle}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      )}

      {/* TOC — mobile accordion + desktop floating button (left, scroll-triggered) */}
      <TableOfContents
        toc={toc}
        scrollOffset={settings.tocScrollOffset}
        scrollDuration={settings.tocScrollDuration}
      />

      {/* 12-col grid: article 9/12 + sidebar 3/12 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Article content */}
        <article className="lg:col-span-9 min-w-0">
          <div
            id="article-content"
            className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-a:text-[var(--cp)] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-sm
              prose-blockquote:border-l-[var(--cp)] prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg
              prose-code:text-[var(--cp)] prose-code:bg-gray-50 prose-code:px-1 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* Divider */}
          <div className="my-10 border-t border-gray-100" />

          {/* Author card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl mb-6"
            style={{ background: 'color-mix(in srgb, var(--cp) 5%, white)', border: '1px solid color-mix(in srgb, var(--cp) 15%, transparent)' }}>
            {authorAvatar ? (
              <Image src={authorAvatar} alt={author} width={52} height={52} className="rounded-full shrink-0" />
            ) : (
              <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-bold shrink-0 text-lg"
                style={{ background: 'var(--cp)' }}>
                {author.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">{author}</p>
              <p className="text-xs text-gray-400">{formatDate(post.date)}</p>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-gray-400 font-medium">{t('tags')}:</span>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tin-tuc?tag=${tag.slug}`}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-[var(--cp)] hover:text-[var(--cp)] transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Social share */}
          <SocialShare url={fullUrl} title={plainTitle} />

          {/* Rating */}
          <div className="border-t border-b border-gray-100">
            <ArticleRating postId={post.id} initialReviews={initialReviews} />
          </div>

          {/* Prev / Next navigation */}
          <PostNavigation prev={adjacent.prev} next={adjacent.next} />

          {/* Back link */}
          <div className="mt-6">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--cp)]"
              style={{ color: 'var(--cp)' }}
            >
              {t('backToList')}
            </Link>
          </div>
        </article>

        {/* Sidebar — mỗi widget độc lập, có thể add/remove/reorder tự do
            Để swap widget cho theme khác: copy file trong components/news/widgets/,
            đổi import + render ở đây. Không có dependencies giữa các widget.
            (TOC không nằm ở đây — đã chuyển sang floating button bên trái) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 self-start">
          <WeatherWidget locale={locale} />
          <CalendarWidget locale={locale} />
          <RecentPostsWidget locale={locale} excludeId={post.id} />
          <CategoriesWidget locale={locale} />
          <CtaWidget settings={settings} />
        </aside>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-100">
          <h2
            className="text-2xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('relatedPosts')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <NewsCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
