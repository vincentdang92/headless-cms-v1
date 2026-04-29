'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn, formatDate } from '@/lib/utils'
import type { WPReview } from '@/lib/wordpress'

interface Props {
  postId: number
  initialReviews: WPReview[]
}

const EMOJIS = ['😞', '😕', '😐', '😊', '🤩'] as const
const EMOJI_LABELS = ['Rất tệ', 'Không hay', 'Bình thường', 'Hay đấy', 'Tuyệt vời']

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2.5 text-xs text-gray-500">
      <span className="w-8 shrink-0 text-lg leading-none">{EMOJIS[stars - 1]}</span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: 'var(--cp)' }}
        />
      </div>
      <span className="w-5 text-right shrink-0 tabular-nums">{count}</span>
    </div>
  )
}

export default function ArticleRating({ postId, initialReviews }: Props) {
  const t = useTranslations('News')
  const submitKey = `reviewed_${postId}`

  const [reviews] = useState<WPReview[]>(initialReviews)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', content: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error' | 'duplicate'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const alreadySubmitted = typeof window !== 'undefined' && !!localStorage.getItem(submitKey)

  const total = reviews.length
  const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }))

  const activeIdx = (hover || rating) - 1

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return
    setStatus('loading')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: form.name,
          authorEmail: form.email,
          content: form.content,
          rating,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem(submitKey, '1')
        setStatus('done')
      } else if (data.code === 'duplicate') {
        setStatus('duplicate')
      } else {
        setErrorMsg(data.message || t('reviewsError'))
        setStatus('error')
      }
    } catch {
      setErrorMsg(t('reviewsError'))
      setStatus('error')
    }
  }

  return (
    <div className="py-8 space-y-8">
      <h3 className="text-lg font-bold text-gray-900">{t('reviewsTitle')}</h3>

      {/* ── Rating summary ─────────────────────────────────── */}
      {total > 0 && (
        <div className="flex gap-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex flex-col items-center justify-center gap-1 shrink-0 min-w-[80px]">
            <span className="text-5xl leading-none">{EMOJIS[Math.round(avg) - 1]}</span>
            <span className="text-3xl font-bold text-gray-900 tabular-nums mt-1">{avg.toFixed(1)}</span>
            <span className="text-xs text-gray-400">{t('reviewsCount', { count: total })}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            {dist.map(({ stars, count }) => (
              <RatingBar key={stars} stars={stars} count={count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* ── Form ──────────────────────────────────────────── */}
      {!alreadySubmitted && status !== 'done' && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl border border-gray-100 space-y-4">
          <p className="text-sm font-semibold text-gray-700">{t('reviewsForm')}</p>

          {/* Emoji picker */}
          <div>
            <div className="flex items-center gap-0.5">
              {EMOJIS.map((emoji, i) => {
                const val = i + 1
                const active = (hover || rating) >= val
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHover(val)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${val} — ${EMOJI_LABELS[i]}`}
                    className={cn(
                      'text-4xl p-1.5 rounded-xl transition-all duration-150 select-none',
                      active ? 'scale-110 drop-shadow-sm' : 'opacity-30 hover:opacity-60'
                    )}
                  >
                    {emoji}
                  </button>
                )
              })}
              {activeIdx >= 0 && (
                <span className="ml-2 text-sm font-medium" style={{ color: 'var(--cp)' }}>
                  {EMOJI_LABELS[activeIdx]}
                </span>
              )}
            </div>
            {!rating && <p className="mt-1 text-xs text-gray-400">{t('reviewsRatingLabel')}</p>}
          </div>

          <textarea
            required
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder={t('reviewsContent')}
            rows={3}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--cp)] resize-none transition-colors"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={t('reviewsName')}
              className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--cp)] transition-colors"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder={t('reviewsEmail')}
              className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--cp)] transition-colors"
            />
          </div>

          {status === 'error' && <p className="text-xs text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === 'loading' || !rating}
            className={cn(
              'w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity',
              rating && status !== 'loading' ? 'opacity-100 hover:opacity-90' : 'opacity-40 cursor-not-allowed'
            )}
            style={{ background: 'var(--cp)' }}
          >
            {status === 'loading' ? '…' : t('reviewsSubmit')}
          </button>
        </form>
      )}

      {/* ── Status messages ────────────────────────────────── */}
      {(status === 'done' || alreadySubmitted) && (
        <div
          className="flex items-center gap-2 p-4 rounded-2xl text-sm"
          style={{ background: 'color-mix(in srgb, var(--cp) 8%, white)', color: 'var(--cp)' }}
        >
          <span className="text-lg">🕐</span>
          <span>{t('reviewsPending')}</span>
        </div>
      )}
      {status === 'duplicate' && (
        <div className="flex items-center gap-2 p-4 rounded-2xl text-sm bg-amber-50 text-amber-700">
          <span className="text-lg">⚠️</span>
          <span>{t('reviewsDuplicate')}</span>
        </div>
      )}

      {/* ── Review list ────────────────────────────────────── */}
      {total > 0 ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: 'var(--cp)' }}
                >
                  {r.author.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{r.author}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{EMOJIS[r.rating - 1]}</span>
                    <span className="text-xs text-gray-400">{formatDate(r.date)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-2">{t('reviewsEmpty')}</p>
      )}
    </div>
  )
}
