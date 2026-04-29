'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types/site-settings'
import type { NavItem } from '@/types/wordpress'
import NotificationBell from '@/components/layout/NotificationBell'

export type { NavItem }

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Mega menu = level-1 item whose children have their own children (depth ≥ 3)
function isMegaMenu(item: NavItem): boolean {
  return !!item.children?.some(c => c.children && c.children.length > 0)
}

function isActive(href: string, pathname: string): boolean {
  if (!href || href === '#') return false
  const path = href.split('#')[0]
  if (!path || path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(path + '/')
}

function isAnyDescendantActive(item: NavItem, pathname: string): boolean {
  if (isActive(item.href, pathname)) return true
  return item.children?.some(c => isAnyDescendantActive(c, pathname)) ?? false
}

// ─── Language Switcher ────────────────────────────────────────────────────────

function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <button
      onClick={() => router.replace(pathname, { locale: locale === 'vi' ? 'en' : 'vi' })}
      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200 text-gray-600 hover:border-(--cp) hover:text-(--cp) transition-colors"
      title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      <span className="text-sm leading-none">{locale === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
      <span>{locale === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  )
}

// ─── Desktop: Regular Dropdown (depth 1→2) ────────────────────────────────────

function RegularDropdown({ item, visible, pathname }: { item: NavItem; visible: boolean; pathname: string }) {
  return (
    <div className={cn(
      'absolute top-full left-0 mt-1.5 min-w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 transition-all duration-150 origin-top-left',
      visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
    )}>
      {item.children?.map(child => (
        <Link
          key={child.href}
          href={child.href}
          className={cn(
            'block px-4 py-2.5 text-sm border-l-2 transition-all',
            isActive(child.href, pathname)
              ? 'text-(--cp) bg-(--cp-pale) border-(--cp) font-semibold'
              : 'text-gray-700 hover:bg-(--cp-pale) hover:text-(--cp) hover:border-(--cp) border-transparent'
          )}
        >
          {child.label}
        </Link>
      ))}
    </div>
  )
}

// ─── Desktop: Mega Menu Panel (depth 1→2→3→4, full-width under nav) ───────────

function MegaPanel({
  item, visible, pathname,
  onEnter, onLeave,
}: {
  item: NavItem; visible: boolean; pathname: string
  onEnter: () => void; onLeave: () => void
}) {
  const cols = item.children?.length ?? 0

  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-full bg-white border-t-2 shadow-2xl z-40 transition-all duration-150 origin-top',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
      )}
      style={{ borderTopColor: 'var(--cp)' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div
          className="grid gap-x-8 gap-y-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(cols, 5)}, 1fr)` }}
        >
          {item.children?.map(col => (
            <div key={col.href}>
              {/* Level 2 — column heading */}
              <Link
                href={col.href}
                className={cn(
                  'block text-sm font-bold mb-3 pb-2.5 border-b transition-colors',
                  isActive(col.href, pathname)
                    ? 'border-(--cp)'
                    : 'border-gray-100 hover:border-(--cp)'
                )}
                style={{ color: 'var(--cp)', fontFamily: 'var(--font-heading)' }}
              >
                {col.label}
              </Link>

              {/* Level 3 */}
              <ul className="space-y-0.5">
                {col.children?.map(item3 => (
                  <li key={item3.href}>
                    <Link
                      href={item3.href}
                      className={cn(
                        'block px-2 py-1.5 text-sm rounded transition-colors',
                        isActive(item3.href, pathname)
                          ? 'text-(--cp) bg-(--cp-pale) font-semibold'
                          : 'text-gray-600 hover:text-(--cp) hover:bg-(--cp-pale)'
                      )}
                    >
                      {item3.label}
                    </Link>

                    {/* Level 4 */}
                    {item3.children?.map(item4 => (
                      <Link
                        key={item4.href}
                        href={item4.href}
                        className={cn(
                          'block pl-4 pr-2 py-1 text-xs rounded border-l-2 ml-2 transition-colors',
                          isActive(item4.href, pathname)
                            ? 'text-(--cp) bg-(--cp-pale) border-(--cp)'
                            : 'text-gray-400 hover:text-(--cp) hover:bg-(--cp-pale) border-transparent hover:border-(--cp)'
                        )}
                      >
                        {item4.label}
                      </Link>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Mobile: Recursive accordion item (up to 4 levels) ───────────────────────

function MobileNavItem({
  item, depth = 0, pathname, onClose,
}: {
  item: NavItem; depth?: number; pathname: string; onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const hasChildren = !!item.children?.length
  const active = isAnyDescendantActive(item, pathname)

  return (
    <div style={{ paddingLeft: depth > 0 ? `${depth * 14}px` : undefined }}>
      <div className="flex items-center border-b border-gray-50">
        <Link
          href={item.href}
          className={cn(
            'flex-1 py-2.5 text-sm transition-colors',
            depth === 0 ? 'font-semibold' : 'font-normal',
            active ? 'text-(--cp)' : 'text-gray-700'
          )}
          onClick={onClose}
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setOpen(v => !v)}
            className="p-2.5 text-gray-400 hover:text-(--cp) transition-colors shrink-0"
            aria-label={open ? 'Thu gọn' : 'Mở rộng'}
          >
            <svg
              className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="border-l-2 ml-1" style={{ borderColor: 'var(--cp-pale)' }}>
          {item.children!.map(child => (
            <MobileNavItem
              key={child.href}
              item={child}
              depth={depth + 1}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Header ──────────────────────────────────────────────────────────────

interface Props {
  settings: SiteSettings
  nav: NavItem[]
  locale: string
  multilingualEnabled?: boolean
}

export default function Header({ settings, nav, locale, multilingualEnabled = false }: Props) {
  const [menuOpen, setMenuOpen]         = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled]         = useState(false)
  const pathname                        = usePathname()
  const closeTimerRef                   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t                               = useTranslations('Header')
  const { logo, siteName, siteTagline, contact, topbar } = settings

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Hover with 120ms close-delay so mouse can move from trigger → panel
  const openMenu = useCallback((id: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setActiveDropdown(id)
  }, [])
  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 120)
  }, [])

  return (
    <header className="sticky top-0 z-50">

      {/* ── Topbar ──────────────────────────────────────────────────────────── */}
      {topbar.enabled && (
        <div className="bg-(--cd) text-white/70 text-xs py-1.5">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">

            <div className="hidden sm:flex items-center gap-3 min-w-0">
              {topbar.text ? (
                <span className="text-white/90 font-medium truncate">{topbar.text}</span>
              ) : (
                <>
                  {contact.address && (
                    <span className="flex items-center gap-1 truncate">
                      <svg className="w-3 h-3 shrink-0 text-(--cp-light)" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {contact.address}
                    </span>
                  )}
                  {contact.workingHours && (
                    <span className="flex items-center gap-1 shrink-0" style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '0.75rem' }}>
                      <svg className="w-3 h-3 shrink-0 text-(--cp-light)" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                      </svg>
                      {contact.workingHours}
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden md:flex items-center gap-2">
                {contact.zaloLink && (
                  <a href={contact.zaloLink} target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors" title="Zalo">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.003 2C6.478 2 2 6.478 2 12.003c0 1.845.487 3.575 1.338 5.078L2 22l5.087-1.312a9.957 9.957 0 004.916 1.285h.003c5.525 0 10.003-4.477 10.003-10.003S17.528 2 12.003 2zM9.08 7.5c.175 0 .36.003.527.01.17.008.396-.065.62.475.234.566.793 1.934.862 2.073.07.14.116.304.022.49-.092.185-.14.3-.277.46-.14.16-.293.357-.42.48-.14.136-.285.283-.123.555.163.273.723 1.19 1.553 1.928.837.737 1.547 1.007 1.82 1.12.273.115.432.096.594-.057.163-.153.693-.81.878-1.086.184-.274.366-.228.614-.137.247.092 1.57.74 1.84.875.27.135.45.203.516.316.066.113.066.655-.154 1.288-.22.633-1.293 1.21-1.793 1.254-.5.045-.968.22-3.247-.677-2.73-1.065-4.456-3.846-4.59-4.023-.136-.176-1.1-1.462-1.1-2.79 0-1.327.695-1.98.942-2.25.245-.27.535-.338.714-.338z"/>
                    </svg>
                  </a>
                )}
                {contact.facebookLink && (
                  <a href={contact.facebookLink} target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors" title="Facebook">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>

              {(contact.zaloLink || contact.facebookLink) && (contact.hotline || contact.phone) && (
                <span className="hidden md:block w-px h-3 bg-white/20" />
              )}

              {contact.hotline ? (
                <a href={`tel:${contact.hotline.replace(/\s/g, '')}`}
                  className="flex items-center gap-1.5 bg-(--cp) text-white px-3 py-0.5 rounded-full font-bold hover:opacity-90 transition-opacity shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  {contact.hotline}
                </a>
              ) : contact.phone ? (
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-1 text-(--cp-light) font-semibold hover:text-white transition-colors shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  {contact.phone}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ── Main nav ─────────────────────────────────────────────────────────── */}
      <nav className={cn(
        'relative bg-white border-b border-gray-100 transition-shadow duration-200',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {logo ? (
              <Image
                src={logo.url} alt={logo.alt || siteName}
                width={logo.width} height={logo.height}
                className="h-10 w-auto object-contain" priority
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, var(--cp), var(--cp-light))' }}
                >
                  {siteName.charAt(0)}
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-(--cd) text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                    {siteName}
                  </p>
                  {siteTagline && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{siteTagline}</p>
                  )}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-0.5">
            {nav.map(item => {
              const mega    = isMegaMenu(item)
              const hasKids = !!item.children?.length
              const active  = isAnyDescendantActive(item, pathname)

              return (
                <li
                  key={item.href}
                  className={cn('relative', mega && 'static')}
                  onMouseEnter={() => openMenu(item.href)}
                  onMouseLeave={scheduleClose}
                >
                  {hasKids ? (
                    <button className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors',
                      active
                        ? 'text-(--cp) bg-(--cp-pale)'
                        : 'text-gray-700 hover:text-(--cp) hover:bg-(--cp-pale)'
                    )}>
                      {item.label}
                      <svg
                        className={cn('w-3 h-3 opacity-60 transition-transform duration-200', activeDropdown === item.href && 'rotate-180')}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-3 py-2 text-sm font-semibold rounded-lg transition-colors',
                        active
                          ? 'text-(--cp) bg-(--cp-pale)'
                          : 'text-gray-700 hover:text-(--cp) hover:bg-(--cp-pale)'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Regular dropdown (no grandchildren) */}
                  {hasKids && !mega && (
                    <RegularDropdown
                      item={item}
                      visible={activeDropdown === item.href}
                      pathname={pathname}
                    />
                  )}
                </li>
              )
            })}

            <li className="flex items-center gap-2 ml-2">
              {multilingualEnabled && <LanguageSwitcher locale={locale} />}
              <NotificationBell />
              <Link
                href="/lien-he"
                className="px-4 py-2 text-sm font-bold text-white rounded-lg transition-all hover:opacity-90 hover:-translate-y-px"
                style={{ background: 'var(--cp)', boxShadow: '0 3px 12px color-mix(in srgb, var(--cp) 40%, transparent)' }}
              >
                {t('cta')}
              </Link>
            </li>
          </ul>

          {/* Mobile: lang + bell + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {multilingualEnabled && <LanguageSwitcher locale={locale} />}
            <NotificationBell />
            <button
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-50"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span className={cn('block w-5 h-0.5 bg-current mb-1 transition-transform origin-center', menuOpen && 'translate-y-1.5 rotate-45')} />
              <span className={cn('block w-5 h-0.5 bg-current mb-1 transition-opacity',               menuOpen && 'opacity-0')} />
              <span className={cn('block w-5 h-0.5 bg-current transition-transform origin-center',    menuOpen && '-translate-y-1.5 -rotate-45')} />
            </button>
          </div>
        </div>

        {/* ── Mega menu panels (positioned under full nav bar) ────────────── */}
        {nav.filter(isMegaMenu).map(item => (
          <MegaPanel
            key={item.href}
            item={item}
            visible={activeDropdown === item.href}
            pathname={pathname}
            onEnter={() => openMenu(item.href)}
            onLeave={scheduleClose}
          />
        ))}

        {/* ── Mobile menu (full accordion, up to 4 levels) ────────────────── */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 max-h-[75vh] overflow-y-auto">
            {nav.map(item => (
              <MobileNavItem
                key={item.href}
                item={item}
                pathname={pathname}
                onClose={() => setMenuOpen(false)}
              />
            ))}
            <div className="pt-3 pb-2 mt-1 border-t border-gray-100">
              <Link
                href="/lien-he"
                className="block w-full text-center py-2.5 text-sm font-bold text-white rounded-lg"
                style={{ background: 'var(--cp)' }}
                onClick={() => setMenuOpen(false)}
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
