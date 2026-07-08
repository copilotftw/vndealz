import Link from 'next/link'
import { LanguageSwitch } from './language-switch'
import { Send, Hash, MessageCircle, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Footer({ locale }: { locale?: string }) {
  const t = useTranslations('footer')
  
  return (
    <footer className="glass-subtle border-t border-[var(--color-border)] mt-auto mt-12">
      <div className="site-content px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-bold text-[length:var(--font-size-2xl)] text-[var(--color-primary)] mb-4 inline-block">
              VNDealz
            </Link>
            <p className="text-[var(--color-text-muted)] text-[length:var(--font-size-sm)] mb-6 max-w-sm">
              {t('description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Hash className="w-5 h-5" /></a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Send className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">{t('aboutUs')}</h4>
            <ul className="space-y-2 text-[length:var(--font-size-sm)]">
              <li><Link href="/ve-chung-toi" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{t('about')}</Link></li>
              <li><Link href="/lien-he" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{t('contact')}</Link></li>
              <li><Link href="/quy-che" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{t('regulations')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-[length:var(--font-size-sm)]">
              <li><Link href="/dieu-khoan" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{t('terms')}</Link></li>
              <li><Link href="/bao-mat" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{t('privacy')}</Link></li>
              <li className="pt-2"><LanguageSwitch /></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--color-border)]/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} VNDealz. {t('rights')}
          </p>
          <div className="flex gap-2">
            <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] opacity-50">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
