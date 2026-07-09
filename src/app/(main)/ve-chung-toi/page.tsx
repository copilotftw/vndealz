import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Về chúng tôi',
}

export default function AboutUsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Về VNDealz</h1>
      <p className="text-[var(--color-text-muted)] text-lg">Cộng đồng chia sẻ khuyến mãi số 1 Việt Nam</p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Sứ mệnh của chúng tôi</h2>
        <p>
          VNDealz được tạo ra với mục tiêu giúp người tiêu dùng Việt Nam tiếp cận nhanh nhất các chương trình khuyến mãi, 
          mã giảm giá và ưu đãi hấp dẫn từ hàng nghìn thương hiệu. Chúng tôi tin rằng mua sắm thông minh không chỉ là mua 
          được giá rẻ, mà còn là mua đúng thời điểm.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Hoạt động dựa trên cộng đồng</h2>
        <p>
          Khác với các trang web tổng hợp tự động, sức mạnh của VNDealz đến từ chính các thành viên. 
          Mọi deal đều được đóng góp, đánh giá và bình luận bởi những người mua sắm thực tế. 
          Deal nào tốt sẽ được "nóng" lên, deal nào kém sẽ bị đào thải.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Tham gia cùng chúng tôi</h2>
        <p>
          Dù bạn là một thợ săn deal chuyên nghiệp hay chỉ là người thỉnh thoảng mua sắm online, 
          VNDealz luôn có chỗ cho bạn. Hãy đăng ký tài khoản, chia sẻ những ưu đãi bạn tìm thấy 
          và giúp cộng đồng mua sắm thông minh hơn mỗi ngày!
        </p>
      </section>
    </div>
  )
}
