import { type NextRequest, NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'

// Force dynamic — reads client IP from headers per request
export const dynamic = 'force-dynamic'

export interface WeatherResult {
  temp: number
  weatherCode: number
  city: string
  windspeed: number
  isDay: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractIp(req: NextRequest): string | undefined {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    undefined
  // Ignore localhost in dev
  return ip && ip !== '127.0.0.1' && ip !== '::1' ? ip : undefined
}

// OpenWeatherMap 3-digit code → WMO approximation
function owmToWmo(code: number): number {
  if (code === 800) return 0
  if (code === 801) return 1
  if (code === 802) return 2
  if (code >= 803) return 3
  if (code >= 700) return 45 // fog / atmosphere
  if (code >= 620) return 86 // snow shower
  if (code >= 600) return code <= 600 ? 71 : code <= 601 ? 73 : 75
  if (code >= 520) return 80 // shower rain
  if (code >= 500) return code === 500 ? 61 : code === 501 ? 63 : 65
  if (code >= 300) return code === 300 ? 51 : code === 301 ? 53 : 55
  if (code >= 200) return code <= 202 ? 95 : 99
  return 0
}

// WeatherAPI.com condition code → WMO
const WAPI_WMO: Record<number, number> = {
  1000: 0,  1003: 2,  1006: 3,  1009: 3,  1030: 45, 1063: 80, 1066: 85,
  1069: 77, 1072: 55, 1087: 95, 1114: 75, 1117: 75, 1135: 45, 1147: 48,
  1150: 51, 1153: 51, 1168: 55, 1171: 55, 1180: 61, 1183: 61, 1186: 63,
  1189: 63, 1192: 65, 1195: 65, 1198: 66, 1201: 67, 1204: 77, 1207: 77,
  1210: 71, 1213: 71, 1216: 73, 1219: 73, 1222: 75, 1225: 75, 1237: 77,
  1240: 80, 1243: 81, 1246: 82, 1249: 85, 1252: 85, 1255: 85, 1258: 86,
  1261: 77, 1264: 77, 1273: 95, 1276: 95, 1279: 95, 1282: 99,
}

// ─── Providers ────────────────────────────────────────────────────────────────

async function fromAuto(ip?: string, location?: string): Promise<WeatherResult> {
  let lat: number, lon: number, city: string

  if (location) {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
      { next: { revalidate: 86400 } }
    ).then((r) => r.json())
    if (!geo.results?.length) throw new Error('geocode-not-found')
    lat  = geo.results[0].latitude as number
    lon  = geo.results[0].longitude as number
    city = geo.results[0].name as string
  } else {
    const ipUrl = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/'
    const d = await fetch(ipUrl, { cache: 'no-store' }).then((r) => r.json())
    lat  = d.latitude as number
    lon  = d.longitude as number
    city = (d.city || d.region || '') as string
  }

  const wx = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`,
    { next: { revalidate: 1800 } }
  ).then((r) => r.json())

  const cw = wx.current_weather
  return {
    temp:        Math.round(cw.temperature as number),
    weatherCode: cw.weathercode as number,
    city,
    windspeed:   Math.round(cw.windspeed as number),
    isDay:       cw.is_day as number,
  }
}

async function fromOWM(key: string, ip?: string, location?: string): Promise<WeatherResult> {
  let q: string
  if (location) {
    q = `q=${encodeURIComponent(location)}`
  } else {
    const ipUrl = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/'
    const d = await fetch(ipUrl, { cache: 'no-store' }).then((r) => r.json())
    q = `lat=${d.latitude}&lon=${d.longitude}`
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${q}&appid=${key}&units=metric`,
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) throw new Error(`owm-${res.status}`)
  const d = await res.json()

  const now = Math.floor(Date.now() / 1000)
  return {
    temp:        Math.round(d.main.temp as number),
    weatherCode: owmToWmo(d.weather[0].id as number),
    city:        d.name as string,
    windspeed:   Math.round(((d.wind?.speed as number) ?? 0) * 3.6), // m/s → km/h
    isDay:       now >= (d.sys?.sunrise ?? 0) && now <= (d.sys?.sunset ?? 0) ? 1 : 0,
  }
}

async function fromWeatherAPI(key: string, ip?: string, location?: string): Promise<WeatherResult> {
  const q   = location ? encodeURIComponent(location) : (ip ?? 'auto:ip')
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${key}&q=${q}&aqi=no`,
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) throw new Error(`wapi-${res.status}`)
  const d = await res.json()
  return {
    temp:        Math.round(d.current.temp_c as number),
    weatherCode: WAPI_WMO[d.current.condition.code as number] ?? 0,
    city:        d.location.name as string,
    windspeed:   Math.round(d.current.wind_kph as number),
    isDay:       d.current.is_day as number,
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const ip       = extractIp(request)
    const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS)
    const w        = settings.weather

    // Env vars override WP admin — better security for API keys
    const provider = (process.env.WEATHER_PROVIDER || w.provider) as 'auto' | 'openweathermap' | 'weatherapi'
    const apiKey   = process.env.WEATHER_API_KEY   || w.apiKey
    const location = process.env.WEATHER_LOCATION  || w.locationOverride || undefined

    let result: WeatherResult
    if (provider === 'openweathermap' && apiKey) {
      result = await fromOWM(apiKey, ip, location)
    } else if (provider === 'weatherapi' && apiKey) {
      result = await fromWeatherAPI(apiKey, ip, location)
    } else {
      result = await fromAuto(ip, location)
    }

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 503 })
  }
}
