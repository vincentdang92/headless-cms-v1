'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types/site-settings'

export interface NavItem {
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}

interface Props {
  settings: SiteSettings
  nav: NavItem[]
}

export default function Header({ settings, nav }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { logo, siteName, siteTagline, contact, topbar } = settings

  return (
    <header className="sticky top-0 z-50">
      {/* Topbar */}
      {topbar.enabled && (
        <div className="bg-(--cd) text-white/80 text-xs py-1.5">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
            <span className="hidden sm:block">
              📍 {contact.address}
              {contact.email && <> &nbsp;|&nbsp; ✉️ {contact.email}</>}
            </span>
            <div className="flex items-center gap-4 ml-auto">
              {topbar.text && <span>{topbar.text}</span>}
              {contact.hotline && (
                <a
                  href={`tel:${contact.hotline.replace(/\s/g, '')}`}
                  className="bg-(--cp) text-white px-3 py-0.5 rounded-full font-bold hover:opacity-90 transition-opacity"
                >
                  📞 {contact.hotline}
                </a>
              )}
              {!contact.hotline && contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="text-(--cp-light) font-semibold"
                >
                  📞 {contact.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {logo ? (
              <Image
                src={logo.url}
                alt={logo.alt || siteName}
                width={logo.width}
                height={logo.height}
                className="h-10 w-auto object-contain"
                priority
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
                  <p className="font-bold text-(--cd) text-sm"
                     style={{ fontFamily: 'var(--font-heading)' }}>
                    {siteName}
                  </p>
                  {siteTagline && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {siteTagline}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="relative group">
                {item.children?.length ? (
                  <>
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-(--cp) hover:bg-(--cp-pale) rounded-lg transition-colors"
                      onMouseEnter={() => setOpenDropdown(item.href)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.label}
                      <svg className="w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M2 4l4 4 4-4"/>
                      </svg>
                    </button>
                    {/* Dropdown */}
                    <div
                      className={cn(
                        'absolute top-full left-0 mt-1 min-w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transition-all',
                        openDropdown === item.href ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                      )}
                      onMouseEnter={() => setOpenDropdown(item.href)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-(--cp-pale) hover:text-(--cp) border-l-2 border-transparent hover:border-(--cp) transition-all"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:text-(--cp) hover:bg-(--cp-pale) rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}

            <li>
              <Link
                href="/lien-he"
                className="ml-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all hover:opacity-90 hover:-translate-y-px"
                style={{ background: 'var(--cp)', boxShadow: '0 3px 12px color-mix(in srgb, var(--cp) 40%, transparent)' }}
              >
                Liên hệ ngay
              </Link>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={cn('block w-5 h-0.5 bg-current mb-1 transition-transform origin-center', menuOpen && 'translate-y-1.5 rotate-45')} />
            <span className={cn('block w-5 h-0.5 bg-current mb-1 transition-opacity', menuOpen && 'opacity-0')} />
            <span className={cn('block w-5 h-0.5 bg-current transition-transform origin-center', menuOpen && '-translate-y-1.5 -rotate-45')} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
            {nav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2.5 text-sm font-semibold text-gray-700 border-b border-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block pl-4 py-2 text-sm text-gray-500 hover:text-(--cp)"
                    onClick={() => setMenuOpen(false)}
                  >
                    — {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
