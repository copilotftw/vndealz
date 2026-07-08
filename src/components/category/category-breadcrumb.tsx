import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'

export function CategoryBreadcrumb({ path, locale }: { path: { nameVi: string; nameEn: string; slug: string }[]; locale: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-[length:var(--font-size-sm)] text-[var(--color-text-muted)] mb-[var(--section-gap)]">
      <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
        {locale === 'vi' ? 'Trang chủ' : 'Home'}
      </Link>
      
      {path.map((item, index) => (
        <div key={item.slug} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          <Link 
            href={`/danh-muc/${item.slug}`} 
            className={`transition-colors hover:text-[var(--color-primary)] ${index === path.length - 1 ? 'font-medium text-[var(--color-text)]' : ''}`}
          >
            {locale === 'vi' ? item.nameVi : item.nameEn}
          </Link>
        </div>
      ))}
    </nav>
  )
}
