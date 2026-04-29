'use client'

import { useState } from 'react'

const DAY_HEADERS: Record<string, string[]> = {
  vi: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
}

export default function CalendarWidget({ locale = 'vi' }: { locale?: string }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const dayHeaders = DAY_HEADERS[locale] ?? DAY_HEADERS.vi

  const monthLabel = new Date(year, month, 1).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'vi-VN',
    { month: 'long', year: 'numeric' }
  )

  // Monday-first offset: JS getDay() 0=Sun → offset 6; 1=Mon → 0; etc.
  const firstDow = new Date(year, month, 1).getDay()
  const startOffset = firstDow === 0 ? 6 : firstDow - 1

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function prev() {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
  }

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="text-sm font-semibold capitalize" style={{ color: 'var(--cd)' }}>
          {monthLabel}
        </h3>
        <button
          onClick={next}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayHeaders.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center h-8">
            {d !== null && (
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors ${
                  isToday(d)
                    ? 'text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-100 cursor-default'
                }`}
                style={isToday(d) ? { background: 'var(--cp)' } : undefined}
              >
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
