import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Liên hệ</h1>
      <p className="text-[var(--color-text-muted)] text-lg">Chúng tôi luôn sẵn sàng lắng nghe bạn!</p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Hỗ trợ & Góp ý</h2>
        <p>
          Nếu bạn gặp sự cố khi sử dụng VNDealz, phát hiện lỗi hệ thống, 
          hoặc có ý tưởng muốn đóng góp để cộng đồng phát triển tốt hơn, đừng ngần ngại liên hệ với chúng tôi:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Email hỗ trợ:</strong> support@vndealz.vn</li>
          <li><strong>Báo cáo nội dung xấu:</strong> report@vndealz.vn</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Hợp tác & Đối tác</h2>
        <p>
          Bạn là đại diện của nhãn hàng, nền tảng thương mại điện tử, hay có mong muốn hợp tác kinh doanh? 
          Hãy liên hệ với bộ phận đối tác của chúng tôi:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Email hợp tác:</strong> partners@vndealz.vn</li>
        </ul>
      </section>
      
      <section className="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20">
        <h3 className="font-bold mb-2">Lưu ý</h3>
        <p className="text-sm">
          Thời gian phản hồi thông thường là từ 24 - 48 giờ làm việc. 
          Vui lòng cung cấp chi tiết vấn đề hoặc ảnh chụp màn hình (nếu có) để chúng tôi hỗ trợ bạn nhanh nhất.
        </p>
      </section>
    </div>
  )
}
