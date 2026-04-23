import { getPageBySlug } from '@/lib/wordpress'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu — CôngTy.vn',
  description: 'Tìm hiểu về lịch sử, sứ mệnh và đội ngũ của CôngTy.vn.',
}

const TEAM = [
  { name: 'Nguyễn Văn A', role: 'CEO & Founder', avatar: '/images/team/ceo.jpg' },
  { name: 'Trần Thị B', role: 'CTO', avatar: '/images/team/cto.jpg' },
  { name: 'Lê Văn C', role: 'Head of Sales', avatar: '/images/team/sales.jpg' },
]

export default async function GioiThieuPage() {
  const page = await getPageBySlug('gioi-thieu').catch(() => null)

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Về chúng tôi</h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          Được thành lập năm 2014, CôngTy.vn đã và đang đồng hành cùng hàng trăm
          doanh nghiệp Việt Nam trong hành trình chuyển đổi số.
        </p>
      </div>

      {/* WP content nếu có */}
      {page && (
        <div
          className="prose prose-lg prose-gray max-w-4xl mx-auto mb-20"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      )}

      {/* Mission / Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="bg-blue-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-blue-800 mb-3">Sứ mệnh</h2>
          <p className="text-blue-700 leading-relaxed">
            Cung cấp giải pháp công nghệ thiết thực, giúp doanh nghiệp Việt Nam
            tăng năng suất và cạnh tranh trên thị trường toàn cầu.
          </p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Tầm nhìn</h2>
          <p className="text-gray-600 leading-relaxed">
            Trở thành đối tác công nghệ số 1 được tin tưởng bởi doanh nghiệp
            vừa và nhỏ tại Đông Nam Á vào năm 2030.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 text-center">
        {[
          { value: '10+', label: 'Năm kinh nghiệm' },
          { value: '200+', label: 'Khách hàng' },
          { value: '50+', label: 'Nhân sự' },
          { value: '99%', label: 'Uptime SLA' },
        ].map((stat) => (
          <div key={stat.label} className="py-8 bg-white border border-gray-100 rounded-xl">
            <p className="text-3xl font-bold text-blue-700 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Đội ngũ lãnh đạo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-blue-700">
                {member.name.charAt(0)}
              </div>
              <p className="font-semibold text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
