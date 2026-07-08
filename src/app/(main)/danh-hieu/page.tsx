import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Award, Lock } from 'lucide-react'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

export const metadata = {
  title: 'Danh hiệu | VNDealz',
}

export default async function BadgesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  // Fetch all badges
  const allBadges = await db.badge.findMany({
    orderBy: { points: 'asc' }
  })

  // If logged in, fetch user's unlocked badges
  let unlockedBadgeIds = new Set<string>()
  if (session?.user) {
    const userBadges = await db.userBadge.findMany({
      where: { userId: session.user.id }
    })
    unlockedBadgeIds = new Set(userBadges.map(ub => ub.badgeId))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 pb-12 px-4">
      <div className="text-center space-y-4 py-8">
        <Award className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold">Hệ thống Danh hiệu</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Thu thập danh hiệu bằng cách hoạt động tích cực trên VNDealz. 
          Các danh hiệu giúp bạn tăng cấp độ tài khoản (Đồng, Bạc, Vàng, Kim Cương) và nhận được sự tin tưởng từ cộng đồng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBadges.map(badge => {
          const isUnlocked = unlockedBadgeIds.has(badge.id)
          return (
            <div 
              key={badge.id} 
              className={`card p-6 flex flex-col items-center text-center transition-all ${
                isUnlocked ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : 'opacity-70 grayscale hover:grayscale-0'
              }`}
            >
              <div className="mb-4 relative text-primary flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <DynamicIcon name={badge.icon} className="w-8 h-8" />
                {!isUnlocked && (
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 border shadow-sm">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h3 className={`text-lg font-bold ${isUnlocked ? 'text-primary' : 'text-foreground'}`}>
                {badge.nameVi}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {badge.description}
              </p>
              <div className="mt-4 pt-4 border-t w-full text-xs font-semibold text-muted-foreground">
                Phần thưởng: {badge.points} điểm
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
