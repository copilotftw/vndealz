'use server'

import { db } from '@/lib/db'

export async function searchDeals(query: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit
  
  if (!query || query.trim() === '') {
    return { deals: [], total: 0, pages: 0 }
  }

  // Fallback to standard contains query if FULLTEXT is not indexed yet
  // In production with MariaDB FULLTEXT index on (title, description), use:
  // const deals = await db.$queryRaw`SELECT * FROM Deal WHERE MATCH(title, description) AGAINST(${query} IN BOOLEAN MODE) AND status='ACTIVE' LIMIT ${limit} OFFSET ${skip}`
  
  const [deals, total] = await Promise.all([
    db.deal.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ]
      },
      include: {
        category: true,
        user: { select: { name: true, avatar: true, tier: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { temperature: 'desc' },
      skip,
      take: limit
    }),
    db.deal.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ]
      }
    })
  ])
  
  return { deals, total, pages: Math.ceil(total / limit) }
}
