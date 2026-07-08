import { getCategoryTree } from '@/server/actions/category'
import Link from 'next/link'

import { DynamicIcon } from '@/components/ui/dynamic-icon'

import { getTranslations } from 'next-intl/server'

export async function CategoryPills({ locale }: { locale: string }) {
  const tree = await getCategoryTree()
  const t = await getTranslations('nav')

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      <Link
        href="/"
        className="px-3 py-1 text-[length:var(--font-size-sm)] rounded-[var(--border-radius-full)] whitespace-nowrap bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 hover:border-[var(--color-primary)] transition-all glass-subtle flex items-center gap-1.5"
      >
        <DynamicIcon name="Tag" className="w-3.5 h-3.5 opacity-70" />
        {t('all')}
      </Link>
      
      {tree.map(cat => (
        <Link
          key={cat.id}
          href={`/danh-muc/${cat.slug}`}
          className="px-3 py-1 text-[length:var(--font-size-sm)] rounded-[var(--border-radius-full)] whitespace-nowrap bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 hover:border-[var(--color-primary)] transition-all glass-subtle flex items-center gap-1.5"
        >
          {cat.icon && <DynamicIcon name={cat.icon} className="w-3.5 h-3.5 opacity-70" />}
          {locale === 'vi' ? cat.nameVi : cat.nameEn}
        </Link>
      ))}
    </div>
  )
}
