import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--cp-pale, #FDF0E7)' }}>
      <div className="text-center max-w-lg">
        <p
          className="text-8xl font-bold mb-4 leading-none"
          style={{ color: 'var(--cp, #E8753A)', fontFamily: 'var(--font-heading, serif)' }}
        >
          404
        </p>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--cd, #1A1A2E)', fontFamily: 'var(--font-heading, serif)' }}
        >
          Trang không tìm thấy
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          Hãy quay lại trang chủ để tiếp tục.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--cp, #E8753A)' }}
          >
            Về trang chủ
          </Link>
          <Link
            href="/lien-he"
            className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all border hover:bg-white"
            style={{ color: 'var(--cd, #1A1A2E)', borderColor: 'var(--cd, #1A1A2E)' }}
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  )
}
