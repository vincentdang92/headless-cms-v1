import type { TestimonialsBlock } from './types'

export default function TestimonialsBlock({ block }: { block: TestimonialsBlock }) {
  const { section_label, section_title, dark_background, testimonials } = block

  return (
    <section
      className="py-20 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: 'var(--cp-pale)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {section_label && (
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: dark_background ? 'var(--cp-light)' : 'var(--cp)' }}>
              {section_label}
            </span>
          )}
          {section_title && (
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: dark_background ? '#fff' : 'var(--cd)' }}>
              {section_title}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-7"
              style={
                dark_background
                  ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
                  : { background: '#fff', border: '1px solid #e5e7eb' }
              }
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <svg key={si} className="w-4 h-4" viewBox="0 0 24 24" fill={si < (t.rating || 5) ? 'var(--cp)' : '#d1d5db'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p
                className="text-sm leading-relaxed mb-6 italic"
                style={{ color: dark_background ? 'rgba(255,255,255,0.7)' : '#374151' }}
              >
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid', borderColor: dark_background ? 'rgba(255,255,255,0.1)' : '#f3f4f6' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--cp), var(--cp-light))' }}
                >
                  {t.author_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: dark_background ? '#fff' : 'var(--cd)' }}>
                    {t.author_name}
                  </p>
                  <p className="text-xs" style={{ color: dark_background ? 'rgba(255,255,255,0.45)' : '#9ca3af' }}>
                    {t.author_company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
