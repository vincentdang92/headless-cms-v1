# Hướng dẫn cài đặt — Headless CMS

> Stack: WordPress (backend API) + Next.js 16 (frontend)  
> Thời gian cài đặt ước tính: 30–60 phút

---

## Mục lục

1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [Cài đặt WordPress](#2-cài-đặt-wordpress)
3. [Cài đặt Plugins](#3-cài-đặt-plugins)
4. [Cấu hình ACF Options Page](#4-cấu-hình-acf-options-page)
5. [Cấu hình ACF Fields](#5-cấu-hình-acf-fields)
6. [Cài đặt Next.js](#6-cài-đặt-nextjs)
7. [Cấu hình Revalidation Webhook](#7-cấu-hình-revalidation-webhook)
8. [Deploy](#8-deploy)
9. [Đổi ngành / Preset](#9-đổi-ngành--preset)

---

## 1. Yêu cầu hệ thống

| Thành phần | Phiên bản tối thiểu |
|---|---|
| PHP | 8.1+ |
| WordPress | 6.4+ |
| Node.js | 20.x+ |
| npm | 10.x+ |

---

## 2. Cài đặt WordPress

### Local (XAMPP / Local by Flywheel / Laragon)

```bash
# Hoặc dùng LocalWP: https://localwp.com/
```

Cài WordPress bình thường. Sau khi xong, truy cập **Settings > Permalinks** → chọn **Post name** → Save.

```
http://localhost:8888/wp-admin
Settings > Permalinks > Post name → Save Changes
```

> **Quan trọng:** Phải đặt Permalink là Post name, nếu không REST API không hoạt động.

### VPS / Production

Cài WordPress trên hosting, cấu hình tương tự. Đảm bảo domain WordPress được trỏ đúng.

---

## 3. Cài đặt Plugins

Vào **Plugins > Add New** và cài các plugin sau:

### Bắt buộc

| Plugin | Mục đích | Link |
|---|---|---|
| **Advanced Custom Fields (ACF)** | Quản lý site settings (logo, màu, contact) | WordPress.org |
| **WP Webhooks** | Tự động gọi webhook khi publish/update | WordPress.org |

### SEO (chọn 1 trong 2)

| Plugin | Ghi chú |
|---|---|
| **Rank Math SEO** | Recommended — REST API tích hợp sẵn, không cần config thêm |
| **Yoast SEO** | Phổ biến — REST API có sẵn qua `yoast_head_json` |

### Tùy chọn

| Plugin | Mục đích |
|---|---|
| **WP-API-Menus** | Expose WordPress menus qua REST API (`/wp-json/wp/v2/menus`) |
| **JWT Auth WP** | Bảo mật REST API bằng JWT token |

---

## 4. Cấu hình ACF Options Page

Thêm code sau vào `functions.php` của theme hoặc tạo plugin riêng:

```php
<?php
// Đăng ký ACF Options Page cho Site Settings
if ( function_exists( 'acf_add_options_page' ) ) {
    acf_add_options_page( array(
        'page_title' => 'Cài Đặt Giao Diện',
        'menu_title' => 'Site Settings',
        'menu_slug'  => 'site-settings',
        'capability' => 'manage_options',
        'icon_url'   => 'dashicons-admin-customizer',
        'position'   => 2,
    ) );
}
```

Sau khi thêm, menu **Site Settings** sẽ xuất hiện trong sidebar WordPress.

> Nếu dùng plugin thay vì functions.php, tạo file `/wp-content/plugins/headless-site-settings/headless-site-settings.php`

---

## 5. Cấu hình ACF Fields

Vào **Custom Fields > Field Groups > Add New**, tạo group tên **"Site Settings"** với location rule:

```
Options Page == Site Settings
```

Tạo các fields theo bảng sau:

### Tab: Thương hiệu

| Field Label | Field Name | Field Type | Ghi chú |
|---|---|---|---|
| Tên công ty | `site_name` | Text | Hiển thị khi không có logo |
| Tagline | `site_tagline` | Text | Dòng phụ dưới tên |
| Logo | `site_logo` | Image | Return format: Array |
| Favicon | `site_favicon` | Image | Return format: Array |
| Mô tả trang web | `site_description` | Textarea | Dùng cho meta description mặc định |

### Tab: Màu sắc & Font

| Field Label | Field Name | Field Type | Default |
|---|---|---|---|
| Màu chủ đạo | `primary_color` | Color Picker | `#E8753A` |
| Màu chủ đạo nhạt | `primary_light_color` | Color Picker | `#F4A96A` |
| Màu nền nhạt | `primary_pale_color` | Color Picker | `#FDF0E7` |
| Màu tối (dark) | `dark_color` | Color Picker | `#1A1A2E` |
| Font tiêu đề | `heading_font` | Select | Xem danh sách bên dưới |
| Font nội dung | `body_font` | Select | Xem danh sách bên dưới |

**Choices cho Font fields:**
```
Playfair Display : Playfair Display (Luật, Tài chính)
Be Vietnam Pro : Be Vietnam Pro (Phổ thông)
Inter : Inter (Công nghệ, SaaS)
DM Sans : DM Sans (Y tế, Wellness)
Nunito : Nunito (Giáo dục)
Lora : Lora (Nhà hàng, F&B)
```

### Tab: Liên hệ

| Field Label | Field Name | Field Type |
|---|---|---|
| Số điện thoại | `phone` | Text |
| Hotline | `hotline` | Text |
| Email | `email` | Email |
| Địa chỉ | `address` | Text |
| Giờ làm việc | `working_hours` | Text |
| Link Zalo | `zalo_link` | URL |
| Link Facebook | `facebook_link` | URL |
| Link YouTube | `youtube_link` | URL |
| Link LinkedIn | `linkedin_link` | URL |

### Tab: Header

| Field Label | Field Name | Field Type | Default |
|---|---|---|---|
| Hiển thị Topbar | `topbar_enabled` | True/False | True |
| Nội dung Topbar | `topbar_text` | Text | |

### Tab: Footer

| Field Label | Field Name | Field Type |
|---|---|---|
| Giới thiệu ngắn | `footer_about` | Textarea |
| Copyright | `footer_copyright` | Text |

### Tab: Scripts & Tracking

| Field Label | Field Name | Field Type | Ghi chú |
|---|---|---|---|
| Google Analytics ID | `google_analytics_id` | Text | `G-XXXXXXXXXX` |
| Google Tag Manager ID | `google_tag_manager_id` | Text | `GTM-XXXXXXX` |
| Custom Head Scripts | `head_scripts` | Textarea | Nhúng trước `</head>` |
| Custom Body Scripts | `body_scripts` | Textarea | Nhúng trước `</body>` |

---

## 6. Cài đặt Next.js

### Clone và cài dependencies

```bash
git clone <repo-url> my-project
cd my-project
npm install
```

### Cấu hình biến môi trường

Copy file `.env.local` và điền thông tin:

```bash
cp .env.local.example .env.local
```

```env
# URL WordPress backend (KHÔNG có trailing slash)
WORDPRESS_API_URL=https://cms.congty.vn/wp-json

# Secret để bảo vệ webhook revalidation
# Tạo ngẫu nhiên: openssl rand -hex 32
REVALIDATION_SECRET=abc123xyz...

# URL của frontend
NEXT_PUBLIC_SITE_URL=https://congty.vn
```

### Đổi preset ngành (nếu cần)

Mở `src/config/defaults.ts`, tìm `DEFAULT_SITE_SETTINGS` và chỉnh màu/font:

```ts
// Hoặc override bằng preset có sẵn:
import { PRESETS } from './defaults'

export const DEFAULT_SITE_SETTINGS = {
  ...BASE_DEFAULTS,
  ...PRESETS.tech,  // law | tech | healthcare | realestate | education | food
}
```

### Chạy development

```bash
npm run dev
# → http://localhost:3000
```

### Build production

```bash
npm run build
npm run start
```

---

## 7. Cấu hình Revalidation Webhook

Mỗi khi editor publish bài hoặc thay đổi ACF Settings trong WordPress, Next.js cần được thông báo để rebuild cache.

### Cài WP Webhooks

1. Vào **WP Webhooks > Send Data > Add Webhook**
2. Tạo 2 webhooks:

#### Webhook 1: Khi publish/update bài viết

```
Name: Revalidate Posts
Webhook URL: https://congty.vn/api/revalidate?secret=YOUR_SECRET
Trigger: post_create, post_update
```

Payload template (chọn "Custom Payload"):

```json
{
  "post_type": "post",
  "post_slug": "*post_slug*",
  "post_id": "*ID*"
}
```

#### Webhook 2: Khi thay đổi Site Settings

```
Name: Revalidate Settings
Webhook URL: https://congty.vn/api/revalidate?secret=YOUR_SECRET
Trigger: acf/save_post (khi save Options Page)
```

Payload template:

```json
{
  "scope": "settings"
}
```

> **Nếu không dùng WP Webhooks plugin**, thêm code PHP vào functions.php:
>
> ```php
> add_action( 'save_post', function( $post_id ) {
>     if ( wp_is_post_revision( $post_id ) ) return;
>     $post = get_post( $post_id );
>     wp_remote_post( 'https://congty.vn/api/revalidate?secret=YOUR_SECRET', [
>         'body' => json_encode([
>             'post_type' => $post->post_type,
>             'post_slug' => $post->post_name,
>         ]),
>         'headers' => [ 'Content-Type' => 'application/json' ],
>     ]);
> });
>
> // Khi save ACF Options
> add_action( 'acf/save_post', function( $post_id ) {
>     if ( $post_id !== 'options' ) return;
>     wp_remote_post( 'https://congty.vn/api/revalidate?secret=YOUR_SECRET', [
>         'body' => json_encode([ 'scope' => 'settings' ]),
>         'headers' => [ 'Content-Type' => 'application/json' ],
>     ]);
> });
> ```

### Test webhook

```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"scope": "settings"}'

# Expected response:
# {"revalidated":true,"paths":["site-settings","layout"],"timestamp":"..."}
```

---

## 8. Deploy

### Frontend (Vercel — Recommended)

```bash
npm i -g vercel
vercel --prod
```

Thêm Environment Variables trên Vercel Dashboard:
- `WORDPRESS_API_URL`
- `REVALIDATION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

### Backend WordPress (VPS)

```nginx
# Nginx config cho WordPress
server {
    server_name cms.congty.vn;
    root /var/www/wordpress;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # Cho phép CORS từ frontend
    add_header Access-Control-Allow-Origin "https://congty.vn" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
}
```

---

## 9. Đổi ngành / Preset

Khi nhận dự án mới cho khách hàng khác ngành:

### Bước 1: Chọn preset

```ts
// src/config/defaults.ts
// Đổi dòng này:
export const DEFAULT_SITE_SETTINGS = { ...BASE, ...PRESETS.law }
// Thành:
export const DEFAULT_SITE_SETTINGS = { ...BASE, ...PRESETS.tech }
```

**Presets có sẵn:**

| Key | Ngành | Màu | Font |
|---|---|---|---|
| `law` | Luật, kế toán, tài chính | Orange + Navy | Playfair Display |
| `tech` | Công nghệ, SaaS, startup | Blue | Inter |
| `healthcare` | Y tế, spa, wellness | Teal | DM Sans |
| `realestate` | Bất động sản, cao cấp | Gold | Cormorant Garamond |
| `education` | Giáo dục, đào tạo | Purple | Nunito |
| `food` | Nhà hàng, F&B | Red | Lora |

### Bước 2: Client tự điều chỉnh

Sau khi deploy, client vào **WordPress > Site Settings** để:
- Upload logo riêng
- Fine-tune màu sắc bằng color picker
- Điền thông tin liên hệ, mạng xã hội
- Cập nhật nội dung footer

Không cần dev can thiệp.
