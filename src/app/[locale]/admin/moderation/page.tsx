import { getPendingDeals } from '@/server/actions/admin'
import { ModerationQueue } from './moderation-queue'

export default async function ModerationPage() {
  const pendingDeals = await getPendingDeals()
  
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Kiểm duyệt Deals</h1>
        <p className="text-muted-foreground mt-2">Duyệt hoặc từ chối các deal do người dùng đăng.</p>
      </div>
      
      <ModerationQueue initialDeals={pendingDeals} />
    </div>
  )
}
