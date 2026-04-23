export interface WPImage {
  id: number
  url: string
  alt: string
  width: number
  height: number
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
}

export interface WPTag {
  id: number
  name: string
  slug: string
}

export interface WPAuthor {
  id: number
  name: string
  avatar_urls: Record<string, string>
}

// SEO fields injected by Yoast or RankMath into REST responses
export interface WPYoastHeadJson {
  title?: string
  description?: string
  robots?: Record<string, string>
  canonical?: string
  og_title?: string
  og_description?: string
  og_image?: Array<{ url: string; width: number; height: number; alt?: string }>
  twitter_card?: string
  twitter_title?: string
  twitter_description?: string
  schema?: object
}

export interface WPRankMathSeo {
  title?: string
  description?: string
  robots?: Record<string, string>
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: Array<{ url: string; width?: number; height?: number }>
  twitter_card?: string
  twitter_title?: string
  twitter_description?: string
  schema?: object
}

export interface WPPost {
  id: number
  slug: string
  status: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  modified: string
  featured_media: number
  // Yoast SEO
  yoast_head_json?: WPYoastHeadJson
  // RankMath SEO
  rank_math_seo?: WPRankMathSeo
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
      media_details: { width: number; height: number }
    }>
    'wp:term'?: Array<WPCategory[] | WPTag[]>
    author?: WPAuthor[]
  }
}

export interface WPPage {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  featured_media: number
  // Yoast SEO
  yoast_head_json?: WPYoastHeadJson
  // RankMath SEO
  rank_math_seo?: WPRankMathSeo
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
      media_details: { width: number; height: number }
    }>
  }
  acf?: Record<string, unknown>
}

export interface WPMenuItem {
  id: number
  title: string
  url: string
  slug: string
  target: string
  parent: number
  children?: WPMenuItem[]
}

export interface WPQueryParams {
  page?: number
  per_page?: number
  search?: string
  categories?: number[]
  tags?: number[]
  slug?: string
  status?: string
  orderby?: string
  order?: 'asc' | 'desc'
}

export interface WPPaginatedResponse<T> {
  data: T[]
  totalPosts: number
  totalPages: number
}
