'use client'

import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldBan, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export function UsersClient({ data }: { data: any[] }) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Người dùng',
      cell: ({ row }: any) => (
        <div className="flex flex-col max-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate" title={row.original.name}>
              {row.original.name}
            </span>
            <Link href={`/ho-so/${row.original.username}`} target="_blank">
              <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
            </Link>
          </div>
          <span className="text-xs text-muted-foreground truncate">@{row.original.username}</span>
          <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Vai trò',
      cell: ({ row }: any) => {
        const r = row.original.role
        const variant = r === 'ADMIN' ? 'destructive' : r === 'MODERATOR' ? 'secondary' : 'outline'
        return <Badge variant={variant}>{r}</Badge>
      }
    },
    { accessorKey: 'tier', header: 'Hạng' },
    { accessorKey: 'points', header: 'Điểm' },
    { accessorKey: 'dealsCount', header: 'Deals' },
    { accessorKey: 'commentsCount', header: 'Bình luận' },
    { accessorKey: 'createdAt', header: 'Tham gia' },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 justify-end">
          {row.original.role !== 'ADMIN' && (
            <>
              {row.original.role === 'USER' ? (
                <Button variant="ghost" size="icon" title="Thăng cấp Moderator">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" title="Giáng cấp xuống User">
                  <ShieldAlert className="w-4 h-4 text-orange-500" />
                </Button>
              )}
              <Button variant="ghost" size="icon" title="Khóa tài khoản">
                <ShieldBan className="w-4 h-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} searchKey="name" />
}
