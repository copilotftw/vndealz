import Link from 'next/link'
import { LayoutDashboard, Shield, Tag, Users, FolderTree, Flag, Palette, Link2, Megaphone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'

export async function AdminSidebar() {
  const [t, pendingCount, reportsCount] = await Promise.all([
    getTranslations('admin'),
    db.deal.count({ where: { status: 'PENDING' } }),
    db.report.count({ where: { status: 'PENDING' } }),
  ])

  const links = [
    { href: '/quan-tri', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/quan-tri/kiem-duyet', label: t('moderation'), icon: Shield, badge: pendingCount },
    { href: '/quan-tri/bai-dang', label: t('deals'), icon: Tag },
    { href: '/quan-tri/nguoi-dung', label: t('users'), icon: Users },
    { href: '/quan-tri/danh-muc', label: t('categories'), icon: FolderTree },
    { href: '/quan-tri/bao-cao', label: t('reports'), icon: Flag, badge: reportsCount },
    { href: '/quan-tri/giao-dien', label: t('theme'), icon: Palette },
    { href: '/quan-tri/doi-tac', label: t('affiliates'), icon: Link2 },
    { href: '/quan-tri/quang-cao', label: t('ads'), icon: Megaphone },
  ]

  return (
    <aside className="w-full md:w-60 glass-subtle h-full overflow-y-auto p-4 flex md:flex-col gap-2 md:gap-0">

      <nav className="flex flex-row md:flex-col gap-1.5 md:space-y-1.5 flex-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--border-radius-md)] text-sm font-medium transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          >
            <link.icon className="w-4 h-4" />
            <span className="flex-1">{link.label}</span>
            {link.badge !== undefined && link.badge > 0 && (
              <span className="bg-[var(--color-danger)] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

    </aside>
  )
}
