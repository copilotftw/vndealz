'use server'
// Theme server actions — read/write SiteConfig

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { themeSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function getSiteConfig() {
  return db.siteConfig.findUnique({ where: { id: 'default' } })
}

export async function updateSiteConfig(input: {
  layout: string; scale: string; colorScheme: string; customCss?: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== 'ADMIN') throw new Error('Admin only')
  const data = themeSchema.parse(input)
  await db.siteConfig.update({
    where: { id: 'default' },
    data: { ...data, updatedBy: session.user.id },
  })
  // Revalidate root layout — re-reads SiteConfig → regenerates CSS
  revalidatePath('/', 'layout')
}
