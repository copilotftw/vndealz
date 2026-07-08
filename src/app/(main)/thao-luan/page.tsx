// Discussions — DealFeed with type=DISCUSSION filter
import { DealFeed } from '@/components/deal/deal-feed'
import { getLocale } from 'next-intl/server'

export default async function DiscussionsPage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string }> }) {
  const resolvedSearchParams = await searchParams
  const locale = await getLocale()

  return (
    <div>
      <DealFeed type="DISCUSSION" searchParams={resolvedSearchParams} locale={locale} />
    </div>
  )
}
