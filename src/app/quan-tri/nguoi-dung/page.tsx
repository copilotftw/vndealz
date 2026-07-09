import { getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { timeAgo } from '@/lib/utils'
import { UsersClient } from './client'

export default async function AdminUsersPage() {
  const t = await getTranslations('admin')
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { deals: true, comments: true } }
    }
  })

  // Format data for DataTable
  const formattedUsers = users.map(u => ({
    id: u.id,
    name: u.name || t('noName'),
    username: u.username,
    email: u.email,
    role: u.role,
    tier: u.tier,
    points: u.points,
    dealsCount: u._count.deals,
    commentsCount: u._count.comments,
    createdAt: timeAgo(u.createdAt)
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('usersTitle')}</h1>
        <p className="text-muted-foreground mt-2">{t('usersDesc')}</p>
      </div>

      <div className="glass-strong p-4 rounded-xl border border-border">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  )
}
