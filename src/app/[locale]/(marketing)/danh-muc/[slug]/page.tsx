import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getPosts, getCategories, getCategoryBySlug } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import NewsCard from '@/components/news/NewsCard'
import Pagination from '@/components/ui/Pagination'
import ViewToggle, { type NewsView, getGridClass } from '@/components/news/ViewToggle'
import CalendarWidget from '@/components/news/widgets/CalendarWidget'
import WeatherWidget from '@/components/news/widgets/WeatherWidget'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string; view?: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const cats = await getCategories()
    return cats.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const category = await getCategoryBySlug(slug, locale).catch(() => null)
  if (!category) return { title: 'Danh mục' }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return {
    title: category.name,
    description: category.description || `Tổng hợp bài viết trong danh mục ${category.name}.`,
    openGraph: {
      title: category.name,
      description: category.description || `Tổng hợp bài viết trong danh mục ${category.name}.`,
      url: `${siteUrl}/danh-muc/${slug}`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [sp, t, settings] = await Promise.all([
    searchParams,
    getTranslations('News'),
    getSiteSettings(locale).catch(() => DEFAULT_SITE_SETTINGS),
  ])

  const page = Number(sp.page ?? 1)
  const view: NewsView = (['list', 'grid3', 'grid4'] as const).includes(sp.view as NewsView)
    ? (sp.view as NewsView)
    : 'grid3'

  const [category, allCategories] = await Promise.all([
    getCategoryBySlug(slug, locale).catch(() => null),
    getCategories(locale).catch(() => []),
  ])

  if (!category) notFound()

  const { data: posts, totalPages } = await getPosts({
    page,
    per_page: 9,
    categories: [category.id],
    locale,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('home'), item: siteUrl },
      { '@type': 'ListItem', position: 2, name: t('news'), item: `${siteUrl}/tin-tuc` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${siteUrl}/danh-muc/${slug}` },
    ],
  }

  const [featuredPost, ...restPosts] = posts
  const showSidebar = settings.showNewsSidebar

  return (
    <div className={`${showSidebar ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 py-16`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-[var(--cp)] transition-colors">{t('home')}</Link>
        <span>/</span>
        <Link href="/tin-tuc" className="hover:text-[var(--cp)] transition-colors">{t('news')}</Link>
        <span>/</span>
        <span className="text-gray-600">{category.name}</span>
      </nav>

      {/* Heading + view toggle */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--cp)' }}>
            {t('news')}
          </p>
          <h1
            className="text-3xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {category.name}
          </h1>
          {category.description ? (
            <p className="text-gray-500 text-sm mt-2 max-w-2xl">{category.description}</p>
          ) : (
            <p className="text-gray-400 text-sm">{t('postCount', { count: category.count })}</p>
          )}
        </div>
        <ViewToggle current={view} />
      </div>

      <div className={showSidebar ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : ''}>
        {/* Main content */}
        <div className={showSidebar ? 'lg:col-span-9' : ''}>
          {/* Category filter pills */}
          {allCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href="/tin-tuc"
                className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-[var(--cp)] hover:text-[var(--cp)] transition-colors"
              >
                {t('all')}
              </Link>
              {allCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/danh-muc/${cat.slug}`}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors text-gray-600 border-gray-200 hover:border-[var(--cp)] hover:text-[var(--cp)]"
                  style={
                    cat.id === category.id
                      ? { background: 'var(--cp)', borderColor: 'var(--cp)', color: 'white' }
                      : {}
                  }
                >
                  {cat.name}
                  <span className="ml-1 text-xs opacity-60">({cat.count})</span>
                </Link>
              ))}
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">{t('noPosts')}</p>
            </div>
          ) : (
            <>
              {/* Featured first post — page 1 only, list view excluded */}
              {page === 1 && featuredPost && view !== 'list' && (
                <div className="mb-8">
                  <NewsCard post={featuredPost} featured />
                </div>
              )}

              {/* Posts grid */}
              {(() => {
                const displayPosts = page === 1 && view !== 'list' ? restPosts : posts
                return displayPosts.length > 0 ? (
                  <div className={getGridClass(view)}>
                    {displayPosts.map((post) => (
                      <NewsCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : null
              })()}
            </>
          )}

          <Pagination currentPage={page} totalPages={totalPages} basePath={`/danh-muc/${slug}`} />
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <aside className="hidden lg:block lg:col-span-3 space-y-4 self-start sticky top-24">
            <WeatherWidget locale={locale} />
            <CalendarWidget locale={locale} />
          </aside>
        )}
      </div>
    </div>
  )
}
