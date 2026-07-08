import { db } from '@/lib/db'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Edit, Trash2, Plus, Megaphone } from 'lucide-react'
import Link from 'next/link'

export default async function AdminAdsPage() {
  const ads = await db.adPlacement.findMany({
    orderBy: { startsAt: 'desc' }
  })

  const columns = [
    {
      accessorKey: 'title',
      header: 'Tiêu đề',
      cell: ({ row }: any) => <span className="font-semibold">{row.original.title || 'Không có tiêu đề'}</span>
    },
    {
      accessorKey: 'slot',
      header: 'Vị trí (Slot)',
      cell: ({ row }: any) => <Badge variant="outline">{row.original.slot}</Badge>
    },
    {
      accessorKey: 'impressions',
      header: 'Lượt hiển thị',
      cell: ({ row }: any) => <span>{row.original.impressions.toLocaleString()}</span>
    },
    {
      accessorKey: 'clicks',
      header: 'Lượt click',
      cell: ({ row }: any) => <span>{row.original.clicks.toLocaleString()}</span>
    },
    {
      accessorKey: 'active',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const active = row.original.active
        return <Badge variant={active ? 'default' : 'secondary'}>{active ? 'Đang chạy' : 'Đã dừng'}</Badge>
      }
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 justify-end">
          <Link href={row.original.targetUrl} target="_blank" title="Xem link đích">
            <Button variant="ghost" size="icon-sm">
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </Button>
          </Link>
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
          <h1 className="text-3xl font-bold">Quản lý Quảng cáo</h1>
          <p className="text-muted-foreground mt-2">Quản lý banner quảng cáo hiển thị trên trang web.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Thêm quảng cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-strong p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tổng hiển thị</p>
            <p className="text-2xl font-bold">{ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-strong p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tổng click</p>
            <p className="text-2xl font-bold">{ads.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-strong p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Đang chạy</p>
            <p className="text-2xl font-bold">{ads.filter(a => a.active).length}</p>
          </div>
        </div>
      </div>

      <div className="glass-strong p-4 rounded-xl border border-border">
        <DataTable columns={columns} data={ads} searchKey="title" />
      </div>
    </div>
  )
}
