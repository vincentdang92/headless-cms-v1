# API Reference — Headless CMS

> Base URL WordPress: `WORDPRESS_API_URL` (vd: `https://cms.congty.vn/wp-json`)  
> Base URL Frontend: `NEXT_PUBLIC_SITE_URL` (vd: `https://congty.vn`)

---

## Mục lục

1. [WordPress REST API Endpoints](#1-wordpress-rest-api-endpoints)
2. [ACF Options API](#2-acf-options-api)
3. [SEO Plugin API](#3-seo-plugin-api)
4. [Revalidation Webhook](#4-revalidation-webhook)
5. [Next.js Internal API Routes](#5-nextjs-internal-api-routes)
6. [Error Codes](#6-error-codes)

---

## 1. WordPress REST API Endpoints

Tất cả endpoints dưới đây là WordPress REST API chuẩn, không cần plugin thêm.

### GET Posts (danh sách bài viết)

```
GET /wp/v2/posts
```

**Query Parameters:**

| Param | Type | Default | Mô tả |
|---|---|---|---|
| `page` | number | 1 | Trang hiện tại |
| `per_page` | number | 10 | Số bài mỗi trang (max 100) |
| `search` | string | — | Tìm kiếm theo từ khóa |
| `categories` | string | — | ID categories, phân cách bằng dấu phẩy |
| `orderby` | string | `date` | `date`, `title`, `modified` |
| `order` | string | `desc` | `asc` hoặc `desc` |
| `_embed` | boolean | — | Kèm featured image, author, terms |

**Response Headers quan trọng:**

```
X-WP-Total: 42        (tổng số bài)
X-WP-TotalPages: 5    (tổng số trang)
```

**Example:**

```bash
curl "https://cms.congty.vn/wp-json/wp/v2/posts?per_page=9&page=1&_embed=1"
```

**Response:**

```json
[
  {
    "id": 123,
    "slug": "ten-bai-viet",
    "date": "2024-01-15T08:00:00",
    "modified": "2024-01-16T10:00:00",
    "title": { "rendered": "Tên bài viết" },
    "excerpt": { "rendered": "<p>Tóm tắt bài viết...</p>" },
    "content": { "rendered": "<p>Nội dung đầy đủ...</p>" },
    "featured_media": 456,
    "yoast_head_json": { ... },     // nếu dùng Yoast
    "rank_math_seo": { ... },       // nếu dùng RankMath
    "_embedded": {
      "wp:featuredmedia": [
        {
          "source_url": "https://cms.congty.vn/wp-content/uploads/image.jpg",
          "alt_text": "Mô tả ảnh",
          "media_details": { "width": 1200, "height": 630 }
        }
      ],
      "wp:term": [
        [ { "id": 1, "name": "Tin tức", "slug": "tin-tuc", "count": 15 } ],
        [ { "id": 5, "name": "seo", "slug": "seo" } ]
      ],
      "author": [
        { "id": 1, "name": "Admin", "avatar_urls": { "96": "https://..." } }
      ]
    }
  }
]
```

---

### GET Post by Slug

```
GET /wp/v2/posts?slug={slug}&_embed=1
```

**Example:**

```bash
curl "https://cms.congty.vn/wp-json/wp/v2/posts?slug=ten-bai-viet&_embed=1"
```

Returns array, lấy phần tử `[0]`. Trả về `[]` nếu không tìm thấy.

---

### GET Pages

```
GET /wp/v2/pages?slug={slug}&_embed=1
```

Dùng để lấy nội dung trang tĩnh (Giới thiệu, Chính sách, ...) được tạo trong WordPress Pages.

---

### GET Categories

```
GET /wp/v2/categories?per_page=100&hide_empty=true
```

**Response:**

```json
[
  { "id": 1, "name": "Tin tức", "slug": "tin-tuc", "count": 25 },
  { "id": 2, "name": "Sự kiện", "slug": "su-kien", "count": 8 }
]
```

---

### GET All Post Slugs (cho generateStaticParams)

```
GET /wp/v2/posts?per_page=100&fields=slug&status=publish
```

Chỉ lấy field `slug` để tối ưu, không cần `_embed`.

---

## 2. ACF Options API

Yêu cầu: plugin **Advanced Custom Fields (ACF)** đã cài và đã đăng ký Options Page.

### GET Site Settings

```
GET /acf/v3/options/options
```

**Example:**

```bash
curl "https://cms.congty.vn/wp-json/acf/v3/options/options"
```

**Response:**

```json
{
  "acf": {
    "site_name": "ACC Legal",
    "site_tagline": "Tư Vấn – Đào Tạo – Pháp Lý",
    "site_description": "Công ty TNHH Tư Vấn Đào Tạo ACC...",

    "site_logo": {
      "url": "https://cms.congty.vn/wp-content/uploads/logo.png",
      "alt": "ACC Legal Logo",
      "width": 200,
      "height": 60
    },

    "primary_color": "#E8753A",
    "primary_light_color": "#F4A96A",
    "primary_pale_color": "#FDF0E7",
    "dark_color": "#1A1A2E",
    "heading_font": "Playfair Display",
    "body_font": "Be Vietnam Pro",

    "phone": "0123 456 789",
    "hotline": "1900 xxxx",
    "email": "info@accphaply.vn",
    "address": "33 Nguyễn Xuân Khoát, P.Tân Sơn Nhì, TP.HCM",
    "working_hours": "T2–T6, 8:00–17:30",
    "zalo_link": "https://zalo.me/0123456789",
    "facebook_link": "https://facebook.com/accphaply",

    "topbar_enabled": true,
    "topbar_text": "🎉 Miễn phí tư vấn tháng này",

    "footer_about": "Hơn 10 năm đồng hành...",
    "footer_copyright": "© 2024 ACC Legal. All rights reserved.",

    "google_analytics_id": "G-XXXXXXXXXX",
    "google_tag_manager_id": "GTM-XXXXXXX"
  }
}
```

> **Lưu ý bảo mật:** Endpoint này public theo mặc định. Nếu muốn bảo vệ, thêm authentication hoặc chỉ whitelist IP của Next.js server.

---

## 3. SEO Plugin API

Cả Yoast và RankMath đều inject SEO data vào response của từng post/page.

### Yoast SEO — `yoast_head_json`

Tự động có trong response của `/wp/v2/posts` và `/wp/v2/pages` khi Yoast đã cài.

```json
{
  "yoast_head_json": {
    "title": "Tên bài viết - Tên trang",
    "description": "Meta description tối đa 160 ký tự...",
    "robots": {
      "index": "index",
      "follow": "follow",
      "max-snippet": "max-snippet:-1",
      "max-image-preview": "max-image-preview:large"
    },
    "canonical": "https://congty.vn/tin-tuc/ten-bai-viet",
    "og_title": "Tên bài viết",
    "og_description": "Mô tả cho Open Graph",
    "og_image": [
      {
        "url": "https://cms.congty.vn/wp-content/uploads/og-image.jpg",
        "width": 1200,
        "height": 630,
        "alt": "Mô tả ảnh"
      }
    ],
    "twitter_card": "summary_large_image",
    "twitter_title": "Tên bài viết",
    "twitter_description": "Mô tả cho Twitter",
    "schema": {
      "@context": "https://schema.org",
      "@graph": [ { "@type": "Article", ... }, { "@type": "BreadcrumbList", ... } ]
    }
  }
}
```

---

### RankMath SEO — `rank_math_seo`

Cần bật **RankMath > General Settings > REST API** để fields xuất hiện trong response.

```json
{
  "rank_math_seo": {
    "title": "Tên bài viết - Tên trang",
    "description": "Meta description...",
    "robots": { "index": "index", "follow": "follow" },
    "canonical_url": "https://congty.vn/tin-tuc/ten-bai-viet",
    "og_title": "Tên bài viết",
    "og_description": "Mô tả Open Graph",
    "og_image": [
      { "url": "https://...", "width": 1200, "height": 630 }
    ],
    "twitter_card": "summary_large_image",
    "schema": { ... }
  }
}
```

**Bật RankMath REST API:**
```
RankMath > General Settings > Others > REST API > Enable
```

---

### Cách Next.js xử lý SEO

Logic ưu tiên trong `src/lib/seo.ts`:

```
1. Kiểm tra rank_math_seo → dùng nếu có title
2. Kiểm tra yoast_head_json → dùng nếu có title
3. Fallback: tự build từ post.title + post.excerpt
```

Dùng trong `generateMetadata()`:

```ts
// src/app/(marketing)/tin-tuc/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  const seo = extractSeoData(post)

  return seoToMetadata(seo, {
    title: post.title.rendered,
    description: stripHtml(post.excerpt.rendered).slice(0, 160),
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/tin-tuc/${post.slug}`,
    siteName: 'CôngTy.vn',
  })
}
```

---

## 4. Revalidation Webhook

Endpoint nhận webhook từ WordPress để invalidate Next.js cache.

### POST /api/revalidate

```
POST https://congty.vn/api/revalidate?secret={REVALIDATION_SECRET}
Content-Type: application/json
```

**Authentication:** Query param `secret` phải khớp với `REVALIDATION_SECRET` trong `.env.local`.

**Request Body:**

```typescript
{
  post_type?: 'post' | 'page'   // loại nội dung thay đổi
  post_slug?: string             // slug của bài viết/trang
  scope?: 'settings' | 'all'    // revalidate site settings
}
```

**Các trường hợp sử dụng:**

#### Publish/update bài viết

```json
{
  "post_type": "post",
  "post_slug": "ten-bai-viet"
}
```

Sẽ revalidate: `/tin-tuc/ten-bai-viet`, `/tin-tuc`, `/`

---

#### Update trang (About, Contact,...)

```json
{
  "post_type": "page",
  "post_slug": "gioi-thieu"
}
```

Sẽ revalidate: `/gioi-thieu`, layout toàn site

---

#### Thay đổi Site Settings (logo, màu, contact)

```json
{
  "scope": "settings"
}
```

Sẽ revalidate: tag `site-settings`, layout toàn site

---

#### Revalidate toàn bộ site

```json
{
  "scope": "all"
}
```

---

**Response thành công (200):**

```json
{
  "revalidated": true,
  "paths": ["/tin-tuc/ten-bai-viet", "/tin-tuc", "/"],
  "timestamp": "2024-01-15T08:30:00.000Z"
}
```

**Response lỗi (401):**

```json
{ "message": "Invalid secret" }
```

---

### GET /api/revalidate (Health check)

```bash
curl "https://congty.vn/api/revalidate"
# → { "status": "ok", "service": "revalidate" }
```

---

## 5. Next.js Internal API Routes

| Route | Method | Mô tả |
|---|---|---|
| `/api/revalidate` | `GET` | Health check |
| `/api/revalidate?secret=...` | `POST` | Trigger revalidation |

---

## 6. Error Codes

### WordPress REST API

| HTTP Code | Ý nghĩa | Cách xử lý |
|---|---|---|
| `200` | OK | — |
| `400` | Bad request | Kiểm tra query params |
| `401` | Unauthorized | Kiểm tra authentication |
| `404` | Not found | Post/page không tồn tại |
| `500` | Server error | Kiểm tra WordPress logs |

### Next.js Revalidation

| HTTP Code | Ý nghĩa |
|---|---|
| `200` | Revalidation thành công |
| `401` | Secret không hợp lệ |
| `500` | Lỗi trong quá trình revalidate |

### Lỗi thường gặp

**`ECONNREFUSED`** khi build

```
TypeError: fetch failed — ECONNREFUSED
```

→ WordPress chưa chạy hoặc `WORDPRESS_API_URL` sai. Next.js sẽ dùng fallback data (không crash).

---

**ACF endpoint 404**

```
WordPress API error: 404 — /acf/v3/options/options
```

→ Plugin ACF chưa cài hoặc chưa đăng ký Options Page. Site vẫn hoạt động với `DEFAULT_SITE_SETTINGS`.

---

**RankMath fields không xuất hiện**

→ Vào **RankMath > General Settings > Others > REST API** và bật **Enable**.

---

## Cấu trúc file liên quan

```
src/
├── lib/
│   ├── wordpress.ts        ← Tất cả WP REST API calls
│   ├── site-settings.ts    ← ACF Options fetch + CSS vars
│   └── seo.ts              ← Yoast/RankMath extractor
├── types/
│   ├── wordpress.ts        ← TypeScript types cho WP response
│   └── site-settings.ts    ← Types cho settings + SEO
└── config/
    └── defaults.ts         ← Fallback values + presets
```
