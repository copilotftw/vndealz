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
  
  if (!name || name.length < 3) throw new Error('Tên phải có ít nhất 3 ký tự')
  
  // check name uniqueness
  if (name !== s.user.name) {
    const existing = await db.user.findFirst({ where: { name } })
    if (existing) throw new Error('Tên đã được sử dụng')
  }

  const updated = await db.user.update({
    where: { id: s.user.id },
    data: {
      name,
      bio,
      avatar: avatar || (s.user as any).avatar,
    }
  })
  
  revalidatePath('/[locale]/cai-dat')
  revalidatePath(`/[locale]/ho-so/${name}`)
  if (s.user.name !== name) revalidatePath(`/[locale]/ho-so/${s.user.name}`)
  
  return updated
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
