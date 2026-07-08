// Voucher codes — DealFeed with type=VOUCHER filter
import { DealFeed } from '@/components/deal/deal-feed'
import { getLocale } from 'next-intl/server'

export default async function VouchersPage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string }> }) {
  const resolvedSearchParams = await searchParams
  const locale = await getLocale()

  return (
    <div>
      <DealFeed type="VOUCHER" searchParams={resolvedSearchParams} locale={locale} />
    </div>
  )
}
