import { db } from '@/lib/db'
import Link from 'next/link'
import { CategoryTreeNav } from '../category/category-tree-nav'
import { Button } from '../ui/button'
import { Flame, LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { getSafeUserSettings } from '@/server/actions/settings'

export async function requireMod() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s || !['ADMIN', 'MODERATOR'].includes((s.user as any).role)) throw new Error('Forbidden')
  return s
}

export async function Sidebar({ locale }: { locale: string }) {
  const t = await getTranslations('nav')
  const ts = await getTranslations('sidebar')

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  const settings = await getSafeUserSettings()
  const w = settings.preferences?.widgets || {}
  const showHottest = w.showHottest ?? true
  const showActivity = w.showActivity ?? true
  const showDiscussions = w.showDiscussions ?? true

  // Fetch top 5 hottest active deals for trending
  const trendingDeals = await db.deal.findMany({
    where: { status: 'ACTIVE', type: { in: ['DEAL', 'VOUCHER', 'FREEBIE'] } },
    orderBy: { temperature: 'desc' },
    take: 5,
    include: { category: true }
  })

  // Fetch recent activities (comments on deals)
  const recentActivities = await db.comment.findMany({
    where: {
      deal: { type: { in: ['DEAL', 'VOUCHER', 'FREEBIE'] } },
      ...(user ? { userId: user.id } : {}) // If logged in, show their activities. If not, global.
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      deal: { select: { slug: true, title: true, image: true } }
    }
  })

  // Fetch recent popular discussions
  const recentDiscussions = await db.deal.findMany({
    where: { type: 'DISCUSSION', status: 'ACTIVE' },
    orderBy: { comments: { _count: 'desc' } }, // Most active discussions
    take: 5,
    include: {
      user: { select: { name: true, avatar: true } },
      _count: { select: { comments: true } }
    }
  })

  return (
    <div className="space-y-[var(--section-gap)] sticky top-[calc(var(--nav-height)+var(--section-gap))] w-[var(--sidebar-width)] flex-shrink-0">

      {/* Trending deals */}
      {showHottest && (
        <section className="glass-subtle rounded-[var(--border-radius-lg)] p-[var(--card-padding)] shadow-sm">
        <h3 className="text-[length:var(--font-size-lg)] font-bold mb-4 text-[var(--color-hot)] flex items-center gap-2">
          <Flame className="w-5 h-5" /> {t('trending')}
        </h3>
        <div className="space-y-4">
          {trendingDeals.map(deal => (
            <Link key={deal.id} href={`/deal/${deal.slug}`} className="flex gap-3 group">
              <div className="relative w-16 h-16 rounded-[var(--border-radius-sm)] overflow-hidden bg-white border border-[var(--color-border)]/50 flex-shrink-0">
                <Image 
                  src={deal.image || 'https://utfs.io/f/placeholder.png'} 
                  alt={deal.title}
                  fill
                  className="object-contain p-1 group-hover:scale-110 transition-transform"
                  sizes="64px"
                />
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <p className="text-[length:var(--font-size-sm)] font-medium text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                  {deal.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[length:var(--font-size-xs)] font-bold text-[var(--color-hot)]">{deal.temperature}°</span>
                  <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] line-clamp-1">{locale === 'vi' ? deal.category?.nameVi : deal.category?.nameEn}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Recent Activities */}
      {showActivity && (recentActivities.length > 0 || user) && (
        <section className="glass-subtle rounded-[var(--border-radius-lg)] p-[var(--card-padding)] shadow-sm">
          <h3 className="text-[length:var(--font-size-lg)] font-bold mb-4 flex items-center justify-between">
            {user ? ts('yourActivity') : ts('recentActivity')}
          </h3>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <Link key={activity.id} href={`/deal/${activity.deal?.slug}#comment-${activity.id}`} className="flex gap-3 group">
                <div className="relative w-12 h-12 rounded-[var(--border-radius-sm)] overflow-hidden bg-white border border-[var(--color-border)]/50 flex-shrink-0 mt-1">
                  <Image 
                    src={activity.deal?.image || 'https://utfs.io/f/placeholder.png'} 
                    alt={activity.deal?.title || ''}
                    fill
                    className="object-contain p-1 group-hover:scale-110 transition-transform"
                    sizes="48px"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-[length:var(--font-size-sm)] text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                    {user ? ts('youCommentedOn') : ts('someoneCommentedOn')}
                    <strong>{activity.deal?.title}</strong>
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[var(--color-text-muted)] text-[11px]">
                    <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg></span>
                    <span>{new Date(activity.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Discussions */}
      {showDiscussions && (
      <section className="glass-subtle rounded-[var(--border-radius-lg)] p-[var(--card-padding)] shadow-sm">
        <h3 className="text-[length:var(--font-size-lg)] font-bold mb-4 flex items-center justify-between">
          {ts('recentDiscussions')}
        </h3>
        <div className="space-y-4">
          {recentDiscussions.map(discussion => (
            <Link key={discussion.id} href={`/thao-luan/${discussion.slug}`} className="flex flex-col gap-2 group block border-b border-[var(--color-border)]/50 pb-3 last:border-0 last:pb-0">
              <p className="text-[length:var(--font-size-sm)] font-bold text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                {discussion.title}
              </p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[var(--color-border)]">
                     <Image src={discussion.user.avatar || 'https://utfs.io/f/placeholder.png'} alt={discussion.user.name || ''} fill className="object-cover" />
                  </div>
                  <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] font-medium">{discussion.user.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-[length:var(--font-size-xs)]">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                   <span>{discussion._count.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

    </div>
  )
}
