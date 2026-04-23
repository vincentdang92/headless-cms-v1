'use client'

import Image from 'next/image'
import type { ClientsBlock } from './types'

export default function ClientsBlock({ block }: { block: ClientsBlock }) {
  const { section_title, dark_background, clients } = block

  return (
    <section
      className="py-16 px-4"
      style={dark_background ? { background: 'var(--cd)' } : { background: '#fff' }}
    >
      <div className="max-w-6xl mx-auto">
        {section_title && (
          <p
            className="text-center text-xs font-bold uppercase tracking-widest mb-8"
            style={{ color: dark_background ? 'rgba(255,255,255,0.35)' : '#9ca3af' }}
          >
            {section_title}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          {clients?.map((client, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-default"
              style={{
                background: dark_background ? 'rgba(255,255,255,0.06)' : '#fff',
                border: `1.5px solid ${dark_background ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}`,
                color: dark_background ? 'rgba(255,255,255,0.7)' : 'var(--cd)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--cp)'
                el.style.borderColor = 'var(--cp)'
                el.style.color = '#fff'
                el.style.transform = 'scale(1.04)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = dark_background ? 'rgba(255,255,255,0.06)' : '#fff'
                el.style.borderColor = dark_background ? 'rgba(255,255,255,0.12)' : '#e5e7eb'
                el.style.color = dark_background ? 'rgba(255,255,255,0.7)' : 'var(--cd)'
                el.style.transform = ''
              }}
            >
              {client.logo?.url ? (
                <Image src={client.logo.url} alt={client.logo.alt || client.name} width={20} height={20} className="w-5 h-5 object-contain" />
              ) : (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: 'var(--cp)' }}
                >
                  {client.name.charAt(0)}
                </span>
              )}
              {client.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
