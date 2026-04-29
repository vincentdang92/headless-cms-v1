import type { SiteSettings } from '@/types/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'

// ACF image field trả về object { url, alt, width, height } hoặc string URL
type AcfImage = { url?: string; alt?: string; width?: number; height?: number } | string | null | undefined

function parseAcfImage(
  raw: AcfImage,
  fallbackAlt: string,
  defaultW: number,
  defaultH: number
): SiteSettings['logo'] {
  if (!raw) return null
  const url    = typeof raw === 'string' ? raw : raw.url
  if (!url) return null
  const alt    = typeof raw === 'object' ? (raw.alt    ?? fallbackAlt) : fallbackAlt
  const width  = typeof raw === 'object' ? (raw.width  ?? defaultW)    : defaultW
  const height = typeof raw === 'object' ? (raw.height ?? defaultH)    : defaultH
  return { url, alt, width, height }
}

const API_URL = process.env.WORDPRESS_API_URL!
const WP_API_SECRET = process.env.WP_API_SECRET
const WP_TIMEOUT_MS = 5_000
const IS_DEV = process.env.NODE_ENV === 'development'

function wpHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (WP_API_SECRET) headers['X-WP-Secret'] = WP_API_SECRET
  return headers
}

// ─── Fetch từ ACF Options Page ─────────────────────────────────────────────
// Yêu cầu WordPress: plugin ACF (free hoặc Pro) + ACF Options Page được đăng ký
// Endpoint: /wp-json/acf/v3/options/options

export async function getSiteSettings(locale?: string): Promise<SiteSettings> {
  const langSuffix = locale && locale !== 'vi' ? `?lang=${locale}` : ''
  // /headless/v1/settings — custom endpoint (works with ACF Free & Pro)
  // Fallback: /acf/v3/options/options — only available with ACF Pro
  const fullUrl = `${API_URL}/headless/v1/settings${langSuffix}`
  try {
    const ts = Date.now()
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600, tags: ['site-settings'] },
      headers: wpHeaders(),
      signal: AbortSignal.timeout(WP_TIMEOUT_MS),
    })
    if (IS_DEV) {
      import('./dev-store').then(({ appendLog }) =>
        appendLog({ method: 'GET', url: fullUrl, path: fullUrl.replace(API_URL, ''), status: res.status, ms: Date.now() - ts, ts })
      )
    }
    if (!res.ok) return DEFAULT_SITE_SETTINGS

    const data = await res.json()
    const acf = data?.acf ?? {}

    return {
      siteName: acf.site_name || DEFAULT_SITE_SETTINGS.siteName,
      siteTagline: acf.site_tagline || DEFAULT_SITE_SETTINGS.siteTagline,
      siteDescription: acf.site_description || DEFAULT_SITE_SETTINGS.siteDescription,

      logo: parseAcfImage(acf.site_logo, acf.site_name || '', 200, 60),
      favicon: parseAcfImage(acf.site_favicon, '', 32, 32),

      colors: {
        primary: acf.primary_color || DEFAULT_SITE_SETTINGS.colors.primary,
        primaryLight: acf.primary_light_color || DEFAULT_SITE_SETTINGS.colors.primaryLight,
        primaryPale: acf.primary_pale_color || DEFAULT_SITE_SETTINGS.colors.primaryPale,
        dark: acf.dark_color || DEFAULT_SITE_SETTINGS.colors.dark,
      },

      headingFont: acf.heading_font || DEFAULT_SITE_SETTINGS.headingFont,
      bodyFont: acf.body_font || DEFAULT_SITE_SETTINGS.bodyFont,

      contact: {
        phone: acf.phone || DEFAULT_SITE_SETTINGS.contact.phone,
        hotline: acf.hotline || DEFAULT_SITE_SETTINGS.contact.hotline,
        email: acf.email || DEFAULT_SITE_SETTINGS.contact.email,
        address: acf.address || DEFAULT_SITE_SETTINGS.contact.address,
        workingHours: acf.working_hours || DEFAULT_SITE_SETTINGS.contact.workingHours,
        zaloLink: acf.zalo_link || '',
        facebookLink: acf.facebook_link || '',
        youtubeLink: acf.youtube_link || '',
        twitterLink: acf.twitter_link || '',
        linkedinLink: acf.linkedin_link || '',
        mapEmbedUrl: acf.map_embed_url || '',
      },

      topbar: {
        enabled: acf.topbar_enabled !== false,
        text: acf.topbar_text || '',
      },

      footer: {
        about: acf.footer_about || DEFAULT_SITE_SETTINGS.footer.about,
        copyright:
          acf.footer_copyright ||
          `© ${new Date().getFullYear()} ${acf.site_name || DEFAULT_SITE_SETTINGS.siteName}. All rights reserved.`,
      },

      scripts: {
        googleAnalyticsId: acf.google_analytics_id || '',
        googleTagManagerId: acf.google_tag_manager_id || '',
        headScripts: acf.head_scripts || '',
        bodyScripts: acf.body_scripts || '',
      },

      heroVariant: (['split', 'centered', 'image_bg', 'minimal'].includes(acf.hero_variant)
        ? acf.hero_variant
        : DEFAULT_SITE_SETTINGS.heroVariant) as SiteSettings['heroVariant'],

      showPostFeaturedImage: acf.show_post_featured_image !== false,

      tocScrollOffset: Number.isFinite(Number(acf.toc_scroll_offset))
        ? Math.max(0, Number(acf.toc_scroll_offset))
        : DEFAULT_SITE_SETTINGS.tocScrollOffset,
      tocScrollDuration: Number.isFinite(Number(acf.toc_scroll_duration))
        ? Math.max(0, Number(acf.toc_scroll_duration))
        : DEFAULT_SITE_SETTINGS.tocScrollDuration,

      showNewsSidebar: acf.show_news_sidebar !== false,

      weather: {
        provider: (['auto', 'openweathermap', 'weatherapi'] as const).includes(acf.weather_provider)
          ? (acf.weather_provider as SiteSettings['weather']['provider'])
          : 'auto',
        apiKey: acf.weather_api_key || '',
        locationOverride: acf.weather_location_override || '',
      },
    }
  } catch (e) {
    if (IS_DEV) {
      import('./dev-store').then(({ appendLog }) =>
        appendLog({ method: 'GET', url: fullUrl, path: fullUrl.replace(API_URL, ''), status: null, ms: 0, ts: Date.now(), error: String(e) })
      )
    }
    return DEFAULT_SITE_SETTINGS
  }
}

// ─── CSS Variables ─────────────────────────────────────────────────────────
// Inject vào <head> → toàn site dùng var(--cp) thay vì hardcode màu

export function buildCssVariables(settings: SiteSettings): string {
  const { colors, headingFont, bodyFont } = settings
  return `
    :root {
      --cp: ${colors.primary};
      --cp-light: ${colors.primaryLight};
      --cp-pale: ${colors.primaryPale};
      --cd: ${colors.dark};
      --font-heading: '${headingFont}', serif;
      --font-body: '${bodyFont}', sans-serif;
    }
  `
    .replace(/\n\s+/g, ' ')
    .trim()
}

// ─── Google Fonts URL ──────────────────────────────────────────────────────
// Tự động tạo Google Fonts link từ 2 font settings
// Cần dùng trong <head> nếu font chưa được load bởi next/font

const GOOGLE_FONTS_MAP: Record<string, string> = {
  'Playfair Display': 'Playfair+Display:ital,wght@0,400;0,600;0,700;1,400',
  'Be Vietnam Pro': 'Be+Vietnam+Pro:wght@300;400;500;600;700',
  Inter: 'Inter:wght@400;500;600;700',
  'DM Sans': 'DM+Sans:wght@400;500;600;700',
  'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,400;0,600;1,400',
  Raleway: 'Raleway:wght@400;500;600;700',
  Nunito: 'Nunito:wght@400;600;700;800',
  Lora: 'Lora:ital,wght@0,400;0,600;1,400',
  Lato: 'Lato:wght@300;400;700',
}

export function buildGoogleFontsUrl(headingFont: string, bodyFont: string): string {
  const families = [...new Set([headingFont, bodyFont])]
    .map((f) => GOOGLE_FONTS_MAP[f])
    .filter(Boolean)
    .join('&family=')

  return families
    ? `https://fonts.googleapis.com/css2?family=${families}&display=swap`
    : ''
}
