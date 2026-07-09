import { db } from '@/lib/db'
import { timeAgo } from '@/lib/utils'
import { ReportsClient } from './client'

export default async function AdminReportsPage() {
  const reports = await db.report.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, username: true } }
    }
  })

  const formattedReports = reports.map(r => ({
    id: r.id,
    targetType: r.targetType,
    targetId: r.targetId,
    reason: r.reason,
    reporter: r.user.name || r.user.username,
    status: r.status,
    createdAt: timeAgo(r.createdAt)
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Báo cáo</h1>
        <p className="text-muted-foreground mt-2">Xử lý các báo cáo vi phạm từ người dùng.</p>
      </div>

      <div className="glass-strong p-4 rounded-xl border border-border">
        <ReportsClient data={formattedReports} />
      </div>
    </div>
  )
}
