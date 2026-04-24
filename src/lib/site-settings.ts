import type { SiteSettings } from '@/types/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'

const API_URL = process.env.WORDPRESS_API_URL!
const WP_TIMEOUT_MS = 5_000

// ─── Fetch từ ACF Options Page ─────────────────────────────────────────────
// Yêu cầu WordPress: plugin ACF (free hoặc Pro) + ACF Options Page được đăng ký
// Endpoint: /wp-json/acf/v3/options/options

export async function getSiteSettings(locale?: string): Promise<SiteSettings> {
  const langSuffix = locale && locale !== 'vi' ? `?lang=${locale}` : ''
  try {
    const res = await fetch(`${API_URL}/acf/v3/options/options${langSuffix}`, {
      next: { revalidate: 3600, tags: ['site-settings'] },
      signal: AbortSignal.timeout(WP_TIMEOUT_MS),
    })
    if (!res.ok) return DEFAULT_SITE_SETTINGS

    const data = await res.json()
    const acf = data?.acf ?? {}

    return {
      siteName: acf.site_name || DEFAULT_SITE_SETTINGS.siteName,
      siteTagline: acf.site_tagline || DEFAULT_SITE_SETTINGS.siteTagline,
      siteDescription: acf.site_description || DEFAULT_SITE_SETTINGS.siteDescription,

      logo: acf.site_logo?.url
        ? {
            url: acf.site_logo.url,
            alt: acf.site_logo.alt || acf.site_name || '',
            width: acf.site_logo.width || 200,
            height: acf.site_logo.height || 60,
          }
        : null,

      favicon: acf.site_favicon?.url
        ? { url: acf.site_favicon.url, alt: '', width: 32, height: 32 }
        : null,

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
    }
  } catch {
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
