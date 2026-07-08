import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined
}

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
let redisClient: Redis | null = null

try {
  redisClient = globalForRedis.redis ?? new Redis(redisUrl, {
    maxRetriesPerRequest: 0,
    retryStrategy() {
      // Don't retry, just give up if it fails
      return null
    }
  })
  
  // Try to connect, if it fails it will emit 'error'
  if (redisClient) {
    redisClient.on('error', (err) => {
      console.warn('Redis connection error, disabling cache:', err.message)
      redisClient = null
    })
  }
} catch (e) {
  console.warn('Failed to initialize Redis, cache will be disabled.')
  redisClient = null
}

export const redis = redisClient

if (process.env.NODE_ENV !== 'production' && redisClient) {
  globalForRedis.redis = redisClient
}

// Cache helper functions
export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    const data = await redis.get(key)
    if (!data) return null
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`Redis Get Error [${key}]:`, error)
    return null
  }
}

export async function setCached<T>(key: string, data: T, expireSeconds: number = 60) {
  if (!redis) return
  try {
    await redis.set(key, JSON.stringify(data), 'EX', expireSeconds)
  } catch (error) {
    console.error(`Redis Set Error [${key}]:`, error)
  }
}

export async function invalidateCache(pattern: string) {
  if (!redis) return
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error(`Redis Invalidate Error [${pattern}]:`, error)
  }
}
