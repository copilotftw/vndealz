import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quy chế hoạt động',
}

export default function RegulationsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Quy chế hoạt động</h1>
      <p className="text-[var(--color-text-muted)]">Cập nhật lần cuối: Tháng 7, 2026</p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold">1. Nguyên tắc chung</h2>
        <p>
          VNDealz là nền tảng chia sẻ khuyến mãi và mã giảm giá do cộng đồng đóng góp. 
          Tất cả các thành viên đều bình đẳng và có trách nhiệm xây dựng môi trường mua sắm lành mạnh, trung thực.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">2. Tiêu chuẩn đăng tải Deal</h2>
        <p>
          - Deal phải có thực, mức giảm giá chính xác và kèm theo link gốc đến trang bán hàng.
          - Tránh đăng các sản phẩm cấm, hàng giả, hàng nhái hoặc các sản phẩm không rõ nguồn gốc.
          - Tiêu đề phải rõ ràng, ngắn gọn và mô tả đúng sản phẩm/dịch vụ.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">3. Xử lý vi phạm</h2>
        <p>
          Ban quản trị sẽ tiến hành nhắc nhở, cảnh cáo hoặc khóa tài khoản vĩnh viễn đối với các trường hợp:
          - Spam link quảng cáo không liên quan.
          - Sử dụng ngôn từ đả kích, thóa mạ thành viên khác.
          - Lợi dụng hệ thống để trục lợi cá nhân bất hợp pháp.
        </p>
      </section>
    </div>
  )
}
