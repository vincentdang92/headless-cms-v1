'use client'

import { useRouter, usePathname } from '@/i18n/navigation'

export type NewsView = 'list' | 'grid3' | 'grid4'

const STORAGE_KEY = 'news-view'

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="2.5" width="4.5" height="4" rx="1" fill="currentColor" opacity=".5" />
    <rect x="1" y="11.5" width="4.5" height="4" rx="1" fill="currentColor" opacity=".5" />
    <rect x="7" y="4" width="10" height="1.5" rx=".75" fill="currentColor" />
    <rect x="7" y="6.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".4" />
    <rect x="7" y="13" width="10" height="1.5" rx=".75" fill="currentColor" />
    <rect x="7" y="15.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".4" />
  </svg>
)

const Grid3Icon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="4.5" height="7" rx="1" fill="currentColor" />
    <rect x="6.75" y="1" width="4.5" height="7" rx="1" fill="currentColor" />
    <rect x="12.5" y="1" width="4.5" height="7" rx="1" fill="currentColor" />
    <rect x="1" y="10" width="4.5" height="7" rx="1" fill="currentColor" opacity=".35" />
    <rect x="6.75" y="10" width="4.5" height="7" rx="1" fill="currentColor" opacity=".35" />
    <rect x="12.5" y="10" width="4.5" height="7" rx="1" fill="currentColor" opacity=".35" />
  </svg>
)

const Grid4Icon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="3" height="7" rx="1" fill="currentColor" />
    <rect x="5.3" y="1" width="3" height="7" rx="1" fill="currentColor" />
    <rect x="9.7" y="1" width="3" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="1" width="3" height="7" rx="1" fill="currentColor" />
    <rect x="1" y="10" width="3" height="7" rx="1" fill="currentColor" opacity=".35" />
    <rect x="5.3" y="10" width="3" height="7" rx="1" fill="currentColor" opacity=".35" />
    <rect x="9.7" y="10" width="3" height="7" rx="1" fill="currentColor" opacity=".35" />
    <rect x="14" y="10" width="3" height="7" rx="1" fill="currentColor" opacity=".35" />
  </svg>
)

const VIEWS: { value: NewsView; icon: React.ReactNode; label: string }[] = [
  { value: 'list',  icon: <ListIcon />,  label: 'Danh sách' },
  { value: 'grid3', icon: <Grid3Icon />, label: '3 cột' },
  { value: 'grid4', icon: <Grid4Icon />, label: '4 cột' },
]

export function getGridClass(view: NewsView): string {
  if (view === 'list')  return 'grid grid-cols-1 gap-4'
  if (view === 'grid4') return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
  return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
}

export default function ViewToggle({ current }: { current: NewsView }) {
  const router = useRouter()
  const pathname = usePathname()

  function navigate(view: NewsView) {
    try { localStorage.setItem(STORAGE_KEY, view) } catch {}
    const params = new URLSearchParams(window.location.search)
    params.set('view', view)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-xl border border-gray-200 p-1 bg-gray-50 flex-shrink-0">
      {VIEWS.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => navigate(value)}
          title={label}
          className={`p-2 rounded-lg transition-all ${
            current === value
              ? 'text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-600 hover:bg-white'
          }`}
          style={current === value ? { background: 'var(--cp)' } : undefined}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
