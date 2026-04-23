import type { TrustBarBlock } from './types'

const DEFAULT_ICONS = [
  '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 011.84.02H5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>',
]

export default function TrustBarBlock({ block }: { block: TrustBarBlock }) {
  const items = block.items?.length ? block.items : []

  return (
    <div style={{ background: 'var(--cp-pale)', borderBottom: '1px solid color-mix(in srgb, var(--cp) 15%, transparent)' }}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-around flex-wrap gap-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-semibold" style={{ color: 'var(--cd)' }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--cp)' }}
              >
                <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d={DEFAULT_ICONS[i % DEFAULT_ICONS.length]} />
                </svg>
              </div>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
