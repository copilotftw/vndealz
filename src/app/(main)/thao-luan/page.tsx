import { getTranslations, getLocale } from 'next-intl/server'
import { MessageCircle, Plus, Clock } from 'lucide-react'
import { getDiscussionCategories, getRecentDiscussions } from '@/server/actions/discussion'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { timeAgo } from '@/lib/utils'

export default async function DiscussionsPage() {
  const [t, locale] = await Promise.all([getTranslations('discussion'), getLocale()])
  const session = await auth.api.getSession({ headers: await headers() })

  const [categories, discussions] = await Promise.all([
    getDiscussionCategories(),
    getRecentDiscussions(),
  ])

  // Right sidebar: user's recent discussion comments, or hot discussions if not logged in
  let recentActivity: Array<{ id: string; deal: { slug: string; title: string }; createdAt: Date }> = []
  if (session?.user) {
    const raw = await db.comment.findMany({
      where: {
        userId: session.user.id,
        deal: { type: 'DISCUSSION', status: 'ACTIVE' },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        deal: { select: { slug: true, title: true } },
      },
    })
    recentActivity = raw.filter((c): c is typeof c & { deal: NonNullable<typeof c.deal> } => c.deal !== null)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full seamless-header">
        <div className="w-full mx-auto px-4 pt-6" style={{ maxWidth: 'var(--content-max-width)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold">{t('title')}</h1>
              <p className="text-[var(--color-text-muted)] mt-1">{t('hotDiscussions')}</p>
            </div>
            <Link
              href="/dang-thao-luan"
              className="flex items-center gap-2 bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-2 rounded-full font-bold hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              <Plus className="w-5 h-5" /> {t('createThread')}
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="mb-6 rounded-xl border border-white/10 bg-black/20">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-bold text-white">{t('allCategories')}</h2>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
              {categories.slice(0, 8).map((c) => (
                <Link key={c.id} href={`/thao-luan/nhom/${c.slug}`} className="flex items-start gap-4 hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <div className="bg-white/10 p-3 rounded-xl shrink-0 text-white">
                    <DynamicIcon name={c.icon || 'MessageCircle'} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">
                      {locale === 'vi' ? c.nameVi : (c.nameEn || c.nameVi)}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mt-1.5 font-medium">
                      <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {c._count.deals}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <button className="border-b-[3px] border-[var(--color-primary)] text-[var(--color-primary)] font-bold pb-3 px-1 mt-2 text-[15px]">{t('all')}</button>
              <button className="text-[var(--color-text-muted)] font-bold pb-3 px-1 mt-2 hover:text-white transition-colors text-[15px]">{t('mostDiscussed')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="w-full mx-auto px-4 mt-6" style={{ maxWidth: 'var(--content-max-width)' }}>
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Discussion list */}
          <div className="flex-1 space-y-4 min-w-0">
            {discussions.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                {locale === 'vi' ? 'Chưa có thảo luận nào' : 'No discussions yet'}
              </div>
            ) : discussions.map(d => (
              <div key={d.id} className="bg-[#1c1c1c] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold mb-3">
                  <span>
                    {d.discussionCategory
                      ? (locale === 'vi' ? d.discussionCategory.nameVi : (d.discussionCategory.nameEn || d.discussionCategory.nameVi))
                      : null}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(d.createdAt, locale)}
                  </span>
                </div>
                <Link href={`/thao-luan/${d.slug}`}>
                  <h3 className="text-[22px] font-bold mb-3 text-white cursor-pointer hover:text-[var(--color-primary)] leading-snug">{d.title}</h3>
                </Link>
                {d.description && (
                  <p className="text-[var(--color-text-muted)] text-[15px] mb-6 line-clamp-2 leading-relaxed">{d.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 shrink-0" />
                    <span className="text-sm font-bold text-[var(--color-text-muted)]">{d.user.name}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[var(--color-text-muted)] font-bold text-sm">
                    <MessageCircle className="w-5 h-5" /> {d._count.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar — user's recent discussion activity */}
          {recentActivity.length > 0 && (
            <div className="w-full lg:w-[320px] shrink-0">
              <div className="bg-[#1c1c1c] rounded-xl p-5 border border-white/5 sticky top-24">
                <h2 className="font-bold text-white text-lg mb-5">{t('recentActivity')}</h2>
                <div className="space-y-5">
                  {recentActivity.map(activity => (
                    <Link key={activity.id} href={`/thao-luan/${activity.deal.slug}`} className="flex gap-3 text-sm hover:bg-white/5 p-1 rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-2 text-white/90 text-xs font-bold leading-relaxed mb-1">
                          {activity.deal.title}
                        </p>
                        <p className="text-[var(--color-text-muted)] text-[11px] font-medium">
                          {timeAgo(activity.createdAt, locale)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
