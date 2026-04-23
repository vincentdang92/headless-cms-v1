'use client'

import type { TwoColumnBlock } from './types'

export default function TwoColumnBlock({ block }: { block: TwoColumnBlock }) {
  const {
    layout = 'image_right',
    dark_background,
    section_label, section_title, section_desc,
    features, badge_number, badge_label,
  } = block

  const isImageLeft = layout === 'image_left'

  return (
    <section
      className="py-20 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: '#fff' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${isImageLeft ? '' : 'md:[&>*:first-child]:order-2'}`}>

          {/* Visual panel */}
          <div className="relative">
            <div
              className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--cp-pale), color-mix(in srgb, var(--cp-light) 20%, white))',
                border: '2px solid color-mix(in srgb, var(--cp) 20%, transparent)',
              }}
            >
              {/* Decorative visual — thay bằng ảnh thực khi có */}
              <div className="text-center">
                <div
                  className="text-7xl font-bold opacity-10 leading-none"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--cp)' }}
                >
                  {badge_number || '10+'}
                </div>
                <p className="text-sm text-gray-400 mt-2">{badge_label || 'Năm kinh nghiệm'}</p>
              </div>
            </div>

            {/* Floating badge */}
            {badge_number && (
              <div
                className="absolute -bottom-5 -right-5 px-5 py-4 rounded-2xl text-center shadow-2xl"
                style={{ background: 'var(--cp)' }}
              >
                <p
                  className="text-3xl font-bold text-white leading-none"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {badge_number}
                </p>
                <p className="text-xs text-white/80 mt-1">{badge_label}</p>
              </div>
            )}
          </div>

          {/* Content panel */}
          <div>
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
                className="text-3xl font-bold mb-3 leading-snug"
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
                className="text-sm leading-relaxed mb-8"
                style={{ color: dark_background ? 'rgba(255,255,255,0.55)' : '#6b7280' }}
              >
                {section_desc}
              </p>
            )}

            {/* Feature list */}
            <div className="space-y-4">
              {features?.map((feat, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-4 rounded-xl transition-all"
                  style={{
                    border: '1px solid',
                    borderColor: dark_background ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
                    background: dark_background ? 'rgba(255,255,255,0.03)' : '#fff',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'color-mix(in srgb, var(--cp) 30%, transparent)'
                    el.style.background = dark_background
                      ? 'color-mix(in srgb, var(--cp) 10%, transparent)'
                      : 'var(--cp-pale)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = dark_background ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
                    el.style.background = dark_background ? 'rgba(255,255,255,0.03)' : '#fff'
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-all"
                    style={{ background: 'var(--cp-pale)', color: 'var(--cp)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4
                      className="font-bold text-sm mb-1"
                      style={{ color: dark_background ? '#fff' : 'var(--cd)' }}
                    >
                      {feat.title}
                    </h4>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: dark_background ? 'rgba(255,255,255,0.5)' : '#6b7280' }}
                    >
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
