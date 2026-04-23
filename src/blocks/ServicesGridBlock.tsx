'use client'

import Link from 'next/link'
import type { ServicesGridBlock } from './types'

const GRID_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}

export default function ServicesGridBlock({ block }: { block: ServicesGridBlock }) {
  const { section_label, section_title, section_desc, dark_background, columns = 3, services } = block
  const cols = GRID_COLS[columns] ?? GRID_COLS[3]

  return (
    <section
      className="py-20 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: 'var(--cp-pale)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          {section_label && (
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: dark_background ? 'var(--cp-light)' : 'var(--cp)' }}
            >
              {section_label}
            </span>
          )}
          {section_title && (
            <h2
              className="text-3xl font-bold mb-3"
              style={{
                fontFamily: 'var(--font-heading)',
                color: dark_background ? '#fff' : 'var(--cd)',
              }}
            >
              {section_title}
            </h2>
          )}
          {section_desc && (
            <p
              className="text-sm max-w-xl mx-auto leading-relaxed"
              style={{ color: dark_background ? 'rgba(255,255,255,0.55)' : '#6b7280' }}
            >
              {section_desc}
            </p>
          )}
        </div>

        {/* Cards grid */}
        <div className={`grid grid-cols-1 ${cols} gap-7`}>
          {services?.map((svc, i) => (
            <div
              key={i}
              className="group relative rounded-2xl p-8 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow =
                  '0 12px 40px color-mix(in srgb, var(--cp) 18%, transparent)'
                ;(e.currentTarget as HTMLElement).style.borderColor =
                  'color-mix(in srgb, var(--cp) 30%, transparent)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'
              }}
            >
              {/* Icon placeholder */}
              <div
                className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, var(--cp-pale), color-mix(in srgb, var(--cp-light) 30%, white))' }}
              >
                <span
                  className="text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--cp)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3
                className="font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)', fontSize: '1.05rem' }}
              >
                {svc.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.description}</p>

              {svc.features?.length > 0 && (
                <ul className="text-left mb-5 space-y-1">
                  {svc.features.map((f, fi) => (
                    <li
                      key={fi}
                      className="text-xs text-gray-500 py-1.5 flex items-start gap-2 border-b border-dashed border-gray-100 last:border-0"
                    >
                      <span style={{ color: 'var(--cp)', fontWeight: 700 }}>›</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {svc.link_text && (
                <Link
                  href={svc.link_url || '#'}
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-3"
                  style={{ color: 'var(--cp)' }}
                >
                  {svc.link_text} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
