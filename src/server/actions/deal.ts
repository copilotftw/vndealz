'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { dealSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { calculateTemperature } from '@/lib/temperature'
import { revalidatePath } from 'next/cache'
import { getCached, setCached, invalidateCache } from '@/lib/redis'
import { getCategoryWithDescendants } from './category'
import { getMutedUserIds } from './user'
import { getSafeUserSettings } from './settings'
import { matchDealWithAlerts } from '@/lib/alerts/matching-engine'
import { evaluateGamification } from '@/lib/gamification/engine'
import { sendNotification } from '@/server/services/notification'
import { routes } from '@/lib/routes'
import type { DealCardData } from '@/components/deal/deal-card'

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
  revalidatePath(routes.admin.moderation)
  
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

    // Notify deal owner of rating (fire and forget)
    if (deal.userId !== s.user.id) {
      sendNotification({
        userId: deal.userId,
        event: 'myDeals.dealRated',
        title: 'Deal của bạn được vote',
        body: `${s.user.name || 'Ai đó'} đã vote deal "${deal.title}"`,
        link: `/deal/${deal.slug}`,
      }).catch(console.error)
    }

    // Notify deal owner when deal goes hot for the first time (temp >= 100)
    const wasAlreadyHot = deal.temperature >= 100
    if (temp >= 100 && !wasAlreadyHot) {
      sendNotification({
        userId: deal.userId,
        event: 'myDeals.dealHot',
        title: 'Deal của bạn đang nóng! 🔥',
        body: `"${deal.title}" đã đạt ${temp}° và đang hot`,
        link: `/deal/${deal.slug}`,
      }).catch(console.error)
    }
  }
  await invalidateCache('deals:*')
  revalidatePath(routes.deal('[slug]'))
  revalidatePath(routes.home, 'layout')
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

export async function getDeals(opts: {
  sort?: 'hot' | 'new' | 'trending'
  type?: string
  categorySlug?: string
  merchant?: string
  page?: number
  limit?: number
  priceMin?: number
  priceMax?: number
  tempFilter?: 'hot' | 'warm' | 'cold'
  // Persona data flags — skip heavy TEXT columns the active layout never renders.
  data?: { needsImage?: boolean; needsDescription?: boolean; needsPriceHistory?: boolean }
}) {
  const page = opts.page || 1
  const limit = opts.limit || 20
  const skip = (page - 1) * limit

  // Default to fetching everything (mydealz-equivalent) when no flags passed.
  const needsImage = opts.data?.needsImage ?? true
  const needsDescription = opts.data?.needsDescription ?? true
  const needsPriceHistory = opts.data?.needsPriceHistory ?? false

  // Prisma select: base scalars always, heavy TEXT columns + relations behind flags.
  const dealSelect: any = {
    id: true, slug: true, title: true, url: true,
    price: true, comparePrice: true, couponCode: true, merchant: true,
    temperature: true, status: true, type: true, sponsored: true,
    isNsfw: true, createdAt: true, categoryId: true,
    category: true,
    user: { select: { id: true, name: true, avatar: true, tier: true } },
    _count: { select: { comments: true } },
  }
  if (needsImage) { dealSelect.image = true; dealSelect.blurHash = true }
  if (needsDescription) dealSelect.description = true
  if (needsPriceHistory) {
    dealSelect.priceHistory = { orderBy: { createdAt: 'asc' }, select: { price: true, createdAt: true } }
  }

  const [mutedUserIds, settings] = await Promise.all([getMutedUserIds(), getSafeUserSettings()])
  const mutedKey = mutedUserIds.length > 0 ? `muted:${mutedUserIds.join(',')}` : 'nomute'
  const showNsfw = (settings.preferences as Record<string, any>)?.showNsfw ?? false
  const nsfwKey = showNsfw ? 'nsfw' : 'sfw'

  // Data-shape signature — prevents a lean persona's payload poisoning a full persona's cache.
  const shapeKey = `img${needsImage ? 1 : 0}desc${needsDescription ? 1 : 0}ph${needsPriceHistory ? 1 : 0}`

  const priceKey = opts.priceMin !== undefined || opts.priceMax !== undefined
    ? `${opts.priceMin ?? ''}-${opts.priceMax ?? ''}`
    : 'any'
  const cacheKey = `deals:${opts.sort || 'hot'}:${opts.type || 'all'}:${opts.categorySlug || 'all'}:${opts.merchant || 'all'}:${page}:${limit}:${mutedKey}:${nsfwKey}:${shapeKey}:p${priceKey}:t${opts.tempFilter || 'any'}`
  const cachedData = await getCached<{deals: DealCardData[], total: number, pages: number}>(cacheKey)
  if (cachedData) return cachedData

  let where: any = { status: 'ACTIVE' }
  
  if (opts.type) where.type = opts.type
  if (opts.merchant) {
    // Exact case-insensitive match is not natively supported out-of-the-box in Prisma without string functions,
    // so we use contains which acts case-insensitively in MySQL.
    where.merchant = { contains: opts.merchant }
  }
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

  if (opts.priceMin !== undefined || opts.priceMax !== undefined) {
    where.price = {}
    if (opts.priceMin !== undefined) where.price.gte = opts.priceMin
    if (opts.priceMax !== undefined) where.price.lte = opts.priceMax
  }

  if (opts.tempFilter === 'hot') where.temperature = { gte: 100 }
  else if (opts.tempFilter === 'warm') where.temperature = { gte: 0, lt: 100 }
  else if (opts.tempFilter === 'cold') where.temperature = { lt: 0 }

  let finalDeals: any[] = []
  let totalCount = 0

  if (opts.sort === 'trending') {
    // For trending, fetch recent 200 active deals, sort them using HackerNews algorithm
    const allRecent = await db.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: dealSelect,
    }) as unknown as DealCardData[]

    // HN Ranking: Points / (Age_Hours + 2)^1.8
    const now = Date.now()
    allRecent.sort((a: any, b: any) => {
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
        select: dealSelect,
      }),
      db.deal.count({ where })
    ])
    finalDeals = fetchedDeals as unknown as DealCardData[]
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

export async function getSavedDealIds(dealIds: string[]): Promise<string[]> {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s?.user || dealIds.length === 0) return []
  const bookmarks = await db.bookmark.findMany({
    where: { userId: s.user.id, dealId: { in: dealIds } },
    select: { dealId: true },
  })
  return bookmarks.map(b => b.dealId)
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
  revalidatePath(routes.deal('[slug]'))
}
