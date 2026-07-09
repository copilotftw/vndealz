import { db } from '@/lib/db'
import { sendEmail, resend } from '@/lib/email'
import { render } from 'react-email'
import DealAlertEmail from '@/emails/deal-alert'

// Email disabled until a provider (RESEND_API_KEY) is configured.
const EMAIL_ENABLED = !!resend

export async function matchDealWithAlerts(dealId: string) {
  // Fetch deal details
  const deal = await db.deal.findUnique({
    where: { id: dealId },
    include: { category: true },
  })

  if (!deal || deal.status !== 'ACTIVE') return

  // Find active alerts
  const activeAlerts = await db.dealAlert.findMany({
    where: {
      active: true,
      minTemperature: { lte: deal.temperature },
    },
    include: { user: true },
  })

  const notificationsToCreate: any[] = []
  const emailsToSend: any[] = []
  
  // Find existing notifications for this deal to prevent duplicates
  // The link is `/deal/${deal.slug}` so we can query by link
  const existingNotifications = await db.notification.findMany({
    where: { link: `/deal/${deal.slug}` },
    select: { userId: true },
  })
  const notifiedUserIds = new Set(existingNotifications.map(n => n.userId))

  // Check which alerts match the deal
  for (const alert of activeAlerts) {
    // Don't notify the user who posted the deal
    if (alert.userId === deal.userId) continue
    
    // Don't notify if they already got a notification for this deal
    if (notifiedUserIds.has(alert.userId)) continue

    let matches = false

    // 1. Keyword match (case insensitive)
    if (alert.keyword) {
      const keywordRegex = new RegExp(alert.keyword, 'i')
      if (keywordRegex.test(deal.title) || keywordRegex.test(deal.description)) {
        matches = true
      }
    }

    // 2. Merchant match
    if (alert.merchant && deal.merchant) {
      if (deal.merchant.toLowerCase() === alert.merchant.toLowerCase()) {
        matches = true
      }
    }

    // 3. Category match
    if (alert.categoryId && deal.categoryId) {
      if (deal.categoryId === alert.categoryId) {
        matches = true
      }
    }

    if (matches) {
      notificationsToCreate.push({
        userId: alert.userId,
        type: 'DEAL_ALERT',
        title: `Deal mới phù hợp báo thức: ${deal.title}`,
        body: `Một deal mới được đăng phù hợp với báo thức của bạn. Nhấn để xem ngay!`,
        link: `/deal/${deal.slug}`,
        channel: 'in-app',
      })
      
      // Track that we notified them so if they have multiple matching alerts they only get 1 notification
      notifiedUserIds.add(alert.userId)
      
      if (alert.user.email) {
        emailsToSend.push({
          to: alert.user.email,
          keyword: alert.keyword || deal.title,
          dealTitle: deal.title,
          dealUrl: `${process.env.BETTER_AUTH_URL}/deal/${deal.slug}`,
          price: deal.price ? Number(deal.price) : 0,
          userName: alert.user.name || 'User'
        })
      }
    }
  }

  // Check followers of the deal author
  const followers = await db.follow.findMany({
    where: { followingId: deal.userId },
    include: { follower: true }
  })

  for (const follow of followers) {
    if (notifiedUserIds.has(follow.followerId)) continue
    
    notificationsToCreate.push({
      userId: follow.followerId,
      type: 'DEAL_ALERT',
      title: `Deal mới từ người bạn theo dõi: ${deal.title}`,
      body: `Một người bạn đang theo dõi vừa đăng deal mới. Nhấn để xem ngay!`,
      link: `/deal/${deal.slug}`,
      channel: 'in-app',
    })
    notifiedUserIds.add(follow.followerId)
    
    // Send email alert for follower
    if (follow.follower.email) {
      emailsToSend.push({
        to: follow.follower.email,
        keyword: 'Theo dõi',
        dealTitle: deal.title,
        dealUrl: `${process.env.BETTER_AUTH_URL}/deal/${deal.slug}`,
        price: deal.price ? Number(deal.price) : 0,
        userName: follow.follower.name || 'User'
      })
    }
  }

  // Insert notifications in bulk
  if (notificationsToCreate.length > 0) {
    await db.notification.createMany({
      data: notificationsToCreate,
    })
  }
  
  // Send emails — skipped entirely when no provider configured (no wasted render).
  if (EMAIL_ENABLED) {
    for (const email of emailsToSend) {
      const html = await render(DealAlertEmail({
        keyword: email.keyword,
        dealTitle: email.dealTitle,
        dealUrl: email.dealUrl,
        price: email.price,
        userName: email.userName
      }))
      // Fire and forget emails
      sendEmail({ to: email.to, subject: `New Deal Alert: ${email.dealTitle}`, html }).catch(console.error)
    }
  }
}
