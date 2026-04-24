# Architecture — headless-cms-v1

**Stack:** WordPress (REST API backend) + Next.js 16 App Router (frontend)  
**Purpose:** Reusable starter kit. Clone once → `new-client.sh` bootstraps a new project per client in under a minute.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `WORDPRESS_API_URL` | Yes | WP REST API base URL — e.g. `https://cms.site.vn/wp-json` — NO trailing slash |
| `REVALIDATION_SECRET` | Yes | Shared secret for `/api/revalidate` webhook |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public frontend URL — e.g. `https://site.vn` |

Copy `.env.local.example` → `.env.local` to start.

---

## Directory Tree

```
headless-cms-v1/
├── messages/
│   ├── vi.json                         i18n strings — Vietnamese (default locale)
│   └── en.json                         i18n strings — English
│
├── src/
│   ├── middleware.ts                   next-intl middleware — locale detection + URL prefix routing
│   │
│   ├── i18n/
│   │   ├── routing.ts                  defineRouting({ locales: ['vi','en'], defaultLocale: 'vi', localePrefix: 'as-needed' })
│   │   ├── request.ts                  getRequestConfig — loads messages/[locale].json per request
│   │   └── navigation.ts               createNavigation(routing) — exports locale-aware Link, useRouter, usePathname
│   │
│   ├── app/
│   │   ├── layout.tsx                  Root layout: loads SiteSettings + getLocale(), injects CSS vars + Google Fonts + GTM/GA
│   │   ├── globals.css                 Tailwind v4 import + base :root tokens
│   │   ├── sitemap.ts                  Dynamic sitemap — generates URLs for all locales
│   │   ├── robots.ts                   robots.txt — blocks /api/, links to sitemap
│   │   ├── not-found.tsx               Global 404 fallback (for routes outside [locale])
│   │   ├── api/
│   │   │   └── revalidate/route.ts     POST: WP webhook → revalidates cache. GET: health check
│   │   └── [locale]/                   Dynamic locale segment — vi (no prefix) / en (/en/)
│   │       ├── layout.tsx              Locale layout: validates locale, provides NextIntlClientProvider
│   │       ├── not-found.tsx           Locale-aware 404 page
│   │       └── (marketing)/            Route group — wraps all public pages with Header + Footer
│   │           ├── layout.tsx          Marketing layout: fetches SiteSettings + nav translations, renders Header + Footer
│   │           ├── page.tsx            Homepage — getFlexiblePage('trang-chu', locale) → BlockRenderer
│   │           ├── gioi-thieu/page.tsx About — getFlexiblePage('gioi-thieu', locale) → BlockRenderer
│   │           ├── dich-vu/page.tsx    Services — getFlexiblePage('dich-vu', locale) → BlockRenderer
│   │           ├── lien-he/page.tsx    Contact — hardcoded ContactBlock
│   │           ├── chinh-sach-bao-mat/ Privacy policy — getPageBySlug fallback to inline content
│   │           ├── dieu-khoan-su-dung/ Terms of use — getPageBySlug fallback to inline content
│   │           └── tin-tuc/
│   │               ├── page.tsx        News list — getPosts with pagination + category filter
│   │               └── [slug]/page.tsx Post detail — getPostBySlug + JSON-LD Article schema
│   │
│   ├── blocks/                         ACF Flexible Content block components
│   │   ├── types.ts                    TypeScript interfaces for every block type + FlexibleContent union
│   │   ├── BlockRenderer.tsx           switch(acf_fc_layout) → render correct block component
│   │   ├── HeroBlock.tsx               Full-width dark hero with stats card
│   │   ├── TrustBarBlock.tsx           Scrolling trust/badge bar
│   │   ├── ServicesGridBlock.tsx       2/3/4-col service cards grid (client component)
│   │   ├── TwoColumnBlock.tsx          Image left/right + feature list (client component)
│   │   ├── TeamGridBlock.tsx           Team member cards
│   │   ├── TestimonialsBlock.tsx       Testimonial/review cards
│   │   ├── ClientsBlock.tsx            Client logos strip
│   │   ├── FaqBlock.tsx                Accordion FAQ
│   │   ├── CtaBlock.tsx                CTA banner (dark or light bg)
│   │   ├── ContactBlock.tsx            Contact form + contact info panel (client component)
│   │   ├── TimelineBlock.tsx           Company milestones timeline
│   │   └── ValuesBlock.tsx             Core values grid
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              Sticky header: topbar + logo + desktop nav + mobile hamburger (client)
│   │   │   └── Footer.tsx              4-col footer: brand + nav + services + contact
│   │   ├── news/
│   │   │   └── NewsCard.tsx            Post card — supports featured (horizontal) mode
│   │   └── ui/
│   │       └── Pagination.tsx          Page number links for news list
│   │
│   ├── config/
│   │   └── defaults.ts                 DEFAULT_SITE_SETTINGS + PRESETS (law|tech|healthcare|realestate|education|food)
│   │
│   ├── lib/
│   │   ├── wordpress.ts                All WP REST API calls. wpFetch() + getPosts/getPostBySlug/getFlexiblePage/etc.
│   │   ├── site-settings.ts            Fetch ACF Options → map to SiteSettings. buildCssVariables(). buildGoogleFontsUrl()
│   │   ├── seo.ts                      extractSeoData (Yoast/RankMath auto-detect), seoToMetadata, JSON-LD schema builders
│   │   └── utils.ts                    cn(), formatDate(), formatDateLong(), stripHtml(), truncate(), slugify()
│   │
│   ├── templates/
│   │   └── law/
│   │       ├── fallback.ts             Homepage fallback blocks (law industry content)
│   │       ├── fallback-about.ts       About page fallback blocks
│   │       └── fallback-services.ts    Services page fallback blocks
│   │
│   └── types/
│       ├── site-settings.ts            SiteSettings, SiteColors, SiteContact, UnifiedSeoData, etc.
│       └── wordpress.ts                WPPost, WPPage, WPCategory, WPTag, WPQueryParams, WPPaginatedResponse
│
├── docs/
│   ├── SETUP.md                        Full setup guide (WP plugins, ACF fields, deploy)
│   ├── API.md                          WP REST API reference + ACF Options API
│   └── acf-fields-export.json          ACF field group export — import to WP to skip manual field creation
│
├── scripts/
│   └── new-client.sh                   Bootstrap new client project: copies starter, writes .env.local, applies preset
│
├── demo/
│   └── acc-luat-v2.html                Static HTML demo for law industry client
│
├── next.config.ts                      withNextIntl wrapper + image remotePatterns for WP domains + localhost + Gravatar
├── .env.local.example                  Template env file
└── CLAUDE.md → AGENTS.md              Agent instructions (read Next.js docs before coding)
```

---

## Data Flow

```
WordPress (REST API)
        │
        ├─ /wp/v2/posts          → lib/wordpress.ts (getPosts, getPostBySlug, getAllPostSlugs)
        ├─ /wp/v2/pages          → lib/wordpress.ts (getPageBySlug)
        ├─ /wp/v2/categories     → lib/wordpress.ts (getCategories, getCategoryBySlug)
        ├─ /acf/v3/pages         → lib/wordpress.ts (getFlexiblePage → FlexibleContent[])
        └─ /acf/v3/options/options → lib/site-settings.ts (getSiteSettings → SiteSettings)
                │
                ▼
        Next.js Server Components
                │
                ├─ SiteSettings injected into RootLayout (<style> CSS vars + Google Fonts)
                ├─ SiteSettings passed to Header + Footer via MarketingLayout
                └─ FlexibleContent[] passed to <BlockRenderer blocks={...} settings={...} />
                                │
                                └─ switch(acf_fc_layout) → individual Block components
```

**Fetch timeout:** All `fetch()` calls use `signal: AbortSignal.timeout(5_000)` — fails fast when WP is offline, falls back to `DEFAULT_SITE_SETTINGS` / template fallback data.

**Cache invalidation:** WordPress webhook → `POST /api/revalidate?secret=...` → `revalidateTag` / `revalidatePath`

---

## Multilingual (i18n)

**Implementation:** next-intl 4.x + Polylang (WordPress)

### URL Structure

| Locale | URL prefix | Example |
|---|---|---|
| Vietnamese (default) | none (`as-needed`) | `congty.vn/tin-tuc` |
| English | `/en/` | `congty.vn/en/tin-tuc` |

`localePrefix: 'as-needed'` — default locale has no prefix; the middleware rewrites `/` → `/vi` internally so all server components receive a locale.

### Routing

```
Request: GET /
  → src/middleware.ts (next-intl)
  → internal rewrite to /vi
  → src/app/[locale]/(marketing)/page.tsx  (locale = 'vi')

Request: GET /en/tin-tuc
  → middleware passes through
  → src/app/[locale]/(marketing)/tin-tuc/page.tsx  (locale = 'en')
```

### WordPress: Polylang integration

All `wpFetch()` calls pass `?lang=<locale>` (via `appendLang()` helper) for non-default locales:

```ts
// lib/wordpress.ts
function appendLang(url: string, locale?: string): string {
  if (!locale || locale === 'vi') return url
  return url.includes('?') ? `${url}&lang=${locale}` : `${url}?lang=${locale}`
}
```

Polylang intercepts the `lang` query param and returns translated content. Vietnamese content (default) requires no extra param — Polylang returns the default language.

### Messages (UI strings)

Stored in `messages/vi.json` and `messages/en.json`. Namespaces:

| Namespace | Used in |
|---|---|
| `Nav` | MarketingLayout (nav labels) |
| `Header` | Header component (CTA button) |
| `Footer` | Footer component |
| `Contact` | ContactBlock (form labels + messages) |
| `News` | NewsCard, Pagination (read more, next/prev) |
| `NotFound` | 404 page |

**Server components:** `getTranslations('Namespace')` from `next-intl/server`  
**Client components:** `useTranslations('Namespace')` from `next-intl`  
**Navigation:** `Link`, `useRouter`, `usePathname` from `@/i18n/navigation` (locale-aware wrappers)

### Adding a new locale

1. Add locale to `src/i18n/routing.ts` → `locales` array
2. Create `messages/<locale>.json` with all namespaces filled
3. If using Polylang: add the language in **WordPress → Languages → Add New**
4. `generateStaticParams` in `[locale]/layout.tsx` auto-picks up new locales

---

## CSS Variable System

Set by `buildCssVariables(settings)` injected into `<head>` at runtime — change colors/fonts from WordPress without redeploying.

| Variable | Maps to | Default (law preset) |
|---|---|---|
| `--cp` | `settings.colors.primary` | `#E8753A` |
| `--cp-light` | `settings.colors.primaryLight` | `#F4A96A` |
| `--cp-pale` | `settings.colors.primaryPale` | `#FDF0E7` |
| `--cd` | `settings.colors.dark` | `#1A1A2E` |
| `--font-heading` | `settings.headingFont` | `'Playfair Display', serif` |
| `--font-body` | `settings.bodyFont` | `'Be Vietnam Pro', sans-serif` |

**Rule:** All blocks use `style={{ color: 'var(--cp)' }}` etc. — never hardcode brand colors.

---

## Block System

### Adding a new block

**Step 1** — Define type in [src/blocks/types.ts](src/blocks/types.ts):
```ts
export interface MyNewBlock {
  acf_fc_layout: 'my_new_block'   // must match ACF field name exactly
  section_title: string
  // ... fields
}

// Add to union:
export type FlexibleBlock = ... | MyNewBlock
```

**Step 2** — Create component `src/blocks/MyNewBlock.tsx`:
```tsx
import type { MyNewBlock } from './types'

export default function MyNewBlock({ block }: { block: MyNewBlock }) {
  // Use var(--cp), var(--cd), var(--font-heading) for styling
  // Add 'use client' if uses useState/useEffect/event handlers
}
```

**Step 3** — Register in [src/blocks/BlockRenderer.tsx](src/blocks/BlockRenderer.tsx):
```tsx
import MyNewBlock from './MyNewBlock'
// in switch:
case 'my_new_block':
  return <MyNewBlock key={key} block={block} />
```

**Step 4** — Add fallback data to `src/templates/<industry>/fallback.ts`

**Step 5** — Add ACF field to WordPress and export `docs/acf-fields-export.json`

---

## Template / Preset System

**Presets** (`src/config/defaults.ts`) — industry-level color + font overrides:
```
law          #E8753A / Playfair Display   — Luật, kế toán, tài chính
tech         #2563EB / Inter              — Công nghệ, SaaS
healthcare   #0D9488 / DM Sans            — Y tế, spa, wellness
realestate   #B45309 / Cormorant Garamond — Bất động sản
education    #7C3AED / Nunito             — Giáo dục
food         #DC2626 / Lora               — Nhà hàng, F&B
```

**Templates** (`src/templates/<industry>/`) — fallback block content for pages when WP has no ACF data yet:
- `fallback.ts` → homepage blocks
- `fallback-about.ts` → `/gioi-thieu` blocks
- `fallback-services.ts` → `/dich-vu` blocks

### Adding a new industry template
1. Add preset colors + fonts to `PRESETS` in `defaults.ts`
2. Create `src/templates/<industry>/fallback.ts`, `fallback-about.ts`, `fallback-services.ts`
3. Update page imports in `gioi-thieu/page.tsx`, `dich-vu/page.tsx`, `page.tsx`

---

## Adding a New Page

```tsx
// src/app/[locale]/(marketing)/my-page/page.tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getFlexiblePage } from '@/lib/wordpress'
import { getSiteSettings } from '@/lib/site-settings'
import { DEFAULT_SITE_SETTINGS } from '@/config/defaults'
import { MY_FALLBACK } from '@/templates/law/fallback-my-page'
import BlockRenderer from '@/blocks/BlockRenderer'

export const metadata: Metadata = { title: 'Page Title' }

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [blocks, settings] = await Promise.all([
    getFlexiblePage('my-wp-page-slug', locale).catch(() => null),
    getSiteSettings(locale).catch(() => null),
  ])
  return <BlockRenderer blocks={blocks ?? MY_FALLBACK} settings={settings ?? DEFAULT_SITE_SETTINGS} />
}
```

---

## Revalidation Webhook

WordPress sends `POST /api/revalidate?secret=REVALIDATION_SECRET` with body:

| Scenario | Body |
|---|---|
| Post published/updated | `{ "post_type": "post", "post_slug": "slug" }` |
| Page updated | `{ "post_type": "page", "post_slug": "slug" }` |
| ACF Site Settings changed | `{ "scope": "settings" }` |
| Full revalidation | `{ "scope": "all" }` |

---

## Key Conventions

- **Vietnamese URLs:** `/tin-tuc`, `/gioi-thieu`, `/dich-vu`, `/lien-he` (same slugs for both locales — Polylang handles content, not URL slugs)
- **Tailwind v4** — uses `@import "tailwindcss"` syntax, NOT `@tailwind base/components/utilities`
- **No hardcoded colors** in blocks — always `var(--cp)`, `var(--cd)` etc.
- **No `import React`** — React 19, not needed
- **`'use client'`** only on components with event handlers / hooks (ContactBlock, ServicesGridBlock, TwoColumnBlock, Header)
- **Navigation links:** use `Link` from `@/i18n/navigation`, NOT `next/link` — locale-aware prefix handling
- **`setRequestLocale(locale)`** must be called at the top of every `[locale]` layout and page — required for static rendering support
- **Fetch deduplication:** Next.js deduplicates identical fetch calls within a render pass — safe to call `getSiteSettings()` in both RootLayout and MarketingLayout
- **Fallback pattern:** Every page wraps API calls in `.catch(() => null)` and falls back to template data — site works without WordPress running
