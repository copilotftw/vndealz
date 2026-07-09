'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function getSession() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s?.user) throw new Error('Unauthorized')
  return s
}

export async function getNotifications(cursor?: string) {
  const s = await getSession()
  const take = 20
  const notifications = await db.notification.findMany({
    where: { userId: s.user.id },
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })
  const hasMore = notifications.length > take
  return {
    notifications: notifications.slice(0, take),
    nextCursor: hasMore ? notifications[take - 1].id : null,
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const s = await auth.api.getSession({ headers: await headers() })
    if (!s?.user) return 0
    return await db.notification.count({ where: { userId: s.user.id, read: false } })
  } catch {
    return 0
  }
}

export async function markAllRead() {
  const s = await getSession()
  await db.notification.updateMany({
    where: { userId: s.user.id, read: false },
    data: { read: true },
  })
}

export async function markRead(id: string) {
  const s = await getSession()
  await db.notification.update({
    where: { id, userId: s.user.id },
    data: { read: true },
  })
}
