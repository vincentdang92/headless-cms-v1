<?php
/**
 * Headless CMS — functions.php
 *
 * Điền 3 hằng số này trước khi dùng:
 *   NEXTJS_URL      URL của Next.js frontend, dùng cho webhook + redirect
 *   REVALIDATION_SECRET   Phải khớp với .env.local của Next.js
 *   WP_API_SECRET   Phải khớp với .env.local của Next.js
 */

define( 'NEXTJS_URL',            'http://localhost:3000' );
define( 'REVALIDATION_SECRET',   'fa1f64c0278cebcc5f631d20f9beae04e0610e77ec2ac3b958c0bfa9bc6416f0' );
define( 'WP_API_SECRET',         'anhdq2202' );

// ── 1. ACF Options Page ───────────────────────────────────────────────────────

add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_options_page' ) ) return;

    acf_add_options_page( [
        'page_title' => 'Cài Đặt Giao Diện',
        'menu_title' => 'Site Settings',
        'menu_slug'  => 'site-settings',
        'capability' => 'manage_options',
        'icon_url'   => 'dashicons-admin-customizer',
        'position'   => 2,
    ] );
} );

// ── 2. REST API — xác thực bằng header bí mật ─────────────────────────────────

add_filter( 'rest_authentication_errors', function ( $result ) {
    if ( ! empty( $result ) ) return $result;

    // Bỏ qua khi request từ wp-admin (logged-in user)
    if ( is_user_logged_in() ) return $result;

    $secret = $_SERVER['HTTP_X_WP_SECRET'] ?? '';
    if ( $secret !== WP_API_SECRET ) {
        return new WP_Error( 'rest_forbidden', 'Access denied.', [ 'status' => 403 ] );
    }

    return $result;
} );

// ── 3. CORS — cho phép Next.js server gọi REST API ────────────────────────────

add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );

    add_filter( 'rest_pre_serve_request', function ( $value ) {
        $allowed = [ NEXTJS_URL, 'http://localhost:3000', 'https://localhost:3000' ];
        $origin  = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ( in_array( $origin, $allowed, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
        }
        header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, X-WP-Secret, X-WP-Nonce' );
        header( 'Access-Control-Allow-Credentials: true' );

        return $value;
    } );
}, 15 );

// ── 4. Custom Site Settings REST endpoint ─────────────────────────────────────
// Thay thế /acf/v3/options/options (chỉ có trong ACF Pro)
// Hoạt động với cả ACF Free và không có ACF
// GET /wp-json/headless/v1/settings

add_action( 'rest_api_init', function () {
    register_rest_route( 'headless/v1', '/settings', [
        'methods'             => 'GET',
        'callback'            => function () {
            // Đọc field theo thứ tự: ACF option → wp_option với prefix 'options_' → null
            $f = function ( $key ) {
                if ( function_exists( 'get_field' ) ) {
                    $val = get_field( $key, 'option' );
                    if ( $val !== null && $val !== '' && $val !== false ) return $val;
                }
                $raw = get_option( 'options_' . $key );
                return ( $raw !== false && $raw !== '' ) ? $raw : null;
            };

            // Helper riêng cho boolean field (true_false). Tránh bug khi $f short-circuit
            // tại false → fallback get_option trả về string '0' thay vì bool false.
            $b = function ( $key, $default = true ) {
                if ( function_exists( 'get_field' ) ) {
                    $val = get_field( $key, 'option' );
                    if ( $val === null ) return $default;
                    return (bool) $val;
                }
                $raw = get_option( 'options_' . $key );
                if ( $raw === false ) return $default;
                return $raw === '1' || $raw === 1 || $raw === true;
            };

            return rest_ensure_response( [
                'acf' => [
                    'site_name'              => $f( 'site_name' )             ?: get_bloginfo( 'name' ),
                    'site_tagline'           => $f( 'site_tagline' )          ?: get_bloginfo( 'description' ),
                    'site_description'       => $f( 'site_description' ),
                    'site_logo'              => $f( 'site_logo' ),
                    'site_favicon'           => $f( 'site_favicon' ),
                    'primary_color'          => $f( 'primary_color' ),
                    'primary_light_color'    => $f( 'primary_light_color' ),
                    'primary_pale_color'     => $f( 'primary_pale_color' ),
                    'dark_color'             => $f( 'dark_color' ),
                    'heading_font'           => $f( 'heading_font' ),
                    'body_font'              => $f( 'body_font' ),
                    'phone'                  => $f( 'phone' ),
                    'hotline'                => $f( 'hotline' ),
                    'email'                  => $f( 'email' )                 ?: get_bloginfo( 'admin_email' ),
                    'address'                => $f( 'address' ),
                    'working_hours'          => $f( 'working_hours' ),
                    'zalo_link'              => $f( 'zalo_link' ),
                    'facebook_link'          => $f( 'facebook_link' ),
                    'youtube_link'           => $f( 'youtube_link' ),
                    'linkedin_link'          => $f( 'linkedin_link' ),
                    'twitter_link'           => $f( 'twitter_link' ),
                    'map_embed_url'          => $f( 'map_embed_url' ),
                    'topbar_enabled'         => $b( 'topbar_enabled', true ),
                    'topbar_text'            => $f( 'topbar_text' ),
                    'footer_about'           => $f( 'footer_about' ),
                    'footer_copyright'       => $f( 'footer_copyright' ),
                    'google_analytics_id'    => $f( 'google_analytics_id' ),
                    'google_tag_manager_id'  => $f( 'google_tag_manager_id' ),
                    'head_scripts'           => $f( 'head_scripts' ),
                    'body_scripts'           => $f( 'body_scripts' ),
                    'hero_variant'              => $f( 'hero_variant' ),
                    'show_post_featured_image'  => $b( 'show_post_featured_image', true ),
                    'toc_scroll_offset'         => (int) ( $f( 'toc_scroll_offset' )   ?: 96 ),
                    'toc_scroll_duration'       => (int) ( $f( 'toc_scroll_duration' ) ?: 700 ),
                    'show_news_sidebar'         => $b( 'show_news_sidebar', true ),
                    'weather_provider'          => $f( 'weather_provider' ) ?: 'auto',
                    'weather_api_key'           => $f( 'weather_api_key' ) ?: '',
                    'weather_location_override' => $f( 'weather_location_override' ) ?: '',
                ],
            ] );
        },
        'permission_callback' => function () {
            if ( is_user_logged_in() ) return true;
            $secret = $_SERVER['HTTP_X_WP_SECRET'] ?? '';
            if ( $secret !== WP_API_SECRET ) {
                return new WP_Error( 'rest_forbidden', 'Access denied.', [ 'status' => 403 ] );
            }
            return true;
        },
    ] );
} );

// ── 5. Revalidation webhook → Next.js ─────────────────────────────────────────

function _headless_revalidate( array $body ): void {
    wp_remote_post(
        NEXTJS_URL . '/api/revalidate?secret=' . REVALIDATION_SECRET,
        [
            'body'     => wp_json_encode( $body ),
            'headers'  => [ 'Content-Type' => 'application/json' ],
            'timeout'  => 5,
            'blocking' => false, // fire-and-forget
        ]
    );
}

// Khi publish / update bài viết hoặc trang
add_action( 'save_post', function ( $post_id ) {
    if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) return;

    $post = get_post( $post_id );
    if ( ! in_array( $post->post_status, [ 'publish', 'future' ], true ) ) return;

    _headless_revalidate( [
        'post_type' => $post->post_type,
        'post_slug' => $post->post_name,
    ] );
} );

// Gửi push notification khi bài viết mới được publish lần đầu
// Chỉ trigger khi transition từ trạng thái khác → publish (không phải update lại)
add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
    if ( $new_status !== 'publish' || $old_status === 'publish' ) return;
    if ( $post->post_type !== 'post' ) return;

    $site_url = defined( 'NEXTJS_URL' ) ? rtrim( NEXTJS_URL, '/' ) : '';
    if ( ! $site_url ) return;

    $title   = wp_strip_all_tags( $post->post_title );
    $excerpt = wp_strip_all_tags( get_the_excerpt( $post ) );
    if ( ! $excerpt ) {
        $excerpt = wp_trim_words( wp_strip_all_tags( $post->post_content ), 20 );
    }
    $url       = $site_url . '/tin-tuc/' . $post->post_name;
    $image_url = '';

    // Lấy featured image nếu có
    $thumb_id = get_post_thumbnail_id( $post->ID );
    if ( $thumb_id ) {
        $src = wp_get_attachment_image_url( $thumb_id, 'og' );
        if ( $src ) $image_url = $src;
    }

    wp_remote_post(
        $site_url . '/api/notifications/send?secret=' . REVALIDATION_SECRET,
        [
            'body'     => wp_json_encode( array_filter( [
                'title'    => $title,
                'body'     => $excerpt ?: $title,
                'url'      => $url,
                'imageUrl' => $image_url ?: null,
                'topic'    => 'all',
            ] ) ),
            'headers'  => [ 'Content-Type' => 'application/json' ],
            'timeout'  => 8,
            'blocking' => false,
        ]
    );
}, 10, 3 );

// Khi lưu ACF Options Page (Site Settings)
add_action( 'acf/save_post', function ( $post_id ) {
    if ( $post_id !== 'options' ) return;
    _headless_revalidate( [ 'scope' => 'settings' ] );
} );

// Khi thêm / sửa / xóa item trong nav menu
add_action( 'wp_update_nav_menu', function () {
    _headless_revalidate( [ 'scope' => 'menus' ] );
} );

// ── 6. Nav Menus — đăng ký vị trí + REST endpoint ────────────────────────────

add_action( 'after_setup_theme', function () {
    register_nav_menus( [
        'primary' => 'Menu chính (Header)',
        'footer'  => 'Menu Footer',
    ] );

    // Bắt buộc để WordPress xử lý featured image và trả về trong REST API
    add_theme_support( 'post-thumbnails' );

    // Kích thước ảnh dùng trong headless frontend
    add_image_size( 'card',   800, 450, true );   // NewsCard thumbnail
    add_image_size( 'hero',  1920, 700, true );   // Hero background
    add_image_size( 'og',    1200, 630, true );   // Open Graph
} );

add_action( 'rest_api_init', function () {
    register_rest_route( 'headless/v1', '/menus/(?P<location>[a-zA-Z0-9_-]+)', [
        'methods'  => 'GET',
        'callback' => function ( WP_REST_Request $request ) {
            $location  = $request->get_param( 'location' );
            $locations = get_nav_menu_locations();

            if ( empty( $locations[ $location ] ) ) {
                return rest_ensure_response( [] );
            }

            $items = wp_get_nav_menu_items( $locations[ $location ] );
            if ( ! $items ) return rest_ensure_response( [] );

            // Chuyển URL tuyệt đối → đường dẫn tương đối cho frontend
            $bases = array_filter( [ rtrim( NEXTJS_URL, '/' ), rtrim( get_home_url(), '/' ) ] );
            $to_rel = function ( $url ) use ( $bases ) {
                foreach ( $bases as $base ) {
                    if ( strpos( $url, $base ) === 0 ) {
                        $path = substr( $url, strlen( $base ) );
                        return $path === '' ? '/' : $path;
                    }
                }
                return $url;
            };

            // Xây map id → node
            $map = [];
            foreach ( $items as $item ) {
                $map[ $item->ID ] = [
                    'label'   => $item->title,
                    'href'    => $to_rel( $item->url ),
                    '_parent' => (int) $item->menu_item_parent,
                    'children' => [],
                ];
            }

            // Xây cây cha-con
            $tree = [];
            foreach ( $map as $id => &$node ) {
                if ( $node['_parent'] === 0 ) {
                    $tree[] = &$node;
                } elseif ( isset( $map[ $node['_parent'] ] ) ) {
                    $map[ $node['_parent'] ]['children'][] = &$node;
                }
            }
            unset( $node );

            // Dọn field nội bộ, bỏ children rỗng
            $clean = function ( &$nodes ) use ( &$clean ) {
                foreach ( $nodes as &$n ) {
                    unset( $n['_parent'] );
                    if ( empty( $n['children'] ) ) unset( $n['children'] );
                    else $clean( $n['children'] );
                }
            };
            $clean( $tree );

            return rest_ensure_response( array_values( $tree ) );
        },
        'permission_callback' => function () {
            if ( is_user_logged_in() ) return true;
            $secret = $_SERVER['HTTP_X_WP_SECRET'] ?? '';
            if ( $secret !== WP_API_SECRET ) {
                return new WP_Error( 'rest_forbidden', 'Access denied.', [ 'status' => 403 ] );
            }
            return true;
        },
        'args' => [
            'location' => [ 'type' => 'string', 'required' => true ],
        ],
    ] );
} );

// ── 7. Review / Rating API — /headless/v1/reviews ────────────────────────────
// Dùng WP native comments + comment_karma (1-5) làm rating.
// Compatible với WooCommerce (cùng DB schema, chỉ khác comment_type khi mở rộng).

add_action( 'rest_api_init', function () {

    // GET /headless/v1/reviews/{post_id}
    // Trả về danh sách reviews đã approved, rating > 0
    register_rest_route( 'headless/v1', '/reviews/(?P<post_id>\d+)', [
        'methods'  => 'GET',
        'callback' => function ( WP_REST_Request $request ) {
            $post_id  = (int) $request->get_param( 'post_id' );
            $comments = get_comments( [
                'post_id' => $post_id,
                'status'  => 'approve',
                'type'    => 'comment',
                'number'  => 50,
                'orderby' => 'comment_date',
                'order'   => 'DESC',
            ] );

            $result = [];
            foreach ( $comments as $c ) {
                $karma = (int) $c->comment_karma;
                if ( $karma < 1 || $karma > 5 ) continue; // chỉ lấy review có rating hợp lệ
                $result[] = [
                    'id'      => (int) $c->comment_ID,
                    'author'  => sanitize_text_field( $c->comment_author ),
                    'content' => wp_strip_all_tags( $c->comment_content ),
                    'rating'  => $karma,
                    'date'    => $c->comment_date,
                ];
            }
            return rest_ensure_response( $result );
        },
        'permission_callback' => '__return_true',
        'args' => [
            'post_id' => [
                'validate_callback' => function ( $v ) { return is_numeric( $v ) && $v > 0; },
            ],
        ],
    ] );

    // POST /headless/v1/reviews
    // Tạo review mới → comment_approved = 0 (chờ duyệt trong WP Admin → Comments)
    register_rest_route( 'headless/v1', '/reviews', [
        'methods'  => 'POST',
        'callback' => function ( WP_REST_Request $request ) {
            $post_id      = (int) $request->get_param( 'post_id' );
            $author_name  = sanitize_text_field( $request->get_param( 'author_name' ) );
            $author_email = sanitize_email( $request->get_param( 'author_email' ) );
            $content      = sanitize_textarea_field( $request->get_param( 'content' ) );
            $rating       = min( 5, max( 1, (int) $request->get_param( 'rating' ) ) );

            if ( ! $post_id || ! $author_name || ! $author_email || ! $content || ! $rating ) {
                return new WP_Error( 'missing_fields', 'Missing required fields.', [ 'status' => 400 ] );
            }
            if ( ! is_email( $author_email ) ) {
                return new WP_Error( 'invalid_email', 'Invalid email address.', [ 'status' => 400 ] );
            }
            if ( ! get_post( $post_id ) ) {
                return new WP_Error( 'invalid_post', 'Post not found.', [ 'status' => 404 ] );
            }

            // Chống spam: cùng email + bài viết trong 24h
            $dupe = get_comments( [
                'post_id'      => $post_id,
                'author_email' => $author_email,
                'status'       => 'all',
                'date_query'   => [ [ 'after' => '24 hours ago', 'inclusive' => true ] ],
                'count'        => true,
            ] );
            if ( $dupe > 0 ) {
                return new WP_Error( 'duplicate', 'You already submitted a review recently.', [ 'status' => 429 ] );
            }

            $comment_id = wp_insert_comment( [
                'comment_post_ID'      => $post_id,
                'comment_author'       => $author_name,
                'comment_author_email' => $author_email,
                'comment_content'      => $content,
                'comment_karma'        => $rating,
                'comment_approved'     => 0,
                'comment_type'         => '',
                'comment_author_IP'    => $_SERVER['REMOTE_ADDR'] ?? '',
                'comment_agent'        => $_SERVER['HTTP_USER_AGENT'] ?? '',
            ] );

            if ( ! $comment_id || is_wp_error( $comment_id ) ) {
                return new WP_Error( 'insert_failed', 'Failed to save review.', [ 'status' => 500 ] );
            }

            return rest_ensure_response( [ 'success' => true, 'id' => $comment_id ] );
        },
        'permission_callback' => '__return_true',
        'args' => [
            'post_id'      => [ 'required' => true, 'validate_callback' => function ( $v ) { return is_numeric( $v ) && $v > 0; } ],
            'author_name'  => [ 'required' => true ],
            'author_email' => [ 'required' => true ],
            'content'      => [ 'required' => true ],
            'rating'       => [ 'required' => true, 'validate_callback' => function ( $v ) { return is_numeric( $v ) && $v >= 1 && $v <= 5; } ],
        ],
    ] );

} );

// ── 8. Dọn dẹp — tắt các feature không cần trong headless ───────────────────

// Tắt emoji scripts (tiết kiệm ~10KB)
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// Tắt XML-RPC (không dùng, bảo mật hơn)
add_filter( 'xmlrpc_enabled', '__return_false' );

// Tắt pingback
add_filter( 'wp_headers', function ( $headers ) {
    unset( $headers['X-Pingback'] );
    return $headers;
} );

// Ẩn version WordPress khỏi public
remove_action( 'wp_head', 'wp_generator' );

// Tắt oEmbed discovery (không dùng trong headless)
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wp_oembed_add_host_js' );
add_filter( 'embed_oembed_discover', '__return_false' );

// Tắt REST API oEmbed endpoint
add_filter( 'rest_endpoints', function ( $endpoints ) {
    unset( $endpoints['/oembed/1.0'] );
    unset( $endpoints['/oembed/1.0/proxy'] );
    return $endpoints;
} );

// Xóa thêm noise khỏi <head>
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'feed_links', 2 );
remove_action( 'wp_head', 'feed_links_extra', 3 );
remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 );

// ── 8. Bảo mật REST API ───────────────────────────────────────────────────────

// Ẩn danh sách users khỏi REST API (tránh username enumeration)
add_filter( 'rest_endpoints', function ( $endpoints ) {
    if ( ! is_user_logged_in() ) {
        unset( $endpoints['/wp/v2/users'] );
        unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
    }
    return $endpoints;
} );

// ── 9. Tắt WordPress built-in sitemap (Next.js tự generate) ──────────────────

add_filter( 'wp_sitemaps_enabled', '__return_false' );

// ── 10. Tắt Gutenberg — dùng Classic Editor ──────────────────────────────────

add_filter( 'use_block_editor_for_post',      '__return_false' );
add_filter( 'use_block_editor_for_post_type', '__return_false' );

// ── 11. Tối ưu REST API response cho posts ────────────────────────────────────

// Thêm image sizes vào _embedded response để Next.js chọn size phù hợp
add_filter( 'rest_prepare_attachment', function ( $response ) {
    $data = $response->get_data();
    if ( ! empty( $data['media_details']['sizes'] ) ) {
        $sizes = [];
        foreach ( $data['media_details']['sizes'] as $key => $size ) {
            $sizes[ $key ] = [
                'source_url' => $size['source_url'],
                'width'      => $size['width'],
                'height'     => $size['height'],
            ];
        }
        $data['sizes'] = $sizes;
        $response->set_data( $data );
    }
    return $response;
} );

// ── RankMath — custom REST field chuẩn hóa (hoạt động với mọi version RankMath) ──
// Tại sao custom field thay vì dùng rank_math built-in?
// → RankMath đổi key giữa các version (rank_math / rank_math_seo)
// → og_image format không nhất quán (string vs object)
// → Cần title đã được process (replace %title%, %sitename% variables)

add_action( 'rest_api_init', function () {
    foreach ( [ 'post', 'page' ] as $type ) {
        register_rest_field( $type, 'rm_head', [
            'get_callback' => function ( $post_arr ) {
                $id = $post_arr['id'];

                if ( ! defined( 'RANK_MATH_VERSION' ) ) return null;

                // Raw meta (RankMath lưu trong post meta)
                $title    = get_post_meta( $id, 'rank_math_title',       true );
                $desc     = get_post_meta( $id, 'rank_math_description',  true );

                // Fast-path: nếu post không có bất kỳ rank_math meta nào, return null
                // → tránh replace_vars() tốn CPU cho posts cũ chưa set SEO
                if ( ! $title && ! $desc ) {
                    $has_any = get_post_meta( $id, 'rank_math_facebook_title', true )
                            || get_post_meta( $id, 'rank_math_canonical_url', true );
                    if ( ! $has_any ) return null;
                }
                $robots   = get_post_meta( $id, 'rank_math_robots',       true ); // array
                $canon    = get_post_meta( $id, 'rank_math_canonical_url',true );
                $og_t     = get_post_meta( $id, 'rank_math_facebook_title',       true );
                $og_d     = get_post_meta( $id, 'rank_math_facebook_description', true );
                $og_img   = get_post_meta( $id, 'rank_math_facebook_image',       true ); // attachment ID
                $tw_t     = get_post_meta( $id, 'rank_math_twitter_title',        true );
                $tw_d     = get_post_meta( $id, 'rank_math_twitter_description',  true );

                // Process title/description variables nếu RankMath Helper có
                $post_obj = get_post( $id );
                if ( class_exists( '\RankMath\Helper' ) ) {
                    if ( $title ) $title = \RankMath\Helper::replace_vars( $title, $post_obj );
                    if ( $desc  ) $desc  = \RankMath\Helper::replace_vars( $desc,  $post_obj );
                }
                // Fallback title
                if ( ! $title ) {
                    $title = get_the_title( $id ) . ' - ' . get_bloginfo( 'name' );
                }

                // Resolve OG image: attachment ID → URL (ưu tiên size 'og' 1200×630)
                $og_image_url = '';
                if ( $og_img ) {
                    $og_image_url = wp_get_attachment_image_url( $og_img, 'og' )
                                 ?: wp_get_attachment_image_url( $og_img, 'full' )
                                 ?: '';
                }
                // Fallback: featured image
                if ( ! $og_image_url ) {
                    $thumb = get_post_thumbnail_id( $id );
                    if ( $thumb ) {
                        $og_image_url = wp_get_attachment_image_url( $thumb, 'og' )
                                     ?: wp_get_attachment_image_url( $thumb, 'full' )
                                     ?: '';
                    }
                }

                // Robots: array ['index','follow'] → object {index:'index',follow:'follow'}
                $robots_map = [];
                if ( is_array( $robots ) ) {
                    foreach ( $robots as $r ) $robots_map[ $r ] = $r;
                }

                return array_filter( [
                    'title'               => $title,
                    'description'         => $desc         ?: null,
                    'robots'              => $robots_map   ?: null,
                    'canonical_url'       => $canon        ?: get_permalink( $id ),
                    'og_title'            => $og_t         ?: null,
                    'og_description'      => $og_d         ?: null,
                    'og_image'            => $og_image_url ?: null,
                    'twitter_title'       => $tw_t         ?: null,
                    'twitter_description' => $tw_d         ?: null,
                ], function ( $v ) { return $v !== null && $v !== '' && $v !== []; } );
            },
            'schema' => [ 'type' => 'object' ],
        ] );
    }
} );

// Thêm plain_excerpt (không HTML) và reading_time vào REST response của post
add_action( 'rest_api_init', function () {
    register_rest_field( 'post', 'plain_excerpt', [
        'get_callback' => function ( $post ) { return wp_strip_all_tags( get_the_excerpt( $post['id'] ) ); },
        'schema'       => [ 'type' => 'string' ],
    ] );

    register_rest_field( 'post', 'reading_time', [
        'get_callback' => function ( $post ) {
            $content = get_post_field( 'post_content', $post['id'], 'raw' );
            $words   = str_word_count( wp_strip_all_tags( $content ) );
            return max( 1, (int) ceil( $words / 200 ) );
        },
        'schema' => [ 'type' => 'integer' ],
    ] );
} );

// ── 12. Admin — Giao diện wp-admin phù hợp cho headless ──────────────────────

// Ẩn "Visit Site" trên admin bar (frontend = Next.js, không phải WP theme)
add_action( 'wp_before_admin_bar_render', function () {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu( 'view-site' );
    $wp_admin_bar->remove_menu( 'comments' );
} );

// Xóa dashboard widgets không liên quan
add_action( 'wp_dashboard_setup', function () {
    remove_meta_box( 'dashboard_quick_press',    'dashboard', 'side'   );
    remove_meta_box( 'dashboard_primary',        'dashboard', 'side'   ); // WP News
    remove_meta_box( 'dashboard_incoming_links', 'dashboard', 'normal' );
    remove_meta_box( 'dashboard_plugins',        'dashboard', 'normal' );
    remove_meta_box( 'dashboard_activity',       'dashboard', 'normal' );
    remove_meta_box( 'wpseo-dashboard-overview', 'dashboard', 'normal' ); // Yoast
} );

// Thêm widget thông tin headless hữu ích
add_action( 'wp_dashboard_setup', function () {
    wp_add_dashboard_widget( 'headless_info', '🚀 Headless CMS', function () {
        $next = defined( 'NEXTJS_URL' ) ? NEXTJS_URL : 'http://localhost:3000';
        echo '<table style="width:100%;border-collapse:collapse">';
        echo '<tr><td style="padding:4px 0;color:#666">Frontend</td><td><a href="' . esc_url( $next ) . '" target="_blank">' . esc_html( $next ) . '</a></td></tr>';
        echo '<tr><td style="padding:4px 0;color:#666">REST API</td><td><a href="' . esc_url( rest_url() ) . '" target="_blank">' . esc_html( rest_url() ) . '</a></td></tr>';
        echo '<tr><td style="padding:4px 0;color:#666">Settings</td><td><a href="' . esc_url( rest_url( 'headless/v1/settings' ) ) . '" target="_blank">headless/v1/settings</a></td></tr>';
        echo '<tr><td style="padding:4px 0;color:#666">Menus</td><td><a href="' . esc_url( rest_url( 'headless/v1/menus/primary' ) ) . '" target="_blank">headless/v1/menus/primary</a></td></tr>';
        echo '</table>';
        echo '<p style="margin-top:12px;color:#888;font-size:12px">Nội dung render bởi Next.js. Save bài viết → cache tự revalidate.</p>';
    } );
} );

// Custom admin footer
add_filter( 'admin_footer_text', function () { return 'Headless CMS — Next.js + WordPress'; } );
add_filter( 'update_footer',     '__return_empty_string', 11 );

// Tắt theme editor & plugin editor trong admin (security)
if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
    define( 'DISALLOW_FILE_EDIT', true );
}

// ── 13. Login page ────────────────────────────────────────────────────────────

// Sau khi login → về wp-admin (không phải frontend)
add_filter( 'login_redirect', function ( $url, $request, $user ) {
    return ( $user && ! is_wp_error( $user ) ) ? admin_url() : $url;
}, 10, 3 );

// Logo link + tooltip
add_filter( 'login_headerurl',  function () { return home_url(); } );
add_filter( 'login_headertext', function () { return get_bloginfo( 'name' ); } );

// Dùng site_logo từ ACF options làm logo trang login nếu có
add_action( 'login_head', function () {
    if ( ! function_exists( 'get_field' ) ) return;
    $logo = get_field( 'site_logo', 'option' );
    if ( empty( $logo['url'] ) ) return;
    $url = esc_url( $logo['url'] );
    echo "<style>.login h1 a{background-image:url({$url})!important;background-size:contain!important;background-repeat:no-repeat!important;width:220px!important;height:80px!important}</style>";
} );

// ── 14. Content defaults ──────────────────────────────────────────────────────

// Tắt comments và pingbacks cho bài viết mới (headless dùng Disqus hoặc bỏ)
add_filter( 'default_comment_status', '__return_false' );
add_filter( 'default_ping_status',    '__return_false' );

// Giới hạn 5 revisions / bài viết (tránh database phình)
add_filter( 'wp_revisions_to_keep', function ( $n ) { return 5; } );

// Tăng autosave interval lên 3 phút (mặc định 60s, tốn tài nguyên)
add_filter( 'autosave_interval', function () { return 180; } );

// ── 15. Email ─────────────────────────────────────────────────────────────────

// From name = tên site
add_filter( 'wp_mail_from_name', function ( $n ) { return get_bloginfo( 'name' ) ?: $n; } );

// From email = noreply@domain (tránh default wordpress@... bị spam filter)
add_filter( 'wp_mail_from', function ( $email ) {
    $host = wp_parse_url( home_url(), PHP_URL_HOST ) ?: 'localhost';
    return 'noreply@' . $host;
} );

// ── 16. TOTP helper (RFC 6238 — Google Authenticator compatible) ─────────────

class Headless_TOTP {
    private static $BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    static function generate_secret( $length = 16 ) {
        $secret = '';
        for ( $i = 0; $i < $length; $i++ ) {
            $secret .= self::$BASE32[ random_int( 0, 31 ) ];
        }
        return $secret;
    }

    private static function base32_decode( $input ) {
        $input  = strtoupper( $input );
        $binary = '';
        $buf    = 0;
        $bits   = 0;
        for ( $i = 0; $i < strlen( $input ); $i++ ) {
            $val = strpos( self::$BASE32, $input[ $i ] );
            if ( $val === false ) continue;
            $buf   = ( $buf << 5 ) | $val;
            $bits += 5;
            if ( $bits >= 8 ) {
                $binary .= chr( ( $buf >> ( $bits - 8 ) ) & 0xFF );
                $bits   -= 8;
            }
        }
        return $binary;
    }

    static function get_code( $secret, $step = null ) {
        if ( $step === null ) $step = (int) floor( time() / 30 );
        $key  = self::base32_decode( $secret );
        $msg  = pack( 'N*', 0 ) . pack( 'N*', $step );
        $hash = hash_hmac( 'sha1', $msg, $key, true );
        $off  = ord( $hash[19] ) & 0x0F;
        $code = (
            ( ( ord( $hash[ $off ] )     & 0x7F ) << 24 ) |
            ( ( ord( $hash[ $off + 1 ] ) & 0xFF ) << 16 ) |
            ( ( ord( $hash[ $off + 2 ] ) & 0xFF ) <<  8 ) |
            (   ord( $hash[ $off + 3 ] ) & 0xFF )
        ) % 1000000;
        return str_pad( (string) $code, 6, '0', STR_PAD_LEFT );
    }

    // Cho phép ±1 bước (±30 giây) để bù lệch đồng hồ
    static function verify( $secret, $code, $window = 1 ) {
        $step = (int) floor( time() / 30 );
        for ( $i = -$window; $i <= $window; $i++ ) {
            if ( self::get_code( $secret, $step + $i ) === $code ) return true;
        }
        return false;
    }

    static function qr_url( $secret, $account, $issuer ) {
        $otp_uri = sprintf(
            'otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=6&period=30',
            rawurlencode( $issuer ),
            rawurlencode( $account ),
            $secret,
            rawurlencode( $issuer )
        );
        return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . rawurlencode( $otp_uri );
    }
}

// ── 17. Auth — /headless/v1/auth/* ───────────────────────────────────────────
// Tất cả endpoints đều được gọi qua Next.js API routes (luôn có X-WP-Secret).
// permission_callback = __return_true vì secret đã được check ở filter trên.

add_action( 'rest_api_init', function () {

    // POST /headless/v1/auth/register
    register_rest_route( 'headless/v1', '/auth/register', [
        'methods'             => 'POST',
        'callback'            => function ( WP_REST_Request $request ) {
            $email    = sanitize_email( (string) $request->get_param( 'email' ) );
            $password = (string) $request->get_param( 'password' );
            $name     = sanitize_text_field( (string) $request->get_param( 'name' ) );

            if ( ! $email || ! $password || ! $name ) {
                return new WP_Error( 'missing_fields', 'Vui lòng điền đầy đủ thông tin.', [ 'status' => 400 ] );
            }
            if ( ! is_email( $email ) ) {
                return new WP_Error( 'invalid_email', 'Email không hợp lệ.', [ 'status' => 400 ] );
            }
            if ( strlen( $password ) < 6 ) {
                return new WP_Error( 'weak_password', 'Mật khẩu phải ít nhất 6 ký tự.', [ 'status' => 400 ] );
            }
            if ( email_exists( $email ) ) {
                return new WP_Error( 'email_exists', 'Email này đã được đăng ký.', [ 'status' => 409 ] );
            }

            $username = sanitize_user( strtolower( strstr( $email, '@', true ) ) );
            if ( ! $username || username_exists( $username ) ) {
                $username = 'user_' . wp_rand( 10000, 99999 );
            }

            $user_id = wp_create_user( $username, $password, $email );
            if ( is_wp_error( $user_id ) ) {
                return new WP_Error( 'register_failed', $user_id->get_error_message(), [ 'status' => 500 ] );
            }

            wp_update_user( [
                'ID'           => $user_id,
                'display_name' => $name,
                'first_name'   => $name,
            ] );

            // WP Easy SMTP xử lý SMTP — gửi email chào mừng tự động
            wp_new_user_notification( $user_id, null, 'user' );

            return rest_ensure_response( [ 'success' => true ] );
        },
        'permission_callback' => '__return_true',
    ] );

    // POST /headless/v1/auth/login
    register_rest_route( 'headless/v1', '/auth/login', [
        'methods'             => 'POST',
        'callback'            => function ( WP_REST_Request $request ) {
            $email    = sanitize_email( (string) $request->get_param( 'email' ) );
            $password = (string) $request->get_param( 'password' );

            if ( ! $email || ! $password ) {
                return new WP_Error( 'missing_fields', 'Vui lòng nhập email và mật khẩu.', [ 'status' => 400 ] );
            }

            // Rate limiting: tối đa 10 lần thử / IP / 15 phút
            $ip      = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            $ip      = trim( explode( ',', $ip )[0] );
            $rl_key  = 'login_rl_' . md5( $ip );
            $attempts = (int) get_transient( $rl_key );
            if ( $attempts >= 10 ) {
                return new WP_Error( 'rate_limited', 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.', [ 'status' => 429 ] );
            }

            $user_obj = get_user_by( 'email', $email );
            if ( ! $user_obj ) {
                set_transient( $rl_key, $attempts + 1, 15 * MINUTE_IN_SECONDS );
                return new WP_Error( 'invalid_credentials', 'Email hoặc mật khẩu không đúng.', [ 'status' => 401 ] );
            }

            $user = wp_authenticate( $user_obj->user_login, $password );
            if ( is_wp_error( $user ) ) {
                set_transient( $rl_key, $attempts + 1, 15 * MINUTE_IN_SECONDS );
                return new WP_Error( 'invalid_credentials', 'Email hoặc mật khẩu không đúng.', [ 'status' => 401 ] );
            }

            // Login thành công → reset counter
            delete_transient( $rl_key );

            // Kiểm tra 2FA — nếu enabled, trả về temp_token thay vì auth_cookie
            $secret_2fa = get_user_meta( $user->ID, '_headless_2fa_secret', true );
            if ( $secret_2fa ) {
                $temp = bin2hex( random_bytes( 24 ) );
                // Lưu tạm 5 phút — chỉ cho phép verify 1 lần
                set_transient( '2fa_pending_' . $temp, $user->ID, 5 * MINUTE_IN_SECONDS );
                return rest_ensure_response( [
                    'requires_2fa' => true,
                    'temp_token'   => $temp,
                ] );
            }

            // Không có 2FA → cấp auth cookie bình thường
            $expiry = time() + 30 * DAY_IN_SECONDS;
            $token  = wp_generate_auth_cookie( $user->ID, $expiry, 'auth' );

            return rest_ensure_response( [
                'token' => $token,
                'user'  => [
                    'id'    => $user->ID,
                    'name'  => $user->display_name,
                    'email' => $user->user_email,
                ],
            ] );
        },
        'permission_callback' => '__return_true',
    ] );

    // GET /headless/v1/auth/me
    register_rest_route( 'headless/v1', '/auth/me', [
        'methods'             => 'GET',
        'callback'            => function ( WP_REST_Request $request ) {
            $token = $request->get_header( 'x_wp_auth_token' );
            if ( ! $token ) {
                return new WP_Error( 'no_token', 'Token không được cung cấp.', [ 'status' => 401 ] );
            }

            $user_id = wp_validate_auth_cookie( $token, 'auth' );
            if ( ! $user_id ) {
                return new WP_Error( 'invalid_token', 'Token hết hạn hoặc không hợp lệ.', [ 'status' => 401 ] );
            }

            $user = get_userdata( $user_id );
            return rest_ensure_response( [
                'id'    => $user->ID,
                'name'  => $user->display_name,
                'email' => $user->user_email,
            ] );
        },
        'permission_callback' => '__return_true',
    ] );

    // POST /headless/v1/auth/logout
    // Destroy WP session token — cookie phải bị xóa bởi Next.js sau đó
    register_rest_route( 'headless/v1', '/auth/logout', [
        'methods'             => 'POST',
        'callback'            => function ( WP_REST_Request $request ) {
            $token = $request->get_header( 'x_wp_auth_token' );
            if ( $token ) {
                $parsed = wp_parse_auth_cookie( $token, 'auth' );
                // wp_parse_auth_cookie trả về [ username, expiration, token, hmac ]
                if ( ! empty( $parsed['username'] ) && ! empty( $parsed['token'] ) ) {
                    $user = get_user_by( 'login', $parsed['username'] );
                    if ( $user ) {
                        WP_Session_Tokens::get_instance( $user->ID )->destroy( $parsed['token'] );
                    }
                }
            }
            return rest_ensure_response( [ 'success' => true ] );
        },
        'permission_callback' => '__return_true',
    ] );

    // POST /headless/v1/auth/forgot-password
    register_rest_route( 'headless/v1', '/auth/forgot-password', [
        'methods'             => 'POST',
        'callback'            => function ( WP_REST_Request $request ) {
            $email = sanitize_email( (string) $request->get_param( 'email' ) );

            if ( ! $email || ! is_email( $email ) ) {
                return new WP_Error( 'invalid_email', 'Email không hợp lệ.', [ 'status' => 400 ] );
            }

            // Luôn trả về success để tránh email enumeration
            $user = get_user_by( 'email', $email );
            if ( $user ) {
                $key = get_password_reset_key( $user );
                if ( ! is_wp_error( $key ) ) {
                    $reset_url = network_site_url(
                        'wp-login.php?action=rp&key=' . rawurlencode( $key )
                        . '&login=' . rawurlencode( $user->user_login ),
                        'login'
                    );
                    $site_name = get_bloginfo( 'name' );
                    wp_mail(
                        $user->user_email,
                        sprintf( '[%s] Đặt lại mật khẩu', $site_name ),
                        "Xin chào {$user->display_name},\n\n"
                        . "Nhấn vào liên kết bên dưới để đặt lại mật khẩu:\n\n"
                        . "{$reset_url}\n\n"
                        . "Liên kết có hiệu lực trong 24 giờ.\n\n"
                        . "— {$site_name}"
                    );
                }
            }

            return rest_ensure_response( [ 'success' => true ] );
        },
        'permission_callback' => '__return_true',
    ] );

} );
