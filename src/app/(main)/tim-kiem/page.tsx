import { searchDeals } from '@/server/actions/search'
import { DealList } from '@/components/deal/deal-list'
import { getLocale, getTranslations } from 'next-intl/server'
import { SearchFilters } from '@/components/deal/search-filters'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string; minPrice?: string; maxPrice?: string; hideExpired?: string }>
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams.q || ''
  const page = parseInt(resolvedParams.page || '1')
  const sort = resolvedParams.sort
  const hideExpired = resolvedParams.hideExpired === 'true'
  const minPrice = resolvedParams.minPrice ? parseInt(resolvedParams.minPrice) : undefined
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice) : undefined
  
  const locale = await getLocale()
  const t = await getTranslations('search')

  const { deals, total } = await searchDeals(q, page, 20, {
    sort,
    minPrice,
    maxPrice,
    hideExpired
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto w-full">
      {/* Left Sidebar Filters */}
      <div className="w-full lg:w-72 shrink-0 space-y-6">
        <SearchFilters />
      </div>

      {/* Main Results Area */}
      <div className="flex-1 space-y-6 min-w-0">
        <div className="glass-strong p-6 rounded-[var(--border-radius-xl)] shadow-sm border border-[var(--color-border)]/50">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Kết quả tìm kiếm cho &quot;{q || 'Tất cả Deal'}&quot;
          </h1>
          {q && (
            <p className="text-[var(--color-text-muted)] mt-2">
              Tìm thấy {total} Deal
            </p>
          )}
        </div>

        <DealList deals={deals as any} locale={locale} initialPages={1} />
      </div>
    </div>
  )
}
