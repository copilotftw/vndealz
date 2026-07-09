'use server'

import { db } from '@/lib/db'
import { getMutedUserIds } from './user'

export async function getDiscussionCategories() {
  const categories = await db.discussionCategory.findMany({
    include: {
      _count: {
        select: { deals: true }
      }
    }
  })
  return categories
}

export async function getRecentDiscussions() {
  const mutedUserIds = await getMutedUserIds()
  
  const discussions = await db.deal.findMany({
    where: { 
      type: 'DISCUSSION', 
      status: 'ACTIVE',
      ...(mutedUserIds.length > 0 && { userId: { notIn: mutedUserIds } })
    },
    include: {
      user: {
        select: { name: true, avatar: true }
      },
      discussionCategory: {
        select: { nameVi: true, nameEn: true }
      },
      _count: {
        select: { comments: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
  
  return discussions
}

export async function getDiscussionBySlug(slug: string) {
  const discussion = await db.deal.findUnique({
    where: { slug, type: 'DISCUSSION' },
    include: {
      user: {
        select: { name: true, avatar: true, createdAt: true, _count: { select: { deals: true, comments: true } } }
      },
      discussionCategory: {
        select: { nameVi: true, nameEn: true }
      },
      _count: {
        select: { comments: true }
      }
    }
  })
  
  return discussion
}

export async function getDiscussionCategoryBySlug(slug: string) {
  const category = await db.discussionCategory.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { deals: true }
      }
    }
  })
  
  return category
}

export async function getDiscussionsByCategory(categoryId: string) {
  const mutedUserIds = await getMutedUserIds()

  const discussions = await db.deal.findMany({
    where: { 
      type: 'DISCUSSION', 
      status: 'ACTIVE', 
      discussionCategoryId: categoryId,
      ...(mutedUserIds.length > 0 && { userId: { notIn: mutedUserIds } })
    },
    include: {
      user: {
        select: { name: true, avatar: true }
      },
      discussionCategory: {
        select: { nameVi: true, nameEn: true }
      },
      _count: {
        select: { comments: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
  
  return discussions
}
