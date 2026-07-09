import { DealFeed } from '@/components/deal/deal-feed'
import { Row3Injector } from '@/components/layout/row3-injector'
import { FeedTabs } from '@/components/layout/navbar'
import { getLocale } from 'next-intl/server'
import { getSafeUserSettings } from '@/server/actions/settings'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string; price?: string; temp?: string }> }) {
  const params = await searchParams
  const settings = await getSafeUserSettings()
  const defaultSort = (settings.preferences as Record<string, any>)?.defaultLanding || 'hot'
  const sort = params.sort || defaultSort
  const locale = await getLocale()

  return (
    <div key={sort} className="ios-page-enter">
      <Row3Injector content={<FeedTabs sort={sort} />} />
      <DealFeed searchParams={params} locale={locale} defaultSort={defaultSort} />
    </div>
  )
}
