'use client'

import { useEffect, useState } from 'react'
import { useRouter, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface User {
  id:    number
  name:  string
  email: string
}

export default function AccountClient() {
  const t      = useTranslations('Auth')
  const router = useRouter()

  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() as Promise<User> : null)
      .then(data => {
        if (!data) {
          router.replace('/dang-nhap')
        } else {
          setUser(data)
        }
      })
      .catch(() => router.replace('/dang-nhap'))
      .finally(() => setLoading(false))
  }, [router])

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/dang-nhap')
  }

  if (loading) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-[var(--cp)] animate-spin mx-auto" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
          style={{ background: 'var(--cp)' }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-gray-400">{t('welcome')}</p>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {user.name}
          </h1>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6 space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ background: 'color-mix(in srgb, var(--cp) 12%, transparent)', color: 'var(--cp)' }}>
            ✉
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('email')}</p>
            <p className="text-sm font-medium text-gray-700">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ background: 'color-mix(in srgb, var(--cp) 12%, transparent)', color: 'var(--cp)' }}>
            #
          </div>
          <div>
            <p className="text-xs text-gray-400">ID</p>
            <p className="text-sm font-medium text-gray-700">{user.id}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="text-center py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-[var(--cp)] hover:text-[var(--cp)] transition-colors"
        >
          {t('goHome')}
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 cursor-pointer"
          style={{ background: 'var(--cp)' }}
        >
          {loggingOut ? '...' : t('logout')}
        </button>
      </div>
    </div>
  )
}
