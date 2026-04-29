import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getPosts, getCategories, getCategoryBySlug } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import NewsCard from '@/components/news/NewsCard'
import Pagination from '@/components/ui/Pagination'
import NewsSearchSection from '@/components/news/NewsSearchSection'
import ViewToggle, { type NewsView, getGridClass } from '@/components/news/ViewToggle'
import CalendarWidget from '@/components/news/widgets/CalendarWidget'
import WeatherWidget from '@/components/news/widgets/WeatherWidget'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string; view?: string }>
}

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Cập nhật tin tức mới nhất từ công ty và ngành công nghệ.',
}

export default async function TinTucPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [sp, t, settings] = await Promise.all([
    searchParams,
    getTranslations('News'),
    getSiteSettings(locale).catch(() => DEFAULT_SITE_SETTINGS),
  ])

  const page = Number(sp.page ?? 1)
  const categorySlug = sp.category
  const view: NewsView = (['list', 'grid3', 'grid4'] as const).includes(sp.view as NewsView)
    ? (sp.view as NewsView)
    : 'grid3'

  const [categories, selectedCategory] = await Promise.all([
    getCategories(locale),
    categorySlug ? getCategoryBySlug(categorySlug, locale) : Promise.resolve(null),
  ])

  const { data: posts, totalPages } = await getPosts({
    page,
    per_page: 9,
    categories: selectedCategory ? [selectedCategory.id] : undefined,
    locale,
  })

  const basePath = categorySlug ? `/danh-muc/${categorySlug}` : '/tin-tuc'
  const [featuredPost, ...restPosts] = posts
  const showSidebar = settings.showNewsSidebar

  return (
    <div className={`${showSidebar ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 py-16`}>
      {/* Page header + view toggle */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('news')}
          </h1>
          <p className="text-gray-500">
            {locale === 'en'
              ? 'Latest news and updates from our company.'
              : 'Cập nhật tin tức và hoạt động mới nhất từ công ty.'}
          </p>
        </div>
        <ViewToggle current={view} />
      </div>

      <div className={showSidebar ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : ''}>
        {/* Main content */}
        <div className={showSidebar ? 'lg:col-span-9' : ''}>
          <NewsSearchSection locale={locale}>
            {/* Category filter pills */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <Link
                  href="/tin-tuc"
                  className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
                  style={
                    !categorySlug
                      ? { background: 'var(--cp)', borderColor: 'var(--cp)', color: 'white' }
                      : undefined
                  }
                >
                  {t('all')}
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/danh-muc/${cat.slug}`}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors text-gray-600 border-gray-200 hover:border-[var(--cp)] hover:text-[var(--cp)]"
                    style={
                      categorySlug === cat.slug
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

            <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
          </NewsSearchSection>
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
