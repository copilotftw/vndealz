'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { routes } from '@/lib/routes'
import { preferencesSchema, notificationSettingsSchema } from '@/lib/validations'

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
  const parsed = preferencesSchema.parse(data)
  const current = await db.user.findUnique({ where: { id: s.user.id }, select: { preferences: true } })
  const existing = (current?.preferences as Record<string, any>) ?? {}
  const merged = { ...existing, ...parsed, widgets: { ...(existing.widgets ?? {}), ...(parsed.widgets ?? {}) } }
  const updated = await db.user.update({ where: { id: s.user.id }, data: { preferences: merged } })
  revalidatePath(routes.settings.preferences, 'layout')
  return updated
}

export async function updateNotificationSettings(data: Record<string, any>) {
  const s = await getSession()
  const parsed = notificationSettingsSchema.parse(data)
  const current = await db.user.findUnique({ where: { id: s.user.id }, select: { notificationSettings: true } })
  const existing = (current?.notificationSettings as Record<string, any>) ?? {}
  const merged: Record<string, any> = { ...existing }
  for (const [key, val] of Object.entries(parsed)) {
    merged[key] = { ...(existing[key] ?? {}), ...(val as Record<string, any>) }
  }
  const updated = await db.user.update({ where: { id: s.user.id }, data: { notificationSettings: merged } })
  revalidatePath(routes.settings.notifications, 'layout')
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
