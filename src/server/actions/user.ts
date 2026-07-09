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

export async function updateProfile(formData: FormData) {
  const s = await getSession()
  
  const name = formData.get('name') as string
  const bio = formData.get('bio') as string | null
  const avatar = formData.get('avatar') as string | null
  const email = formData.get('email') as string | null
  
  if (!name || name.length < 3) throw new Error('Name must be at least 3 characters')
  if (!/^[a-zA-Z0-9_]+$/.test(name)) throw new Error('Username can only contain letters, numbers, and underscores')
  
  // check name uniqueness
  if (name !== s.user.name) {
    const existing = await db.user.findFirst({ where: { name } })
    if (existing) throw new Error('Name is already taken')
  }

  if (email && email !== s.user.email) {
    const existing = await db.user.findFirst({ where: { email } })
    if (existing) throw new Error('Email is already in use')
  }

  const updated = await db.user.update({
    where: { id: s.user.id },
    data: {
      name,
      bio,
      avatar: avatar || (s.user as any).avatar,
      ...(email && { email })
    }
  })
  
  revalidatePath('/[locale]/cai-dat', 'layout')
  revalidatePath(`/[locale]/ho-so/${name}`)
  if (s.user.name !== name) revalidatePath(`/[locale]/ho-so/${s.user.name}`)
  
  return updated
}

export async function deleteAccount() {
  const s = await getSession()
  
  await db.user.delete({
    where: { id: s.user.id }
  })
  
  // Session is deleted via cascading relations, but we will redirect from client
}

export async function checkHasPassword() {
  const s = await getSession()
  const account = await db.account.findFirst({
    where: { 
      userId: s.user.id,
      providerId: 'credential' 
    }
  })
  return !!account
}

export async function toggleBookmark(dealId: string) {
  const s = await getSession()
  
  const existing = await db.dealCollectionItem.findFirst({
    where: { 
      dealId,
      collection: { userId: s.user.id }
    }
  })
  
  if (existing) {
    await db.dealCollectionItem.delete({ where: { id: existing.id } })
  } else {
    // get or create default collection
    let collection = await db.dealCollection.findFirst({
      where: { userId: s.user.id, slug: 'da-luu' }
    })
    
    if (!collection) {
      collection = await db.dealCollection.create({
        data: { userId: s.user.id, nameVi: 'Đã lưu', nameEn: 'Saved', slug: 'da-luu' }
      })
    }
    
    await db.dealCollectionItem.create({
      data: { dealId, collectionId: collection.id }
    })
  }
  
  revalidatePath('/[locale]/deal/[slug]')
  revalidatePath('/[locale]/ho-so/[username]')
}

export async function getUserProfile(username: string) {
  const user = await db.user.findFirst({
    where: { name: username },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      tier: true,
      points: true,
      createdAt: true,
      _count: { select: { deals: true, comments: true } },
      userBadges: {
        include: { badge: true }
      }
    }
  })
  
  if (!user) return null
  
  const deals = await db.deal.findMany({
    where: { userId: user.id },
    include: {
      category: true,
      user: { select: { name: true, avatar: true, tier: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
  
  return { ...user, recentDeals: deals }
}

export async function getSavedDeals(username: string) {
  const user = await db.user.findFirst({ where: { name: username } })
  if (!user) return []
  
  const bookmarks = await db.bookmark.findMany({
    where: { userId: user.id },
    include: {
      deal: {
        include: {
          category: true,
          user: { select: { name: true, avatar: true, tier: true } },
          _count: { select: { comments: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return bookmarks.map(b => b.deal)
}

export async function checkIsFollowing(targetUsername: string) {
  try {
    const s = await auth.api.getSession({ headers: await headers() })
    if (!s?.user) return false
    
    const targetUser = await db.user.findFirst({ where: { name: targetUsername } })
    if (!targetUser) return false

    const follow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: s.user.id,
          followingId: targetUser.id
        }
      }
    })
    return !!follow
  } catch (e) {
    return false
  }
}

export async function toggleFollowUser(targetUsername: string) {
  const s = await getSession()
  
  const targetUser = await db.user.findFirst({ where: { name: targetUsername } })
  if (!targetUser) throw new Error('User not found')
  if (targetUser.id === s.user.id) throw new Error('Cannot follow yourself')

  const targetPrefs = targetUser.preferences as Record<string, any> || {}
  if (targetPrefs.allowOthersToFollow === false) {
    throw new Error('This user does not allow followers')
  }

  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: s.user.id,
        followingId: targetUser.id
      }
    }
  })

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } })
  } else {
    await db.follow.create({
      data: {
        followerId: s.user.id,
        followingId: targetUser.id
      }
    })
  }

  revalidatePath('/[locale]/ho-so/[username]', 'layout')
  return !existing
}

export async function checkIsMuted(targetUsername: string) {
  try {
    const s = await auth.api.getSession({ headers: await headers() })
    if (!s?.user) return false
    
    const targetUser = await db.user.findFirst({ where: { name: targetUsername } })
    if (!targetUser) return false

    const mute = await db.mutedUser.findUnique({
      where: {
        muterId_mutedId: {
          muterId: s.user.id,
          mutedId: targetUser.id
        }
      }
    })
    return !!mute
  } catch (e) {
    return false
  }
}

export async function getMutedUserIds(): Promise<string[]> {
  try {
    const s = await auth.api.getSession({ headers: await headers() })
    if (!s?.user) return []
    const mutes = await db.mutedUser.findMany({ where: { muterId: s.user.id } })
    return mutes.map(m => m.mutedId)
  } catch (e) {
    return []
  }
}

export async function toggleMuteUser(targetUsername: string) {
  const s = await getSession()
  
  const targetUser = await db.user.findFirst({ where: { name: targetUsername } })
  if (!targetUser) throw new Error('User not found')
  if (targetUser.id === s.user.id) throw new Error('Cannot mute yourself')

  const existing = await db.mutedUser.findUnique({
    where: {
      muterId_mutedId: {
        muterId: s.user.id,
        mutedId: targetUser.id
      }
    }
  })

  if (existing) {
    await db.mutedUser.delete({ where: { id: existing.id } })
  } else {
    await db.mutedUser.create({
      data: {
        muterId: s.user.id,
        mutedId: targetUser.id
      }
    })
  }

  // Revalidate feeds to apply mute filters
  revalidatePath('/[locale]', 'layout')
  return !existing
}
