import { db } from '@/lib/db'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Edit, Trash2, Plus } from 'lucide-react'

export default async function AdminAffiliatesPage() {
  const configs = await db.affiliateConfig.findMany({
    orderBy: { merchant: 'asc' }
  })

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
          <Button variant="ghost" size="icon-sm" title="Sửa">
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Xóa">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cấu hình Affiliate</h1>
          <p className="text-muted-foreground mt-2">Tự động chèn mã Affiliate vào link của người dùng đăng.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Thêm đối tác
        </Button>
      </div>

      <div className="glass-strong p-4 rounded-xl border border-border">
        <DataTable columns={columns} data={configs} searchKey="merchant" />
      </div>
    </div>
  )
}
