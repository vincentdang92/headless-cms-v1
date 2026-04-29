'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">📡</div>
      <h1
        className="text-2xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: 'var(--font-heading, serif)' }}
      >
        Không có kết nối mạng
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Vui lòng kiểm tra kết nối internet và thử lại.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'var(--cp, #E8753A)' }}
      >
        Thử lại
      </button>
    </div>
  )
}
