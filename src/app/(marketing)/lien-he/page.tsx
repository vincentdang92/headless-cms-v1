import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ — CôngTy.vn',
  description: 'Liên hệ với chúng tôi để được tư vấn miễn phí.',
}

export default function LienHePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Liên hệ với chúng tôi</h1>
        <p className="text-gray-500">Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Gửi tin nhắn</h2>
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="0123 456 789"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Chủ đề
              </label>
              <select
                id="subject"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="">Chọn chủ đề...</option>
                <option value="demo">Yêu cầu demo</option>
                <option value="pricing">Hỏi về giá</option>
                <option value="support">Hỗ trợ kỹ thuật</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                required
                placeholder="Mô tả nhu cầu của bạn..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
            <ul className="space-y-4 text-sm text-gray-600">
              {[
                { icon: '📍', label: 'Địa chỉ', value: '123 Đường ABC, Quận 1, TP.HCM' },
                { icon: '📞', label: 'Điện thoại', value: '0123 456 789' },
                { icon: '✉️', label: 'Email', value: 'info@congty.vn' },
                { icon: '🕐', label: 'Giờ làm việc', value: 'T2–T6, 8:00–17:30' },
              ].map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-700">{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <p className="font-semibold text-blue-800 mb-2">Hỗ trợ nhanh</p>
            <p className="text-sm text-blue-700">
              Cần hỗ trợ ngay? Nhắn tin qua Zalo hoặc gọi hotline — chúng tôi phản hồi trong 30 phút.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
