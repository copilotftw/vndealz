'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { discussionCategorySchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

async function requireMod() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s || !['ADMIN', 'MODERATOR'].includes((s.user as any).role)) throw new Error('Forbidden')
  return s
}

type CatNode = {
  id: string; nameVi: string; nameEn: string; slug: string
  icon: string | null; order: number; depth: number; parentId: string | null
  children: CatNode[]
}

export async function getDiscussionCategoryTree(): Promise<CatNode[]> {
  const all = await db.discussionCategory.findMany({ orderBy: [{ depth: 'asc' }, { order: 'asc' }] })
  const map = new Map<string, CatNode>()
  const roots: CatNode[] = []
  for (const c of all) map.set(c.id, { ...c, children: [] })
  for (const c of all) {
    const node = map.get(c.id)!
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

export async function getDiscussionCategoryWithDescendants(slug: string): Promise<string[]> {
  const cat = await db.discussionCategory.findUnique({ where: { slug } })
  if (!cat) return []
  const all = await db.discussionCategory.findMany()
  const ids: string[] = [cat.id]
  function collect(parentId: string) {
    for (const c of all) {
      if (c.parentId === parentId) { ids.push(c.id); collect(c.id) }
    }
  }
  collect(cat.id)
  return ids
}

export async function getDiscussionCategoryBreadcrumb(slug: string) {
  const path: { nameVi: string; nameEn: string; slug: string }[] = []
  let current = await db.discussionCategory.findUnique({ where: { slug } })
  while (current) {
    path.unshift({ nameVi: current.nameVi, nameEn: current.nameEn, slug: current.slug })
    current = current.parentId
      ? await db.discussionCategory.findUnique({ where: { id: current.parentId } })
      : null
  }
  return path
}

export async function createDiscussionCategory(input: {
  nameVi: string; nameEn: string; slug: string
  icon?: string; parentId?: string | null; order?: number
}) {
  await requireMod()
  const data = discussionCategorySchema.parse(input)
  let depth = 0
  if (data.parentId) {
    const parent = await db.discussionCategory.findUnique({ where: { id: data.parentId } })
    if (parent) depth = parent.depth + 1
  }
  const cat = await db.discussionCategory.create({
    data: { ...data, depth, parentId: data.parentId || null },
  })
  revalidatePath('/[locale]/admin/discussion-categories')
  return cat
}

export async function updateDiscussionCategory(
  id: string,
  input: Partial<{ nameVi: string; nameEn: string; slug: string; icon: string; order: number }>
) {
  await requireMod()
  const cat = await db.discussionCategory.update({ where: { id }, data: input })
  revalidatePath('/[locale]/admin/discussion-categories')
  return cat
}

export async function moveDiscussionCategory(id: string, newParentId: string | null) {
  await requireMod()
  let newDepth = 0
  if (newParentId) {
    const parent = await db.discussionCategory.findUnique({ where: { id: newParentId } })
    if (parent) newDepth = parent.depth + 1
    const cat = await db.discussionCategory.findUnique({ where: { id } })
    if (cat) {
      const desc = await getDiscussionCategoryWithDescendants(cat.slug)
      if (desc.includes(newParentId)) throw new Error('Circular reference')
    }
  }
  await db.discussionCategory.update({ where: { id }, data: { parentId: newParentId, depth: newDepth } })
  
  async function fixDepths(pid: string, pd: number) {
    const children = await db.discussionCategory.findMany({ where: { parentId: pid } })
    for (const c of children) {
      await db.discussionCategory.update({ where: { id: c.id }, data: { depth: pd + 1 } })
      await fixDepths(c.id, pd + 1)
    }
  }
  await fixDepths(id, newDepth)
  revalidatePath('/[locale]/admin/discussion-categories')
}

export async function deleteDiscussionCategory(id: string) {
  await requireMod()
  const cat = await db.discussionCategory.findUnique({ where: { id }, include: { children: true } })
  if (!cat) throw new Error('Not found')
  if (cat.children.length > 0) throw new Error('Delete children first')
  
  const fallback = cat.parentId || (await db.discussionCategory.findFirst())?.id
  if (fallback) {
    await db.deal.updateMany({ where: { discussionCategoryId: id }, data: { discussionCategoryId: fallback } })
  }
  await db.discussionCategory.delete({ where: { id } })
  revalidatePath('/[locale]/admin/discussion-categories')
}

export async function reorderDiscussionCategories(updates: { id: string; order: number }[]) {
  await requireMod()
  await Promise.all(updates.map(u => db.discussionCategory.update({ where: { id: u.id }, data: { order: u.order } })))
  revalidatePath('/[locale]/admin/discussion-categories')
}
