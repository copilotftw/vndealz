import { db as prisma } from '@/lib/db'
import { BADGE_CONFIG, BadgeConfig } from './config'
import { unstable_cache } from 'next/cache'

export interface UserBadgeProgress {
  badgeId: string
  isUnlocked: boolean
  progress: number
  unlockedAt?: Date
  lockedText?: string
}

async function calculateBadgesUncached(userId: string): Promise<UserBadgeProgress[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatar: true,
      bio: true,
      createdAt: true
    }
  })

  if (!user) return []

  // 1. Comment Metrics
  const totalComments = await prisma.comment.count({ where: { userId } })
  
  // 2. Deal Metrics
  const totalDeals = await prisma.deal.count({ where: { userId } })
  const topDeal = await prisma.deal.findFirst({
    where: { userId },
    orderBy: { temperature: 'desc' },
    select: { temperature: true }
  })
  const maxTemperature = topDeal?.temperature || 0

  // 3. Max comments on a single deal
  const topCommentedDeals = await prisma.comment.groupBy({
    by: ['dealId'],
    where: { userId, dealId: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 1
  })
  const maxDealComments = topCommentedDeals[0]?._count.id || 0

  // 4. Votes cast
  const totalVotes = await prisma.vote.count({ where: { userId } })

  // 5. Social Profile
  const hasAvatarAndBio = !!(user.avatar && user.bio)

  // Map configs to progress
  const badges: UserBadgeProgress[] = BADGE_CONFIG.map(config => {
    let progress = 0

    switch (config.type) {
      case 'comments':
        progress = totalComments
        break
      case 'deals':
        progress = totalDeals
        break
      case 'max_temp':
        progress = maxTemperature
        break
      case 'votes':
        progress = totalVotes
        break
      case 'max_deal_comments':
        progress = maxDealComments
        break
      case 'social':
        progress = hasAvatarAndBio ? 1 : 0
        break
    }

    const isUnlocked = progress >= config.threshold

    return {
      badgeId: config.id,
      isUnlocked,
      progress: Math.min(progress, config.threshold)
    }
  })

  // Second pass: handle dependencies (GESPERRT)
  const finalBadges = badges.map(badge => {
    const config = BADGE_CONFIG.find(c => c.id === badge.badgeId)
    if (config?.dependsOn) {
      const depBadge = badges.find(b => b.badgeId === config.dependsOn)
      if (depBadge && !depBadge.isUnlocked) {
        return {
          ...badge,
          isUnlocked: false,
          lockedText: 'GESPERRT'
        }
      }
    }
    return badge
  })

  return finalBadges
}

export const getUserBadges = unstable_cache(
  async (userId: string) => calculateBadgesUncached(userId),
  ['user-badges-v2'],
  { revalidate: 3600, tags: ['user-badges-v2'] }
)
