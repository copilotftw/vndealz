import { DealFeed } from '@/components/deal/deal-feed'
import { Row3Injector } from '@/components/layout/row3-injector'
import { FeedTabs } from '@/components/layout/navbar'
import { getLocale } from 'next-intl/server'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string }> }) {
  const params = await searchParams
  const sort = params.sort as 'hot' | 'new' | undefined
  const locale = await getLocale()

  return (
    <div>
      <Row3Injector content={<FeedTabs sort={sort || 'hot'} />} />
      <DealFeed searchParams={params} locale={locale} />
    </div>
  )
}
