export interface SiteImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface SiteColors {
  primary: string
  primaryLight: string
  primaryPale: string
  dark: string
}

export interface SiteContact {
  phone: string
  hotline: string
  email: string
  address: string
  workingHours: string
  zaloLink: string
  facebookLink: string
  youtubeLink: string
  twitterLink: string
  linkedinLink: string
}

export interface SiteTopbar {
  enabled: boolean
  text: string
}

export interface SiteFooter {
  about: string
  copyright: string
}

export interface SiteScripts {
  googleAnalyticsId: string
  googleTagManagerId: string
  headScripts: string
  bodyScripts: string
}

export interface SiteSettings {
  siteName: string
  siteTagline: string
  siteDescription: string
  logo: SiteImage | null
  favicon: SiteImage | null
  colors: SiteColors
  headingFont: string
  bodyFont: string
  contact: SiteContact
  topbar: SiteTopbar
  footer: SiteFooter
  scripts: SiteScripts
}

// ─── SEO Types ────────────────────────────────────────────────────────────────

export interface SeoRobots {
  index?: string
  follow?: string
  'max-snippet'?: string
  'max-image-preview'?: string
  'max-video-preview'?: string
}

export interface SeoImage {
  url: string
  width?: number
  height?: number
  alt?: string
}

export interface UnifiedSeoData {
  title?: string
  description?: string
  robots?: SeoRobots
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: SeoImage
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: SeoImage
  // Raw JSON-LD schema from plugin (Article, BreadcrumbList, etc.)
  schema?: object
  isNoIndex?: boolean
}
