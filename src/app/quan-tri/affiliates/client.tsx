'use client'

import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

export function AffiliatesClient({ data }: { data: any[] }) {
  const columns = [
    {
      accessorKey: 'merchant',
      header: 'Đối tác (Merchant)',
      cell: ({ row }: any) => <span className="font-semibold">{row.original.merchant}</span>
    },
    {
      accessorKey: 'urlPattern',
      header: 'URL Pattern (Regex)',
      cell: ({ row }: any) => <code className="text-xs bg-muted px-2 py-1 rounded">{row.original.urlPattern}</code>
    },
    {
      accessorKey: 'affiliateTag',
      header: 'Tham số Affiliate',
      cell: ({ row }: any) => <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{row.original.affiliateTag}</code>
    },
    {
      accessorKey: 'active',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const active = row.original.active
        return <Badge variant={active ? 'default' : 'secondary'}>{active ? 'Đang bật' : 'Đã tắt'}</Badge>
      }
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="icon" title="Sửa">
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" title="Xóa">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} searchKey="merchant" />
}
