// Freebies — DealFeed with type=FREEBIE filter
import { DealFeed } from '@/components/deal/deal-feed'
import { getLocale } from 'next-intl/server'

export default async function FreebiesPage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string }> }) {
  const resolvedSearchParams = await searchParams
  const locale = await getLocale()

  return (
    <div>
      <DealFeed type="FREEBIE" searchParams={resolvedSearchParams} locale={locale} />
    </div>
  )
}
