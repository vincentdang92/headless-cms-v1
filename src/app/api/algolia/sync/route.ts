import { NextRequest, NextResponse } from 'next/server'
import { algoliasearch } from 'algoliasearch'
import type { AlgoliaPost } from '@/components/news/NewsSearchSection'

const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'wp_posts'
const WP_API = process.env.WORDPRESS_API_URL!

// ── Fetch all WP posts (paginate through all pages) ───────────────────────────

async function fetchAllPosts(locale?: string) {
  const posts: WPPostRaw[] = []
  let page = 1

  const langParam = locale && locale !== 'vi' ? `&lang=${locale}` : ''

  while (true) {
    const res = await fetch(
      `${WP_API}/wp/v2/posts?per_page=100&page=${page}&_embed=1${langParam}`,
      { signal: AbortSignal.timeout(10_000) }
    )

    if (!res.ok) break

    const batch: WPPostRaw[] = await res.json()
    if (!batch.length) break

    posts.push(...batch)

    const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1)
    if (page >= totalPages) break
    page++
  }

  return posts
}

// ── Transform WPPost → AlgoliaRecord ─────────────────────────────────────────

function toAlgoliaRecord(post: WPPostRaw, locale: string): AlgoliaPost {
  const categories: string[] =
    (post._embedded?.['wp:term']?.[0] as { name: string }[] | undefined)
      ?.map((c) => c.name) ?? []

  const featuredImageUrl: string =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''

  return {
    objectID: String(post.id),
    title: stripHtml(post.title?.rendered ?? ''),
    excerpt: stripHtml(post.excerpt?.rendered ?? ''),
    slug: post.slug,
    date: post.date,
    featuredImageUrl,
    categories,
    locale,
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// ── POST /api/algolia/sync?secret=...&locale=vi ───────────────────────────────

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const locale = request.nextUrl.searchParams.get('locale') ?? 'vi'

  const adminKey = process.env.ALGOLIA_ADMIN_KEY
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID

  if (!adminKey || !appId) {
    return NextResponse.json(
      { message: 'ALGOLIA_ADMIN_KEY or NEXT_PUBLIC_ALGOLIA_APP_ID not configured' },
      { status: 500 }
    )
  }

  try {
    const start = Date.now()
    const client = algoliasearch(appId, adminKey)

    // Fetch all posts from WordPress
    const posts = await fetchAllPosts(locale)
    const records = posts.map((p) => toAlgoliaRecord(p, locale))

    // Configure searchable attributes + facets (idempotent)
    await client.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: ['title', 'excerpt', 'categories'],
        attributesForFaceting: ['locale', 'categories'],
        customRanking: ['desc(date)'],
      },
    })

    // Clear old records for this locale, then save new ones
    await client.deleteBy({
      indexName: INDEX_NAME,
      deleteByParams: { filters: `locale:${locale}` },
    })

    if (records.length > 0) {
      await client.saveObjects({
        indexName: INDEX_NAME,
        objects: records as unknown as Record<string, unknown>[],
      })
    }

    return NextResponse.json({
      ok: true,
      locale,
      indexed: records.length,
      duration: `${Date.now() - start}ms`,
    })
  } catch (err) {
    console.error('[algolia/sync]', err)
    return NextResponse.json({ message: 'Sync failed', error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'algolia-sync' })
}

// ── Minimal WP types for sync ─────────────────────────────────────────────────

interface WPPostRaw {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
    'wp:term'?: { name: string }[][]
  }
}
