'use client'

import { useEffect, useState } from 'react'
import type { WeatherResult } from '@/app/api/weather/route'

type AnimType = 'sunny' | 'night' | 'cloudy' | 'rainy' | 'snowy' | 'stormy'

interface WMOEntry {
  emoji: string
  nightEmoji?: string     // icon khi isDay = 0
  nightAnim?: AnimType    // animation khi isDay = 0
  nightBg?: string        // gradient khi isDay = 0 (implies white text)
  vi: string
  en: string
  anim: AnimType
  bg: string
}

// WMO codes 0-2 có night variant riêng.
// Codes 3+ (mây dày, mưa, tuyết, bão) không phân biệt ngày/đêm.
const WMO: Record<number, WMOEntry> = {
  0: {
    emoji: '☀️',  nightEmoji: '🌙',
    vi: 'Trời quang',       en: 'Clear sky',
    anim: 'sunny',          nightAnim: 'night',
    bg: 'from-amber-100 to-orange-50',
    nightBg: 'from-indigo-700 to-slate-700',
  },
  1: {
    emoji: '🌤️', nightEmoji: '🌙',
    vi: 'Ít mây',           en: 'Mostly clear',
    anim: 'sunny',          nightAnim: 'night',
    bg: 'from-amber-100 to-yellow-50',
    nightBg: 'from-slate-600 to-indigo-700',
  },
  2: {
    emoji: '⛅',  nightEmoji: '🌙',
    vi: 'Có mây',           en: 'Partly cloudy',
    anim: 'cloudy',         nightAnim: 'night',
    bg: 'from-gray-100 to-slate-50',
    nightBg: 'from-slate-600 to-slate-500',
  },
  3:  { emoji: '☁️',  vi: 'Nhiều mây',          en: 'Overcast',            anim: 'cloudy', bg: 'from-gray-200 to-gray-100' },
  45: { emoji: '🌫️', vi: 'Có sương',           en: 'Foggy',               anim: 'cloudy', bg: 'from-gray-200 to-slate-100' },
  48: { emoji: '🌫️', vi: 'Sương đá',           en: 'Icy fog',             anim: 'cloudy', bg: 'from-gray-200 to-slate-100' },
  51: { emoji: '🌦️', vi: 'Mưa phùn nhẹ',      en: 'Light drizzle',       anim: 'rainy',  bg: 'from-sky-100 to-blue-50' },
  53: { emoji: '🌦️', vi: 'Mưa phùn',          en: 'Drizzle',             anim: 'rainy',  bg: 'from-sky-100 to-blue-50' },
  55: { emoji: '🌦️', vi: 'Mưa phùn nặng',     en: 'Heavy drizzle',       anim: 'rainy',  bg: 'from-blue-200 to-sky-100' },
  61: { emoji: '🌧️', vi: 'Mưa nhẹ',           en: 'Light rain',          anim: 'rainy',  bg: 'from-blue-200 to-sky-100' },
  63: { emoji: '🌧️', vi: 'Mưa vừa',           en: 'Rain',                anim: 'rainy',  bg: 'from-blue-300 to-blue-200' },
  65: { emoji: '🌧️', vi: 'Mưa to',            en: 'Heavy rain',          anim: 'rainy',  bg: 'from-blue-400 to-blue-300' },
  71: { emoji: '❄️',  vi: 'Tuyết nhẹ',         en: 'Light snow',          anim: 'snowy',  bg: 'from-sky-100 to-blue-50' },
  73: { emoji: '❄️',  vi: 'Tuyết',             en: 'Snow',                anim: 'snowy',  bg: 'from-sky-200 to-sky-100' },
  75: { emoji: '❄️',  vi: 'Tuyết to',          en: 'Heavy snow',          anim: 'snowy',  bg: 'from-sky-300 to-sky-200' },
  77: { emoji: '🌨️', vi: 'Hạt tuyết',         en: 'Snow grains',         anim: 'snowy',  bg: 'from-sky-100 to-blue-50' },
  80: { emoji: '🌦️', vi: 'Mưa rào nhẹ',      en: 'Light showers',       anim: 'rainy',  bg: 'from-blue-200 to-sky-100' },
  81: { emoji: '🌧️', vi: 'Mưa rào',           en: 'Rain showers',        anim: 'rainy',  bg: 'from-blue-300 to-blue-200' },
  82: { emoji: '🌧️', vi: 'Mưa rào nặng',      en: 'Heavy showers',       anim: 'stormy', bg: 'from-slate-400 to-slate-300' },
  85: { emoji: '🌨️', vi: 'Tuyết rào',         en: 'Snow showers',        anim: 'snowy',  bg: 'from-sky-100 to-blue-50' },
  86: { emoji: '🌨️', vi: 'Tuyết rào nặng',    en: 'Heavy snow showers',  anim: 'snowy',  bg: 'from-sky-200 to-sky-100' },
  95: { emoji: '⛈️', vi: 'Giông bão',          en: 'Thunderstorm',        anim: 'stormy', bg: 'from-slate-600 to-slate-500' },
  96: { emoji: '⛈️', vi: 'Giông mưa đá',      en: 'Thunderstorm + hail', anim: 'stormy', bg: 'from-slate-700 to-slate-600' },
  99: { emoji: '⛈️', vi: 'Bão nặng',           en: 'Severe thunderstorm', anim: 'stormy', bg: 'from-slate-800 to-slate-700' },
}

function getWMO(code: number): WMOEntry {
  if (code in WMO) return WMO[code]
  const keys = Object.keys(WMO).map(Number).sort((a, b) => a - b)
  for (let i = keys.length - 1; i >= 0; i--) {
    if (keys[i] <= code) return WMO[keys[i]]
  }
  return WMO[0]
}

const ANIM_CSS = `
@keyframes wx-spin   { to { transform: rotate(360deg); } }
@keyframes wx-float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes wx-bounce { 0%,100% { transform: translateY(0); } 45% { transform: translateY(-9px); } }
@keyframes wx-drift  { 0%,100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
@keyframes wx-flash  { 0%,55%,100% { opacity:1; } 28% { opacity:0.25; } }
`

const ANIM_STYLE: Record<AnimType, React.CSSProperties> = {
  sunny:  { animation: 'wx-spin 10s linear infinite' },
  night:  { animation: 'wx-float 4s ease-in-out infinite' },
  cloudy: { animation: 'wx-drift 5s ease-in-out infinite' },
  rainy:  { animation: 'wx-bounce 1.6s ease-in-out infinite' },
  snowy:  { animation: 'wx-float 3s ease-in-out infinite' },
  stormy: { animation: 'wx-flash 2s ease-in-out infinite' },
}

export default function WeatherWidget({ locale = 'vi' }: { locale?: string }) {
  const [data, setData] = useState<WeatherResult | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/weather')
      .then((r) => {
        if (!r.ok) throw new Error(`status-${r.status}`)
        return r.json() as Promise<WeatherResult>
      })
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) return null

  if (!data) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-100 to-gray-50 p-5 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  const info    = getWMO(data.weatherCode)
  const isNight = !data.isDay

  // Night variants apply only when the entry has explicit night overrides
  const emoji = isNight && info.nightEmoji ? info.nightEmoji : info.emoji
  const anim: AnimType = isNight && info.nightAnim ? info.nightAnim : info.anim
  const bg    = isNight && info.nightBg    ? info.nightBg    : info.bg

  const label = locale === 'en' ? info.en : info.vi

  // Dark background = night gradient OR stormy conditions
  const darkBg     = (isNight && !!info.nightBg) || anim === 'stormy'
  const textCls    = darkBg ? 'text-white'    : 'text-gray-800'
  const subtextCls = darkBg ? 'text-white/70' : 'text-gray-500'

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${bg} p-5 shadow-sm border border-white/30 overflow-hidden`}>
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className={`text-4xl font-bold leading-none ${textCls}`}>{data.temp}°C</div>
          <div className={`text-sm font-medium mt-1 ${textCls}`}>{label}</div>
          <div className={`text-xs mt-1.5 flex items-center gap-1 ${subtextCls} truncate`}>
            <span>📍</span>
            <span className="truncate">{data.city}</span>
          </div>
          {data.windspeed > 0 && (
            <div className={`text-xs mt-0.5 flex items-center gap-1 ${subtextCls}`}>
              <span>💨</span> {data.windspeed} km/h
            </div>
          )}
        </div>
        <div className="text-5xl flex-shrink-0 select-none" style={ANIM_STYLE[anim]}>
          {emoji}
        </div>
      </div>
    </div>
  )
}
