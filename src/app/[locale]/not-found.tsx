import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function LocaleNotFound() {
  const locale = await getLocale().catch(() => 'vi')
  const isEn = locale === 'en'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--cp-pale, #f0f7ff)' }}
    >
      <div
        className="text-8xl font-black mb-4 select-none"
        style={{ color: 'var(--cp, #1a56db)', opacity: 0.15 }}
      >
        404
      </div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--cd, #1e293b)', fontFamily: 'var(--font-heading)' }}>
        {isEn ? 'Page Not Found' : 'Không tìm thấy trang'}
      </h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        {isEn
          ? 'The page you are looking for does not exist or has been moved.'
          : 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.'}
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background: 'var(--cp, #1a56db)' }}
        >
          {isEn ? 'Back to Home' : 'Về trang chủ'}
        </Link>
        <Link
          href="/lien-he"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-300"
        >
          {isEn ? 'Contact Support' : 'Liên hệ hỗ trợ'}
        </Link>
      </div>
    </div>
  )
}
