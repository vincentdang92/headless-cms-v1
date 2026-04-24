import type {
  WPPost,
  WPPage,
  WPCategory,
  WPTag,
  WPQueryParams,
  WPPaginatedResponse,
} from '@/types/wordpress'
import type { FlexibleContent } from '@/blocks/types'

const API_URL = process.env.WORDPRESS_API_URL!

const WP_TIMEOUT_MS = 5_000

// Appends ?lang=en for non-default locale (requires Polylang on WordPress)
function appendLang(url: string, locale?: string): string {
  if (!locale || locale === 'vi') return url
  return url.includes('?') ? `${url}&lang=${locale}` : `${url}?lang=${locale}`
}

async function wpFetch<T>(endpoint: string, revalidate = 3600, locale?: string): Promise<T> {
  const url = appendLang(`${API_URL}${endpoint}`, locale)
  const res = await fetch(url, {
    next: { revalidate },
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(WP_TIMEOUT_MS),
  })

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

  const url = `/wp/v2/posts?${query}`
  const res = await fetch(`${API_URL}${url}`, {
    next: { revalidate: 3600 },
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(WP_TIMEOUT_MS),
  })

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
// Fetch ACF flexible_content field từ một WP Page (slug)
// Endpoint: /acf/v3/pages?slug={slug}  hoặc /wp/v2/pages?slug={slug} (ACF exposes acf field)

export async function getFlexiblePage(slug: string, locale?: string): Promise<FlexibleContent | null> {
  try {
    // ACF REST API v3 trả về acf fields trực tiếp
    const apiUrl = appendLang(`${API_URL}/acf/v3/pages?slug=${slug}`, locale)
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600, tags: ['flexible-content', `page-${slug}`] },
      signal: AbortSignal.timeout(WP_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const data = await res.json()
    const page = Array.isArray(data) ? data[0] : data
    return (page?.acf?.page_sections as FlexibleContent) ?? null
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
