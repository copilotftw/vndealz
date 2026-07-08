import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AffiliatesClient } from './client'

export default async function AdminAffiliatesPage() {
  const configs = await db.affiliateConfig.findMany({
    orderBy: { merchant: 'asc' }
  })

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
        <AffiliatesClient data={configs} />
      </div>
    </div>
  )
}
