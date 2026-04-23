import type { Metadata } from 'next'
import Script from 'next/script'
import { getSiteSettings, buildCssVariables, buildGoogleFontsUrl } from '@/lib/site-settings'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings().catch(() => null)
  return {
    title: {
      default: s?.siteName ?? 'CôngTy.vn',
      template: `%s | ${s?.siteName ?? 'CôngTy.vn'}`,
    },
    description: s?.siteDescription,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    ...(s?.favicon?.url && {
      icons: { icon: s.favicon.url, apple: s.favicon.url },
    }),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null)
  const cssVars = settings ? buildCssVariables(settings) : ''
  const fontsUrl = settings
    ? buildGoogleFontsUrl(settings.headingFont, settings.bodyFont)
    : ''
  const gtmId = settings?.scripts.googleTagManagerId
  const gaId = settings?.scripts.googleAnalyticsId
  const headScripts = settings?.scripts.headScripts
  const bodyScripts = settings?.scripts.bodyScripts

  return (
    <html lang="vi" className="h-full antialiased">
      <head>
        {/* Dynamic CSS variables từ ACF — đổi màu/font không cần deploy */}
        {cssVars && <style dangerouslySetInnerHTML={{ __html: cssVars }} />}

        {/* Google Fonts dynamic — load theo font setting trong ACF */}
        {fontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={fontsUrl} />
          </>
        )}

        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics (GA4) */}
        {gaId && !gtmId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}

        {/* Custom head scripts (e.g. Facebook Pixel, Hotjar) */}
        {headScripts && <script dangerouslySetInnerHTML={{ __html: headScripts }} />}
      </head>

      <body
        className="min-h-full flex flex-col bg-white text-gray-900"
        style={{ fontFamily: 'var(--font-body, "Be Vietnam Pro", sans-serif)' }}
      >
        {/* GTM noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {children}

        {/* Custom body scripts */}
        {bodyScripts && <script dangerouslySetInnerHTML={{ __html: bodyScripts }} />}
      </body>
    </html>
  )
}
