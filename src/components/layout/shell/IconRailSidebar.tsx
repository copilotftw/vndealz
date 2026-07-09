// Prism persona sidebar — narrow icon-only rail, tooltips on hover.

import Link from 'next/link'
import { db } from '@/lib/db'
import { Flame, Tag, MessageCircle, Ticket, Gift, Home } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

export async function IconRailSidebar() {
  const t = await getTranslations('nav')

  const topCategories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { order: 'asc' },
    take: 6,
    select: { slug: true, nameEn: true, icon: true },
  })

  const staticLinks = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/ma-giam-gia', icon: Ticket, label: t('vouchers') },
    { href: '/mien-phi', icon: Gift, label: 'Free' },
    { href: '/thao-luan', icon: MessageCircle, label: t('forum') },
    { href: '/canh-bao-deal', icon: Flame, label: t('alerts') },
  ]

  return (
    <aside className="hidden lg:flex flex-col items-center gap-1 w-16 py-4 shrink-0 border-r border-[var(--color-border)]">
      {staticLinks.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          title={label}
          className="flex items-center justify-center w-10 h-10 rounded-[var(--border-radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] transition-all"
        >
          <Icon className="w-5 h-5" />
        </Link>
      ))}

      <div className="w-8 h-px bg-[var(--color-border)] my-2" />

      {topCategories.map(cat => (
        <Link
          key={cat.slug}
          href={`/danh-muc/${cat.slug}`}
          title={cat.nameEn}
          className="flex items-center justify-center w-10 h-10 rounded-[var(--border-radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] transition-all text-lg"
        >
          <DynamicIcon name={cat.icon} className="w-5 h-5" />
        </Link>
      ))}
    </aside>
  )
}
