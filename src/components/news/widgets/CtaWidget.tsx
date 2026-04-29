import { getTranslations } from 'next-intl/server'
import type { SiteSettings } from '@/types/site-settings'

interface Props {
  settings: SiteSettings
}

export default async function CtaWidget({ settings }: Props) {
  const t = await getTranslations('News')
  const phone = settings.contact.hotline || settings.contact.phone
  const zalo = settings.contact.zaloLink

  if (!phone && !zalo) return null

  return (
    <div
      className="rounded-2xl p-5 text-white relative overflow-hidden"
      style={{ background: 'var(--cd)' }}
    >
      {/* Decorative bg blob */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ background: 'var(--cp)' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-5 h-5"
            style={{ color: 'var(--cp)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <h3 className="text-base font-bold">{t('needHelp')}</h3>
        </div>
        <p className="text-sm text-white/70 mb-4 leading-relaxed">
          {t('needHelpDesc')}
        </p>

        <div className="space-y-2">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--cp)' }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {t('callNow')} {phone}
            </a>
          )}

          {zalo && (
            <a
              href={zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-white text-gray-900 transition-colors hover:bg-gray-100"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.49 10.272v-.45h1.347v6.322h-.748a.6.6 0 0 1-.599-.6V14.16h-3.46c-.226 0-.41-.183-.41-.41v-3.477h1.347v2.534h2.523v-2.534zM5.057 11.36v-.535c0-.276.224-.5.5-.5h2.32v.534c0 .276-.224.5-.5.5H7.04l1.336 2.673h-.5a.6.6 0 0 1-.535-.331l-1.224-2.452-.001 2.193a.6.6 0 0 1-.6.6h-.146v-3.477H5.057v.795zm6.31-1.532h.605v6.4h-.604a.6.6 0 0 1-.6-.6V10.43c0-.331.268-.6.6-.6zM4.34 4.4C2.49 4.4 1 5.89 1 7.74v8.52c0 1.85 1.49 3.34 3.34 3.34h15.32c1.85 0 3.34-1.49 3.34-3.34V7.74c0-1.85-1.49-3.34-3.34-3.34z" />
              </svg>
              {t('chatZalo')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
