import type { TimelineBlock } from './types'

export default function TimelineBlock({ block }: { block: TimelineBlock }) {
  const { section_label, section_title, section_desc, dark_background, milestones } = block

  return (
    <section
      className="py-20 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: '#fff' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
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
              style={{ fontFamily: 'var(--font-heading)', color: dark_background ? '#fff' : 'var(--cd)' }}
            >
              {section_title}
            </h2>
          )}
          {section_desc && (
            <p className="text-sm" style={{ color: dark_background ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
              {section_desc}
            </p>
          )}
        </div>

        <div className="relative">
          {/* Center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: dark_background ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
          />

          <div className="space-y-12">
            {milestones?.map((m, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={i} className={`relative flex items-start gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="flex-1">
                    <div
                      className={`p-6 rounded-2xl ${isLeft ? 'text-right' : 'text-left'}`}
                      style={{
                        background: dark_background ? 'rgba(255,255,255,0.04)' : '#f9fafb',
                        border: `1px solid ${dark_background ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
                      }}
                    >
                      <span
                        className="inline-block text-xs font-black mb-2 px-3 py-1 rounded-full"
                        style={{ background: 'var(--cp)', color: '#fff' }}
                      >
                        {m.year}
                      </span>
                      <h3
                        className="font-bold mb-1"
                        style={{ fontFamily: 'var(--font-heading)', color: dark_background ? '#fff' : 'var(--cd)' }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: dark_background ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div
                    className="absolute left-1/2 top-6 w-4 h-4 rounded-full -translate-x-1/2 z-10"
                    style={{
                      background: 'var(--cp)',
                      outline: `4px solid ${dark_background ? 'var(--cd)' : '#fff'}`,
                    }}
                  />

                  {/* Spacer */}
                  <div className="flex-1" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
