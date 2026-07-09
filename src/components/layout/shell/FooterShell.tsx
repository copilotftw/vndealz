import type { FooterVariant } from '@/components/theme/persona'
import { Footer } from '@/components/layout/footer'
import { CompactFooter } from './CompactFooter'

export function FooterShell({ variant, locale }: { variant: FooterVariant; locale: string }) {
  switch (variant) {
    case 'none':
      return null
    case 'status-bar':
      return (
        <footer className="border-t border-[var(--color-border)] px-4 py-2 flex items-center justify-between text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] font-mono">
          <span>VNDealz/ledger</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      )
    case 'compact':
      return <CompactFooter locale={locale} />
    case 'minimal':
      return (
        <footer className="border-t border-[var(--color-border)] py-6 text-center text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} VNDealz
        </footer>
      )
    case 'full':
    default:
      return <Footer locale={locale} />
  }
}
