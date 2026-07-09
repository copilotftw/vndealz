'use client'

import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function DealsClient({ data }: { data: any[] }) {
  const columns = [
    {
      accessorKey: 'title',
      header: 'Tiêu đề',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 max-w-[300px]">
          <span className="truncate font-medium" title={row.original.title}>
            {row.original.title}
          </span>
          <Link href={`/deal/${row.original.slug}`} target="_blank">
            <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
          </Link>
        </div>
      )
    },
    { accessorKey: 'price', header: 'Giá' },
    { accessorKey: 'category', header: 'Danh mục' },
    { accessorKey: 'author', header: 'Người đăng' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const s = row.original.status
        const variant = s === 'ACTIVE' ? 'default' : s === 'PENDING' ? 'secondary' : s === 'REJECTED' ? 'destructive' : 'outline'
        return <Badge variant={variant}>{s}</Badge>
      }
    },
    { accessorKey: 'createdAt', header: 'Đăng lúc' },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="icon">
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} searchKey="title" />
}
