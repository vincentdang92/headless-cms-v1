'use client'

import { useState, type FormEvent } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const INPUT = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[var(--cp)] transition-colors bg-white'
const BTN   = 'w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 cursor-pointer'

export default function RegisterForm() {
  const t = useTranslations('Auth')

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError(t('errorWeakPassword'))
      return
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t('errorDefault'))
      } else {
        setDone(true)
      }
    } catch {
      setError(t('errorDefault'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t('registerSuccess')}</h2>
        <p className="text-sm text-gray-500 mb-6">{t('registerSuccessDesc')}</p>
        <Link
          href="/dang-nhap"
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--cp)' }}
        >
          {t('loginLink')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-8">
        <h1
          className="text-2xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('registerTitle')}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {t('hasAccount')}
          <Link href="/dang-nhap" className="font-medium hover:underline" style={{ color: 'var(--cp)' }}>
            {t('loginLink')}
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('name')}</label>
            <input
              type="text" required autoComplete="name"
              value={name} onChange={e => setName(e.target.value)}
              className={INPUT} placeholder={t('namePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('email')}</label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              className={INPUT} placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('password')}</label>
            <input
              type="password" required autoComplete="new-password" minLength={6}
              value={password} onChange={e => setPassword(e.target.value)}
              className={INPUT} placeholder="••••••  (ít nhất 6 ký tự)"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className={BTN} style={{ background: 'var(--cp)' }}
          >
            {loading ? '...' : t('registerSubmit')}
          </button>
        </form>
      </div>
    </div>
  )
}
