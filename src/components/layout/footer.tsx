import { Link } from '@/i18n/navigation'
import { LanguageSwitch } from './language-switch'
import { Send, Hash, MessageCircle, Share2 } from 'lucide-react'

export function Footer({ locale }: { locale?: string }) {
  const isVi = locale === 'vi'
  
  return (
    <footer className="glass-subtle border-t border-[var(--color-border)] mt-auto mt-12">
      <div className="site-content px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-bold text-[length:var(--font-size-2xl)] text-[var(--color-primary)] mb-4 inline-block">
              VNDealz
            </Link>
            <p className="text-[var(--color-text-muted)] text-[length:var(--font-size-sm)] mb-6 max-w-sm">
              {isVi 
                ? 'Cộng đồng chia sẻ khuyến mãi, mã giảm giá và deals hot nhất Việt Nam. Tiết kiệm hơn cho mọi chuyến mua sắm của bạn.' 
                : 'Vietnam\'s #1 community for sharing the hottest deals, coupons, and discounts. Save more on every shopping trip.'}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Hash className="w-5 h-5" /></a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Send className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">{isVi ? 'Về chúng tôi' : 'About Us'}</h4>
            <ul className="space-y-2 text-[length:var(--font-size-sm)]">
              <li><Link href="/ve-chung-toi" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{isVi ? 'Giới thiệu' : 'About'}</Link></li>
              <li><Link href="/lien-he" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{isVi ? 'Liên hệ' : 'Contact'}</Link></li>
              <li><Link href="/quy-che" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{isVi ? 'Quy chế hoạt động' : 'Regulations'}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">{isVi ? 'Pháp lý' : 'Legal'}</h4>
            <ul className="space-y-2 text-[length:var(--font-size-sm)]">
              <li><Link href="/dieu-khoan" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{isVi ? 'Điều khoản sử dụng' : 'Terms of Service'}</Link></li>
              <li><Link href="/bao-mat" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{isVi ? 'Chính sách bảo mật' : 'Privacy Policy'}</Link></li>
              <li className="pt-2"><LanguageSwitch /></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--color-border)]/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} VNDealz. {isVi ? 'Đã đăng ký bản quyền.' : 'All rights reserved.'}
          </p>
          <div className="flex gap-2">
            <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] opacity-50">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
