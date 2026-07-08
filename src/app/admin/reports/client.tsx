'use client'

import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Check, Trash2, Ban } from 'lucide-react'
import Link from 'next/link'

export function ReportsClient({ data }: { data: any[] }) {
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
            <Link href={`/deal/${row.original.targetId}`} target="_blank" title="Xem chi tiết">
              <Button variant="ghost" size="icon">
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" title="Bỏ qua (Dismiss)">
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" title="Xóa nội dung vi phạm">
              <Trash2 className="w-4 h-4 text-orange-500" />
            </Button>
            <Button variant="ghost" size="icon" title="Khóa tài khoản vi phạm">
              <Ban className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )
      }
    }
  ]

  return <DataTable columns={columns} data={data} searchKey="reason" />
}
