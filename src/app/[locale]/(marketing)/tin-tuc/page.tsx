import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getPosts, getCategories, getCategoryBySlug } from '@/lib/wordpress'
import NewsCard from '@/components/news/NewsCard'
import Pagination from '@/components/ui/Pagination'
import NewsSearchSection from '@/components/news/NewsSearchSection'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Cập nhật tin tức mới nhất từ công ty và ngành công nghệ.',
}

export default async function TinTucPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [sp, t] = await Promise.all([searchParams, getTranslations('News')])

  const page = Number(sp.page ?? 1)
  const categorySlug = sp.category

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

  const basePath = categorySlug ? `/tin-tuc?category=${categorySlug}` : '/tin-tuc'

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('news')}</h1>
        <p className="text-gray-500">
          {locale === 'en'
            ? 'Latest news and updates from our company.'
            : 'Cập nhật tin tức và hoạt động mới nhất từ công ty.'}
        </p>
      </div>

      <NewsSearchSection locale={locale}>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/tin-tuc"
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !categorySlug
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'text-gray-600 border-gray-200 hover:border-blue-700 hover:text-blue-700'
              }`}
            >
              {t('all')}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tin-tuc?category=${cat.slug}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  categorySlug === cat.slug
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'text-gray-600 border-gray-200 hover:border-blue-700 hover:text-blue-700'
                }`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
      </NewsSearchSection>
    </div>
  )
}
