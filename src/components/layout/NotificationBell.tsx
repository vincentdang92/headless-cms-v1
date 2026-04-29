'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { subscribePushNotifications, isFirebaseConfigured } from '@/lib/firebase-client'

type BellState = 'idle' | 'subscribed' | 'denied' | 'loading'

const LS_KEY = 'push_subscribed'

export default function NotificationBell() {
  const t = useTranslations('Push')
  const [state, setState] = useState<BellState>('idle')
  const [tooltip, setTooltip] = useState('')

  useEffect(() => {
    if (!isFirebaseConfigured()) return
    if (!('Notification' in window)) return

    if (Notification.permission === 'denied') {
      setState('denied')
    } else if (Notification.permission === 'granted' && localStorage.getItem(LS_KEY) === '1') {
      setState('subscribed')
    }
  }, [])

  // Don't render if Firebase isn't configured
  if (!isFirebaseConfigured()) return null
  if (typeof window !== 'undefined' && !('Notification' in window)) return null

  async function handleClick() {
    if (state === 'subscribed') {
      setTooltip(t('alreadySubscribed'))
      setTimeout(() => setTooltip(''), 2500)
      return
    }
    if (state === 'denied') {
      setTooltip(t('blockedHint'))
      setTimeout(() => setTooltip(''), 3000)
      return
    }

    setState('loading')
    const result = await subscribePushNotifications()

    if (result.ok) {
      localStorage.setItem(LS_KEY, '1')
      setState('subscribed')
      setTooltip(t('subscribeSuccess'))
    } else if (result.reason === 'denied') {
      setState('denied')
      setTooltip(t('denied'))
    } else {
      setState('idle')
      setTooltip(t('error'))
    }
    setTimeout(() => setTooltip(''), 3000)
  }

  const title = state === 'subscribed' ? t('alreadySubscribed')
              : state === 'denied'     ? t('blockedHint')
              : t('subscribe')

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        title={title}
        aria-label={title}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-(--cp) hover:bg-(--cp-pale) transition-colors disabled:opacity-50"
      >
        {state === 'loading' ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        ) : state === 'denied' ? (
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={state === 'subscribed' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )}

        {/* Subscribed dot */}
        {state === 'subscribed' && (
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: 'var(--cp)' }}
          />
        )}
      </button>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute right-0 top-full mt-2 z-50 whitespace-nowrap text-xs bg-gray-900 text-white px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none">
          {tooltip}
          <div className="absolute -top-1 right-2.5 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  )
}
