import type {
  WPPost,
  WPPage,
  WPCategory,
  WPTag,
  WPQueryParams,
  WPPaginatedResponse,
  NavItem,
} from '@/types/wordpress'
import type { FlexibleContent } from '@/blocks/types'

const API_URL = process.env.WORDPRESS_API_URL!
const WP_API_SECRET = process.env.WP_API_SECRET
const IS_DEV = process.env.NODE_ENV === 'development'

const WP_TIMEOUT_MS = 5_000

function wpHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (WP_API_SECRET) headers['X-WP-Secret'] = WP_API_SECRET
  return headers
}

async function devLog(fullUrl: string, method: string, fn: () => Promise<Response>): Promise<Response> {
  if (!IS_DEV) return fn()
  const { appendLog } = await import('./dev-store')
  const ts = Date.now()
  try {
    const res = await fn()
    appendLog({ method, url: fullUrl, path: fullUrl.replace(API_URL, ''), status: res.status, ms: Date.now() - ts, ts })
    return res
  } catch (e) {
    appendLog({ method, url: fullUrl, path: fullUrl.replace(API_URL, ''), status: null, ms: Date.now() - ts, ts, error: String(e) })
    throw e
  }
}

// Appends ?lang=en for non-default locale (requires Polylang on WordPress)
function appendLang(url: string, locale?: string): string {
  if (!locale || locale === 'vi') return url
  return url.includes('?') ? `${url}&lang=${locale}` : `${url}?lang=${locale}`
}

async function wpFetch<T>(endpoint: string, revalidate = 3600, locale?: string): Promise<T> {
  const url = appendLang(`${API_URL}${endpoint}`, locale)
  const res = await devLog(url, 'GET', () =>
    fetch(url, {
      next: { revalidate },
      headers: wpHeaders(),
      signal: AbortSignal.timeout(WP_TIMEOUT_MS),
    })
  )

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText} — ${url}`)
  }

  return res.json()
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(
  params: WPQueryParams = {}
): Promise<WPPaginatedResponse<WPPost>> {
  const {
    page = 1,
    per_page = 10,
    search,
    categories,
    orderby = 'date',
    order = 'desc',
    locale,
  } = params

  const query = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
    orderby,
    order,
    _embed: '1',
  })

  if (search) query.set('search', search)
  if (categories?.length) query.set('categories', categories.join(','))
  if (locale && locale !== 'vi') query.set('lang', locale)

  const fullUrl = `${API_URL}/wp/v2/posts?${query}`
  const res = await devLog(fullUrl, 'GET', () =>
    fetch(fullUrl, {
      next: { revalidate: 3600 },
      headers: wpHeaders(),
      signal: AbortSignal.timeout(WP_TIMEOUT_MS),
    })
  )

  if (!res.ok) throw new Error(`WordPress API error: ${res.status}`)

  const data: WPPost[] = await res.json()
  const totalPosts = Number(res.headers.get('X-WP-Total') ?? 0)
  const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1)

  return { data, totalPosts, totalPages }
}

export async function getPostBySlug(slug: string, locale?: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(
    `/wp/v2/posts?slug=${slug}&_embed=1`,
    3600,
    locale
  )
  return posts[0] ?? null
}

export async function getLatestPosts(count = 6, locale?: string): Promise<WPPost[]> {
  const { data } = await getPosts({ per_page: count, locale })
  return data
}

export async function getAllPostSlugs(locale?: string): Promise<string[]> {
  const posts = await wpFetch<WPPost[]>(`/wp/v2/posts?per_page=100&fields=slug`, 3600, locale)
  return posts.map((p) => p.slug)
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string, locale?: string): Promise<WPPage | null> {
  const pages = await wpFetch<WPPage[]>(
    `/wp/v2/pages?slug=${slug}&_embed=1`,
    86400,
    locale
  )
  return pages[0] ?? null
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(locale?: string): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>(`/wp/v2/categories?per_page=100&hide_empty=true`, 3600, locale)
}

export async function getCategoryBySlug(slug: string, locale?: string): Promise<WPCategory | null> {
  const cats = await wpFetch<WPCategory[]>(`/wp/v2/categories?slug=${slug}`, 3600, locale)
  return cats[0] ?? null
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function getTags(locale?: string): Promise<WPTag[]> {
  return wpFetch<WPTag[]>(`/wp/v2/tags?per_page=100&hide_empty=true`, 3600, locale)
}

// ─── ACF Flexible Content ─────────────────────────────────────────────────────
// Dùng native WP REST API — ACF Pro 5.11+ tự động thêm acf field vào response
// Yêu cầu: bật "Show in REST API" trong ACF → field group → Group Settings
// Field name phải khớp với ACF: "flexible_content" (xem acf-fields-export.json)

export async function getFlexiblePage(slug: string, locale?: string): Promise<FlexibleContent | null> {
  const apiUrl = appendLang(`${API_URL}/wp/v2/pages?slug=${slug}&_fields=id,acf`, locale)
  try {
    const res = await devLog(apiUrl, 'GET', () =>
      fetch(apiUrl, {
        next: { revalidate: 3600, tags: ['flexible-content', `page-${slug}`] },
        headers: wpHeaders(),
        signal: AbortSignal.timeout(WP_TIMEOUT_MS),
      })
    )
    if (!res.ok) return null
    const data = await res.json()
    const page = Array.isArray(data) ? data[0] : data
    return (page?.acf?.flexible_content as FlexibleContent) ?? null
  } catch {
    return null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getFeaturedImageUrl(post: WPPost | WPPage): string {
  return (
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/images/placeholder.jpg'
  )
}

export function getFeaturedImageAlt(post: WPPost | WPPage): string {
  return post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? ''
}

export function getPostCategories(post: WPPost): WPCategory[] {
  const terms = post._embedded?.['wp:term']
  if (!terms) return []
  return (terms[0] as WPCategory[]) ?? []
}

export function getPostAuthor(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? 'Admin'
}

// ─── Nav Menus ────────────────────────────────────────────────────────────────
// Fetch từ custom endpoint /headless/v1/menus/{location}
// Trả [] nếu menu chưa được tạo trong WP → caller fallback về DEFAULT_NAV

export async function getMenu(location: string, locale?: string): Promise<NavItem[]> {
  const url = appendLang(`${API_URL}/headless/v1/menus/${location}`, locale)
  try {
    const res = await devLog(url, 'GET', () =>
      fetch(url, {
        next: { revalidate: 3600, tags: ['menus'] },
        headers: wpHeaders(),
        signal: AbortSignal.timeout(WP_TIMEOUT_MS),
      })
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
