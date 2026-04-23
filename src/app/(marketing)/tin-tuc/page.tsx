import { getPosts, getCategories, getCategoryBySlug } from '@/lib/wordpress'
import NewsCard from '@/components/news/NewsCard'
import Pagination from '@/components/ui/Pagination'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức — CôngTy.vn',
  description: 'Cập nhật tin tức mới nhất từ công ty và ngành công nghệ.',
}

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function TinTucPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const categorySlug = params.category

  const [categories, selectedCategory] = await Promise.all([
    getCategories(),
    categorySlug ? getCategoryBySlug(categorySlug) : Promise.resolve(null),
  ])

  const { data: posts, totalPages } = await getPosts({
    page,
    per_page: 9,
    categories: selectedCategory ? [selectedCategory.id] : undefined,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tin tức</h1>
        <p className="text-gray-500">Cập nhật tin tức và hoạt động mới nhất từ công ty.</p>
      </div>

      {/* Category filter */}
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
            Tất cả
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

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Chưa có bài viết nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={categorySlug ? `/tin-tuc?category=${categorySlug}` : '/tin-tuc'}
      />
    </div>
  )
}
