import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed', // /tin-tuc (vi), /en/tin-tuc (en)
})

export type Locale = (typeof routing.locales)[number]
