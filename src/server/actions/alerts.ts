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

export async function getAlerts() {
  const session = await getSession()

  const alerts = await db.dealAlert.findMany({
    where: { userId: session.user.id },
    include: {
      category: { select: { nameVi: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return alerts
}

export async function createAlert(data: {
  keyword?: string
  categoryId?: string
  merchant?: string
  minTemperature?: number
}) {
  const session = await getSession()

  // Basic validation: must have at least one criteria
  if (!data.keyword && !data.categoryId && !data.merchant) {
    throw new Error('Alert must have a keyword, category, or merchant')
  }

  const alert = await db.dealAlert.create({
    data: {
      userId: session.user.id,
      keyword: data.keyword?.trim() || null,
      categoryId: data.categoryId || null,
      merchant: data.merchant?.trim() || null,
      minTemperature: data.minTemperature || 0,
    },
  })

  revalidatePath('/canh-bao-deal')
  return alert
}

export async function toggleAlert(id: string, active: boolean) {
  const session = await getSession()

  // Ensure user owns this alert
  const alert = await db.dealAlert.findUnique({ where: { id } })
  if (alert?.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const updated = await db.dealAlert.update({
    where: { id },
    data: { active },
  })

  revalidatePath('/canh-bao-deal')
  return updated
}

export async function deleteAlert(id: string) {
  const session = await getSession()

  const alert = await db.dealAlert.findUnique({ where: { id } })
  if (alert?.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  await db.dealAlert.delete({ where: { id } })

  revalidatePath('/canh-bao-deal')
  return { success: true }
}
