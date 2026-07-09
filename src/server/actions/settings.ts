'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSession() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s?.user) throw new Error('Unauthorized')
  return s
}

export async function getUserSettings() {
  const s = await getSession()
  const user = await db.user.findUnique({
    where: { id: s.user.id },
    select: { preferences: true, notificationSettings: true }
  })
  
  return {
    preferences: user?.preferences as Record<string, any> || {},
    notificationSettings: user?.notificationSettings as Record<string, any> || {}
  }
}

export async function getSafeUserSettings() {
  try {
    return await getUserSettings()
  } catch (e) {
    return { preferences: {}, notificationSettings: {} }
  }
}

export async function updatePreferences(data: Record<string, any>) {
  const s = await getSession()
  
  const updated = await db.user.update({
    where: { id: s.user.id },
    data: {
      preferences: data
    }
  })
  
  revalidatePath('/[locale]/cai-dat/tuy-chon', 'layout')
  return updated
}

export async function updateNotificationSettings(data: Record<string, any>) {
  const s = await getSession()
  
  const updated = await db.user.update({
    where: { id: s.user.id },
    data: {
      notificationSettings: data
    }
  })
  
  revalidatePath('/[locale]/cai-dat/thong-bao', 'layout')
  return updated
}

export async function getConnectedAccounts() {
  const s = await getSession()
  
  const accounts = await db.account.findMany({
    where: { userId: s.user.id },
    select: { providerId: true }
  })
  
  return accounts.map(a => a.providerId)
}

export async function getFollowsAndMutes() {
  const s = await getSession()
  
  const following = await db.follow.findMany({
    where: { followerId: s.user.id },
    include: { following: { select: { name: true, avatar: true } } }
  })
  
  const mutes = await db.mutedUser.findMany({
    where: { muterId: s.user.id },
    include: { muted: { select: { name: true, avatar: true } } }
  })
  
  return { following, mutes }
}
