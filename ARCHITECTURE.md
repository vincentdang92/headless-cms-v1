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
| `WEATHER_PROVIDER` | No | Override WP admin: `auto` \| `openweathermap` \| `weatherapi` (default `auto`) |
| `WEATHER_API_KEY` | No | API key for OpenWeatherMap or WeatherAPI.com — takes priority over WP admin setting |
| `WEATHER_LOCATION` | No | Override WP admin: fixed city name e.g. `Hà Nội` — otherwise auto-detected from user IP |

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
│   │   │   ├── revalidate/route.ts     POST: WP webhook → revalidates cache. GET: health check
│   │   │   ├── reviews/route.ts        POST: proxy review submission to WP (keeps WP_API_SECRET server-side)
│   │   │   └── weather/route.ts        GET: proxy weather API — supports auto/openweathermap/weatherapi, detects client IP
│   │   └── [locale]/                   Dynamic locale segment — vi (no prefix) / en (/en/)
│   │       ├── layout.tsx              Locale layout: validates locale, provides NextIntlClientProvider
│   │       ├── not-found.tsx           Locale-aware 404 page
│   │       └── (marketing)/            Route group — wraps all public pages with Header + Footer
│   │           ├── layout.tsx          Marketing layout: fetches SiteSettings + nav translations, renders Header + Footer
│   │           ├── page.tsx            Homepage — getFlexiblePage('trang-chu') → BlockRenderer + JSON-LD Organization schema
│   │           ├── gioi-thieu/page.tsx About — pale page header + getFlexiblePage('gioi-thieu') → BlockRenderer
│   │           ├── dich-vu/page.tsx    Services — getFlexiblePage('dich-vu') → BlockRenderer (has Hero block at top)
│   │           ├── dich-vu/[slug]/     Service detail — breadcrumb + page header + getFlexiblePage(slug) → BlockRenderer
│   │           │   └── page.tsx        Falls back to SERVICE_DETAIL_FALLBACKS[slug]; unknown slug → 404
│   │           ├── lien-he/page.tsx    Contact — pale page header + ContactBlock
│   │           ├── chinh-sach-bao-mat/ Privacy policy — getPageBySlug fallback to inline content
│   │           ├── dieu-khoan-su-dung/ Terms of use — getPageBySlug fallback to inline content
│   │           ├── tin-tuc/
│   │           │   ├── page.tsx        News list — ViewToggle (list/3col/4col) + Algolia search + optional sidebar (CalendarWidget + WeatherWidget)
│   │           │   └── [slug]/page.tsx Post detail — getPostBySlug + JSON-LD Article/Breadcrumb schema + sidebar widgets
│   │           └── danh-muc/
│   │               └── [slug]/page.tsx Category archive — ViewToggle + JSON-LD BreadcrumbList + optional sidebar
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
│   │   │   ├── NewsCard.tsx            Post card — supports featured (horizontal) mode
│   │   │   ├── ViewToggle.tsx          Client — list/3col/4col toggle, saves to localStorage, updates ?view= URL param
│   │   │   ├── TableOfContents.tsx     TOC: mobile accordion + desktop fixed floating button (left, scroll-triggered, animated)
│   │   │   ├── ReadingProgress.tsx     Fixed top bar tracking scroll progress through #article-content (client)
│   │   │   ├── BackToTop.tsx           Fixed bottom-right button, visible after 400px scroll (client)
│   │   │   ├── PostNavigation.tsx      Prev/Next article links — fetches adjacent by date from WP (server)
│   │   │   ├── ArticleRating.tsx       Emoji review widget: summary + form + list — WP comments + comment_karma (client)
│   │   │   ├── SocialShare.tsx         Share buttons: Facebook, Twitter, copy-link (client)
│   │   │   └── widgets/                Self-fetching sidebar widgets — add/remove/reorder freely in page.tsx
│   │   │       ├── RecentPostsWidget.tsx   Server component — fetches latest posts, excludes current
│   │   │       ├── CategoriesWidget.tsx    Server component — fetches all categories sorted by count
│   │   │       ├── CtaWidget.tsx           Server component — call/Zalo CTA card from SiteSettings contact
│   │   │       ├── CalendarWidget.tsx      Client — current month calendar, Mon-first, highlights today
│   │   │       └── WeatherWidget.tsx       Client — ipapi.co (location) + Open-Meteo (weather), animated emoji icon
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
│   │   └── utils.ts                    cn(), formatDate(), formatDateLong(), stripHtml(), truncate(), slugify(), calcReadingTime(), extractToc(), injectHeadingIds()
│   │
│   ├── templates/
│   │   └── law/
│   │       ├── fallback.ts             Homepage fallback blocks (law industry content)
│   │       ├── fallback-about.ts       About page fallback blocks
│   │       ├── fallback-services.ts    Services list page fallback blocks
│   │       └── fallback-service-detail.ts  Per-slug detail fallback + SERVICE_META map (9 services)
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
        ├─ /headless/v1/settings  → lib/site-settings.ts (getSiteSettings → SiteSettings)  ← custom endpoint
        └─ /acf/v3/options/options → fallback for ACF Pro only
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

**Fetch timeout:** `IS_DEV ? 15_000 : 8_000` ms — longer in dev to survive WP cold starts, shorter in prod to fail fast. Falls back to `DEFAULT_SITE_SETTINGS` / template data.

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
| `News` | NewsCard, Pagination, TableOfContents, post detail page, sidebar widgets |
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

## Sidebar Widget System

There are two distinct sidebar contexts:

### Post detail sidebar (`tin-tuc/[slug]/page.tsx`)
**Self-fetching server components** — each widget fetches its own data independently. No prop drilling.

```tsx
<aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 self-start">
  <WeatherWidget locale={locale} />
  <CalendarWidget locale={locale} />
  <RecentPostsWidget locale={locale} excludeId={post.id} />
  <CategoriesWidget locale={locale} />
  <CtaWidget settings={settings} />
</aside>
```

Each widget returns `null` gracefully when there's no data. To add/remove/reorder, edit the `<aside>` block — widgets have no inter-dependencies.

### News list sidebar (`tin-tuc/page.tsx`, `danh-muc/[slug]/page.tsx`)
**Client components** — controlled by `settings.showNewsSidebar` (ACF `show_news_sidebar` true_false field):

```tsx
{settings.showNewsSidebar && (
  <aside className="hidden lg:block lg:col-span-3 space-y-4 self-start sticky top-24">
    <WeatherWidget locale={locale} />   {/* ipapi.co + Open-Meteo, animated emoji */}
    <CalendarWidget locale={locale} />  {/* current month, Mon-first, today highlighted */}
  </aside>
)}
```

`WeatherWidget` calls `GET /api/weather` (Next.js server route) — API keys never exposed to the browser. The route supports 3 providers configurable from WP admin or env vars (env takes priority):

| Provider | ACF value | Free tier | Key needed |
|---|---|---|---|
| ipapi.co + Open-Meteo | `auto` | Yes (rate-limited) | No |
| OpenWeatherMap | `openweathermap` | 60 calls/min | Yes |
| WeatherAPI.com | `weatherapi` | 1M calls/month | Yes |

Location is auto-detected from client IP (`x-forwarded-for`) or fixed via ACF `weather_location_override`. Returns `null` on any error (no broken UI).

### View toggle (`ViewToggle.tsx`)
News list and category pages show a `list | 3col | 4col` toggle in the page header. The server reads `?view=` from `searchParams`, passes it as a prop to `ViewToggle` (avoids `useSearchParams()` Suspense requirement). `getGridClass(view)` returns the Tailwind grid class string for the posts container.

---

## Post Detail Layout

`tin-tuc/[slug]/page.tsx` uses a 12-column grid:

| Column span | Content |
|---|---|
| `lg:col-span-9` | Article body — content, author card, tags, social share, rating |
| `lg:col-span-3` | Sidebar — sidebar widgets (hidden on mobile) |

**Fixed UI overlays** (mounted once at top of page JSX):
- `ReadingProgress` — 3px bar at very top, tracks scroll through `#article-content`
- `BackToTop` — bottom-right circle, appears after 400px scroll, smooth-scrolls to 0

**Prev/Next navigation** (`PostNavigation`) — server component, sits below article body above back-link. Uses `getAdjacentPosts(post.date)` which fires 2 parallel WP REST calls: `?before={date}` for prev, `?after={date}` for next.

**TOC** (`TableOfContents`) sits above the grid (full width):
- **Mobile:** collapsible accordion (`lg:hidden`)
- **Desktop:** `position: fixed` button at `left-4 top-1/2`, visible after scrolling past `floatingThreshold` (default 400px). Click → expands panel with full TOC. Click outside or Esc → closes.
- **Smooth scroll:** RAF-based `smoothScrollTo()` with easeInOutCubic. Cancels automatically on `wheel`/`touchstart` to not fight user input. Offset and duration are configurable from WP admin (`toc_scroll_offset`, `toc_scroll_duration`).

---

## SiteSettings Fields

Controlled via ACF Options page in WordPress (`/headless/v1/settings`):

| Field (ACF key) | Type | SiteSettings property | Default |
|---|---|---|---|
| `site_name` | text | `siteName` | — |
| `site_logo` | image | `logo` | null |
| `primary_color` | color | `colors.primary` | `#E8753A` |
| `hero_variant` | select | `heroVariant` | `'split'` |
| `show_post_featured_image` | true_false | `showPostFeaturedImage` | `true` |
| `toc_scroll_offset` | number | `tocScrollOffset` | `96` |
| `toc_scroll_duration` | number | `tocScrollDuration` | `700` |
| `show_news_sidebar` | true_false | `showNewsSidebar` | `true` |

---

## Review / Rating System

Post reviews use **WP native comments + `comment_karma`** (no plugin). WooCommerce-compatible: WC product reviews use the same `comment_karma` field and `wp_comments` table — only `comment_type` differs.

### Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/headless/v1/reviews/{post_id}` | Approved reviews with `comment_karma ≥ 1` |
| POST | `/headless/v1/reviews` | Create review → `comment_approved = 0` (pending) |
| POST | `/api/reviews` (Next.js) | Proxy to WP, keeps `WP_API_SECRET` server-side |

### Moderation

WP Admin → Comments → Pending. Built-in WP UI, no extra plugin.

### Anti-spam

Same email + same post within 24 h → `429 duplicate` from WP endpoint.  
Client also stores `reviewed_{postId}` in `localStorage` to hide the form after submit.

### Extending to WooCommerce

Same `comment_karma` field, same DB schema. When building a WC theme:
- Use `comment_type: 'review'` in `wp_insert_comment`
- Point to the WC product ID as `post_id`
- The `ArticleRating` component is UI-only — reusable as-is

---

## PWA + Firebase Push Notifications

### PWA

`@ducanh2912/next-pwa` (Workbox) wraps `next.config.ts` and generates `public/sw.js` at build time.

| Feature | Implementation |
|---|---|
| Service worker | `public/sw.js` — generated by next-pwa + custom code from `src/worker/index.ts` |
| Manifest | `src/app/manifest.ts` — dynamic, reads `siteName` + `colors.primary` from SiteSettings |
| Offline fallback | `src/app/offline/page.tsx` — shown when network unavailable |
| PWA icons | Place at `public/icons/icon-192.png` and `public/icons/icon-512.png` (generate at realfavicongenerator.net) |

**SW composition:** `src/worker/index.ts` is compiled by webpack and merged into the Workbox-generated `sw.js`. ONE service worker handles both caching AND FCM background messages.

### Firebase Cloud Messaging (Push)

**Topic-based** — no per-user token DB needed. All opt-in users subscribe to `/topics/all`.

```
User clicks bell → request permission → getToken() (using sw.js) → POST /api/notifications/subscribe → Firebase Admin subscribeToTopic('all')

WordPress publish post → transition_post_status hook → POST /api/notifications/send?secret=... → Firebase Admin sendPushToTopic('all') → push to all subscribers
```

| File | Role |
|---|---|
| `src/worker/index.ts` | Background message handler (merged into sw.js) |
| `src/lib/firebase-client.ts` | Client-side FCM init + `subscribePushNotifications()` |
| `src/lib/firebase-admin.ts` | Admin SDK singleton — `sendPushToTopic()`, `subscribeToTopic()` |
| `src/app/api/notifications/subscribe/route.ts` | Receives FCM token, subscribes to topic |
| `src/app/api/notifications/send/route.ts` | WP webhook → send push (auth: `REVALIDATION_SECRET`) |
| `src/components/layout/NotificationBell.tsx` | Opt-in bell in Header (desktop + mobile) |

**Graceful degradation:** All Firebase code checks `isFirebaseConfigured()` / `isFirebaseAdminConfigured()` before executing. If env vars are missing, the bell doesn't render and API routes return 503 — site works normally without Firebase.

**Env vars needed:**
- Client (safe to expose): `NEXT_PUBLIC_FIREBASE_*` + `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- Server only: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`

### Extending push to other topics

To subscribe users to category-specific topics, pass `topic: 'tin-tuc'` (category slug) to `POST /api/notifications/subscribe`. WP can send to that topic in the `send` endpoint. Topic names must match `[a-zA-Z0-9-_.~]`.

---

## Auth System

Simple login/register using WP native user management. No JWT plugin — uses WP's own `wp_generate_auth_cookie` / `wp_validate_auth_cookie` for token signing.

### Flow

```
Browser → POST /api/auth/login (Next.js) → POST /headless/v1/auth/login (WP)
       ← httpOnly cookie `wp_auth` (30 days)

Browser → GET /tai-khoan → middleware checks cookie → OK → page loads
       → client fetches /api/auth/me → WP validates token → user info
```

### WP Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/headless/v1/auth/register` | `wp_create_user()` + welcome email via WP Easy SMTP |
| POST | `/headless/v1/auth/login` | `wp_authenticate()` → `wp_generate_auth_cookie()` |
| GET  | `/headless/v1/auth/me` | `wp_validate_auth_cookie()` via `X-WP-Auth-Token` header |
| POST | `/headless/v1/auth/forgot-password` | `get_password_reset_key()` + `wp_mail()` |

### Next.js API Routes

| Route | Description |
|---|---|
| `POST /api/auth/login` | Proxy to WP, sets httpOnly `wp_auth` cookie on success |
| `POST /api/auth/register` | Proxy to WP |
| `GET /api/auth/me` | Reads `wp_auth` cookie, proxies to WP `/auth/me` with `X-WP-Auth-Token` |
| `POST /api/auth/logout` | Deletes `wp_auth` cookie |
| `POST /api/auth/forgot-password` | Proxy to WP |

### Pages

| Route | Type | Description |
|---|---|---|
| `/dang-nhap` | Client | Login form + forgot password toggle |
| `/dang-ky` | Client | Register form |
| `/tai-khoan` | Client | Account info + logout (middleware-protected) |

### Middleware Protection

`src/middleware.ts` redirects `/tai-khoan` (and `/en/tai-khoan`) to `/dang-nhap?redirect=...` when `wp_auth` cookie is absent. Cookie presence check only — actual token validation happens in the account page client component.

### Token Invalidation

- **Logout**: `POST /api/auth/logout` deletes the `wp_auth` cookie
- **Stale token**: `/api/auth/me` returns 401 → client calls logout → clears cookie → redirect to login
- **WP side**: `wp_validate_auth_cookie()` validates session token stored in WP's user meta

### Email (WP Easy SMTP)

Install and configure the **WP Easy SMTP** plugin in WordPress admin. All `wp_mail()` calls (registration welcome, password reset) route through it automatically — no Next.js config needed.
| `topbar_enabled` | true_false | `topbar.enabled` | `true` |
| `google_analytics_id` | text | `scripts.googleAnalyticsId` | — |
| `phone`, `hotline`, `email`, `address` | text | `contact.*` | — |
| `zalo_link`, `facebook_link`, etc. | url | `contact.*Link` | — |

**WordPress theme note:** ACF `true_false` fields return `'1'`/`'0'` (not PHP booleans). The theme's `$b()` helper normalises this: `$b = fn($k) => (bool) get_field($k, 'option');`. Never use `get_field() !== false` for boolean fields.

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
- `fallback-service-detail.ts` → `/dich-vu/[slug]` — `SERVICE_DETAIL_FALLBACKS` map + `SERVICE_META` map (titles, descriptions)

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

## Deploy — Quick Reference

Full guide in [`docs/SETUP.md §9`](docs/SETUP.md#9-deploy-frontend).

| Platform | Khi nào dùng | Cần `output: standalone` |
|---|---|---|
| **Vercel** | Dự án mới, không có server | Không |
| **cPanel Node.js** | Khách có sẵn shared hosting cPanel | **Bắt buộc** |
| **VPS + PM2 + Nginx** | Toàn quyền server, WP + Next.js cùng VPS | Không |
| **Coolify** | VPS có sẵn, muốn UI deploy như Vercel | Không |

### cPanel — 3 điểm bắt buộc

1. **`output: 'standalone'`** trong `next.config.ts`
2. **`server.js`** entry point phải có `process.env.HOSTNAME = '0.0.0.0'` — Phusion Passenger cần bind `0.0.0.0`, không phải `127.0.0.1`
3. **Copy static assets** sau mỗi lần build:
   ```bash
   cp -r .next/static  .next/standalone/.next/static
   cp -r public        .next/standalone/public
   ```

> **RAM thấp (< 512MB)?** Build local, upload `.next/standalone/` lên server — xem Lộ trình B trong SETUP.md.

### Biến môi trường theo platform

`NEXT_PUBLIC_*` được **inline lúc build** — phải set đúng trước khi `npm run build`:

| Biến | Ví dụ | Build-time? |
|---|---|---|
| `WORDPRESS_API_URL` | `https://cms.congty.vn/wp-json` | Không |
| `NEXT_PUBLIC_SITE_URL` | `https://congty.vn` | **Có** |
| `REVALIDATION_SECRET` | `<hex 32 bytes>` | Không |
| `NODE_ENV` | `production` | Không |

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
- **Self-fetching widgets:** Sidebar widgets fetch their own data — no prop drilling. Add/remove by editing the `<aside>` in `page.tsx`; never pass data down into widgets
- **ACF boolean fields:** Use `$b($key)` helper in `functions.php` for `true_false` ACF fields. Never use `get_field() !== false` — returns `'0'` for false which is truthy
- **WordPress theme PHP:** Avoid `fn() =>` arrow syntax in `wp-theme/functions.php` — cPanel editor flags it as a syntax error (though PHP 8+ accepts it). Use `function() { return ...; }` instead
- **SEO:** `generateMetadata` uses `extractSeoData(post)` → auto-detects Yoast or RankMath. Falls back to `post.title` / `post.excerpt` when no SEO plugin data exists
