<?php
// Redirect mọi request frontend về Next.js — WordPress chỉ dùng cho /wp-admin
$frontend_url = defined('NEXTJS_URL') ? NEXTJS_URL : 'http://localhost:3000';
wp_redirect( $frontend_url, 301 );
exit;
