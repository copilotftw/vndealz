import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendNotification } from '@/server/services/notification'

// Helper: derive the stored notification type string from an event name,
// matching the logic in sendNotification (event.toUpperCase().replace('.', '_')).
function eventToType(event: string) {
  return event.toUpperCase().replace('.', '_')
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')

  if (!secret) {
    console.warn('[check-alerts] CRON_SECRET is not set — running without auth (dev mode)')
  } else if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  let notified = 0

  // 1. dealBeforeExpire — ACTIVE deals expiring within the next 24 hours
  const soonExpiring = await db.deal.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { gt: now, lt: in24h },
    },
    select: { id: true, userId: true, title: true, slug: true, expiresAt: true },
  })

  const beforeExpireType = eventToType('myDeals.dealBeforeExpire')
  for (const deal of soonExpiring) {
    // Dedup: skip if we already sent this notification within the last 25h
    // (25h window avoids re-firing on consecutive hourly cron runs).
    const alreadyNotified = await db.notification.findFirst({
      where: {
        userId: deal.userId,
        type: beforeExpireType,
        link: `/deal/${deal.slug}`,
        createdAt: { gt: new Date(now.getTime() - 25 * 60 * 60 * 1000) },
      },
      select: { id: true },
    })
    if (alreadyNotified) continue

    await sendNotification({
      userId: deal.userId,
      event: 'myDeals.dealBeforeExpire',
      title: 'Deal sắp hết hạn',
      body: `"${deal.title}" sẽ hết hạn trong vòng 24 giờ`,
      link: `/deal/${deal.slug}`,
    })
    notified++
  }

  // 2. dealExpired — ACTIVE deals whose expiresAt has already passed
  //    Use AND to guard against null expiresAt rows being included.
  const expired = await db.deal.findMany({
    where: {
      AND: [
        { status: 'ACTIVE' },
        { expiresAt: { not: null } },
        { expiresAt: { lt: now } },
      ],
    },
    select: { id: true, userId: true, title: true, slug: true },
  })

  for (const deal of expired) {
    await db.deal.update({
      where: { id: deal.id },
      data: { status: 'EXPIRED' },
    })
    await sendNotification({
      userId: deal.userId,
      event: 'myDeals.dealExpired',
      title: 'Deal đã hết hạn',
      body: `"${deal.title}" đã hết hạn và bị ẩn khỏi feed`,
      link: `/deal/${deal.slug}`,
    })
    notified++
  }

  // 3. priceDropAlert — deals with a price drop recorded in the last hour
  //    Fetch recent PriceHistory entries, then for each unique deal check
  //    whether the latest entry is cheaper than the one before it.
  const recentPriceChanges = await db.priceHistory.findMany({
    where: { createdAt: { gt: new Date(now.getTime() - 60 * 60 * 1000) } },
    include: {
      deal: {
        select: { id: true, userId: true, title: true, slug: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const seenDeals = new Set<string>()
  for (const ph of recentPriceChanges) {
    if (seenDeals.has(ph.dealId)) continue
    if (ph.deal.status !== 'ACTIVE') continue
    seenDeals.add(ph.dealId)

    const history = await db.priceHistory.findMany({
      where: { dealId: ph.dealId },
      orderBy: { createdAt: 'desc' },
      take: 2,
    })
    if (history.length < 2) continue

    const [latest, previous] = history
    if (Number(latest.price) >= Number(previous.price)) continue

    // Price dropped — fire alert-matching for any subscribers watching this deal.
    const { matchDealWithAlerts } = await import('@/lib/alerts/matching-engine')
    matchDealWithAlerts(ph.dealId).catch(console.error)
    notified++
  }

  return NextResponse.json({ ok: true, notified, ts: now.toISOString() })
}
