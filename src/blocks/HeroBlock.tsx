import Link from 'next/link'
import type { HeroBlock } from './types'

export default function HeroBlock({ block }: { block: HeroBlock }) {
  const {
    badge_text, headline, headline_highlight, slogan, description,
    cta_primary_text, cta_primary_link,
    cta_secondary_text, cta_secondary_link,
    stats, checklist, show_stats_card,
  } = block

  return (
    <section
      className="relative overflow-hidden py-24 min-h-[580px] flex items-center"
      style={{ background: 'linear-gradient(135deg, var(--cd) 0%, color-mix(in srgb, var(--cd) 85%, #0f3460) 100%)' }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute right-0 top-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--cp) 15%, transparent) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* Left: Content */}
          <div>
            {badge_text && (
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{
                  background: 'color-mix(in srgb, var(--cp) 15%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--cp) 30%, transparent)',
                  color: 'var(--cp-light)',
                }}
              >
                {badge_text}
              </div>
            )}

            <h1
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {headline}{' '}
              {headline_highlight && (
                <span style={{ color: 'var(--cp-light)' }}>{headline_highlight}</span>
              )}
            </h1>

            {slogan && (
              <p className="text-lg text-white/70 italic mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {slogan}
              </p>
            )}
            {description && (
              <p className="text-sm text-white/60 leading-relaxed mb-8">{description}</p>
            )}

            <div className="flex flex-wrap gap-3">
              {cta_primary_text && (
                <Link
                  href={cta_primary_link || '/lien-he'}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'var(--cp)',
                    boxShadow: '0 6px 20px color-mix(in srgb, var(--cp) 40%, transparent)',
                  }}
                >
                  {cta_primary_text}
                </Link>
              )}
              {cta_secondary_text && (
                <Link
                  href={cta_secondary_link || '/dich-vu'}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:bg-white/10"
                  style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}
                >
                  {cta_secondary_text}
                </Link>
              )}
            </div>
          </div>

          {/* Right: Stats card */}
          {show_stats_card && (
            <div
              className="rounded-2xl p-8 hidden md:block"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <p
                className="text-white font-semibold mb-5 pb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                ✦ Thành Tích Nổi Bật
              </p>

              {stats?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map((s, i) => (
                    <div key={i}>
                      <p
                        className="text-3xl font-bold leading-none mb-1"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--cp-light)' }}
                      >
                        {s.value}
                      </p>
                      <p className="text-xs text-white/50">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {checklist?.length > 0 && (
                <ul className="space-y-2">
                  {checklist.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-white/75">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: 'color-mix(in srgb, var(--cp) 20%, transparent)',
                          color: 'var(--cp-light)',
                        }}
                      >
                        ✓
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
