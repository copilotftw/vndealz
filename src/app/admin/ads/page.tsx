import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Plus, Megaphone, ExternalLink } from 'lucide-react'
import { AdsClient } from './client'

export default async function AdminAdsPage() {
  const ads = await db.adPlacement.findMany({
    orderBy: { startsAt: 'desc' }
  })

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
        <AdsClient data={ads} />
      </div>
    </div>
  )
}
