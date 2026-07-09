'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { dealSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { calculateTemperature } from '@/lib/temperature'
import { revalidatePath } from 'next/cache'
import { getCategoryWithDescendants } from './category'
import { getMutedUserIds } from './user'
import { getSafeUserSettings } from './settings'
import { matchDealWithAlerts } from '@/lib/alerts/matching-engine'
import { evaluateGamification } from '@/lib/gamification/engine'

async function getSession() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s?.user) throw new Error('Unauthorized')
  return s
}

export async function createDeal(formData: FormData) {
  const s = await getSession()
  
  const rawData = {
    title: formData.get('title') as string,
    url: formData.get('url') as string,
    description: formData.get('description') as string,
    price: formData.get('price') ? Number(formData.get('price')) : null,
    comparePrice: formData.get('comparePrice') ? Number(formData.get('comparePrice')) : null,
    couponCode: formData.get('couponCode') as string | null,
    merchant: formData.get('merchant') as string | null,
    categoryId: formData.get('categoryId') as string,
    type: formData.get('type') as string,
    image: formData.get('image') as string | null,
  }

  const data = dealSchema.parse(rawData)

  // check duplicate URL
  const existing = await db.deal.findFirst({ where: { url: data.url } })
  if (existing) throw new Error('URL already submitted')

  const slug = generateSlug(data.title) + '-' + Date.now().toString(36)

  const deal = await db.deal.create({
    data: {
      ...data,
      slug,
      userId: s.user.id,
      status: 'PENDING',
    }
  })

  await invalidateCache('deals:*')
  revalidatePath('/[locale]/admin/moderation')
  
  // Ponytail: fire and forget gamification check
  evaluateGamification(s.user.id).catch(console.error)
  
  return deal
}

export async function voteDeal(dealId: string, value: 1 | -1) {
  const s = await getSession()
  
  const existingVote = await db.vote.findUnique({
    where: { userId_dealId: { userId: s.user.id, dealId } }
  })

  if (existingVote && existingVote.value === value) {
    // Toggle off
    await db.vote.delete({
      where: { userId_dealId: { userId: s.user.id, dealId } }
    })
  } else {
    // Upsert vote
    await db.vote.upsert({
      where: { userId_dealId: { userId: s.user.id, dealId } },
      update: { value },
      create: { userId: s.user.id, dealId, value }
    })
  }

  // Recalculate temp
  const votes = await db.vote.findMany({ where: { dealId } })
  const deal = await db.deal.findUnique({ where: { id: dealId } })
  
  if (deal) {
    const temp = calculateTemperature(votes)
    await db.deal.update({ where: { id: dealId }, data: { temperature: temp } })
    
    if (temp >= 100) {
      await db.user.update({
        where: { id: deal.userId },
        data: { points: { increment: 10 } }
      })
    }
    
    // Check if new temperature triggers any alerts
    matchDealWithAlerts(dealId).catch(console.error)
    
    // Evaluate Gamification for the deal creator
    evaluateGamification(deal.userId).catch(console.error)
  }
  await invalidateCache('deals:*')
  revalidatePath('/[locale]/deal/[slug]')
  revalidatePath('/[locale]', 'layout')
}

export async function toggleSaveDeal(dealId: string) {
  const s = await getSession()
  
  const existingBookmark = await db.bookmark.findUnique({
    where: {
      userId_dealId: {
        userId: s.user.id,
        dealId
      }
    }
  })

  if (existingBookmark) {
    await db.bookmark.delete({
      where: {
        userId_dealId: {
          userId: s.user.id,
          dealId
        }
      }
    })
    return { saved: false }
  } else {
    await db.bookmark.create({
      data: {
        userId: s.user.id,
        dealId
      }
    })
    return { saved: true }
  }
}

import { getCached, setCached, invalidateCache } from '@/lib/redis'

export async function getDeals(opts: {
  sort?: 'hot' | 'new' | 'trending'
  type?: string
  categorySlug?: string
  page?: number
  limit?: number
}) {
  const page = opts.page || 1
  const limit = opts.limit || 20
  const skip = (page - 1) * limit
  
  const mutedUserIds = await getMutedUserIds()
  const mutedKey = mutedUserIds.length > 0 ? `muted:${mutedUserIds.join(',')}` : 'nomute'
  
  const settings = await getSafeUserSettings()
  const showNsfw = settings.preferences?.showNsfw ?? false
  const nsfwKey = showNsfw ? 'nsfw' : 'sfw'
  
  // Create unique cache key for this query
  const cacheKey = `deals:${opts.sort || 'hot'}:${opts.type || 'all'}:${opts.categorySlug || 'all'}:${page}:${limit}:${mutedKey}:${nsfwKey}`
  const cachedData = await getCached<{deals: any[], total: number, pages: number}>(cacheKey)
  if (cachedData) return cachedData

  let where: any = { status: 'ACTIVE' }
  
  if (opts.type) where.type = opts.type
  if (opts.categorySlug) {
    const catIds = await getCategoryWithDescendants(opts.categorySlug)
    if (catIds.length) where.categoryId = { in: catIds }
  }
  if (mutedUserIds.length > 0) {
    where.userId = { notIn: mutedUserIds }
  }

  if (!showNsfw) {
    where.isNsfw = false
  }

  let finalDeals: any[] = []
  let totalCount = 0

  if (opts.sort === 'trending') {
    // For trending, fetch recent 200 active deals, sort them using HackerNews algorithm
    const allRecent = await db.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        category: true,
        user: { select: { id: true, name: true, avatar: true, tier: true } },
        _count: { select: { comments: true } }
      }
    })
    
    // HN Ranking: Points / (Age_Hours + 2)^1.8
    const now = Date.now()
    allRecent.sort((a, b) => {
      const pointsA = Math.max(a.temperature / 10, 0)
      const pointsB = Math.max(b.temperature / 10, 0)
      const hoursA = (now - a.createdAt.getTime()) / 3600000
      const hoursB = (now - b.createdAt.getTime()) / 3600000
      
      const scoreA = pointsA / Math.pow(hoursA + 2, 1.8)
      const scoreB = pointsB / Math.pow(hoursB + 2, 1.8)
      
      return scoreB - scoreA
    })
    
    finalDeals = allRecent.slice(skip, skip + limit)
    totalCount = Math.min(200, await db.deal.count({ where }))
  } else {
    let orderBy: any = { temperature: 'desc' }
    if (opts.sort === 'new') orderBy = { createdAt: 'desc' }
    else if (opts.sort === 'hot') orderBy = { temperature: 'desc' }
    
    const [fetchedDeals, count] = await Promise.all([
      db.deal.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          user: { select: { id: true, name: true, avatar: true, tier: true } },
          _count: { select: { comments: true } }
        }
      }),
      db.deal.count({ where })
    ])
    finalDeals = fetchedDeals
    totalCount = count
  }

  const serializedDeals = finalDeals.map(d => ({
    ...d,
    price: d.price ? Number(d.price) : null,
    comparePrice: d.comparePrice ? Number(d.comparePrice) : null,
  }))

  const response = { deals: serializedDeals, total: totalCount, pages: Math.ceil(totalCount / limit) }
  // Cache for 60 seconds
  await setCached(cacheKey, response, 60)
  return response
}

export async function expireDeal(dealId: string) {
  const s = await getSession()
  const deal = await db.deal.findUnique({ where: { id: dealId } })
  if (!deal) throw new Error('Not found')
  if (deal.userId !== s.user.id && !['ADMIN', 'MODERATOR'].includes((s.user as any).role)) {
    throw new Error('Forbidden')
  }
  await db.deal.update({ where: { id: dealId }, data: { status: 'EXPIRED' } })
  await invalidateCache('deals:*')
  revalidatePath('/[locale]/deal/[slug]')
}
