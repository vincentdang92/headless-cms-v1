'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type Mode = 'login' | 'forgot'

const INPUT = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[var(--cp)] transition-colors bg-white'
const BTN   = 'w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 cursor-pointer'

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const t      = useTranslations('Auth')
  const router = useRouter()

  const [mode, setMode]           = useState<Mode>('login')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t('errorDefault'))
      } else {
        router.push(redirectTo ?? '/tai-khoan')
      }
    } catch {
      setError(t('errorDefault'))
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      setForgotSent(true)
    } catch {
      setError(t('errorDefault'))
    } finally {
      setLoading(false)
    }
  }

  if (forgotSent) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t('forgotTitle')}</h2>
        <p className="text-sm text-gray-500 mb-6">{t('forgotSuccess')}</p>
        <button
          onClick={() => { setMode('login'); setForgotSent(false) }}
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--cp)' }}
        >
          {t('backToLogin')}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-8">
        {mode === 'login' ? (
          <>
            <h1
              className="text-2xl font-bold text-gray-900 mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('loginTitle')}
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              {t('noAccount')}
              <Link href="/dang-ky" className="font-medium hover:underline" style={{ color: 'var(--cp)' }}>
                {t('registerLink')}
              </Link>
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

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
                  type="password" required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className={INPUT} placeholder="••••••"
                />
              </div>

              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError('') }}
                  className="text-xs text-gray-400 hover:text-[var(--cp)] transition-colors"
                >
                  {t('forgotPassword')}
                </button>
              </div>

              <button
                type="submit" disabled={loading}
                className={BTN} style={{ background: 'var(--cp)' }}
              >
                {loading ? '...' : t('loginSubmit')}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1
              className="text-2xl font-bold text-gray-900 mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('forgotTitle')}
            </h1>
            <p className="text-sm text-gray-400 mb-6">{t('forgotDesc')}</p>

            <form onSubmit={handleForgot} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('email')}</label>
                <input
                  type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={INPUT} placeholder="you@example.com"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className={BTN} style={{ background: 'var(--cp)' }}
              >
                {loading ? '...' : t('forgotSubmit')}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setMode('login'); setError('') }}
              className="mt-4 text-sm font-medium hover:underline block"
              style={{ color: 'var(--cp)' }}
            >
              {t('backToLogin')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
