import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings } from '@/types/site-settings'
import type { NavItem } from './Header'

interface Props {
  settings: SiteSettings
  nav: NavItem[]
}

export default function Footer({ settings, nav }: Props) {
  const { siteName, siteTagline, logo, contact, footer } = settings

  const socialLinks = [
    contact.facebookLink && { label: 'Facebook', href: contact.facebookLink, icon: 'FB' },
    contact.zaloLink && { label: 'Zalo', href: contact.zaloLink, icon: 'ZL' },
    contact.youtubeLink && { label: 'YouTube', href: contact.youtubeLink, icon: 'YT' },
    contact.twitterLink && { label: 'Twitter', href: contact.twitterLink, icon: 'TW' },
    contact.linkedinLink && { label: 'LinkedIn', href: contact.linkedinLink, icon: 'LI' },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: string }>

  return (
    <footer className="bg-(--cd) text-white/70 mt-20">
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {logo ? (
                <Image
                  src={logo.url}
                  alt={logo.alt || siteName}
                  width={logo.width}
                  height={logo.height}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--cp), var(--cp-light))' }}
                  >
                    {siteName.charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-white text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                      {siteName}
                    </p>
                    {siteTagline && (
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{siteTagline}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4">{footer.about}</p>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-(--cp) transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4
              className="text-white font-semibold text-sm mb-4 pb-2 border-b border-white/10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Liên kết
            </h4>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-(--cp-light) transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services (nếu có nav children) */}
          {nav.some((n) => n.children?.length) && (
            <div>
              <h4
                className="text-white font-semibold text-sm mb-4 pb-2 border-b border-white/10"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Dịch vụ
              </h4>
              <ul className="space-y-2">
                {nav
                  .flatMap((n) => n.children ?? [])
                  .slice(0, 6)
                  .map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="text-sm hover:text-(--cp-light) transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Col 4: Contact info */}
          <div>
            <h4
              className="text-white font-semibold text-sm mb-4 pb-2 border-b border-white/10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm">
              {contact.address && (
                <li className="flex gap-2">
                  <span className="shrink-0">📍</span>
                  <span>{contact.address}</span>
                </li>
              )}
              {(contact.hotline || contact.phone) && (
                <li className="flex gap-2">
                  <span className="shrink-0">📞</span>
                  <a
                    href={`tel:${(contact.hotline || contact.phone).replace(/\s/g, '')}`}
                    className="hover:text-(--cp-light) transition-colors"
                  >
                    {contact.hotline || contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex gap-2">
                  <span className="shrink-0">✉️</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-(--cp-light) transition-colors"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.workingHours && (
                <li className="flex gap-2">
                  <span className="shrink-0">🕐</span>
                  <span>{contact.workingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>{footer.copyright}</p>
          <div className="flex gap-4">
            <Link href="/chinh-sach-bao-mat" className="hover:text-white/70 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/dieu-khoan-su-dung" className="hover:text-white/70 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
