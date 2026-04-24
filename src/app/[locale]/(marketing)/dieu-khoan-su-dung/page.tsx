import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getPageBySlug } from '@/lib/wordpress'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ của chúng tôi.',
}

export default async function DieuKhoanSuDungPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const page = await getPageBySlug('dieu-khoan-su-dung', locale).catch(() => null)
  const homeLabel = locale === 'en' ? 'Home' : 'Trang chủ'
  const pageTitle = locale === 'en' ? 'Terms of Use' : 'Điều Khoản Sử Dụng'
  const contactLabel = locale === 'en' ? 'contact us' : 'liên hệ'

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-700">{homeLabel}</Link>
        <span>/</span>
        <span className="text-gray-600">{pageTitle}</span>
      </nav>

      {page ? (
        <>
          <h1
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
          <div
            className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-700"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />
        </>
      ) : (
        <>
          <h1
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
          >
            {pageTitle}
          </h1>
          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-700">
            <p>Bằng cách sử dụng website này, bạn đồng ý với các điều khoản sau.</p>
            <h2>1. Chấp nhận điều khoản</h2>
            <p>Khi truy cập và sử dụng website, bạn xác nhận đã đọc, hiểu và đồng ý tuân theo các điều khoản này.</p>
            <h2>2. Sử dụng thông tin</h2>
            <p>Mọi thông tin trên website chỉ mang tính chất tham khảo.</p>
            <h2>3. Sở hữu trí tuệ</h2>
            <p>Toàn bộ nội dung, hình ảnh và tài liệu trên website thuộc quyền sở hữu của chúng tôi.</p>
            <h2>4. Liên hệ</h2>
            <p>Nếu có câu hỏi, vui lòng <Link href="/lien-he">{contactLabel}</Link> với chúng tôi.</p>
          </div>
        </>
      )}
    </div>
  )
}
