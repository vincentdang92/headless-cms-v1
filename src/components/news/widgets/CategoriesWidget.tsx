import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { getCategories } from '@/lib/wordpress'

interface Props {
  locale: string
  limit?: number
  activeSlug?: string
}

export default async function CategoriesWidget({
  locale,
  limit = 10,
  activeSlug,
}: Props) {
  const t = await getTranslations('News')
  const categories = await getCategories(locale).catch(() => [])
  if (!categories.length) return null

  const sorted = [...categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
        {t('categories')}
      </h3>
      <ul className="space-y-1">
        {sorted.map((cat) => {
          const active = cat.slug === activeSlug
          return (
            <li key={cat.id}>
              <Link
                href={`/danh-muc/${cat.slug}`}
                className="flex items-center justify-between py-2 text-sm transition-colors group"
                style={{
                  color: active ? 'var(--cp)' : undefined,
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span className="text-gray-700 group-hover:text-[var(--cp)] transition-colors">
                  {cat.name}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[color-mix(in_srgb,var(--cp)_10%,transparent)] group-hover:text-[var(--cp)] transition-colors"
                >
                  {cat.count}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
