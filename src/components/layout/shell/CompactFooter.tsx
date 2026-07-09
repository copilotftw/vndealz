import Link from 'next/link'
import { LanguageSwitch } from '@/components/layout/language-switch'

export function CompactFooter({ locale }: { locale?: string }) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
      <div className="max-w-[var(--content-max-width)] mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[var(--color-primary)]">VNDealz</span>
          <Link href="/ve-chung-toi" className="hover:text-[var(--color-primary)] transition-colors">Về chúng tôi</Link>
          <Link href="/lien-he" className="hover:text-[var(--color-primary)] transition-colors">Liên hệ</Link>
          <Link href="/dieu-khoan" className="hover:text-[var(--color-primary)] transition-colors">Điều khoản</Link>
          <Link href="/bao-mat" className="hover:text-[var(--color-primary)] transition-colors">Bảo mật</Link>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitch />
          <span>© {new Date().getFullYear()} VNDealz</span>
        </div>
      </div>
    </footer>
  )
}
