import Link from 'next/link'
import Image from 'next/image'
import { formatDate, truncate } from '@/lib/utils'
import { getFeaturedImageUrl, getFeaturedImageAlt, getPostCategories } from '@/lib/wordpress'
import type { WPPost } from '@/types/wordpress'

interface Props {
  post: WPPost
  featured?: boolean
}

export default function NewsCard({ post, featured = false }: Props) {
  const imageUrl = getFeaturedImageUrl(post)
  const imageAlt = getFeaturedImageAlt(post)
  const categories = getPostCategories(post)

  return (
    <article className={`group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow ${featured ? 'md:flex' : ''}`}>
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? 'md:w-1/2 h-56 md:h-auto' : 'h-48'}`}>
        <Image
          src={imageUrl}
          alt={imageAlt || post.title.rendered}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
        />
      </div>

      <div className={`p-5 flex flex-col ${featured ? 'md:w-1/2 md:p-8 justify-center' : ''}`}>
        {categories.length > 0 && (
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            {categories[0].name}
          </span>
        )}

        <Link href={`/tin-tuc/${post.slug}`}>
          <h2
            className={`font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2 ${featured ? 'text-2xl' : 'text-base'}`}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {truncate(post.excerpt.rendered, 120)}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <time className="text-xs text-gray-400">{formatDate(post.date)}</time>
          <Link
            href={`/tin-tuc/${post.slug}`}
            className="text-xs font-medium text-blue-700 hover:underline"
          >
            Đọc tiếp →
          </Link>
        </div>
      </div>
    </article>
  )
}
