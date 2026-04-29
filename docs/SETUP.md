# Hướng dẫn cài đặt — Headless CMS

> Stack: WordPress (backend API) + Next.js 16 (frontend)  
> Thời gian cài đặt ước tính: 30–60 phút

---

## Mục lục

1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [Cài đặt WordPress](#2-cài-đặt-wordpress)
3. [Cài đặt Plugins](#3-cài-đặt-plugins)
4. [Cấu hình Contact Form 7](#4-cấu-hình-contact-form-7)
5. [Cấu hình ACF Options Page](#5-cấu-hình-acf-options-page)
6. [Cấu hình ACF Fields](#6-cấu-hình-acf-fields)
7. [Cài đặt Next.js](#7-cài-đặt-nextjs)
8. [Cấu hình Revalidation Webhook](#8-cấu-hình-revalidation-webhook)
9. [Deploy Frontend](#9-deploy-frontend)
   - [9.1 Vercel](#91-vercel-khuyến-nghị--nhanh-nhất)
   - [9.2 Shared Hosting cPanel Node.js](#92-shared-hosting-cpanel-có-nodejs-selector)
   - [9.3 VPS + PM2 + Nginx](#93-vps-tự-quản-lý-pm2--nginx)
   - [9.4 Coolify](#94-coolify-self-hosted-paas--khuyến-nghị-cho-vps)
   - [9.5 Railway / Render](#95-railway--render-budget-friendly-paas)
10. [Deploy WordPress (Backend)](#10-deploy-wordpress-backend)
11. [Đổi ngành / Preset](#11-đổi-ngành--preset)
12. [Cấu hình Song ngữ](#12-cấu-hình-song-ngữ)

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

### Local (XAMPP / LocalWP / Laragon)

Cài WordPress bình thường. Sau khi xong, vào **Settings → Permalinks** → chọn **Post name** → Save.

> **Quan trọng:** Phải đặt Permalink là Post name, nếu không REST API không hoạt động.

### VPS / Production

Cài WordPress trên hosting/VPS, cấu hình permalink tương tự. Đảm bảo domain WordPress được trỏ đúng.

---

## 3. Cài đặt Plugins

Vào **Plugins → Add New** và cài các plugin sau:

### Bắt buộc

| Plugin | Mục đích |
|---|---|
| **Advanced Custom Fields (ACF)** | Quản lý site settings (logo, màu, contact info) |
| **Contact Form 7** | Form liên hệ — expose REST API để Next.js submit |
| **WP Webhooks** | Tự động gọi revalidation webhook khi publish/update |

### SEO (chọn 1 trong 2)

| Plugin | Ghi chú |
|---|---|
| **Rank Math SEO** | Recommended — REST API tích hợp sẵn |
| **Yoast SEO** | Phổ biến — REST API qua `yoast_head_json` |

### Song ngữ (nếu cần)

| Plugin | Mục đích |
|---|---|
| **Polylang** | Quản lý đa ngôn ngữ — expose nội dung dịch qua REST API `?lang=en` |

### Tùy chọn

| Plugin | Mục đích |
|---|---|
| **WP-API-Menus** | Expose WordPress menus qua REST API |
| **JWT Auth WP** | Bảo mật REST API bằng JWT token |

---

## 4. Cấu hình Contact Form 7

### 4.1 Tạo form

Vào **Contact → Add New**, đặt tên form (ví dụ: "Form Tư Vấn"). Copy nội dung sau vào Form tab:

```
<div class="cf7-row">
  <label>Họ và tên (bắt buộc)
    [text* your-name placeholder "Nguyễn Văn A"]
  </label>
  <label>Số điện thoại (bắt buộc)
    [tel* your-phone placeholder "0123 456 789"]
  </label>
</div>

<label>Email
  [email your-email placeholder "email@example.com"]
</label>

<label>Dịch vụ quan tâm
  [select your-service "Tư vấn pháp lý" "Kế toán thuế" "Thành lập doanh nghiệp" "Bảo hộ thương hiệu" "Khác"]
</label>

<label>Nội dung (bắt buộc)
  [textarea* your-message placeholder "Mô tả nhu cầu của bạn..."]
</label>

[submit "Gửi yêu cầu"]
```

> **Quan trọng:** Tên field (`your-name`, `your-phone`...) phải khớp chính xác với code. Không đổi tên.

### 4.2 Các field name bắt buộc

| Field name | Loại | Bắt buộc | Mô tả |
|---|---|---|---|
| `your-name` | text | ✓ | Họ và tên |
| `your-phone` | tel | ✓ | Số điện thoại |
| `your-email` | email | | Email |
| `your-service` | select | | Dịch vụ quan tâm |
| `your-message` | textarea | ✓ | Nội dung |

### 4.3 Lấy Form ID

Sau khi Save form, nhìn URL trong thanh địa chỉ:

```
https://cms.congty.vn/wp-admin/admin.php?page=wpcf7&action=edit&post=123
                                                                      ^^^
                                                                  Form ID = 123
```

Ghi lại số này để điền vào biến môi trường.

### 4.4 Cấu hình email nhận

Vào tab **Mail** trong form, chỉnh:
- **To:** `your-email@congty.vn`
- **Subject:** `[your-subject] Yêu cầu tư vấn từ [your-name]`
- **Body:** điền template email như mong muốn

### 4.5 Ghi vào biến môi trường

```env
CF7_DEFAULT_FORM_ID=123
```

### 4.6 Override per-block (tùy chọn)

Nếu site có nhiều form khác nhau, trong ACF của block `contact_form`, thêm field:

| Field Label | Field Name | Field Type |
|---|---|---|
| CF7 Form ID | `cf7_form_id` | Number |
| Danh sách dịch vụ | `cf7_services` | Textarea |

Field `cf7_services` nhập mỗi dịch vụ một dòng — sẽ ghi đè danh sách mặc định trong select.

### 4.7 Test form

```bash
curl -X POST "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "formId": 123,
    "fields": {
      "your-name": "Test User",
      "your-phone": "0123456789",
      "your-email": "test@test.com",
      "your-message": "Test message"
    }
  }'

# Response thành công:
# {"status":"mail_sent","message":"Thank you for your message..."}

# Response lỗi validation:
# {"status":"validation_failed","message":"...","invalid_fields":[...]}
```

---

## 5. Cấu hình ACF Options Page

Thêm code sau vào `functions.php` của theme (hoặc tạo plugin riêng):

```php
<?php
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

---

## 6. Cấu hình ACF Fields

Vào **Custom Fields → Field Groups → Add New**, tạo group **"Site Settings"** với location rule `Options Page == Site Settings`.

### Tab: Thương hiệu

| Field Label | Field Name | Field Type | Ghi chú |
|---|---|---|---|
| Tên công ty | `site_name` | Text | Hiển thị khi không có logo |
| Tagline | `site_tagline` | Text | Dòng phụ dưới tên |
| Logo | `site_logo` | Image | Return format: Array |
| Favicon | `site_favicon` | Image | Return format: Array |
| Mô tả trang web | `site_description` | Textarea | Dùng cho meta description |

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

## 7. Cài đặt Next.js

### Clone và cài dependencies

```bash
git clone <repo-url> my-project
cd my-project
npm install
```

### Cấu hình biến môi trường

```bash
cp .env.local.example .env.local
```

Điền đầy đủ các biến:

```env
WORDPRESS_API_URL=https://cms.congty.vn/wp-json
REVALIDATION_SECRET=<openssl rand -hex 32>
NEXT_PUBLIC_SITE_URL=https://congty.vn
CF7_DEFAULT_FORM_ID=123
```

### Chạy development

```bash
npm run dev
# → http://localhost:3000
```

> Nếu chưa có WordPress, site vẫn chạy bình thường với fallback data.  
> Mọi fetch đến WP có timeout 5 giây — không bị treo máy.

### Build production

```bash
npm run build
npm run start
```

---

## 8. Cấu hình Revalidation Webhook

### Cài WP Webhooks plugin

Vào **WP Webhooks → Send Data → Add Webhook**, tạo 2 webhooks:

#### Webhook 1: Khi publish/update bài viết

```
Name:        Revalidate Posts
Webhook URL: https://congty.vn/api/revalidate?secret=YOUR_REVALIDATION_SECRET
Trigger:     post_create, post_update
```

Custom Payload:
```json
{
  "post_type": "post",
  "post_slug": "*post_slug*"
}
```

#### Webhook 2: Khi thay đổi Site Settings (ACF Options)

```
Name:        Revalidate Settings
Webhook URL: https://congty.vn/api/revalidate?secret=YOUR_REVALIDATION_SECRET
Trigger:     acf/save_post
```

Custom Payload:
```json
{ "scope": "settings" }
```

### Thay thế bằng PHP thuần (không cần plugin)

Thêm vào `functions.php`:

```php
// Revalidate khi publish/update bài viết
add_action( 'save_post', function( $post_id ) {
    if ( wp_is_post_revision( $post_id ) ) return;
    $post = get_post( $post_id );
    wp_remote_post( 'https://congty.vn/api/revalidate?secret=YOUR_SECRET', [
        'body'    => json_encode([
            'post_type' => $post->post_type,
            'post_slug' => $post->post_name,
        ]),
        'headers' => [ 'Content-Type' => 'application/json' ],
    ]);
});

// Revalidate khi save ACF Options
add_action( 'acf/save_post', function( $post_id ) {
    if ( $post_id !== 'options' ) return;
    wp_remote_post( 'https://congty.vn/api/revalidate?secret=YOUR_SECRET', [
        'body'    => json_encode([ 'scope' => 'settings' ]),
        'headers' => [ 'Content-Type' => 'application/json' ],
    ]);
});
```

### Test webhook

```bash
curl -X POST "https://congty.vn/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"scope": "settings"}'

# Expected:
# {"revalidated":true,"paths":["site-settings","layout"],"timestamp":"..."}
```

---

## 9. Deploy Frontend

### 9.1 Vercel (Khuyến nghị — nhanh nhất)

Vercel là platform chính thức của Next.js — zero-config, CDN toàn cầu, free tier.

```bash
npm i -g vercel
vercel --prod
```

Hoặc kết nối GitHub repo trực tiếp tại vercel.com → mỗi push sẽ tự build.

**Environment Variables** — thêm trong Vercel Dashboard → Project → Settings → Environment Variables:

| Tên | Giá trị |
|---|---|
| `WORDPRESS_API_URL` | `https://cms.congty.vn/wp-json` |
| `REVALIDATION_SECRET` | `<random hex>` |
| `NEXT_PUBLIC_SITE_URL` | `https://congty.vn` |
| `CF7_DEFAULT_FORM_ID` | `123` |

**Custom domain:** Vercel Dashboard → Domains → Add `congty.vn` → trỏ DNS theo hướng dẫn.

---

### 9.2 Shared Hosting cPanel có Node.js Selector

Một số shared hosting hiện đại hỗ trợ Node.js qua **cPanel → Setup Node.js App** (dùng Phusion Passenger). Phù hợp khi khách hàng đã có sẵn gói hosting cPanel và không muốn thêm VPS.

> **Kiểm tra trước:** Vào cPanel → tìm mục **"Setup Node.js App"**. Nếu không thấy thì hosting không hỗ trợ Node.js — phải dùng Vercel hoặc VPS.  
> **Lưu ý RAM:** Build Next.js cần ~512MB RAM. Trên shared hosting RAM thấp (<256MB), hãy **build local rồi upload** (xem Lộ trình B bên dưới).

---

#### Lộ trình A — Build trực tiếp trên server (hosting RAM ≥ 512MB)

##### Bước 1: Bật `output: standalone` trong next.config.ts

Standalone mode đóng gói toàn bộ server + dependencies vào `.next/standalone/` — bắt buộc với Phusion Passenger.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',   // ← thêm dòng này
  // ... giữ nguyên phần còn lại
}
```

##### Bước 2: Upload code lên server

```bash
# Qua SSH (nếu hosting có)
ssh user@congty.vn
git clone <repo-url> ~/congty-vn
cd ~/congty-vn
cp .env.local.example .env.local
nano .env.local       # điền đầy đủ biến môi trường
```

##### Bước 3: Tạo Node.js App trong cPanel

1. cPanel → **Setup Node.js App** → **Create Application**
2. Điền thông tin:

| Trường | Giá trị |
|---|---|
| Node.js version | `20.x` (chọn cao nhất có) |
| Application mode | `Production` |
| Application root | `/home/user/congty-vn` |
| Application URL | `congty.vn` (hoặc subdomain) |
| Application startup file | `server.js` |

3. Click **Create** → cPanel tạo virtualenv Node.js và file `server.js` mẫu.

##### Bước 4: Sửa `server.js` — điểm quan trọng nhất

cPanel tạo một `server.js` mặc định — **xóa toàn bộ nội dung**, thay bằng:

```js
// server.js — Phusion Passenger entry point cho Next.js standalone
process.env.HOSTNAME = '0.0.0.0'   // bắt buộc: Passenger kết nối qua 0.0.0.0
// PORT được Passenger tự set qua env — không override

require('./.next/standalone/server.js')
```

> **Tại sao cần `HOSTNAME=0.0.0.0`?** Next.js standalone mặc định bind `127.0.0.1` — Phusion Passenger không kết nối được. Phải bind `0.0.0.0` để Passenger forward traffic vào.

##### Bước 5: Thêm biến môi trường trong cPanel

Trong giao diện **Setup Node.js App** → mục **Environment variables**, thêm:

| Name | Value | Ghi chú |
|---|---|---|
| `WORDPRESS_API_URL` | `https://cms.congty.vn/wp-json` | Không có trailing slash |
| `REVALIDATION_SECRET` | `<openssl rand -hex 32>` | |
| `NEXT_PUBLIC_SITE_URL` | `https://congty.vn` | URL frontend (không trailing slash) |
| `CF7_DEFAULT_FORM_ID` | `123` | |
| `NODE_ENV` | `production` | |

> **Lưu ý:** `NEXT_PUBLIC_*` phải được set **trước khi build** — chúng được inline vào bundle lúc build, không đọc runtime.

##### Bước 6: Cài dependencies & build

Qua SSH:
```bash
cd ~/congty-vn
source /home/user/nodevenv/congty-vn/20/bin/activate   # activate virtualenv cPanel
npm install --legacy-peer-deps
npm run build
```

Hoặc qua giao diện cPanel: **Run NPM Install** (chỉ install, không build được — phải dùng SSH để build).

##### Bước 7: Copy static assets (bắt buộc sau mỗi lần build)

Next.js standalone không tự include static files — phải copy thủ công:

```bash
cp -r .next/static   .next/standalone/.next/static
cp -r public         .next/standalone/public
```

##### Bước 8: Khởi động app

cPanel → **Setup Node.js App** → **Restart** (hoặc Stop → Start nếu lần đầu).

Kiểm tra app đang chạy: mở trình duyệt vào `https://congty.vn` — nếu thấy trang web là thành công.

---

#### Lộ trình B — Build local, upload lên server (hosting RAM thấp hoặc không có SSH)

Build trên máy tính của mình rồi upload thư mục `.next/standalone/` lên server — bỏ qua bước `npm run build` trên server.

**Trên máy local:**

```bash
# 1. Set biến môi trường production trong .env.local
NEXT_PUBLIC_SITE_URL=https://congty.vn
# ... các biến khác

# 2. Build
npm run build

# 3. Copy static vào standalone (bắt buộc)
cp -r .next/static   .next/standalone/.next/static
cp -r public         .next/standalone/public

# 4. Tạo archive để upload
tar -czf deploy.tar.gz \
  .next/standalone \
  package.json \
  server.js
```

**Upload và giải nén trên server** (qua File Manager hoặc FTP):

```bash
# Qua SSH
scp deploy.tar.gz user@congty.vn:~/congty-vn/
ssh user@congty.vn
cd ~/congty-vn
tar -xzf deploy.tar.gz
```

Sau đó **Restart** app trong cPanel.

> **Lưu ý:** Với lộ trình B, `NEXT_PUBLIC_*` phải khớp giữa máy build local và server thật — nếu khác domain, build lại.

---

#### Script deploy tự động (SSH)

Tạo file `scripts/deploy-cpanel.sh`:

```bash
#!/bin/bash
# Deploy Next.js lên cPanel — chạy từ máy local qua SSH
# Usage: ./scripts/deploy-cpanel.sh user@congty.vn ~/congty-vn

SSH_TARGET=${1:-"user@congty.vn"}
REMOTE_DIR=${2:-"~/congty-vn"}
CPANEL_APP_NAME=${3:-"congty-vn"}  # tên app trong Setup Node.js App

echo "▶ Building locally..."
npm run build
cp -r .next/static  .next/standalone/.next/static
cp -r public        .next/standalone/public

echo "▶ Uploading to $SSH_TARGET:$REMOTE_DIR ..."
ssh "$SSH_TARGET" "cd $REMOTE_DIR && git pull"

echo "▶ Restarting Passenger..."
ssh "$SSH_TARGET" "cd $REMOTE_DIR && source ~/nodevenv/$CPANEL_APP_NAME/20/bin/activate && npm install --legacy-peer-deps && npm run build && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public"

# Restart qua cPanel API (nếu có API token)
# curl -s "https://congty.vn:2083/execute/NodeJSApp/restart_app" \
#   -H "Authorization: cpanel USER:TOKEN" \
#   --data "appname=$CPANEL_APP_NAME"

echo "✓ Done — restart app in cPanel → Setup Node.js App → Restart"
```

```bash
chmod +x scripts/deploy-cpanel.sh
./scripts/deploy-cpanel.sh user@congty.vn ~/congty-vn
```

---

#### SSL & Domain

- **AutoSSL:** cPanel → **SSL/TLS** → **Manage AutoSSL** → kích hoạt → tự gia hạn mỗi 90 ngày.
- **Trỏ domain:** DNS → A record trỏ về IP của hosting, hoặc dùng Cloudflare làm proxy.
- **www redirect:** cPanel → **Redirects** → thêm redirect `www.congty.vn` → `congty.vn` (permanent 301).

---

#### Xử lý lỗi phổ biến

| Triệu chứng | Nguyên nhân | Cách fix |
|---|---|---|
| Trang trắng, lỗi 500 | `HOSTNAME` chưa set `0.0.0.0` | Thêm `process.env.HOSTNAME = '0.0.0.0'` vào `server.js` |
| Ảnh/CSS không load (`/_next/static/` 404) | Quên copy static assets | Chạy lại `cp -r .next/static .next/standalone/.next/static` |
| `Cannot find module` khi start | Build chưa chạy hoặc thất bại | SSH → `npm run build` lại; kiểm tra đủ RAM |
| Build lỗi `ENOMEM` | RAM không đủ | Dùng Lộ trình B (build local, upload) |
| App không tự restart sau crash | Passenger idle timeout | Không cần lo — Passenger tự restart khi có request mới |
| `NEXT_PUBLIC_*` hiển thị sai URL | Biến không được set trước khi build | Re-build với đúng biến; `NEXT_PUBLIC_*` là compile-time |
| Cold start chậm 3–5 giây | Passenger kill process khi idle | Bình thường trên shared hosting; dùng VPS nếu cần luôn warm |

---

#### Checklist trước khi go-live

- [ ] `output: 'standalone'` đã thêm vào `next.config.ts`
- [ ] `server.js` có `process.env.HOSTNAME = '0.0.0.0'`
- [ ] Đã copy `static/` và `public/` vào `.next/standalone/`
- [ ] `NODE_ENV=production` trong env vars cPanel
- [ ] `NEXT_PUBLIC_SITE_URL` đúng domain production
- [ ] AutoSSL đã kích hoạt, site load qua HTTPS
- [ ] Test form liên hệ gửi được
- [ ] Test revalidation webhook: `curl -X POST https://congty.vn/api/revalidate?secret=...`

---

### 9.3 VPS tự quản lý (PM2 + Nginx)

Phù hợp khi cần toàn quyền server, hoặc WordPress và Next.js trên cùng một VPS.

#### Bước 1: Cài Node.js 20 trên VPS (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # → v20.x.x
```

#### Bước 2: Cài PM2 (process manager)

```bash
sudo npm install -g pm2
```

#### Bước 3: Upload code và build

```bash
# Trên VPS
git clone <repo-url> /var/www/congty-vn
cd /var/www/congty-vn
npm install
cp .env.local.example .env.local
nano .env.local          # điền đúng các biến môi trường
npm run build
```

#### Bước 4: Chạy với PM2

```bash
pm2 start npm --name "congty-vn" -- start
pm2 save                 # lưu để khởi động lại khi reboot
pm2 startup              # thêm PM2 vào systemd
```

Các lệnh PM2 thường dùng:

```bash
pm2 list                 # xem danh sách process
pm2 logs congty-vn       # xem log realtime
pm2 restart congty-vn    # restart sau khi deploy mới
pm2 stop congty-vn       # dừng
```

#### Bước 5: Nginx reverse proxy

Cài Nginx nếu chưa có:
```bash
sudo apt install nginx
```

Tạo file config:
```bash
sudo nano /etc/nginx/sites-available/congty-vn
```

```nginx
server {
    listen 80;
    server_name congty.vn www.congty.vn;

    # Tăng timeout cho Next.js ISR
    proxy_read_timeout 60s;
    proxy_connect_timeout 60s;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets của Next.js
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Kích hoạt và test:
```bash
sudo ln -s /etc/nginx/sites-available/congty-vn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Bước 6: SSL miễn phí với Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d congty.vn -d www.congty.vn
# Certbot tự cập nhật Nginx config và cài cronjob tự gia hạn
```

#### Bước 7: Deploy code mới

Mỗi khi có code mới, chạy:
```bash
cd /var/www/congty-vn
git pull
npm install          # nếu có thay đổi package.json
npm run build
pm2 restart congty-vn
```

> **Tip:** Tạo script `deploy.sh` để tự động hóa 5 lệnh trên.

---

### 9.4 Coolify (Self-hosted PaaS — khuyến nghị cho VPS)

Coolify là giải pháp self-hosted tương tự Vercel/Heroku — web UI, git integration, tự động build/deploy. Cài trên cùng VPS với WordPress.

#### Cài Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Truy cập `http://<VPS-IP>:8000` để vào dashboard.

#### Deploy Next.js trên Coolify

1. **New Resource → Application → GitHub/GitLab**
2. Chọn repo và branch (`main`)
3. **Build Pack:** `Nixpacks` (tự detect Next.js)
4. **Port:** `3000`
5. **Environment Variables:** thêm 4 biến (xem bảng ở mục 9.1)
6. Click **Deploy**

Coolify tự động:
- Build mỗi khi push lên `main`
- Cấp SSL (Let's Encrypt)
- Restart nếu process crash

---

### 9.5 Railway / Render (Budget-friendly PaaS)

Không muốn tự quản lý server? Dùng Railway hoặc Render — rẻ hơn Vercel cho traffic lớn.

**Railway:**
1. Vào railway.app → New Project → Deploy from GitHub
2. Thêm Environment Variables
3. Railway tự detect Next.js và build

**Render:**
1. Vào render.com → New → Web Service → Connect GitHub
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Thêm Environment Variables

---

### 9.6 So sánh các lựa chọn

| | Vercel | cPanel Node.js | VPS + PM2 | Coolify | Railway/Render |
|---|---|---|---|---|---|
| Độ khó | ⭐ Dễ nhất | ⭐⭐ Trung bình | ⭐⭐⭐ Khó | ⭐⭐ Trung bình | ⭐ Dễ |
| Giá | Free → $20/tháng | Có sẵn trong hosting | ~$5–10/tháng VPS | Miễn phí (self-host) | Free tier → $7/tháng |
| CDN | ✓ Toàn cầu | ✗ | Cần tự cấu hình | ✗ | ✗ |
| Ổn định | ✓ Rất cao | ⚠ Tùy provider | ✓ Cao | ✓ Cao | ✓ |
| Phù hợp | Dự án mới | Tận dụng hosting sẵn | Toàn quyền server | VPS có sẵn WP | Budget thấp |
| Tự động deploy | ✓ | Thủ công | Cần script | ✓ | ✓ |
| Cần `output: standalone` | ✗ | ✓ | ✗ | ✗ | ✗ |

> **Khuyến nghị thực tế:**
> - Khách có sẵn **shared hosting cPanel có Node.js** → dùng cPanel (tiết kiệm chi phí nhất)
> - Khách có sẵn **VPS chạy WordPress** → dùng **Coolify**
> - Dự án mới, không có server → **Vercel** (frontend) + shared hosting (WordPress)

---

## 10. Deploy WordPress (Backend)

### Nginx config cho WordPress trên VPS

```nginx
server {
    listen 80;
    server_name cms.congty.vn;
    root /var/www/wordpress;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # CORS cho Next.js frontend
    add_header Access-Control-Allow-Origin "https://congty.vn" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    # Deny trực tiếp từ browser (chỉ cho phép Next.js server gọi)
    # Bỏ comment dòng này nếu muốn bảo mật thêm:
    # if ($http_origin !~ "^https://congty\.vn$") { return 403; }
}
```

---

## 11. Đổi ngành / Preset

Khi nhận dự án mới cho khách hàng khác ngành:

### Bước 1: Chọn preset trong code

```ts
// src/config/defaults.ts
export const DEFAULT_SITE_SETTINGS = { ...BASE_DEFAULTS, ...PRESETS.tech }
//                                                                   ^^^^
//                        law | tech | healthcare | realestate | education | food
```

### Bước 2: Bootstrap project mới bằng script

```bash
./scripts/new-client.sh <client-name> <industry> <wp-url>

# Ví dụ:
./scripts/new-client.sh abc-legal law https://cms.abclaw.vn
./scripts/new-client.sh startup-xyz tech https://cms.startup.vn
```

Script tự động: copy starter, viết `.env.local`, apply preset, init git, `npm install`.

### Bước 3: Client tự điều chỉnh từ WordPress

Sau khi deploy, client vào **WordPress → Site Settings** để:
- Upload logo, favicon
- Fine-tune màu sắc bằng color picker
- Điền thông tin liên hệ, mạng xã hội
- Cập nhật nội dung footer

**Không cần dev can thiệp** — mọi thay đổi visual được apply realtime qua CSS variables.

---

## 12. Cấu hình Song ngữ

> Mặc định: Tiếng Việt (`vi`) + Tiếng Anh (`en`).  
> URL pattern: `/` = Tiếng Việt, `/en/` = Tiếng Anh (`localePrefix: 'as-needed'`).

### 12.1 Cài đặt Polylang trong WordPress

1. Cài plugin **Polylang** (xem mục 3)
2. Vào **Languages → Add New Language** → thêm **English (en)**
3. Dịch từng trang/bài viết: mở post → click nút bút chì cạnh **English** ở cột phải → dịch nội dung → Publish
4. Dịch ACF Options: cài thêm **Polylang for WooCommerce** hoặc dùng hook để expose Options theo ngôn ngữ (Polylang Pro tự xử lý)

> **Lưu ý:** Polylang tự động thêm `?lang=en` khi REST API call từ Next.js — không cần cấu hình thêm ở WP phía.

### 12.2 Cấu trúc URL và Middleware

next-intl middleware (`src/middleware.ts`) xử lý routing:

| Request | Xử lý | Kết quả |
|---|---|---|
| `GET /` | rewrite nội bộ → `/vi` | Trang chủ Tiếng Việt |
| `GET /tin-tuc` | rewrite nội bộ → `/vi/tin-tuc` | Tin tức Tiếng Việt |
| `GET /en/` | pass-through | Trang chủ Tiếng Anh |
| `GET /en/tin-tuc` | pass-through | Tin tức Tiếng Anh |
| `GET /vi/` | 307 → `/` | Redirect (no prefix for default) |

### 12.3 Thêm ngôn ngữ mới

**Bước 1** — Thêm locale vào `src/i18n/routing.ts`:
```ts
export const routing = defineRouting({
  locales: ['vi', 'en', 'zh'],   // thêm 'zh'
  defaultLocale: 'vi',
  localePrefix: 'as-needed',
})
```

**Bước 2** — Tạo file messages:
```bash
cp messages/en.json messages/zh.json
# Dịch toàn bộ giá trị trong zh.json sang Tiếng Trung
```

**Bước 3** — Thêm ngôn ngữ trong WordPress → **Polylang → Languages → Add New**

**Bước 4** — Dịch nội dung trong WordPress cho ngôn ngữ mới

### 12.4 Dịch UI strings

Tất cả string giao diện (nav, header, footer, form, pagination) nằm trong `messages/vi.json` và `messages/en.json`.

Cấu trúc namespace:
```json
{
  "Nav": { "home": "Trang chủ", "about": "Giới thiệu", ... },
  "Header": { "cta": "Tư vấn miễn phí" },
  "Footer": { "rights": "Bản quyền thuộc về..." },
  "Contact": { "name": "Họ và tên", "submit": "Gửi yêu cầu", ... },
  "News": { "readMore": "Đọc thêm", "prev": "Trước", "next": "Sau" },
  "NotFound": { "title": "Trang không tồn tại", "back": "Về trang chủ" }
}
```

### 12.5 Language Switcher

Header có sẵn `<LanguageSwitcher>` — toggle giữa `vi` ↔ `en`, giữ nguyên pathname hiện tại:

```tsx
// Dùng router từ @/i18n/navigation
router.replace(pathname, { locale: locale === 'vi' ? 'en' : 'vi' })
```

Để thêm locale mới vào switcher, update component `LanguageSwitcher` trong `src/components/layout/Header.tsx`.

### 12.6 SEO đa ngôn ngữ

Sitemap (`src/app/sitemap.ts`) tự động generate URL cho tất cả locales:
- `congty.vn/` (vi)
- `congty.vn/tin-tuc` (vi)
- `congty.vn/en/` (en)
- `congty.vn/en/tin-tuc` (en)

Thêm `hreflang` vào metadata của từng page nếu cần SEO đầy đủ (hiện tại chưa implement).
