import type { FlexibleContent } from '@/blocks/types'

// ─── Shared CTA block ─────────────────────────────────────────────────────────

const CTA_BLOCK = {
  acf_fc_layout: 'cta_banner' as const,
  headline: 'Bắt Đầu Ngay Hôm Nay',
  description: 'Tư vấn miễn phí 30 phút với chuyên gia — không ràng buộc, không phí tư vấn.',
  cta_primary_text: 'Nhận Tư Vấn Miễn Phí',
  cta_primary_link: '/lien-he',
  cta_secondary_text: 'Xem Tất Cả Dịch Vụ',
  cta_secondary_link: '/dich-vu',
  dark_background: true,
}

// ─── Per-service fallback content ────────────────────────────────────────────

const TNHH_1TV: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Thành Lập Doanh Nghiệp',
    section_title: 'Công Ty TNHH 1 Thành Viên — Toàn Quyền & Trách Nhiệm Hữu Hạn',
    section_desc:
      'Mô hình phổ biến nhất cho cá nhân khởi nghiệp tại Việt Nam. Chủ sở hữu toàn quyền quyết định hoạt động kinh doanh và chỉ chịu trách nhiệm trong phạm vi vốn góp.',
    features: [
      { title: 'Thời gian 3–5 ngày làm việc', description: 'Nhận giấy phép kinh doanh trong vòng 3 đến 5 ngày sau khi hồ sơ đầy đủ, không cần chờ đợi.' },
      { title: 'Trọn gói từ A đến Z', description: 'Tư vấn loại hình, soạn thảo điều lệ, đăng ký ĐKKD, con dấu, mã số thuế — một đầu mối xử lý toàn bộ.' },
      { title: 'Hỗ trợ sau thành lập 12 tháng', description: 'Tư vấn miễn phí khai báo thuế ban đầu, hóa đơn điện tử, mở tài khoản ngân hàng trong 30 ngày đầu.' },
      { title: 'Cam kết hoàn tiền', description: 'Nếu không hoàn thành hồ sơ theo đúng tiến độ cam kết, chúng tôi hoàn trả toàn bộ phí dịch vụ.' },
    ],
    badge_number: '3–5',
    badge_label: 'Ngày hoàn thành',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Quy Trình',
    section_title: 'Các Bước Thành Lập Công Ty TNHH 1TV',
    section_desc: 'Quy trình chuẩn hóa — minh bạch từng bước, cập nhật tiến độ liên tục',
    dark_background: false,
    values: [
      { icon: '📋', title: 'Bước 1: Tư vấn loại hình', description: 'Chuyên gia tư vấn ngành nghề, vốn điều lệ phù hợp và kiểm tra tên công ty tại Cổng thông tin quốc gia.' },
      { icon: '📝', title: 'Bước 2: Soạn thảo hồ sơ', description: 'Soạn điều lệ, đơn đăng ký ĐKKD, danh sách thành viên và các tài liệu theo yêu cầu của Sở KH&ĐT.' },
      { icon: '🏛️', title: 'Bước 3: Nộp hồ sơ', description: 'Nộp hồ sơ trực tuyến hoặc trực tiếp tại Sở KH&ĐT. Theo dõi tiến độ và xử lý bổ sung (nếu có).' },
      { icon: '🖋️', title: 'Bước 4: Nhận ĐKKD & con dấu', description: 'Nhận Giấy chứng nhận ĐKKD, khắc con dấu pháp nhân, công bố mẫu dấu trên Cổng thông tin quốc gia.' },
      { icon: '🏦', title: 'Bước 5: Mở tài khoản ngân hàng', description: 'Hỗ trợ mở tài khoản ngân hàng doanh nghiệp, đăng ký Internet Banking, chứng từ nộp vốn.' },
      { icon: '📊', title: 'Bước 6: Đăng ký thuế ban đầu', description: 'Khai báo phương pháp tính thuế, đăng ký hóa đơn điện tử, chữ ký số và các thủ tục thuế ban đầu.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Công Ty TNHH 1 Thành Viên',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Vốn điều lệ tối thiểu là bao nhiêu?', answer: 'Không có quy định vốn điều lệ tối thiểu (trừ một số ngành nghề kinh doanh có điều kiện như tài chính, bất động sản). Vốn điều lệ phổ biến cho công ty mới thành lập là 100 triệu đến 1 tỷ VNĐ.' },
      { question: 'Tôi có thể thay đổi chủ sở hữu sau khi thành lập không?', answer: 'Có — bằng cách chuyển nhượng toàn bộ vốn điều lệ cho cá nhân/tổ chức khác, hoặc thay đổi loại hình sang TNHH 2 thành viên. Chúng tôi hỗ trợ cả hai trường hợp.' },
      { question: 'Mất bao lâu để hoàn thành toàn bộ thủ tục?', answer: 'Từ lúc ký hợp đồng đến khi nhận đầy đủ giấy tờ (ĐKKD + con dấu + thủ tục thuế ban đầu) mất khoảng 7–10 ngày làm việc.' },
      { question: 'Tôi cần chuẩn bị những gì?', answer: 'CMND/CCCD/Hộ chiếu của chủ sở hữu, địa chỉ trụ sở (có thể thuê địa chỉ ảo), tên công ty và ngành nghề dự kiến. Chúng tôi sẽ tư vấn và soạn thảo toàn bộ phần còn lại.' },
    ],
  },
  CTA_BLOCK,
]

const TNHH_2TV: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Thành Lập Doanh Nghiệp',
    section_title: 'Công Ty TNHH 2 Thành Viên — Hợp Tác Linh Hoạt, Quyền Lợi Rõ Ràng',
    section_desc:
      'Mô hình lý tưởng cho 2–50 cá nhân/tổ chức cùng góp vốn kinh doanh. Quyền lợi và trách nhiệm được phân chia rõ ràng theo tỷ lệ vốn góp, có thể điều chỉnh linh hoạt.',
    features: [
      { title: 'Soạn thảo điều lệ & thỏa thuận thành viên', description: 'Điều lệ được soạn thảo chi tiết, bảo vệ quyền lợi từng thành viên, quy định rõ cơ chế ra quyết định và giải quyết mâu thuẫn.' },
      { title: 'Tối đa 50 thành viên góp vốn', description: 'Linh hoạt mở rộng từ 2 đến 50 thành viên, dễ dàng tăng vốn bằng cách kết nạp thành viên mới.' },
      { title: 'Bảo vệ quyền lợi thiểu số', description: 'Tư vấn cơ chế bảo vệ thành viên thiểu số (dưới 35% vốn góp) theo quy định Luật Doanh nghiệp 2020.' },
      { title: 'Hỗ trợ thay đổi thành viên', description: 'Tư vấn và thực hiện thủ tục chuyển nhượng phần vốn góp, thêm/bớt thành viên trong suốt quá trình hoạt động.' },
    ],
    badge_number: '2–50',
    badge_label: 'Thành viên góp vốn',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Quy Trình',
    section_title: 'Quy Trình Thành Lập TNHH 2 Thành Viên',
    section_desc: 'Chúng tôi điều phối toàn bộ — từ soạn thảo hồ sơ đến bàn giao giấy phép',
    dark_background: false,
    values: [
      { icon: '🤝', title: 'Tư vấn cấu trúc vốn', description: 'Xác định tỷ lệ góp vốn, cơ chế biểu quyết và phân chia lợi nhuận phù hợp với mô hình kinh doanh.' },
      { icon: '📝', title: 'Soạn thảo tài liệu pháp lý', description: 'Điều lệ công ty, biên bản họp thành lập, thỏa thuận cổ đông và các hợp đồng góp vốn.' },
      { icon: '🏛️', title: 'Đăng ký kinh doanh', description: 'Nộp hồ sơ tại Sở KH&ĐT, theo dõi và xử lý yêu cầu bổ sung từ cơ quan nhà nước.' },
      { icon: '🖋️', title: 'Hoàn thiện pháp lý', description: 'Khắc con dấu, công bố thông tin, mở tài khoản ngân hàng và nộp vốn góp đúng tiến độ.' },
      { icon: '📊', title: 'Đăng ký thuế', description: 'Khai báo thuế ban đầu, đăng ký hóa đơn điện tử, chữ ký số và phương pháp khấu trừ thuế.' },
      { icon: '🛡️', title: 'Tư vấn quản trị nội bộ', description: 'Hướng dẫn tổ chức Hội đồng thành viên, quy trình ra nghị quyết và lưu giữ biên bản họp.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Công Ty TNHH 2 Thành Viên',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Cần tối thiểu bao nhiêu thành viên?', answer: 'Tối thiểu 2 thành viên (cá nhân hoặc tổ chức). Không giới hạn quốc tịch — người nước ngoài có thể là thành viên góp vốn.' },
      { question: 'Nếu thành viên muốn rút khỏi công ty thì sao?', answer: 'Thành viên có thể chuyển nhượng phần vốn góp cho thành viên khác hoặc bên thứ ba theo trình tự luật định. Chúng tôi hỗ trợ toàn bộ thủ tục đăng ký thay đổi tại Sở KH&ĐT.' },
      { question: 'TNHH 2TV khác TNHH 1TV như thế nào?', answer: 'Điểm khác biệt chính: có từ 2 thành viên trở lên, phải tổ chức Hội đồng thành viên, quyết định quan trọng cần đa số phiếu. Đổi lại, khả năng huy động vốn linh hoạt hơn.' },
      { question: 'Tôi và đối tác ở hai tỉnh khác nhau, có ký được không?', answer: 'Hoàn toàn có thể. Chúng tôi hỗ trợ ký tên điện tử (chữ ký số) hoặc ký công chứng ủy quyền để xử lý thủ tục từ xa.' },
    ],
  },
  CTA_BLOCK,
]

const CO_PHAN: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Thành Lập Doanh Nghiệp',
    section_title: 'Công Ty Cổ Phần — Mô Hình Để Phát Triển & Huy Động Vốn',
    section_desc:
      'Lựa chọn tối ưu cho doanh nghiệp có kế hoạch mở rộng quy mô lớn, thu hút nhà đầu tư và chuẩn bị cho IPO. Cơ cấu quản trị rõ ràng với HĐQT, Ban Giám đốc và Ban Kiểm soát.',
    features: [
      { title: 'Phát hành cổ phần linh hoạt', description: 'Phát hành cổ phần phổ thông và cổ phần ưu đãi, chuyển nhượng dễ dàng — nền tảng lý tưởng để gọi vốn đầu tư.' },
      { title: 'Cơ cấu HĐQT chuyên nghiệp', description: 'Soạn thảo quy chế HĐQT, Ban Kiểm soát và Điều lệ công ty theo chuẩn quốc tế, sẵn sàng cho đối tác FDI.' },
      { title: 'Bảo vệ cổ đông thiểu số', description: 'Tư vấn cơ chế anti-dilution, tag-along, drag-along và các điều khoản bảo vệ cổ đông thiểu số trong SHA.' },
      { title: 'Chuẩn bị cho vòng gọi vốn', description: 'Hỗ trợ soạn thảo tài liệu Due Diligence, Data Room và thủ tục phát hành cổ phần mới cho nhà đầu tư.' },
    ],
    badge_number: '3+',
    badge_label: 'Cổ đông sáng lập',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Quy Trình',
    section_title: 'Thành Lập Công Ty Cổ Phần Đúng Quy Trình',
    section_desc: 'Từ cơ cấu cổ đông đến quản trị nội bộ — chúng tôi đảm bảo mọi thứ đúng luật',
    dark_background: false,
    values: [
      { icon: '📊', title: 'Tư vấn cơ cấu cổ đông', description: 'Xác định tỷ lệ sở hữu, loại cổ phần, quyền biểu quyết và cơ chế phân chia cổ tức.' },
      { icon: '📋', title: 'Soạn thảo Điều lệ & SHA', description: 'Điều lệ công ty, thỏa thuận cổ đông (SHA), quy chế hoạt động HĐQT và Ban Kiểm soát.' },
      { icon: '🏛️', title: 'Đăng ký kinh doanh', description: 'Nộp hồ sơ đăng ký tại Sở KH&ĐT, theo dõi và xử lý yêu cầu bổ sung.' },
      { icon: '🖋️', title: 'Con dấu & pháp lý', description: 'Khắc con dấu, công bố thông tin doanh nghiệp, chuẩn bị sổ cổ đông lần đầu.' },
      { icon: '💳', title: 'Phát hành cổ phần sáng lập', description: 'Ghi nhận vốn góp, cấp giấy chứng nhận sở hữu cổ phần và mở tài khoản nhận vốn góp.' },
      { icon: '📈', title: 'Tư vấn quản trị công ty', description: 'Hướng dẫn tổ chức ĐHCĐ, lưu giữ biên bản và các nghĩa vụ pháp lý định kỳ.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Công Ty Cổ Phần',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Cần bao nhiêu cổ đông để thành lập công ty cổ phần?', answer: 'Tối thiểu 3 cổ đông sáng lập (cá nhân hoặc tổ chức). Không giới hạn số lượng tối đa.' },
      { question: 'Công ty cổ phần có thể lên sàn chứng khoán không?', answer: 'Có — nhưng cần đáp ứng thêm các điều kiện của Ủy ban Chứng khoán Nhà nước (lợi nhuận, quy mô vốn, quản trị). Chúng tôi tư vấn lộ trình chuẩn bị từ giai đoạn thành lập.' },
      { question: 'Khác gì so với công ty TNHH?', answer: 'Công ty cổ phần có thể phát hành cổ phiếu để huy động vốn từ công chúng, chuyển nhượng cổ phần dễ dàng hơn, nhưng cơ cấu quản trị phức tạp hơn và phải tuân thủ nhiều quy định hơn.' },
      { question: 'Có thể chuyển đổi từ TNHH sang Cổ phần không?', answer: 'Hoàn toàn có thể. Thủ tục chuyển đổi mất khoảng 15–20 ngày làm việc. Chúng tôi hỗ trợ toàn bộ quy trình, kể cả soạn thảo lại điều lệ và cơ cấu cổ đông mới.' },
    ],
  },
  CTA_BLOCK,
]

const KE_TOAN_THUE: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Kế Toán & Thuế',
    section_title: 'Kế Toán Thuế Hàng Tháng — Để Bạn Tập Trung Vào Kinh Doanh',
    section_desc:
      'Dịch vụ kế toán thuế trọn gói hàng tháng — khai thuế đúng hạn, sổ sách rõ ràng, báo cáo minh bạch. Đội kế toán chuyên nghiệp thay thế hoàn toàn bộ phận kế toán nội bộ với chi phí tối ưu hơn.',
    features: [
      { title: 'Khai thuế đúng hạn 100%', description: 'Khai báo thuế GTGT, TNCN hàng tháng/quý và báo cáo tài chính theo đúng hạn nộp của cơ quan thuế — không phát sinh phạt chậm nộp.' },
      { title: 'Sổ sách kế toán chuẩn VAS', description: 'Lập và cập nhật đầy đủ sổ sách theo chuẩn kế toán Việt Nam (VAS), sẵn sàng cho kiểm toán và quyết toán năm.' },
      { title: 'Hóa đơn điện tử & chứng từ', description: 'Quản lý hóa đơn đầu vào/đầu ra, kiểm tra tính hợp lệ, lưu trữ và đối chiếu theo quy định Thông tư 78/2021/TT-BTC.' },
      { title: 'Báo cáo tài chính định kỳ', description: 'Báo cáo P&L, bảng cân đối kế toán hàng tháng/quý — giúp chủ doanh nghiệp nắm rõ tình hình tài chính bất cứ lúc nào.' },
    ],
    badge_number: '100%',
    badge_label: 'Đúng hạn nộp thuế',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Dịch Vụ Bao Gồm',
    section_title: 'Những Gì Có Trong Gói Kế Toán Thuế Hàng Tháng',
    section_desc: 'Một gói dịch vụ — nhiều đầu việc được xử lý chuyên nghiệp',
    dark_background: false,
    values: [
      { icon: '📋', title: 'Khai thuế GTGT', description: 'Lập và nộp tờ khai thuế GTGT hàng tháng hoặc hàng quý theo phương pháp khấu trừ hoặc trực tiếp.' },
      { icon: '👤', title: 'Khai thuế TNCN', description: 'Tính toán và khai báo thuế thu nhập cá nhân cho toàn bộ nhân viên công ty theo từng kỳ lương.' },
      { icon: '📊', title: 'Báo cáo tài chính', description: 'Lập báo cáo kết quả kinh doanh, bảng cân đối kế toán và lưu chuyển tiền tệ theo chuẩn VAS.' },
      { icon: '🧾', title: 'Quản lý hóa đơn', description: 'Kiểm tra, phân loại và lưu trữ hóa đơn đầu vào/đầu ra, đảm bảo tính hợp lệ cho khấu trừ thuế.' },
      { icon: '💼', title: 'Sổ sách kế toán', description: 'Cập nhật đầy đủ nhật ký chung, sổ cái và các sổ kế toán chi tiết theo đúng chuẩn mực kế toán VN.' },
      { icon: '📞', title: 'Tư vấn thuế định kỳ', description: 'Giải đáp thắc mắc về thuế và kế toán trong giờ hành chính, cập nhật các thay đổi chính sách mới nhất.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Dịch Vụ Kế Toán Thuế',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Chi phí dịch vụ kế toán hàng tháng là bao nhiêu?', answer: 'Phụ thuộc vào quy mô doanh nghiệp (số lượng hóa đơn, nhân viên, nghiệp vụ phát sinh). Chúng tôi báo giá cố định sau khi khảo sát nhu cầu — không phát sinh phí ngoài báo giá.' },
      { question: 'Tôi cần chuyển tài liệu gì hàng tháng?', answer: 'Hóa đơn mua vào, hóa đơn bán ra, bảng lương, sao kê ngân hàng và chứng từ thu chi phát sinh trong tháng. Có thể gửi qua Zalo, email hoặc phần mềm quản lý chúng tôi cung cấp.' },
      { question: 'Nếu tôi đang có kế toán nội bộ, có thể chuyển sang outsource không?', answer: 'Hoàn toàn có thể. Chúng tôi hỗ trợ tiếp nhận hồ sơ từ kế toán cũ, rà soát sổ sách lịch sử và chuẩn hóa trước khi tiếp quản.' },
      { question: 'Dịch vụ có bao gồm xử lý kiểm tra thuế không?', answer: 'Có — khi cơ quan thuế kiểm tra, chúng tôi cử kế toán trưởng trực tiếp làm việc với đoàn kiểm tra, chuẩn bị hồ sơ giải trình và bảo vệ quyền lợi cho doanh nghiệp.' },
    ],
  },
  CTA_BLOCK,
]

const QUYET_TOAN_THUE: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Kế Toán & Thuế',
    section_title: 'Quyết Toán Thuế Năm — Chuẩn Xác, Tối Ưu Số Thuế Phải Nộp',
    section_desc:
      'Dịch vụ lập báo cáo tài chính năm và khai quyết toán thuế TNDN, TNCN theo đúng quy định. Rà soát toàn diện sổ sách, tối ưu chi phí hợp lệ và giảm thiểu rủi ro thuế.',
    features: [
      { title: 'Rà soát sổ sách toàn bộ năm', description: 'Kiểm tra và điều chỉnh toàn bộ chứng từ, hóa đơn và sổ sách kế toán trong năm tài chính trước khi lập báo cáo.' },
      { title: 'Tối ưu chi phí hợp lệ', description: 'Rà soát và tư vấn các khoản chi phí được khấu trừ thuế TNDN theo Thông tư 96/2015/TT-BTC, tối thiểu hóa số thuế phải nộp.' },
      { title: 'Báo cáo tài chính chuẩn mực', description: 'Lập đầy đủ 4 báo cáo tài chính theo chuẩn mực VAS: BCTC, KQHĐKD, LCTT và thuyết minh.' },
      { title: 'Xử lý kiểm tra thuế', description: 'Đồng hành cùng doanh nghiệp trong các đợt kiểm tra, thanh tra thuế — chuẩn bị hồ sơ, giải trình và bảo vệ quyền lợi.' },
    ],
    badge_number: '31/3',
    badge_label: 'Hạn nộp quyết toán',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Quy Trình',
    section_title: 'Quy Trình Quyết Toán Thuế Năm Chuyên Nghiệp',
    section_desc: 'Bắt đầu từ tháng 1 — hoàn thành trước hạn nộp 31/3',
    dark_background: false,
    values: [
      { icon: '🔍', title: 'Rà soát sổ sách', description: 'Kiểm tra tổng thể chứng từ kế toán, phát hiện và điều chỉnh các sai sót trước khi lập báo cáo chính thức.' },
      { icon: '📊', title: 'Lập báo cáo tài chính', description: 'Lập 4 mẫu biểu BCTC theo TT200/TT133, đảm bảo khớp số liệu giữa sổ sách và tờ khai thuế.' },
      { icon: '💰', title: 'Tối ưu thuế TNDN', description: 'Rà soát chi phí được trừ, các khoản miễn/giảm thuế, ưu đãi đầu tư và trích lập dự phòng hợp lý.' },
      { icon: '📝', title: 'Khai quyết toán TNCN', description: 'Tổng hợp thu nhập, khấu trừ gia cảnh, hoàn/nộp bổ sung thuế TNCN cho toàn bộ nhân viên.' },
      { icon: '🏛️', title: 'Nộp tờ khai & nộp thuế', description: 'Nộp tờ khai quyết toán qua cổng Thuế điện tử trước ngày 31/3, nộp số thuế còn thiếu (nếu có).' },
      { icon: '🗂️', title: 'Lưu trữ hồ sơ', description: 'Đóng gói và lưu trữ toàn bộ hồ sơ thuế năm theo quy định 10 năm, sẵn sàng cho các đợt thanh tra.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Quyết Toán Thuế Năm',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Hạn nộp quyết toán thuế năm là khi nào?', answer: 'Hạn nộp tờ khai quyết toán thuế TNDN và TNCN là ngày 31/3 của năm sau. Nếu là quý thì hạn nộp khác nhau theo từng loại thuế.' },
      { question: 'Công ty mới thành lập năm nay có phải quyết toán không?', answer: 'Có — tất cả doanh nghiệp đang hoạt động đều phải quyết toán, kể cả công ty mới thành lập chưa phát sinh doanh thu. Có thể nộp báo cáo "không phát sinh".' },
      { question: 'Nếu sổ sách năm cũ có sai sót thì sao?', answer: 'Chúng tôi sẽ rà soát và điều chỉnh sai sót trong phạm vi cho phép, lập biên bản điều chỉnh và khai bổ sung tờ khai thuế nếu cần thiết, đồng thời tư vấn mức phạt và cách xử lý tối ưu.' },
      { question: 'Tôi có thể tự làm quyết toán rồi nhờ kiểm tra lại được không?', answer: 'Hoàn toàn được. Chúng tôi cung cấp dịch vụ rà soát và soát xét báo cáo tài chính đã được doanh nghiệp tự lập trước khi nộp cơ quan thuế.' },
    ],
  },
  CTA_BLOCK,
]

const HOAN_THUE: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Kế Toán & Thuế',
    section_title: 'Hoàn Thuế GTGT — Lấy Lại Tiền Đúng Hạn, Đủ Điều Kiện',
    section_desc:
      'Dịch vụ lập hồ sơ đề nghị hoàn thuế GTGT cho doanh nghiệp xuất khẩu, đầu tư dự án mới và mua sắm tài sản cố định lớn. Tỷ lệ hoàn thuế thành công cao, theo dõi sát tiến độ từ cục thuế.',
    features: [
      { title: 'Tư vấn điều kiện hoàn thuế', description: 'Đánh giá doanh nghiệp có đủ điều kiện hoàn thuế GTGT không theo Điều 13 Luật Thuế GTGT và các thông tư hướng dẫn.' },
      { title: 'Chuẩn bị hồ sơ đầy đủ', description: 'Lập đơn đề nghị hoàn thuế, tổng hợp hóa đơn đầu vào, hóa đơn xuất khẩu, tờ khai hải quan và toàn bộ chứng từ liên quan.' },
      { title: 'Theo dõi tiến độ từ cục thuế', description: 'Cập nhật tình trạng xử lý hồ sơ, làm việc trực tiếp với cán bộ thuế khi có yêu cầu bổ sung hoặc xác minh.' },
      { title: 'Xử lý yêu cầu bổ sung', description: 'Chuẩn bị và bổ sung hồ sơ kịp thời khi cơ quan thuế có yêu cầu, đảm bảo không bị từ chối do thiếu chứng từ.' },
    ],
    badge_number: '40',
    badge_label: 'Ngày hoàn thuế theo luật',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Đối Tượng Áp Dụng',
    section_title: 'Doanh Nghiệp Nào Được Hoàn Thuế GTGT?',
    section_desc: 'Kiểm tra xem doanh nghiệp bạn có đủ điều kiện không',
    dark_background: false,
    values: [
      { icon: '✈️', title: 'Doanh nghiệp xuất khẩu', description: 'Có số thuế GTGT đầu vào phát sinh từ hàng hóa/dịch vụ xuất khẩu mà chưa được khấu trừ hết.' },
      { icon: '🏗️', title: 'Đầu tư dự án mới', description: 'Dự án đầu tư chưa đi vào hoạt động, lũy kế thuế GTGT đầu vào từ 300 triệu trở lên.' },
      { icon: '🏭', title: 'Mua sắm TSCĐ lớn', description: 'Mua máy móc, thiết bị giá trị lớn dẫn đến thuế GTGT đầu vào liên tục vượt đầu ra.' },
      { icon: '🔄', title: 'Chuyển đổi loại hình', description: 'Doanh nghiệp hợp nhất, sáp nhập, giải thể có số thuế GTGT còn được khấu trừ chuyển sang.' },
      { icon: '📦', title: 'Hàng xuất trả lại', description: 'Hàng nhập khẩu sau đó tái xuất hoặc trả lại nhà cung cấp nước ngoài được hoàn thuế phát sinh khi nhập.' },
      { icon: '📋', title: 'Kinh doanh dự án BĐS', description: 'Chủ đầu tư dự án bất động sản trong giai đoạn xây dựng chưa bán hàng được hoàn thuế GTGT đầu vào.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Hoàn Thuế GTGT',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Thời gian hoàn thuế là bao lâu?', answer: 'Theo quy định, Cơ quan thuế phải giải quyết trong 40 ngày (hoàn thuế trước kiểm tra) hoặc 60 ngày (kiểm tra trước hoàn thuế). Thực tế thường nhanh hơn nếu hồ sơ đầy đủ.' },
      { question: 'Thuế GTGT được hoàn bằng tiền mặt hay chuyển khoản?', answer: 'Hoàn thuế bằng chuyển khoản vào tài khoản ngân hàng doanh nghiệp đã đăng ký với cơ quan thuế. Không hoàn tiền mặt.' },
      { question: 'Doanh nghiệp mới thành lập chưa xuất khẩu có được hoàn không?', answer: 'Nếu là dự án đầu tư chưa đi vào hoạt động và có số thuế GTGT đầu vào lũy kế từ 300 triệu, có thể làm hồ sơ hoàn theo quy định đầu tư.' },
      { question: 'Có rủi ro gì khi hoàn thuế không?', answer: 'Khi lập hồ sơ hoàn thuế, cơ quan thuế có thể kiểm tra toàn diện hoạt động kinh doanh. Đội ngũ chúng tôi sẽ rà soát hồ sơ trước khi nộp để giảm thiểu rủi ro phát sinh thuế truy thu.' },
    ],
  },
  CTA_BLOCK,
]

const NHAN_HIEU_TRONG_NUOC: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Bảo Hộ Thương Hiệu',
    section_title: 'Đăng Ký Nhãn Hiệu Trong Nước — Bảo Vệ Thương Hiệu Của Bạn',
    section_desc:
      'Tra cứu khả năng đăng ký, nộp đơn và theo dõi hồ sơ tại Cục Sở hữu trí tuệ Việt Nam (NOIP). Bảo vệ nhãn hiệu trước hành vi xâm phạm và cạnh tranh không lành mạnh trên thị trường.',
    features: [
      { title: 'Tra cứu khả năng đăng ký miễn phí', description: 'Tra cứu cơ sở dữ liệu nhãn hiệu NOIP, đánh giá khả năng đăng ký thành công và tư vấn điều chỉnh nếu cần.' },
      { title: 'Nộp đơn và theo dõi hồ sơ', description: 'Chuẩn bị đầy đủ hồ sơ đơn đăng ký, nộp tại NOIP và theo dõi tiến độ thẩm định từ thực chất đến hình thức.' },
      { title: 'Phân loại Nice chính xác', description: 'Tư vấn chọn đúng nhóm sản phẩm/dịch vụ theo Bảng phân loại Nice — ảnh hưởng trực tiếp đến phạm vi bảo hộ.' },
      { title: 'Gia hạn & duy trì hiệu lực', description: 'Nhắc nhở gia hạn trước 6 tháng khi đến kỳ, chuẩn bị hồ sơ gia hạn văn bằng bảo hộ (mỗi 10 năm một lần).' },
    ],
    badge_number: '12–18',
    badge_label: 'Tháng cấp văn bằng',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Quy Trình',
    section_title: 'Quy Trình Đăng Ký Nhãn Hiệu Tại Việt Nam',
    section_desc: 'Từ tra cứu đến nhận văn bằng — chúng tôi đồng hành toàn bộ hành trình',
    dark_background: false,
    values: [
      { icon: '🔍', title: 'Tra cứu nhãn hiệu', description: 'Tra cứu cơ sở dữ liệu NOIP và tra cứu nâng cao trên các nền tảng quốc tế để đánh giá rủi ro từ chối.' },
      { icon: '🎨', title: 'Tư vấn thiết kế', description: 'Khuyến nghị về màu sắc, hình thức, tên gọi để tăng khả năng đăng ký và phân biệt trên thị trường.' },
      { icon: '📋', title: 'Chuẩn bị hồ sơ đơn', description: 'Soạn tờ khai, phân loại nhóm hàng/dịch vụ, ký mẫu nhãn và hoàn thiện bộ hồ sơ nộp NOIP.' },
      { icon: '🏛️', title: 'Nộp đơn NOIP', description: 'Nộp đơn trực tiếp hoặc online tại NOIP, nhận số đơn và xác nhận ngày ưu tiên — cơ sở pháp lý quan trọng.' },
      { icon: '⏳', title: 'Theo dõi thẩm định', description: 'Theo dõi kết quả thẩm định hình thức (1–2 tháng) và thẩm định nội dung (9–12 tháng), phản hồi từ NOIP.' },
      { icon: '📜', title: 'Nhận văn bằng', description: 'Nộp lệ phí cấp văn bằng và nhận Giấy chứng nhận đăng ký nhãn hiệu — có giá trị 10 năm kể từ ngày nộp đơn.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Đăng Ký Nhãn Hiệu',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Tại sao cần đăng ký nhãn hiệu?', answer: 'Nhãn hiệu chưa đăng ký có thể bị người khác đăng ký trước — bạn sẽ mất quyền sử dụng tên/logo đã đầu tư xây dựng. Đăng ký sớm là cách bảo vệ thương hiệu tốt nhất và rẻ nhất.' },
      { question: 'Nhãn hiệu có giá trị bao lâu?', answer: 'Văn bằng bảo hộ nhãn hiệu tại Việt Nam có hiệu lực 10 năm kể từ ngày nộp đơn và có thể gia hạn không giới hạn số lần, mỗi lần 10 năm.' },
      { question: 'Nếu đơn bị từ chối thì sao?', answer: 'Chúng tôi sẽ phân tích lý do từ chối, tư vấn phương án kháng nghị hoặc nộp đơn mới với điều chỉnh phù hợp. Đội ngũ có kinh nghiệm xử lý kháng nghị thành công cho nhiều khách hàng.' },
      { question: 'Đăng ký nhãn hiệu cho một tỉnh hay cả nước?', answer: 'Đăng ký nhãn hiệu tại Việt Nam có hiệu lực trên toàn quốc — không phân biệt địa phương. Muốn bảo hộ tại nước ngoài, cần đăng ký riêng hoặc qua hệ thống Madrid.' },
    ],
  },
  CTA_BLOCK,
]

const NHAN_HIEU_QUOC_TE: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Bảo Hộ Thương Hiệu',
    section_title: 'Đăng Ký Nhãn Hiệu Quốc Tế — Mở Rộng Bảo Hộ Ra Toàn Cầu',
    section_desc:
      'Bảo hộ nhãn hiệu tại các thị trường xuất khẩu trọng điểm qua hệ thống Madrid (WIPO) hoặc đăng ký trực tiếp. Một đơn Madrid có thể bảo hộ tại hơn 130 quốc gia thành viên.',
    features: [
      { title: 'Hệ thống Madrid — 1 đơn 130+ quốc gia', description: 'Nộp một đơn quốc tế duy nhất qua WIPO, chỉ định nhiều quốc gia cùng lúc — tiết kiệm thời gian và chi phí đáng kể so với đăng ký riêng lẻ.' },
      { title: 'Tư vấn chọn thị trường chiến lược', description: 'Phân tích thị trường xuất khẩu mục tiêu, đánh giá rủi ro xung đột nhãn hiệu và lộ trình đăng ký theo ngân sách.' },
      { title: 'Đăng ký trực tiếp tại từng quốc gia', description: 'Với các thị trường không tham gia Madrid (một số ASEAN), chúng tôi đăng ký trực tiếp qua mạng lưới đại lý quốc tế.' },
      { title: 'Theo dõi và gia hạn định kỳ', description: 'Quản lý danh mục nhãn hiệu quốc tế, nhắc nhở gia hạn đúng hạn tại từng quốc gia theo chu kỳ 10 năm.' },
    ],
    badge_number: '130+',
    badge_label: 'Quốc gia thành viên Madrid',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Thị Trường Phổ Biến',
    section_title: 'Đăng Ký Nhãn Hiệu Tại Các Thị Trường Trọng Điểm',
    section_desc: 'Doanh nghiệp Việt xuất khẩu nhiều nhất sang các thị trường sau',
    dark_background: false,
    values: [
      { icon: '🇺🇸', title: 'Hoa Kỳ (USPTO)', description: 'Thị trường lớn nhất. Đăng ký trực tiếp tại USPTO hoặc chỉ định qua Madrid với kinh nghiệm xử lý Office Action.' },
      { icon: '🇪🇺', title: 'Liên minh Châu Âu (EUIPO)', description: 'Một đăng ký EU bảo hộ toàn bộ 27 quốc gia thành viên — lựa chọn tối ưu cho thị trường EU.' },
      { icon: '🇨🇳', title: 'Trung Quốc (CNIPA)', description: 'Thị trường rủi ro cao về giả mạo nhãn hiệu. Nên đăng ký sớm, kể cả khi chưa kinh doanh tại đây.' },
      { icon: '🇯🇵', title: 'Nhật Bản & Hàn Quốc', description: 'Hai thị trường xuất khẩu lớn của Việt Nam. Thẩm định nghiêm ngặt nhưng văn bằng được bảo hộ tốt.' },
      { icon: '🌏', title: 'ASEAN (Thái Lan, Malaysia…)', description: 'Đăng ký trực tiếp tại từng quốc gia ASEAN — chúng tôi phối hợp với đại lý địa phương uy tín.' },
      { icon: '🇦🇺', title: 'Úc & New Zealand', description: 'Thị trường xuất khẩu nông sản, thực phẩm lớn. Thủ tục tương đối nhanh và minh bạch.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Đăng Ký Nhãn Hiệu Quốc Tế',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Điều kiện để sử dụng hệ thống Madrid là gì?', answer: 'Doanh nghiệp hoặc cá nhân Việt Nam phải có nhãn hiệu đã đăng ký hoặc đang trong quá trình đăng ký tại Việt Nam (nhãn hiệu cơ sở). Sau đó có thể nộp đơn quốc tế qua NOIP.' },
      { question: 'Chi phí đăng ký nhãn hiệu quốc tế tốn khoảng bao nhiêu?', answer: 'Phụ thuộc vào số quốc gia chỉ định và số nhóm hàng/dịch vụ. Phí WIPO cơ bản từ 250–300 CHF/quốc gia. Chúng tôi tư vấn ngân sách chi tiết sau khi biết nhu cầu cụ thể.' },
      { question: 'Nếu nhãn hiệu bị từ chối tại một quốc gia thì các quốc gia khác có bị ảnh hưởng không?', answer: 'Không — từ chối tại một quốc gia không ảnh hưởng đến các chỉ định khác trong cùng đơn Madrid. Chúng tôi sẽ xử lý kháng nghị riêng tại quốc gia từ chối.' },
      { question: 'Mất bao lâu để đăng ký nhãn hiệu quốc tế?', answer: 'WIPO xử lý đơn Madrid trong 18 tháng. Mỗi cơ quan quốc gia có thể từ chối trong thời hạn đó, sau đó đơn tự động có hiệu lực tại quốc gia không có phản đối.' },
    ],
  },
  CTA_BLOCK,
]

const BAN_QUYEN: FlexibleContent = [
  {
    acf_fc_layout: 'two_column',
    layout: 'image_right',
    dark_background: false,
    section_label: 'Bảo Hộ Thương Hiệu & SHTT',
    section_title: 'Bản Quyền & Tranh Chấp SHTT — Bảo Vệ Tài Sản Sáng Tạo',
    section_desc:
      'Đăng ký bản quyền tác phẩm, phần mềm và thiết kế. Xử lý vi phạm sở hữu trí tuệ — từ gửi thông báo yêu cầu gỡ bỏ đến đại diện tố tụng tại tòa án.',
    features: [
      { title: 'Đăng ký bản quyền tác phẩm', description: 'Đăng ký tại Cục Bản quyền tác giả cho phần mềm, tác phẩm văn học, âm nhạc, hình ảnh và các tác phẩm sáng tạo.' },
      { title: 'Phát hiện và xử lý vi phạm', description: 'Rà soát và phát hiện hành vi vi phạm bản quyền, nhãn hiệu trên internet, mạng xã hội và thị trường thực tế.' },
      { title: 'Gửi thông báo vi phạm (DMCA/NOIP)', description: 'Soạn thảo và gửi cease & desist letter, yêu cầu gỡ bỏ nội dung vi phạm trên các nền tảng kỹ thuật số.' },
      { title: 'Đại diện khiếu nại & tố tụng', description: 'Đại diện doanh nghiệp trong thủ tục khiếu nại hành chính tại NOIP/Thanh tra Bộ KH&CN và tố tụng dân sự tại tòa án.' },
    ],
    badge_number: '0',
    badge_label: 'Chi phí tư vấn ban đầu',
  },
  {
    acf_fc_layout: 'values_grid',
    section_label: 'Dịch Vụ Bao Gồm',
    section_title: 'Toàn Diện Bảo Hộ Tài Sản Trí Tuệ',
    section_desc: 'Từ phòng ngừa đến xử lý tranh chấp — chúng tôi đồng hành suốt hành trình',
    dark_background: false,
    values: [
      { icon: '💻', title: 'Bản quyền phần mềm', description: 'Đăng ký tại Cục Bản quyền cho phần mềm máy tính, ứng dụng mobile, mã nguồn và tài liệu kỹ thuật.' },
      { icon: '🎨', title: 'Bản quyền thiết kế & logo', description: 'Bảo hộ thiết kế đồ họa, logo, bao bì sản phẩm và các tác phẩm mỹ thuật ứng dụng.' },
      { icon: '📝', title: 'Bản quyền nội dung số', description: 'Bảo vệ bài viết, video, podcast, khóa học online và nội dung sáng tạo số khác.' },
      { icon: '🚫', title: 'Xử lý hàng giả & nhái', description: 'Phối hợp với QLTT, Hải quan xử lý hàng hóa vi phạm nhãn hiệu trên thị trường và tại cửa khẩu.' },
      { icon: '⚖️', title: 'Tranh chấp nhãn hiệu', description: 'Xử lý tranh chấp nhãn hiệu tương tự/giống hệt, thủ tục hủy đơn/văn bằng bảo hộ của đối thủ.' },
      { icon: '🌐', title: 'Xử lý vi phạm online', description: 'Yêu cầu gỡ bỏ nội dung vi phạm trên Facebook, TikTok, Shopee, Lazada và các nền tảng quốc tế.' },
    ],
  },
  {
    acf_fc_layout: 'faq_accordion',
    section_label: 'Câu Hỏi Thường Gặp',
    section_title: 'Thắc Mắc Về Bản Quyền & SHTT',
    section_desc: '',
    dark_background: true,
    faqs: [
      { question: 'Bản quyền có tự động phát sinh khi tạo ra tác phẩm không?', answer: 'Đúng — theo Luật SHTT Việt Nam, bản quyền phát sinh tự động khi tác phẩm được tạo ra và thể hiện dưới hình thức vật chất. Tuy nhiên, đăng ký tại Cục Bản quyền giúp bạn có chứng cứ pháp lý rõ ràng khi xảy ra tranh chấp.' },
      { question: 'Mất bao lâu để đăng ký bản quyền?', answer: 'Cục Bản quyền tác giả cấp giấy chứng nhận trong vòng 15–30 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ.' },
      { question: 'Nếu phát hiện đối thủ sao chép logo/sản phẩm của mình, làm gì?', answer: 'Liên hệ ngay — chúng tôi sẽ đánh giá mức độ vi phạm, thu thập chứng cứ và tư vấn phương án xử lý nhanh nhất (từ cảnh báo đến khởi kiện) để bảo vệ quyền lợi của bạn.' },
      { question: 'Bảo hộ thiết kế công nghiệp khác bảo hộ nhãn hiệu như thế nào?', answer: 'Nhãn hiệu bảo hộ dấu hiệu phân biệt nguồn gốc sản phẩm (tên, logo). Thiết kế công nghiệp bảo hộ hình dáng bên ngoài của sản phẩm. Nhiều trường hợp nên đăng ký cả hai để bảo hộ toàn diện.' },
    ],
  },
  CTA_BLOCK,
]

// ─── Fallback map ─────────────────────────────────────────────────────────────

export const SERVICE_DETAIL_FALLBACKS: Record<string, FlexibleContent> = {
  'thanh-lap-tnhh-1tv':          TNHH_1TV,
  'thanh-lap-tnhh-2tv':          TNHH_2TV,
  'thanh-lap-co-phan':           CO_PHAN,
  'ke-toan-thue-hang-thang':     KE_TOAN_THUE,
  'quyet-toan-thue':             QUYET_TOAN_THUE,
  'hoan-thue':                   HOAN_THUE,
  'nhan-hieu-trong-nuoc':        NHAN_HIEU_TRONG_NUOC,
  'nhan-hieu-quoc-te':           NHAN_HIEU_QUOC_TE,
  'ban-quyen':                   BAN_QUYEN,
}

// Meta titles & descriptions for generateMetadata
export const SERVICE_META: Record<string, { title: string; description: string }> = {
  'thanh-lap-tnhh-1tv':      { title: 'Thành Lập Công Ty TNHH 1 Thành Viên', description: 'Dịch vụ thành lập công ty TNHH 1 thành viên trọn gói — 3–5 ngày, không phát sinh chi phí ẩn, hỗ trợ sau dịch vụ 12 tháng.' },
  'thanh-lap-tnhh-2tv':      { title: 'Thành Lập Công Ty TNHH 2 Thành Viên', description: 'Thành lập TNHH 2 thành viên trở lên — soạn thảo điều lệ, thỏa thuận cổ đông, đăng ký kinh doanh trọn gói.' },
  'thanh-lap-co-phan':       { title: 'Thành Lập Công Ty Cổ Phần', description: 'Dịch vụ thành lập công ty cổ phần — từ cơ cấu HĐQT đến phát hành cổ phần và tư vấn quản trị nội bộ.' },
  'ke-toan-thue-hang-thang': { title: 'Dịch Vụ Kế Toán Thuế Hàng Tháng', description: 'Kế toán thuế trọn gói hàng tháng — khai thuế đúng hạn, sổ sách rõ ràng, báo cáo tài chính minh bạch.' },
  'quyet-toan-thue':         { title: 'Dịch Vụ Quyết Toán Thuế Năm', description: 'Quyết toán thuế TNDN và TNCN — rà soát sổ sách, tối ưu chi phí khấu trừ và nộp đúng hạn 31/3.' },
  'hoan-thue':               { title: 'Dịch Vụ Hoàn Thuế GTGT', description: 'Lập hồ sơ và theo dõi hoàn thuế GTGT cho doanh nghiệp xuất khẩu, đầu tư mới và mua sắm TSCĐ lớn.' },
  'nhan-hieu-trong-nuoc':    { title: 'Đăng Ký Nhãn Hiệu Trong Nước', description: 'Tra cứu, nộp đơn và theo dõi đăng ký nhãn hiệu tại Cục SHTT Việt Nam — tỷ lệ thành công cao.' },
  'nhan-hieu-quoc-te':       { title: 'Đăng Ký Nhãn Hiệu Quốc Tế', description: 'Bảo hộ nhãn hiệu tại 130+ quốc gia qua hệ thống Madrid (WIPO) hoặc đăng ký trực tiếp theo thị trường.' },
  'ban-quyen':               { title: 'Bản Quyền & Giải Quyết Tranh Chấp SHTT', description: 'Đăng ký bản quyền tác phẩm, xử lý vi phạm sở hữu trí tuệ và đại diện tranh chấp tại NOIP và tòa án.' },
}
