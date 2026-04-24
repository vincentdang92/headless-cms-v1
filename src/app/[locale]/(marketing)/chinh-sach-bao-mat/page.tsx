import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getPageBySlug } from '@/lib/wordpress'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật và quyền riêng tư của chúng tôi.',
}

export default async function ChinhSachBaoMatPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const page = await getPageBySlug('chinh-sach-bao-mat', locale).catch(() => null)
  const homeLabel = locale === 'en' ? 'Home' : 'Trang chủ'
  const pageTitle = locale === 'en' ? 'Privacy Policy' : 'Chính Sách Bảo Mật'
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
            <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn.</p>
            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ, bao gồm tên, số điện thoại, email và nội dung liên hệ.</p>
            <h2>2. Mục đích sử dụng</h2>
            <p>Thông tin của bạn được sử dụng để liên hệ tư vấn theo yêu cầu, không chia sẻ với bên thứ ba.</p>
            <h2>3. Bảo mật dữ liệu</h2>
            <p>Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin của bạn.</p>
            <h2>4. Liên hệ</h2>
            <p>Nếu có thắc mắc, vui lòng <Link href="/lien-he">{contactLabel}</Link> với chúng tôi.</p>
          </div>
        </>
      )}
    </div>
  )
}
