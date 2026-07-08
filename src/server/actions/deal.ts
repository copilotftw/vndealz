'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { dealSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { calculateTemperature } from '@/lib/temperature'
import { revalidatePath } from 'next/cache'
import { getCategoryWithDescendants } from './category'

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
  return deal
}

export async function voteDeal(dealId: string, value: 1 | -1) {
  const s = await getSession()
  
  // Upsert vote
  await db.vote.upsert({
    where: { userId_dealId: { userId: s.user.id, dealId } },
    update: { value },
    create: { userId: s.user.id, dealId, value }
  })

  // Recalculate temp
  const votes = await db.vote.findMany({ where: { dealId } })
  const deal = await db.deal.findUnique({ where: { id: dealId } })
  
  if (deal) {
    const temp = calculateTemperature(votes)
    await db.deal.update({ where: { id: dealId }, data: { temperature: temp } })
    
    // award points if > 100
    if (temp >= 100) {
      await db.user.update({
        where: { id: deal.userId },
        data: { points: { increment: 10 } }
      })
    }
  }
  await invalidateCache('deals:*')
  revalidatePath('/[locale]/deal/[slug]')
  revalidatePath('/[locale]')
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
  
  // Create unique cache key for this query
  const cacheKey = `deals:${opts.sort || 'hot'}:${opts.type || 'all'}:${opts.categorySlug || 'all'}:${page}:${limit}`
  const cachedData = await getCached<{deals: any[], total: number, pages: number}>(cacheKey)
  if (cachedData) return cachedData

  let where: any = { status: 'ACTIVE' }
  
  if (opts.type) where.type = opts.type
  if (opts.categorySlug) {
    const catIds = await getCategoryWithDescendants(opts.categorySlug)
    if (catIds.length) where.categoryId = { in: catIds }
  }

  let orderBy: any = { temperature: 'desc' }
  if (opts.sort === 'new') orderBy = { createdAt: 'desc' }
  else if (opts.sort === 'hot') orderBy = { temperature: 'desc' }
  
  const [deals, total] = await Promise.all([
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

  const response = { deals, total, pages: Math.ceil(total / limit) }
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
