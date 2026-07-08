// Redis cache wrapper — get/set with TTL, invalidation by tag
// Usage:
//   const deals = await cached('deals:hot:p1', 60, ['deals'], () => getDeals(...))
//   await invalidateTag('deals') // clears all keys tagged with 'deals'

import { redis } from './redis'

const TAG_PREFIX = 'tag:'

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  tags: string[],
  fn: () => Promise<T>,
): Promise<T> {
  if (!redis) return fn()

  // Try cache first
  try {
    const hit = await redis.get(key)
    if (hit) return JSON.parse(hit) as T
  } catch (e) {
    // Ignore error
  }

  // Cache miss — run function
  const data = await fn()

  // Store data + register key under each tag (for invalidation)
  try {
    const pipeline = redis.pipeline()
    pipeline.setex(key, ttlSeconds, JSON.stringify(data))
    for (const tag of tags) {
      pipeline.sadd(`${TAG_PREFIX}${tag}`, key)
      pipeline.expire(`${TAG_PREFIX}${tag}`, ttlSeconds * 2) // tag set lives 2× key TTL
    }
    await pipeline.exec()
  } catch (e) {
    // Ignore error
  }

  return data
}

export async function invalidateTag(tag: string): Promise<number> {
  if (!redis) return 0
  try {
    const keys = await redis.smembers(`${TAG_PREFIX}${tag}`)
    if (keys.length === 0) return 0
    const pipeline = redis.pipeline()
    for (const key of keys) pipeline.del(key)
    pipeline.del(`${TAG_PREFIX}${tag}`)
    await pipeline.exec()
    return keys.length
  } catch (e) {
    return 0
  }
}

export async function invalidateKey(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch (e) {
    // Ignore
  }
}

// ── Predefined cache keys ──

export const CACHE_KEYS = {
  categoryTree: 'categories:tree',
  siteConfig: 'site:config',
  dealFeed: (sort: string, type: string, page: number) => `deals:${sort}:${type}:p${page}`,
  dealDetail: (slug: string) => `deal:${slug}`,
  dealHot: (page: number) => `deals:hot:p${page}`,
  dealNew: (page: number) => `deals:new:p${page}`,
  userProfile: (username: string) => `user:${username}`,
  searchResults: (q: string, page: number) => `search:${q}:p${page}`,
  dashboardStats: 'admin:stats',
  trendingDeals: 'deals:trending:sidebar',
} as const

export const CACHE_TTL = {
  categoryTree: 3600,     // 1 hour
  siteConfig: 86400,      // 24 hours (until manual invalidation)
  dealFeed: 60,           // 1 minute
  dealDetail: 300,        // 5 minutes
  userProfile: 300,       // 5 minutes
  searchResults: 30,      // 30 seconds
  dashboardStats: 120,    // 2 minutes
  trendingDeals: 120,     // 2 minutes
} as const
