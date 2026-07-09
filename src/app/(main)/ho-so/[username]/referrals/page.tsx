import { getTranslations } from 'next-intl/server'

export default async function ProfileReferralsPage() {
  const t = await getTranslations('profile')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('tabs.referrals')}</h2>
      <div className="glass-strong rounded-[var(--border-radius-xl)] p-8 text-center text-[var(--color-text-muted)]">
        Coming Soon
      </div>
    </div>
  )
}
