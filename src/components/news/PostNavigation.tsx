import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { WPAdjacentPost } from '@/lib/wordpress'

interface Props {
  prev: WPAdjacentPost | null
  next: WPAdjacentPost | null
}

export default async function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null
  const t = await getTranslations('News')

  return (
    <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-gray-100">
      {/* Previous — bài cũ hơn, bên trái */}
      <div>
        {prev && (
          <Link
            href={`/tin-tuc/${prev.slug}`}
            className="group flex flex-col gap-1 p-4 rounded-2xl border border-gray-100 hover:border-[var(--cp)] transition-colors h-full"
          >
            <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-[var(--cp)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('prevPost')}
            </span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-[var(--cp)] transition-colors line-clamp-2 leading-snug">
              {prev.title}
            </span>
          </Link>
        )}
      </div>

      {/* Next — bài mới hơn, bên phải */}
      <div>
        {next && (
          <Link
            href={`/tin-tuc/${next.slug}`}
            className="group flex flex-col gap-1 p-4 rounded-2xl border border-gray-100 hover:border-[var(--cp)] transition-colors h-full items-end text-right"
          >
            <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-[var(--cp)] transition-colors">
              {t('nextPost')}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-[var(--cp)] transition-colors line-clamp-2 leading-snug">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
