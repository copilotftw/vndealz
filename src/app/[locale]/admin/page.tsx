import { getDashboardStats } from '@/server/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Users, ShoppingBag, AlertTriangle, Megaphone } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Deals</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card className={stats.pendingDeals > 0 ? "border-[var(--color-hot)] bg-[var(--color-hot)]/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Activity className={`h-4 w-4 ${stats.pendingDeals > 0 ? 'text-[var(--color-hot)]' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.pendingDeals > 0 ? 'text-[var(--color-hot)]' : ''}`}>
              {stats.pendingDeals}
            </div>
          </CardContent>
        </Card>
        
        <Card className={stats.pendingReports > 0 ? "border-[var(--color-danger)] bg-[var(--color-danger)]/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Báo cáo</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${stats.pendingReports > 0 ? 'text-[var(--color-danger)]' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.pendingReports > 0 ? 'text-[var(--color-danger)]' : ''}`}>
              {stats.pendingReports}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quảng cáo</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAds}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass-strong p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold mb-4">Hành động nhanh</h2>
          <div className="flex flex-col gap-3">
            <Link href="/admin/moderation" className="inline-flex h-9 items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Duyệt bài ({stats.pendingDeals})
            </Link>
            <Link href="/admin/reports" className="inline-flex h-9 items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Xử lý báo cáo ({stats.pendingReports})
            </Link>
            <Link href="/admin/categories" className="inline-flex h-9 items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">Quản lý danh mục</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
