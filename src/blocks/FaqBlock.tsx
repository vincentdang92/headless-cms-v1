'use client'

import { useState } from 'react'
import type { FaqBlock } from './types'

export default function FaqBlock({ block }: { block: FaqBlock }) {
  const { section_label, section_title, section_desc, dark_background, faqs } = block
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  // Split into 2 columns
  const mid = Math.ceil((faqs?.length ?? 0) / 2)
  const col1 = faqs?.slice(0, mid) ?? []
  const col2 = faqs?.slice(mid) ?? []

  return (
    <section
      className="py-20 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: 'var(--cp-pale)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {section_label && (
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: dark_background ? 'var(--cp-light)' : 'var(--cp)' }}>
              {section_label}
            </span>
          )}
          {section_title && (
            <h2 className="text-3xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: dark_background ? '#fff' : 'var(--cd)' }}>
              {section_title}
            </h2>
          )}
          {section_desc && (
            <p className="text-sm max-w-xl mx-auto"
              style={{ color: dark_background ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
              {section_desc}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[col1, col2].map((col, colIdx) => (
            <div key={colIdx} className="space-y-3">
              {col.map((faq, idx) => {
                const globalIdx = colIdx * mid + idx
                const isOpen = openIndex === globalIdx
                return (
                  <div
                    key={globalIdx}
                    className="rounded-xl overflow-hidden"
                    style={{ background: '#fff', border: '1px solid #e5e7eb' }}
                  >
                    <button
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors"
                      style={{
                        color: isOpen ? 'var(--cp)' : 'var(--cd)',
                        background: isOpen ? 'var(--cp-pale)' : 'transparent',
                      }}
                      onClick={() => toggle(globalIdx)}
                    >
                      {faq.question}
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          background: isOpen ? 'var(--cp)' : 'var(--cp-pale)',
                          transform: isOpen ? 'rotate(45deg)' : 'none',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          stroke={isOpen ? '#fff' : 'var(--cp)'} strokeWidth="2">
                          <path d="M6 2v8M2 6h8" />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        className="px-5 pb-4 text-sm leading-relaxed"
                        style={{
                          color: '#374151',
                          borderTop: '1px solid #f3f4f6',
                          paddingTop: '14px',
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
