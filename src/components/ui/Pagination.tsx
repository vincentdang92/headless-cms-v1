import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

export default async function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const t = await getTranslations('News')
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const sep = basePath.includes('?') ? '&' : '?'

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={`${basePath}${sep}page=${currentPage - 1}`}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          {t('prev')}
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}${sep}page=${p}`}
          className={cn(
            'w-9 h-9 flex items-center justify-center text-sm rounded-lg border transition-colors',
            p === currentPage
              ? 'text-white'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
          style={p === currentPage ? { background: 'var(--cp)', borderColor: 'var(--cp)' } : undefined}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}${sep}page=${currentPage + 1}`}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          {t('next')}
        </Link>
      )}
    </nav>
  )
}
