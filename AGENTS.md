<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# WordPress theme (`wp-theme/functions.php`)

- **ACF boolean fields** (`true_false`) return `'1'`/`'0'` strings. Use the `$b($key)` helper — never `get_field() !== false`.
- **No arrow functions** (`fn() =>`): cPanel's editor flags them as syntax errors. Use `function() { return ...; }` instead.
- **Custom settings endpoint** `/headless/v1/settings` serves all ACF Options fields — this is what `lib/site-settings.ts` calls.

# Sidebar widgets

Components in `src/components/news/widgets/` are **self-fetching server components**. They own their own data fetching — do not pass data into them from the page. Each returns `null` when there's nothing to show.

# SEO

`generateMetadata` must call `extractSeoData(post)` → `seoToMetadata()` for Yoast/RankMath support. Never build metadata from raw `post.title` / `post.excerpt` alone.
