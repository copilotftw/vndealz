import { getTranslations } from 'next-intl/server'
import { getPendingDeals } from '@/server/actions/admin'
import { ModerationQueue } from './moderation-queue'

export default async function ModerationPage() {
  const t = await getTranslations('admin')
  const pendingDeals = await getPendingDeals()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">{t('moderationTitle')}</h1>
        <p className="text-muted-foreground mt-2">{t('moderationDesc')}</p>
      </div>

      <ModerationQueue initialDeals={pendingDeals} />
    </div>
  )
}
