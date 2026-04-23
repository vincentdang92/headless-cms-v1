'use client'

import type { ContactBlock } from './types'
import type { SiteSettings } from '@/types/site-settings'

interface Props {
  block: ContactBlock
  settings: SiteSettings
}

export default function ContactBlock({ block, settings }: Props) {
  const { section_label, section_title } = block
  const { contact, siteName } = settings

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--cd), color-mix(in srgb, var(--cd) 80%, #0f3460))' }}
    >
      <div
        className="absolute right-0 bottom-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--cp) 12%, transparent), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {section_label && (
              <span className="inline-block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--cp)' }}>
                {section_label}
              </span>
            )}
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
            >
              {section_title || 'Đăng ký tư vấn miễn phí'}
            </h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none transition-all"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--cp)'
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--cp) 10%, transparent)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = ''
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0123 456 789"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none transition-all"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--cp)'
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--cp) 10%, transparent)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = ''
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--cp)'
                    e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--cp) 10%, transparent)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = ''
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Dịch vụ quan tâm</label>
                <select
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none text-gray-700"
                  style={{ background: '#fff' }}
                >
                  <option value="">Chọn dịch vụ...</option>
                  <option>Tư vấn pháp lý</option>
                  <option>Kế toán thuế</option>
                  <option>Thành lập doanh nghiệp</option>
                  <option>Bảo hộ thương hiệu</option>
                  <option>Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nội dung *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mô tả nhu cầu của bạn..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none resize-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--cp)'
                    e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--cp) 10%, transparent)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = ''
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--cp)',
                  boxShadow: '0 4px 16px color-mix(in srgb, var(--cp) 35%, transparent)',
                }}
              >
                Gửi yêu cầu tư vấn
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-7">
            <div>
              <p
                className="text-white font-bold text-xl mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {siteName}
              </p>
              <ul className="space-y-5">
                {[
                  { icon: '📍', label: 'Địa chỉ', value: contact.address },
                  { icon: '📞', label: 'Hotline', value: contact.hotline || contact.phone },
                  { icon: '✉️', label: 'Email', value: contact.email },
                  { icon: '🕐', label: 'Giờ làm việc', value: contact.workingHours },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <li key={item.label} className="flex gap-4 items-start">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'color-mix(in srgb, var(--cp) 15%, transparent)' }}
                      >
                        <span className="text-base">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-0.5"
                          style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-white/85">{item.value}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Social links */}
            {(contact.zaloLink || contact.facebookLink) && (
              <div
                className="p-5 rounded-xl"
                style={{ background: 'color-mix(in srgb, var(--cp) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--cp) 20%, transparent)' }}
              >
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--cp-light)' }}>
                  Kết nối nhanh
                </p>
                <div className="flex gap-3">
                  {contact.zaloLink && (
                    <a href={contact.zaloLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
                      style={{ background: '#0068ff' }}>
                      Zalo
                    </a>
                  )}
                  {contact.facebookLink && (
                    <a href={contact.facebookLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
                      style={{ background: '#1877f2' }}>
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
