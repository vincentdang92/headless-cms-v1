'use client'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { TocItem } from '@/lib/utils'

interface Props {
  toc: TocItem[]
  /**
   * Ngưỡng scroll (px) trước khi floating button xuất hiện trên desktop.
   * Mặc định 400px — sau khi user đọc qua title + featured image.
   */
  floatingThreshold?: number
  /**
   * Khoảng đệm (px) trừ vào vị trí scroll target — bù sticky header
   * để heading không bị che. Mặc định 96.
   */
  scrollOffset?: number
  /**
   * Thời gian animate (ms). 0 = jump tức thì, không animate. Mặc định 700.
   */
  scrollDuration?: number
}

// easeInOutCubic — chậm đầu, nhanh giữa, chậm cuối (mượt nhất cho UI scroll)
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function smoothScrollTo(targetY: number, duration: number) {
  if (duration <= 0) {
    window.scrollTo(0, targetY)
    return
  }
  const startY = window.scrollY
  const distance = targetY - startY
  if (Math.abs(distance) < 1) return

  const startTime = performance.now()
  let raf = 0
  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * ease(progress))
    if (progress < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)

  // Dừng nếu user scroll thủ công (wheel/touch) → tránh fight với user input
  const cancel = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
  }
  window.addEventListener('wheel', cancel, { passive: true, once: true })
  window.addEventListener('touchstart', cancel, { passive: true, once: true })
}

export default function TableOfContents({
  toc,
  floatingThreshold = 400,
  scrollOffset = 96,
  scrollDuration = 700,
}: Props) {
  const t = useTranslations('News')
  const [activeId, setActiveId] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [floatingOpen, setFloatingOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Scroll-spy
  useEffect(() => {
    if (!toc.length) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    )

    toc.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [toc])

  // Show floating button khi scroll quá ngưỡng
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > floatingThreshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [floatingThreshold])

  // Click ngoài panel → đóng
  useEffect(() => {
    if (!floatingOpen) return
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setFloatingOpen(false)
      }
    }
    // Trì hoãn 1 tick để click mở button không trigger luôn close
    const id = window.setTimeout(() => document.addEventListener('click', onClick), 0)
    return () => {
      window.clearTimeout(id)
      document.removeEventListener('click', onClick)
    }
  }, [floatingOpen])

  // Esc → đóng
  useEffect(() => {
    if (!floatingOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFloatingOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [floatingOpen])

  if (!toc.length) return null

  const handleClick = (id: string, closeFloat = false) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const targetY = el.getBoundingClientRect().top + window.scrollY - scrollOffset
    smoothScrollTo(Math.max(0, targetY), scrollDuration)
    // Cập nhật URL hash mà không scroll thêm (history API)
    history.replaceState(null, '', `#${id}`)
    setActiveId(id)
    if (closeFloat) setFloatingOpen(false)
  }

  const List = ({ onItemClick }: { onItemClick?: (id: string) => (e: React.MouseEvent) => void }) => (
    <ul className="space-y-0.5">
      {toc.map((item) => (
        <li key={item.id} style={{ paddingLeft: item.level === 3 ? '0.875rem' : '0' }}>
          <a
            href={`#${item.id}`}
            onClick={onItemClick ? onItemClick(item.id) : handleClick(item.id)}
            className={cn(
              'block text-sm py-1 leading-snug transition-colors hover:text-[var(--cp)]',
              activeId === item.id ? 'text-[var(--cp)] font-semibold' : 'text-gray-500',
              item.level === 3 && 'text-xs'
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* ── Mobile accordion (lg ẩn) ───────────────────────────────────── */}
      <div className="lg:hidden mb-8 rounded-xl border border-gray-100 overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span>{t('toc')}</span>
          <svg
            className={cn('w-4 h-4 transition-transform', mobileOpen && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && <div className="px-4 py-3"><List /></div>}
      </div>

      {/* ── Desktop floating button (trái màn hình, hiện sau khi scroll) ─ */}
      <div
        ref={panelRef}
        className={cn(
          'hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300',
          scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        )}
      >
        {/* Toggle button */}
        <button
          onClick={() => setFloatingOpen((v) => !v)}
          aria-label={t('toc')}
          aria-expanded={floatingOpen}
          className={cn(
            'w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105',
            floatingOpen && 'scale-110'
          )}
          style={{ background: 'var(--cp)' }}
        >
          {floatingOpen ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          )}
        </button>

        {/* Expanded panel */}
        <div
          className={cn(
            'absolute left-16 top-1/2 -translate-y-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all origin-left',
            floatingOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          )}
        >
          <div
            className="px-5 py-3 border-b border-gray-100 flex items-center justify-between"
            style={{ background: 'color-mix(in srgb, var(--cp) 5%, white)' }}
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cp)' }}>
              {t('toc')}
            </span>
            <span className="text-xs text-gray-400">{toc.length}</span>
          </div>
          <div className="px-5 py-3 max-h-[60vh] overflow-y-auto">
            <List onItemClick={(id) => handleClick(id, true)} />
          </div>
        </div>
      </div>
    </>
  )
}
