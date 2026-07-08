import { db } from '@/lib/db'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, timeAgo } from '@/lib/utils'
import { Edit, Trash, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDealsPage() {
  const deals = await db.deal.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      category: { select: { nameVi: true } }
    }
  })

  // Format data for DataTable
  const formattedDeals = deals.map(deal => ({
    id: deal.id,
    title: deal.title,
    slug: deal.slug,
    price: deal.price ? formatPrice(Number(deal.price)) : 'Miễn phí',
    category: deal.category.nameVi,
    author: deal.user.name,
    status: deal.status,
    createdAt: timeAgo(deal.createdAt)
  }))

  const columns = [
    {
      accessorKey: 'title',
      header: 'Tiêu đề',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 max-w-[300px]">
          <span className="truncate font-medium" title={row.original.title}>
            {row.original.title}
          </span>
          <Link href={`/vi/deal/${row.original.slug}`} target="_blank">
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
          <Button variant="ghost" size="icon-sm">
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Deals</h1>
        <p className="text-muted-foreground mt-2">Xem và quản lý toàn bộ deal trên hệ thống.</p>
      </div>

      <div className="glass-strong p-4 rounded-xl border border-border">
        <DataTable columns={columns} data={formattedDeals} searchKey="title" />
      </div>
    </div>
  )
}
