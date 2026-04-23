import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          ← Trước
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}?page=${p}`}
          className={cn(
            'w-9 h-9 flex items-center justify-center text-sm rounded-lg border transition-colors',
            p === currentPage
              ? 'bg-blue-700 text-white border-blue-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Sau →
        </Link>
      )}
    </nav>
  )
}
