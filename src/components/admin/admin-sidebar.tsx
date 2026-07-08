import Link from 'next/link'
import { LayoutDashboard, Shield, Tag, Users, FolderTree, Flag, Palette, Link2, Megaphone } from 'lucide-react'
import { db } from '@/lib/db'

export async function AdminSidebar() {
  const pendingCount = await db.deal.count({ where: { status: 'PENDING' } })
  const reportsCount = await db.report.count({ where: { status: 'PENDING' } })

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/moderation', label: 'Duyệt bài', icon: Shield, badge: pendingCount },
    { href: '/admin/deals', label: 'Deals', icon: Tag },
    { href: '/admin/users', label: 'Người dùng', icon: Users },
    { href: '/admin/categories', label: 'Danh mục', icon: FolderTree },
    { href: '/admin/reports', label: 'Báo cáo', icon: Flag, badge: reportsCount },
    { href: '/admin/theme', label: 'Giao diện', icon: Palette },
    { href: '/admin/affiliates', label: 'Affiliate', icon: Link2 },
    { href: '/admin/ads', label: 'Quảng cáo', icon: Megaphone },
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
      
      <div className="mt-auto pt-4 border-t border-[var(--color-border)] px-2">
        <Link href="/" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          &larr; Quay lại trang chủ
        </Link>
      </div>
    </aside>
  )
}
