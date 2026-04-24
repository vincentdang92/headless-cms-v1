import type { TrustBarBlock } from './types'

function getIcon(index: number) {
  switch (index % 6) {
    case 0:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    case 1:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    case 2:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 3:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 4:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 011.84.02H5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      )
  }
}

export default function TrustBarBlock({ block }: { block: TrustBarBlock }) {
  const items = block.items?.length ? block.items : []

  return (
    <div
      className="border-y"
      style={{
        background: 'var(--cp-pale)',
        borderColor: 'color-mix(in srgb, var(--cp) 15%, transparent)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-3 px-3 py-5 text-center rounded-2xl transition-colors duration-200 hover:bg-white/70 lg:rounded-none lg:border-r last:border-r-0"
              style={{ borderColor: 'color-mix(in srgb, var(--cp) 12%, transparent)' }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, var(--cp), var(--cp-light))',
                  boxShadow: '0 6px 16px color-mix(in srgb, var(--cp) 28%, transparent)',
                }}
              >
                <span className="block w-7 h-7 text-white">
                  {getIcon(i)}
                </span>
              </div>

              {/* Text */}
              <p
                className="text-sm font-semibold leading-snug"
                style={{ color: 'var(--cd)' }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
