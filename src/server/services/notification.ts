import { db } from '@/lib/db'
import { resend } from '@/lib/email'

// Email disabled until a provider (RESEND_API_KEY) is configured.
const EMAIL_ENABLED = !!resend

type NotificationEvent =
  | 'browser.pm'
  | 'general.mention'
  | 'myDeals.dealRated'
  | 'myDeals.dealCommented'
  | 'myDeals.dealHot'
  | 'myDeals.dealInfoAdded'
  | 'myDeals.dealBeforeExpire'
  | 'myDeals.dealExpired'
  | 'myDeals.dealUnexpired'
  | 'myDeals.dealCheckActive'
  | 'myDeals.dealStats'
  | 'followedDeals.followedCommented'
  | 'followedDeals.followedInfoAdded'
  | 'myAddedInfo.infoLiked'
  | 'clubPoints.levelUp'
  | 'clubPoints.loseBenefits'
  | 'clubPoints.commentHelpful'
  | 'clubPoints.pointsVoted'
  | 'clubPoints.refUsed'
  | 'badges.newBadge'
  | 'badges.superPoster'
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
    
    if (isEmailEnabled && EMAIL_ENABLED) {
      // TODO: render + queue email via lib/email sendEmail once a provider is set.
      // Intentionally a no-op for now (no RESEND_API_KEY).
    }
    
  } catch (error) {
    console.error('Failed to send notification', error)
  }
}
