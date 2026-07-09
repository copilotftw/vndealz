import { db } from '@/lib/db'
import { sendNotification } from '@/server/services/notification'

export async function evaluateGamification(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        deals: true,
        comments: true,
        userBadges: true,
      }
    })
    
    if (!user) return

    let pointsToAdd = 0
    let points = user.points
    const unlockedBadges = new Set(user.userBadges.map(ub => ub.badgeId))
    const badgesToAward: string[] = []

    // Get all badges to check conditions
    const allBadges = await db.badge.findMany()

    for (const badge of allBadges) {
      if (unlockedBadges.has(badge.id)) continue

      let achieved = false

      switch (badge.condition) {
        case 'FIRST_DEAL':
          achieved = user.deals.length >= 1
          break
        case 'TEN_DEALS':
          achieved = user.deals.length >= 10
          break
        case 'HOT_DEAL_100':
          achieved = user.deals.some(d => d.temperature >= 100)
          break
        case 'TEN_COMMENTS':
          achieved = user.comments.length >= 10
          break
        case 'POINTS_100':
          achieved = points >= 100
          break
        case 'POINTS_500':
          achieved = points >= 500
          break
        case 'POINTS_2000':
          achieved = points >= 2000
          break
      }

      if (achieved) {
        badgesToAward.push(badge.id)
        pointsToAdd += badge.points

        sendNotification({
          userId,
          event: 'badges.newBadge',
          title: 'Huy hiệu mới!',
          body: `Bạn vừa nhận được huy hiệu "${badge.nameVi}"`,
          link: '/danh-hieu',
        }).catch(console.error)
      }
    }

    const newTotalPoints = points + pointsToAdd
    let newTier = user.tier

    if (newTotalPoints >= 2000) newTier = 'DIAMOND'
    else if (newTotalPoints >= 500) newTier = 'GOLD'
    else if (newTotalPoints >= 100) newTier = 'SILVER'

    if (badgesToAward.length > 0 || pointsToAdd > 0 || newTier !== user.tier) {
      await db.user.update({
        where: { id: userId },
        data: {
          points: { increment: pointsToAdd },
          tier: newTier,
          userBadges: {
            create: badgesToAward.map(id => ({ badgeId: id }))
          }
        }
      })

      if (newTier !== user.tier) {
        sendNotification({
          userId,
          event: 'clubPoints.levelUp',
          title: 'Lên cấp!',
          body: `Chúc mừng! Bạn vừa đạt cấp mới`,
          link: '/danh-hieu',
        }).catch(console.error)
      }
    }

  } catch (error) {
    console.error('Gamification Engine Error:', error)
  }
}
