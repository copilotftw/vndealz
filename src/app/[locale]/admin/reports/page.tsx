import { db } from '@/lib/db'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { timeAgo } from '@/lib/utils'
import { ExternalLink, Check, Trash2, Ban } from 'lucide-react'
import Link from 'next/link'

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

  const columns = [
    {
      accessorKey: 'targetType',
      header: 'Loại',
      cell: ({ row }: any) => {
        const t = row.original.targetType
        const map: any = { DEAL: 'Deal', COMMENT: 'Bình luận', USER: 'Người dùng' }
        return <Badge variant="outline">{map[t] || t}</Badge>
      }
    },
    {
      accessorKey: 'reason',
      header: 'Lý do báo cáo',
      cell: ({ row }: any) => (
        <span className="font-medium truncate max-w-[300px] block" title={row.original.reason}>
          {row.original.reason}
        </span>
      )
    },
    { accessorKey: 'reporter', header: 'Người báo cáo' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const s = row.original.status
        return <Badge variant={s === 'PENDING' ? 'destructive' : 'secondary'}>{s}</Badge>
      }
    },
    { accessorKey: 'createdAt', header: 'Thời gian' },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        if (row.original.status !== 'PENDING') return null
        return (
          <div className="flex items-center gap-2 justify-end">
            <Link href={`/vi/deal/${row.original.targetId}`} target="_blank" title="Xem chi tiết">
              <Button variant="ghost" size="icon-sm">
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon-sm" title="Bỏ qua (Dismiss)">
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Xóa nội dung vi phạm">
              <Trash2 className="w-4 h-4 text-orange-500" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Khóa tài khoản vi phạm">
              <Ban className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Báo cáo</h1>
        <p className="text-muted-foreground mt-2">Xử lý các báo cáo vi phạm từ người dùng.</p>
      </div>

      <div className="glass-strong p-4 rounded-xl border border-border">
        <DataTable columns={columns} data={formattedReports} searchKey="reason" />
      </div>
    </div>
  )
}
