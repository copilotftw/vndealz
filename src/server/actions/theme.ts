'use server'
// Theme server actions — read/write SiteConfig

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { themeSchema } from '@/lib/validations'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function getSiteConfig() {
  return db.siteConfig.findUnique({ where: { id: 'default' } })
}

export async function updateSiteConfig(input: {
  layout: string; scale: string; colorScheme: string; customCss?: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== 'ADMIN') throw new Error('Admin only')
  const data = themeSchema.parse(input)
  await db.siteConfig.upsert({
    where: { id: 'default' },
    update: { ...data, updatedBy: session.user.id },
    create: { id: 'default', ...data, updatedBy: session.user.id },
  })
  // Revalidate cache tag
  ;(revalidateTag as any)('theme')
  ;(revalidatePath as any)('/', 'layout')
}
