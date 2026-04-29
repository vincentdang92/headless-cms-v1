<?php
// WordPress 404 — redirect về Next.js 404 page
$frontend_url = defined( 'NEXTJS_URL' ) ? NEXTJS_URL : 'http://localhost:3000';
wp_redirect( $frontend_url . '/not-found', 302 );
exit;
