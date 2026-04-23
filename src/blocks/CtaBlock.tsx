import Link from 'next/link'
import type { CtaBlock } from './types'

export default function CtaBlock({ block }: { block: CtaBlock }) {
  const { headline, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, dark_background } = block

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={dark_background
        ? { background: 'linear-gradient(135deg, var(--cd), color-mix(in srgb, var(--cd) 80%, #0f3460))' }
        : { background: 'var(--cp)' }
      }
    >
      {/* Decorative glow */}
      <div
        className="absolute right-0 bottom-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--cp-light) 15%, transparent), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {headline && (
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {headline}
          </h2>
        )}
        {description && (
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            {description}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
          {cta_primary_text && (
            <Link
              href={cta_primary_link || '/lien-he'}
              className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: '#fff',
                color: dark_background ? 'var(--cp)' : 'var(--cd)',
              }}
            >
              {cta_primary_text}
            </Link>
          )}
          {cta_secondary_text && (
            <Link
              href={cta_secondary_link || '/dich-vu'}
              className="px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.4)' }}
            >
              {cta_secondary_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
