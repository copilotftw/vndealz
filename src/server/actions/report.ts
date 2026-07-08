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

export async function resolveReport(reportId: string, action: 'DISMISS' | 'DELETE_TARGET' | 'BAN_USER') {
  const s = await getSession()
  const role = (s.user as any).role
  if (role !== 'ADMIN' && role !== 'MODERATOR') throw new Error('Unauthorized')

  const report = await db.report.findUnique({ where: { id: reportId } })
  if (!report) throw new Error('Report not found')

  if (action === 'DELETE_TARGET') {
    if (report.targetType === 'DEAL') {
      await db.deal.delete({ where: { id: report.targetId } })
    } else if (report.targetType === 'COMMENT') {
      await db.comment.delete({ where: { id: report.targetId } })
    }
  } else if (action === 'BAN_USER') {
    // Basic implementation
    if (report.targetType === 'DEAL') {
      const deal = await db.deal.findUnique({ where: { id: report.targetId } })
      if (deal) await db.user.update({ where: { id: deal.userId }, data: { role: 'BANNED' } })
    } else if (report.targetType === 'USER') {
      await db.user.update({ where: { id: report.targetId }, data: { role: 'BANNED' } })
    }
  }

  await db.report.update({
    where: { id: reportId },
    data: { status: 'RESOLVED' }
  })

  revalidatePath('/[locale]/admin/reports')
}
