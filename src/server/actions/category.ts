'use server'
// Category server actions — tree operations
// These are MORE complex, so they have more implementation guidance.
// See PLAN.md Step 9 for full details.

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { categorySchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

async function requireMod() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s || !['ADMIN', 'MODERATOR'].includes((s.user as any).role)) throw new Error('Forbidden')
  return s
}

// ── Build full category tree from flat DB rows ──
type CatNode = {
  id: string; nameVi: string; nameEn: string; slug: string
  icon: string | null; order: number; depth: number; parentId: string | null
  children: CatNode[]
}

export async function getCategoryTree(): Promise<CatNode[]> {
  const all = await db.category.findMany({ orderBy: [{ depth: 'asc' }, { order: 'asc' }] })
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

// ── Get all descendant IDs (for filtering deals by parent category) ──
export async function getCategoryWithDescendants(slug: string): Promise<string[]> {
  const cat = await db.category.findUnique({ where: { slug } })
  if (!cat) return []
  const all = await db.category.findMany()
  const ids: string[] = [cat.id]
  function collect(parentId: string) {
    for (const c of all) {
      if (c.parentId === parentId) { ids.push(c.id); collect(c.id) }
    }
  }
  collect(cat.id)
  return ids
}

// ── Breadcrumb path from leaf → root ──
export async function getCategoryBreadcrumb(slug: string) {
  const path: { nameVi: string; nameEn: string; slug: string }[] = []
  let current = await db.category.findUnique({ where: { slug } })
  while (current) {
    path.unshift({ nameVi: current.nameVi, nameEn: current.nameEn, slug: current.slug })
    current = current.parentId
      ? await db.category.findUnique({ where: { id: current.parentId } })
      : null
  }
  return path
}

// ── CRUD (all require mod/admin) ──

export async function createCategory(input: {
  nameVi: string; nameEn: string; slug: string
  icon?: string; parentId?: string | null; order?: number
}) {
  await requireMod()
  const data = categorySchema.parse(input)
  let depth = 0
  if (data.parentId) {
    const parent = await db.category.findUnique({ where: { id: data.parentId } })
    if (parent) depth = parent.depth + 1
  }
  const cat = await db.category.create({
    data: { ...data, depth, parentId: data.parentId || null },
  })
  revalidatePath('/[locale]/admin/categories')
  return cat
}

export async function updateCategory(
  id: string,
  input: Partial<{ nameVi: string; nameEn: string; slug: string; icon: string; order: number }>
) {
  await requireMod()
  const cat = await db.category.update({ where: { id }, data: input })
  revalidatePath('/[locale]/admin/categories')
  return cat
}

export async function moveCategory(id: string, newParentId: string | null) {
  await requireMod()
  let newDepth = 0
  if (newParentId) {
    const parent = await db.category.findUnique({ where: { id: newParentId } })
    if (parent) newDepth = parent.depth + 1
    // Prevent circular: newParentId can't be descendant of id
    const cat = await db.category.findUnique({ where: { id } })
    if (cat) {
      const desc = await getCategoryWithDescendants(cat.slug)
      if (desc.includes(newParentId)) throw new Error('Circular reference')
    }
  }
  await db.category.update({ where: { id }, data: { parentId: newParentId, depth: newDepth } })
  // Recursively fix descendant depths
  async function fixDepths(pid: string, pd: number) {
    const children = await db.category.findMany({ where: { parentId: pid } })
    for (const c of children) {
      await db.category.update({ where: { id: c.id }, data: { depth: pd + 1 } })
      await fixDepths(c.id, pd + 1)
    }
  }
  await fixDepths(id, newDepth)
  revalidatePath('/[locale]/admin/categories')
}

export async function deleteCategory(id: string) {
  await requireMod()
  const cat = await db.category.findUnique({ where: { id }, include: { children: true } })
  if (!cat) throw new Error('Not found')
  if (cat.children.length > 0) throw new Error('Delete children first')
  const fallback = cat.parentId || (await db.category.findUnique({ where: { slug: 'khac' } }))?.id
  if (fallback) {
    await db.deal.updateMany({ where: { categoryId: id }, data: { categoryId: fallback } })
  }
  await db.category.delete({ where: { id } })
  revalidatePath('/[locale]/admin/categories')
}

export async function reorderCategories(updates: { id: string; order: number }[]) {
  await requireMod()
  await Promise.all(updates.map(u => db.category.update({ where: { id: u.id }, data: { order: u.order } })))
  revalidatePath('/[locale]/admin/categories')
}
