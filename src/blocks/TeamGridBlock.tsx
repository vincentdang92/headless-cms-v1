'use client'

import Image from 'next/image'
import type { TeamGridBlock } from './types'

export default function TeamGridBlock({ block }: { block: TeamGridBlock }) {
  const { section_label, section_title, section_desc, dark_background, members } = block

  return (
    <section
      className="py-20 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: '#fff' }}
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
              className="text-sm max-w-xl mx-auto"
              style={{ color: dark_background ? 'rgba(255,255,255,0.5)' : '#6b7280' }}
            >
              {section_desc}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members?.map((member, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 text-center transition-all duration-300 cursor-default"
              style={
                dark_background
                  ? {
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
                  : {
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                    }
              }
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                if (dark_background) {
                  el.style.background = 'color-mix(in srgb, var(--cp) 10%, transparent)'
                  el.style.borderColor = 'color-mix(in srgb, var(--cp) 35%, transparent)'
                } else {
                  el.style.boxShadow = '0 8px 30px color-mix(in srgb, var(--cp) 12%, transparent)'
                  el.style.borderColor = 'color-mix(in srgb, var(--cp) 25%, transparent)'
                }
                el.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                if (dark_background) {
                  el.style.background = 'rgba(255,255,255,0.04)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                } else {
                  el.style.boxShadow = ''
                  el.style.borderColor = '#e5e7eb'
                }
                el.style.transform = ''
              }}
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--cp), var(--cp-light))', border: '3px solid rgba(255,255,255,0.15)' }}
              >
                {member.avatar?.url ? (
                  <Image
                    src={member.avatar.url}
                    alt={member.avatar.alt || member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>

              <p
                className="font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: dark_background ? '#fff' : 'var(--cd)',
                }}
              >
                {member.name}
              </p>
              <p
                className="text-xs font-semibold mb-3"
                style={{ color: 'var(--cp-light)' }}
              >
                {member.role}
              </p>
              {member.description && (
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: dark_background ? 'rgba(255,255,255,0.45)' : '#9ca3af' }}
                >
                  {member.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
