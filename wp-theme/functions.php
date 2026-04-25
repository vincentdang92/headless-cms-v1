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
define( 'WP_API_SECRET',         '5d4227de4e5a2082f7e95fcf023ad357a2720a7ab4197514d46ceb6708dc19b3' );

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
                    'topbar_enabled'         => $f( 'topbar_enabled' ) !== false,
                    'topbar_text'            => $f( 'topbar_text' ),
                    'footer_about'           => $f( 'footer_about' ),
                    'footer_copyright'       => $f( 'footer_copyright' ),
                    'google_analytics_id'    => $f( 'google_analytics_id' ),
                    'google_tag_manager_id'  => $f( 'google_tag_manager_id' ),
                    'head_scripts'           => $f( 'head_scripts' ),
                    'body_scripts'           => $f( 'body_scripts' ),
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

// ── 7. Dọn dẹp — tắt các feature không cần trong headless ───────────────────

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
