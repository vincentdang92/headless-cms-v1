import type { ValuesBlock } from './types'

export default function ValuesBlock({ block }: { block: ValuesBlock }) {
  const { section_label, section_title, section_desc, dark_background, values } = block

  return (
    <section
      className="py-20 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: 'var(--cp-pale)' }}
    >
      <div className="max-w-6xl mx-auto">
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
              style={{ fontFamily: 'var(--font-heading)', color: dark_background ? '#fff' : 'var(--cd)' }}
            >
              {section_title}
            </h2>
          )}
          {section_desc && (
            <p className="text-sm max-w-xl mx-auto" style={{ color: dark_background ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
              {section_desc}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values?.map((val, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl text-center"
              style={{
                background: dark_background ? 'rgba(255,255,255,0.04)' : '#fff',
                border: `1px solid ${dark_background ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, var(--cp-pale), color-mix(in srgb, var(--cp-light) 20%, white))' }}
              >
                {val.icon}
              </div>
              <h3
                className="font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: dark_background ? '#fff' : 'var(--cd)' }}
              >
                {val.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: dark_background ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
