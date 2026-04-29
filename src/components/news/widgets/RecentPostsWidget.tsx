import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getLatestPosts, getFeaturedImageUrl } from '@/lib/wordpress'
import { formatDate } from '@/lib/utils'

interface Props {
  locale: string
  excludeId?: number
  limit?: number
}

export default async function RecentPostsWidget({
  locale,
  excludeId,
  limit = 5,
}: Props) {
  const t = await getTranslations('News')
  const posts = await getLatestPosts(limit + 1, locale).catch(() => [])
  const filtered = posts.filter((p) => p.id !== excludeId).slice(0, limit)

  if (!filtered.length) return null

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
        {t('recentPosts')}
      </h3>
      <ul className="space-y-4">
        {filtered.map((post) => {
          const img = getFeaturedImageUrl(post)
          const hasImg = img !== '/images/placeholder.jpg'
          return (
            <li key={post.id}>
              <Link href={`/tin-tuc/${post.slug}`} className="flex gap-3 group">
                {hasImg && (
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4
                    className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-[var(--cp)] transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    {formatDate(post.date)}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
