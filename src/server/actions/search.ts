'use server'

import { db } from '@/lib/db'

export async function searchDeals(
  query: string, 
  page = 1, 
  limit = 20,
  options?: {
    sort?: string
    minPrice?: number
    maxPrice?: number
    hideExpired?: boolean
  }
) {
  const skip = (page - 1) * limit
  
  if (!query || query.trim() === '') {
    return { deals: [], total: 0, pages: 0 }
  }

  const whereCondition: any = {
    status: options?.hideExpired ? 'ACTIVE' : { in: ['ACTIVE', 'EXPIRED'] },
    OR: [
      { title: { contains: query } },
      { description: { contains: query } }
    ]
  }

  if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
    whereCondition.price = {}
    if (options.minPrice !== undefined) whereCondition.price.gte = options.minPrice
    if (options.maxPrice !== undefined) whereCondition.price.lte = options.maxPrice
  }

  let orderBy: any = { temperature: 'desc' }
  if (options?.sort === 'new') {
    orderBy = { createdAt: 'desc' }
  }

  const [deals, total] = await Promise.all([
    db.deal.findMany({
      where: whereCondition,
      include: {
        category: true,
        user: { select: { name: true, avatar: true, tier: true } },
        _count: { select: { comments: true } }
      },
      orderBy,
      skip,
      take: limit
    }),
    db.deal.count({
      where: whereCondition
    })
  ])
  const serializedDeals = deals.map(d => ({
    ...d,
    price: d.price ? Number(d.price) : null,
    comparePrice: d.comparePrice ? Number(d.comparePrice) : null,
  }))

  return { deals: serializedDeals, total, pages: Math.ceil(total / limit) }
}

export async function getLiveSearchSuggestions(query: string) {
  if (!query || query.trim().length < 2) {
    return { merchants: [], categories: [], users: [], deals: [] }
  }

  const q = query.trim()

  const [merchants, categories, users, deals] = await Promise.all([
    db.merchant.findMany({
      where: { name: { contains: q } },
      select: { id: true, name: true, slug: true, logo: true },
      take: 2
    }),
    db.category.findMany({
      where: { nameVi: { contains: q } },
      select: { id: true, nameVi: true, slug: true, icon: true },
      take: 2
    }),
    db.user.findMany({
      where: { 
        OR: [
          { name: { contains: q } },
          { username: { contains: q } }
        ]
      },
      select: { id: true, name: true, username: true, avatar: true },
      take: 2
    }),
    db.deal.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { title: { contains: q } },
        ]
      },
      select: { 
        id: true, 
        title: true, 
        slug: true, 
        image: true, 
        price: true, 
        comparePrice: true, 
        temperature: true 
      },
      orderBy: { temperature: 'desc' },
      take: 4
    })
  ])

  // Serialize deals properly
  const serializedDeals = deals.map(d => ({
    ...d,
    price: d.price ? Number(d.price) : null,
    comparePrice: d.comparePrice ? Number(d.comparePrice) : null,
  }))

  return { merchants, categories, users, deals: serializedDeals }
}
