'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { routes } from '@/lib/routes'

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
import { render } from 'react-email'
import DealApprovedEmail from '@/emails/deal-approved'
import DealRejectedEmail from '@/emails/deal-rejected'
import { matchDealWithAlerts } from '@/lib/alerts/matching-engine'

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
    // Fire and forget matching engine (ponytail approach)
    matchDealWithAlerts(deal.id).catch(console.error)
  }
  
  revalidatePath(routes.admin.moderation)
  revalidatePath(routes.home)
  return deal
}

export async function getPendingDeals() {
  await requireAdmin()
  
  const deals = await db.deal.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      category: { select: { nameVi: true, nameEn: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return deals.map(d => ({
    ...d,
    price: d.price ? Number(d.price) : null,
    comparePrice: d.comparePrice ? Number(d.comparePrice) : null,
  }))
}

export async function banUser(userId: string) {
  await requireAdmin()
  await db.user.update({
    where: { id: userId },
    data: { role: 'BANNED' }
  })
  revalidatePath(routes.admin.users)
}

export async function promoteUser(userId: string, role: 'MODERATOR' | 'ADMIN') {
  await requireAdmin()
  await db.user.update({
    where: { id: userId },
    data: { role }
  })
  revalidatePath(routes.admin.users)
}
