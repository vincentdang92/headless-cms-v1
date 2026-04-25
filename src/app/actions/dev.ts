'use server'

const API_URL = process.env.WORDPRESS_API_URL ?? ''
const WP_API_SECRET = process.env.WP_API_SECRET

export interface PingResult {
  ok: boolean
  status: number | null
  ms: number
  url: string
  error?: string
}

export interface RequestLog {
  url: string
  status: number | null
  ms: number
  cached: boolean
  label: string
}

export async function pingWordPress(): Promise<PingResult> {
  const url = `${API_URL}/wp/v2`
  const start = Date.now()
  try {
    const headers: Record<string, string> = {}
    if (WP_API_SECRET) headers['X-WP-Secret'] = WP_API_SECRET

    const res = await fetch(url, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
    return { ok: res.ok, status: res.status, ms: Date.now() - start, url }
  } catch (e) {
    return { ok: false, status: null, ms: Date.now() - start, url, error: String(e) }
  }
}

export async function probeEndpoints(): Promise<RequestLog[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (WP_API_SECRET) headers['X-WP-Secret'] = WP_API_SECRET

  const endpoints: Array<{ url: string; label: string }> = [
    { url: `${API_URL}/headless/v1/settings`,                          label: 'Site Settings' },
    { url: `${API_URL}/headless/v1/menus/primary`,                     label: 'Primary Menu' },
    { url: `${API_URL}/wp/v2/posts?per_page=1&_fields=id,slug`,        label: 'Posts' },
    { url: `${API_URL}/wp/v2/pages?per_page=1&_fields=id,slug`,        label: 'Pages' },
    { url: `${API_URL}/wp/v2/pages?slug=trang-chu&_fields=id,acf`,     label: 'Flexible Content (trang-chu)' },
    { url: `${API_URL}/wp/v2/categories?per_page=1&_fields=id,slug`,   label: 'Categories' },
  ]

  const results = await Promise.all(
    endpoints.map(async ({ url, label }) => {
      const start = Date.now()
      try {
        const res = await fetch(url, {
          headers,
          cache: 'no-store',
          signal: AbortSignal.timeout(4000),
        })
        const ms = Date.now() - start
        const cacheHeader = res.headers.get('x-wp-cache') ?? res.headers.get('cf-cache-status') ?? ''
        return { url, label, status: res.status, ms, cached: cacheHeader === 'HIT' }
      } catch {
        return { url, label, status: null, ms: Date.now() - start, cached: false }
      }
    })
  )
  return results
}
