import { getCategoryTree } from '@/server/actions/category'
import { Link } from '@/i18n/navigation'

export async function CategoryPills({ locale }: { locale: string }) {
  const tree = await getCategoryTree()

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      <Link
        href="/"
        className="px-3 py-1 text-[length:var(--font-size-sm)] rounded-[var(--border-radius-full)] whitespace-nowrap bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 hover:border-[var(--color-primary)] transition-all glass-subtle"
      >
        {locale === 'vi' ? 'Tất cả' : 'All'}
      </Link>
      
      {tree.map(cat => (
        <Link
          key={cat.id}
          href={`/danh-muc/${cat.slug}`}
          className="px-3 py-1 text-[length:var(--font-size-sm)] rounded-[var(--border-radius-full)] whitespace-nowrap bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 hover:border-[var(--color-primary)] transition-all glass-subtle"
        >
          {cat.icon && <span className="mr-1">{cat.icon}</span>}
          {locale === 'vi' ? cat.nameVi : cat.nameEn}
        </Link>
      ))}
    </div>
  )
}
