import { getSavedDeals } from '@/server/actions/user'
import { DealList } from '@/components/deal/deal-list'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function ProfileSavedPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const username = decodeURIComponent(resolvedParams.username)
  const deals = await getSavedDeals(username)
  const t = await getTranslations('profile')
  const locale = await getLocale()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('tabs.saved')}</h2>
      {deals.length > 0 ? (
        <DealList deals={deals as any} locale={locale} initialPages={1} />
      ) : (
        <div className="glass-strong rounded-[var(--border-radius-xl)] p-8 text-center text-[var(--color-text-muted)]">
          {t('noDeals')}
        </div>
      )}
    </div>
  )
}
