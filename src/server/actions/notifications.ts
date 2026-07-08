'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function getSession() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s?.user) throw new Error('Unauthorized')
  return s
}

export async function getUnreadNotificationCount() {
  try {
    const session = await getSession()
    return db.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    })
  } catch {
    return 0
  }
}

export async function getNotifications(limit = 10) {
  const session = await getSession()

  return db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function markNotificationAsRead(id: string) {
  const session = await getSession()

  const notif = await db.notification.findUnique({ where: { id } })
  if (notif?.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  return db.notification.update({
    where: { id },
    data: { read: true },
  })
}

export async function markAllNotificationsAsRead() {
  const session = await getSession()

  return db.notification.updateMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    data: { read: true },
  })
}
