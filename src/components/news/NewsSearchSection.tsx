'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { algoliasearch } from 'algoliasearch'
import type { Hit } from 'algoliasearch'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'wp_posts'

// Client created once at module level — không recreate mỗi render
const algoliaClient =
  APP_ID && SEARCH_KEY ? algoliasearch(APP_ID, SEARCH_KEY) : null

export interface AlgoliaPost {
  objectID: string
  title: string
  excerpt: string
  slug: string
  date: string
  featuredImageUrl: string
  categories: string[]
  locale: string
}

interface Props {
  locale: string
  children: React.ReactNode
}

export default function NewsSearchSection({ locale, children }: Props) {
  const t = useTranslations('News')
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<Hit<AlgoliaPost>[]>([])
  const [nbHits, setNbHits] = useState(0)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!query.trim() || !algoliaClient) {
      setHits([])
      setNbHits(0)
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const result = await algoliaClient.searchSingleIndex({
          indexName: INDEX_NAME,
          searchParams: {
            query,
            hitsPerPage: 9,
            filters: `locale:${locale}`,
            attributesToHighlight: ['title', 'excerpt'],
            highlightPreTag: '<mark style="background:var(--cp-pale);color:var(--cd);font-style:normal">',
            highlightPostTag: '</mark>',
          },
        })
        setHits(result.hits as Hit<AlgoliaPost>[])
        setNbHits(result.nbHits ?? 0)
      } catch {
        setHits([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, locale])

  const isSearchActive = query.trim().length > 0

  return (
    <div>
      {/* ── Search bar ──────────────────────────────────────────────────── */}
      {algoliaClient && (
        <div className="relative mb-8">
          <div className="relative flex items-center">
            <svg
              className="absolute left-4 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--cp)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-11 pr-10 py-3 text-sm border border-gray-200 rounded-xl outline-none transition-all bg-white"
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--cp)'
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--cp) 10%, transparent)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.boxShadow = ''
              }}
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xs"
                aria-label={t('clearSearch')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Search results ──────────────────────────────────────────────── */}
      {isSearchActive ? (
        <div>
          <p className="text-sm text-gray-400 mb-6">
            {loading
              ? t('searching')
              : `${nbHits} ${t('searchResults')} "${query}"`}
          </p>

          {loading ? (
            <SearchSkeleton />
          ) : hits.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 font-medium mb-1">{t('noSearchResults')}</p>
              <p className="text-sm text-gray-400">{t('noSearchResultsHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hits.map((hit) => (
                <SearchHitCard key={hit.objectID} hit={hit} t={t} />
              ))}
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getHighlight(result: unknown): string | undefined {
  if (!result) return undefined
  if (Array.isArray(result)) return (result[0] as { value?: string } | undefined)?.value
  return (result as { value?: string }).value
}

// ── Hit card ──────────────────────────────────────────────────────────────────

type TFunc = ReturnType<typeof useTranslations<'News'>>

function SearchHitCard({ hit, t }: { hit: Hit<AlgoliaPost>; t: TFunc }) {
  const titleHtml = getHighlight(hit._highlightResult?.title) ?? hit.title
  const excerptHtml = getHighlight(hit._highlightResult?.excerpt) ?? hit.excerpt

  return (
    <article className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {hit.featuredImageUrl && (
        <Link href={`/tin-tuc/${hit.slug}`} className="block relative aspect-video overflow-hidden">
          <Image
            src={hit.featuredImageUrl}
            alt={hit.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      <div className="p-5 flex flex-col flex-1">
        {hit.categories.length > 0 && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--cp)' }}
          >
            {hit.categories[0]}
          </span>
        )}

        <Link href={`/tin-tuc/${hit.slug}`} className="flex-1">
          <h3
            className="font-bold text-base leading-snug mb-2 hover:underline"
            style={{ color: 'var(--cd)', fontFamily: 'var(--font-heading)' }}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        </Link>

        {excerptHtml && (
          <p
            className="text-sm text-gray-500 line-clamp-2 mb-4"
            dangerouslySetInnerHTML={{ __html: excerptHtml }}
          />
        )}

        <div className="flex items-center justify-between mt-auto">
          <time className="text-xs text-gray-400">{formatDate(hit.date)}</time>
          <Link
            href={`/tin-tuc/${hit.slug}`}
            className="text-xs font-semibold hover:underline"
            style={{ color: 'var(--cp)' }}
          >
            {t('readMore')}
          </Link>
        </div>
      </div>
    </article>
  )
}

// ── Skeleton loading ──────────────────────────────────────────────────────────

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-100" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
