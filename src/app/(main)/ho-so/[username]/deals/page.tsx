import { getUserProfile } from '@/server/actions/user'
import { DealList } from '@/components/deal/deal-list'
import { getTranslations, getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function ProfileDealsPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const username = decodeURIComponent(resolvedParams.username)
  const user = await getUserProfile(username)
  const t = await getTranslations('profile')
  const locale = await getLocale()

  if (!user) notFound()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('tabs.deals')}</h2>
      {user.recentDeals && user.recentDeals.length > 0 ? (
        <DealList deals={user.recentDeals as any} locale={locale} initialPages={1} />
      ) : (
        <div className="glass-strong rounded-[var(--border-radius-xl)] p-8 text-center text-[var(--color-text-muted)]">
          {t('noDeals')}
        </div>
      )}
    </div>
  )
}
