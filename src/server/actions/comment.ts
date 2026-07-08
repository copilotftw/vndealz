'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { commentSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { evaluateGamification } from '@/lib/gamification/engine'

async function getSession() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s?.user) throw new Error('Unauthorized')
  return s
}

export async function createComment(input: { content: string; dealId?: string; parentId?: string }) {
  const s = await getSession()
  const data = commentSchema.parse(input)
  
  const comment = await db.comment.create({
    data: {
      content: data.content,
      userId: s.user.id,
      dealId: data.dealId,
      parentId: data.parentId,
    }
  })
  
  // Award 1 point for commenting
  await db.user.update({
    where: { id: s.user.id },
    data: { points: { increment: 1 } }
  })

  // Hook gamification
  evaluateGamification(s.user.id).catch(console.error)
  
  if (data.dealId) {
    const deal = await db.deal.findUnique({ where: { id: data.dealId } })
    if (deal) revalidatePath(`/[locale]/deal/${deal.slug}`)
  }
  
  return comment
}

export async function getComments(dealId: string) {
  // Fetch comments and build tree
  const comments = await db.comment.findMany({
    where: { dealId },
    include: {
      user: { select: { id: true, name: true, avatar: true, tier: true } }
    },
    orderBy: { createdAt: 'asc' }
  })
  
  const map = new Map()
  const roots: any[] = []
  
  comments.forEach(c => map.set(c.id, { ...c, children: [] }))
  
  comments.forEach(c => {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId).children.push(map.get(c.id))
    } else {
      roots.push(map.get(c.id))
    }
  })
  
  return roots
}

export async function reactToComment(commentId: string) {
  const s = await getSession()
  
  // Simplified logic for helpful toggle
  const comment = await db.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw new Error('Not found')
  
  // Update count and award point to author if > 3 (simplified)
  await db.comment.update({
    where: { id: commentId },
    data: { helpfulCount: { increment: 1 } }
  })
  
  if (comment.helpfulCount + 1 >= 3) {
    await db.user.update({
      where: { id: comment.userId },
      data: { points: { increment: 5 } }
    })
  }
  
  if (comment.dealId) {
    const deal = await db.deal.findUnique({ where: { id: comment.dealId } })
    if (deal) revalidatePath(`/[locale]/deal/${deal.slug}`)
  }
}

export async function deleteComment(commentId: string) {
  const s = await getSession()
  const comment = await db.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw new Error('Not found')
  
  if (comment.userId !== s.user.id && !['ADMIN', 'MODERATOR'].includes((s.user as any).role)) {
    throw new Error('Forbidden')
  }
  
  // Soft delete
  await db.comment.update({
    where: { id: commentId },
    data: { content: '[Đã bị xóa]', userId: 'DELETED' }
  })
  
  if (comment.dealId) {
    const deal = await db.deal.findUnique({ where: { id: comment.dealId } })
    if (deal) revalidatePath(`/[locale]/deal/${deal.slug}`)
  }
}
