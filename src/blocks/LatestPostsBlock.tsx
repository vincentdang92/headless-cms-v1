import { getLocale } from 'next-intl/server'
import { getPosts, getCategoryBySlug } from '@/lib/wordpress'
import { Link } from '@/i18n/navigation'
import NewsCard from '@/components/news/NewsCard'
import type { LatestPostsBlock } from './types'

interface Props {
  block: LatestPostsBlock
}

export default async function LatestPostsBlock({ block }: Props) {
  const {
    section_label,
    section_title,
    section_desc,
    dark_background,
    posts_count = 6,
    category_slug,
    view_all_text,
    view_all_link = '/tin-tuc',
  } = block

  const locale = await getLocale()

  const categoryId = category_slug
    ? await getCategoryBySlug(category_slug, locale).then((c) => c?.id).catch(() => undefined)
    : undefined

  const { data: posts } = await getPosts({
    per_page: posts_count,
    categories: categoryId ? [categoryId] : undefined,
    locale,
  }).catch(() => ({ data: [] }))

  if (!posts.length) return null

  const bg = dark_background
    ? { background: 'linear-gradient(135deg, var(--cd), color-mix(in srgb, var(--cd) 85%, #0f172a))' }
    : { background: '#f9fafb' }

  const textColor = dark_background ? '#ffffff' : 'var(--cd)'
  const subTextColor = dark_background ? 'rgba(255,255,255,0.6)' : '#6b7280'

  // Bài đầu tiên hiển thị featured (ngang) nếu có >= 4 bài
  const hasFeatured = posts.length >= 4

  return (
    <section className="py-20 px-4" style={bg}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            {section_label && (
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: 'var(--cp)' }}
              >
                {section_label}
              </span>
            )}
            <h2
              className="text-3xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: textColor }}
            >
              {section_title}
            </h2>
            {section_desc && (
              <p className="mt-2 text-sm max-w-xl" style={{ color: subTextColor }}>
                {section_desc}
              </p>
            )}
          </div>

          {view_all_text && (
            <Link
              href={view_all_link}
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold border-b-2 pb-0.5 transition-opacity hover:opacity-70"
              style={{ color: 'var(--cp)', borderColor: 'var(--cp)' }}
            >
              {view_all_text} →
            </Link>
          )}
        </div>

        {/* Grid */}
        {hasFeatured ? (
          <div className="space-y-6">
            {/* Featured post — full width */}
            <NewsCard post={posts[0]} featured />
            {/* Remaining posts — 3 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Mobile view all link */}
        {view_all_text && (
          <div className="mt-10 text-center md:hidden">
            <Link
              href={view_all_link}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'var(--cp)' }}
            >
              {view_all_text} →
            </Link>
          </div>
        )}

      </div>
    </section>
  )
}
