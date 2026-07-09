import { db } from '@/lib/db'
import { formatPrice, timeAgo } from '@/lib/utils'
import { DealsClient } from './client'

export default async function AdminDealsPage() {
  const deals = await db.deal.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      category: { select: { nameVi: true } },
      discussionCategory: { select: { nameVi: true } }
    }
  })

  // Format data for DataTable
  const formattedDeals = deals.map(deal => ({
    id: deal.id,
    title: deal.title,
    slug: deal.slug,
    price: deal.price ? formatPrice(Number(deal.price)) : 'Miễn phí',
    category: deal.category?.nameVi || deal.discussionCategory?.nameVi || 'Khác',
    author: deal.user.name,
    status: deal.status,
    createdAt: timeAgo(deal.createdAt)
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Deals</h1>
        <p className="text-muted-foreground mt-2">Xem và quản lý toàn bộ deal trên hệ thống.</p>
      </div>

      <div className="glass-strong p-4 rounded-xl border border-border">
        <DealsClient data={formattedDeals} />
      </div>
    </div>
  )
}
