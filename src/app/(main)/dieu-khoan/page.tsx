import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
}

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Điều khoản sử dụng</h1>
      <p className="text-[var(--color-text-muted)]">Cập nhật lần cuối: Tháng 7, 2026</p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold">1. Chấp nhận điều khoản</h2>
        <p>
          Bằng việc truy cập và sử dụng VNDealz, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. 
          Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngưng sử dụng dịch vụ.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">2. Trách nhiệm của người dùng</h2>
        <p>
          - Bạn chịu trách nhiệm hoàn toàn về nội dung (deal, mã giảm giá, bình luận) mà bạn đăng tải.
          - Không đăng tải các nội dung vi phạm pháp luật, đồi trụy, phản động hoặc vi phạm bản quyền.
          - Không sử dụng các công cụ tự động (bot) để thu thập dữ liệu hoặc spam hệ thống.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">3. Quyền của VNDealz</h2>
        <p>
          Chúng tôi có quyền xóa, sửa đổi hoặc ẩn bất kỳ nội dung nào vi phạm tiêu chuẩn cộng đồng mà không cần báo trước. 
          VNDealz cũng có quyền khóa tài khoản vi phạm nhiều lần.
        </p>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold">4. Thay đổi điều khoản</h2>
        <p>
          VNDealz có thể cập nhật điều khoản sử dụng bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang này.
        </p>
      </section>
    </div>
  )
}
