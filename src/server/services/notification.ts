import { db } from '@/lib/db'

type NotificationEvent = 
  | 'browser.pm'
  | 'general.mention'
  | 'myDeals.dealRated'
  | 'myDeals.dealCommented'
  | 'myDeals.dealHot'
  | 'myDeals.dealInfoAdded'
  | 'followedDeals.followedCommented'
  | 'followedDeals.followedInfoAdded'
  | 'clubPoints.levelUp'
  | 'clubPoints.loseBenefits'
  | 'badges.newBadge'
  | 'follows.followedPosted'

export async function sendNotification({
  userId,
  event,
  title,
  body,
  link
}: {
  userId: string
  event: NotificationEvent
  title: string
  body: string
  link?: string
}) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { notificationSettings: true }
    })
    
    if (!user) return

    const settings = user.notificationSettings as Record<string, any> || {}
    
    // Parse the event path (e.g. 'myDeals.dealCommented')
    const [category, action] = event.split('.')
    
    const categorySettings = settings[category] || {}
    const isPushEnabled = categorySettings[action] ?? true // Defaults based on the UI
    const isEmailEnabled = categorySettings.notifyEmail ?? false
    
    if (isPushEnabled) {
      await db.notification.create({
        data: {
          userId,
          type: event.toUpperCase().replace('.', '_'),
          title,
          body,
          link,
          channel: 'in-app'
        }
      })
    }
    
    if (isEmailEnabled) {
      // Future: Queue email via Resend or AWS SES
      console.log(`[Email Mock] Sending email to User ${userId} for event ${event}`)
    }
    
  } catch (error) {
    console.error('Failed to send notification', error)
  }
}
