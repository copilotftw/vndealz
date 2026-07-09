import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Chính sách bảo mật</h1>
      <p className="text-[var(--color-text-muted)]">Cập nhật lần cuối: Tháng 7, 2026</p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold">1. Thu thập thông tin</h2>
        <p>
          VNDealz thu thập các thông tin cơ bản khi bạn đăng ký tài khoản, bao gồm địa chỉ email, 
          tên hiển thị và các liên kết mạng xã hội nếu bạn cung cấp. Chúng tôi cũng thu thập dữ liệu tự động 
          như địa chỉ IP và cookie để cải thiện trải nghiệm người dùng.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">2. Sử dụng thông tin</h2>
        <p>
          Thông tin của bạn được sử dụng để cung cấp các tính năng của cộng đồng, 
          gửi thông báo về deal mới, và ngăn chặn các hành vi spam/gian lận.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">3. Chia sẻ thông tin</h2>
        <p>
          Chúng tôi không bán hay cho thuê thông tin cá nhân của bạn cho bên thứ ba. 
          Thông tin chỉ được chia sẻ trong trường hợp có yêu cầu từ cơ quan pháp luật.
        </p>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold">4. Liên hệ</h2>
        <p>
          Nếu có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ với chúng tôi qua trang Liên hệ.
        </p>
      </section>
    </div>
  )
}
