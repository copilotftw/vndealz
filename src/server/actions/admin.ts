'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s || !['ADMIN', 'MODERATOR'].includes((s.user as any).role)) throw new Error('Forbidden')
  return s
}

export async function getDashboardStats() {
  await requireAdmin()
  
  const [
    totalDeals,
    totalUsers,
    pendingDeals,
    pendingReports,
    activeAds
  ] = await Promise.all([
    db.deal.count(),
    db.user.count(),
    db.deal.count({ where: { status: 'PENDING' } }),
    db.report.count({ where: { status: 'PENDING' } }),
    db.adPlacement.count({ where: { active: true } })
  ])
  
  return {
    totalDeals,
    totalUsers,
    pendingDeals,
    pendingReports,
    activeAds
  }
}

import { sendEmail } from '@/lib/email'
import { render } from '@react-email/render'
import DealApprovedEmail from '@/emails/deal-approved'
import DealRejectedEmail from '@/emails/deal-rejected'
import DealAlertEmail from '@/emails/deal-alert'

export async function moderateDeal(dealId: string, action: 'approve' | 'reject', reason?: string) {
  const s = await requireAdmin()
  
  const deal = await db.deal.update({
    where: { id: dealId },
    data: {
      status: action === 'approve' ? 'ACTIVE' : 'REJECTED',
      moderatedBy: s.user.id,
      moderatedAt: new Date()
    },
    include: { user: true }
  })
  
  // Send email to author
  if (deal.user?.email) {
    const dealUrl = `${process.env.BETTER_AUTH_URL}/deal/${deal.slug}`
    
    if (action === 'approve') {
      const html = await render(DealApprovedEmail({
        dealTitle: deal.title,
        dealUrl,
        userName: deal.user.name || 'User'
      }))
      await sendEmail({ to: deal.user.email, subject: 'Your deal has been approved!', html })
    } else {
      const html = await render(DealRejectedEmail({
        dealTitle: deal.title,
        userName: deal.user.name || 'User',
        reason
      }))
      await sendEmail({ to: deal.user.email, subject: 'Update on your deal submission', html })
    }
  }

  // Check DealAlerts for matches if approved
  if (action === 'approve') {
    const alerts = await db.dealAlert.findMany({
      where: {
        active: true,
        OR: [
          { keyword: { contains: deal.title } },
          { categoryId: deal.categoryId },
          // Note: Full keyword matching can be more complex, keeping it simple
        ]
      },
      include: { user: true }
    })
    
    // Filter out the deal creator and send emails
    for (const alert of alerts) {
      if (alert.userId === deal.userId) continue
      if (!alert.user.email) continue
      
      const html = await render(DealAlertEmail({
        keyword: alert.keyword || deal.title,
        dealTitle: deal.title,
        dealUrl: `${process.env.BETTER_AUTH_URL}/deal/${deal.slug}`,
        price: Number(deal.price),
        userName: alert.user.name || 'User'
      }))
      
      await sendEmail({ to: alert.user.email, subject: `New Deal Alert: ${deal.title}`, html })
    }
  }
  
  revalidatePath('/[locale]/admin/moderation')
  revalidatePath('/[locale]')
  return deal
}

export async function getPendingDeals() {
  await requireAdmin()
  
  return await db.deal.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      category: { select: { nameVi: true, nameEn: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function banUser(userId: string) {
  await requireAdmin()
  await db.user.update({
    where: { id: userId },
    data: { role: 'BANNED' }
  })
  revalidatePath('/[locale]/admin/users')
}

export async function promoteUser(userId: string, role: 'MODERATOR' | 'ADMIN') {
  await requireAdmin()
  await db.user.update({
    where: { id: userId },
    data: { role }
  })
  revalidatePath('/[locale]/admin/users')
}
