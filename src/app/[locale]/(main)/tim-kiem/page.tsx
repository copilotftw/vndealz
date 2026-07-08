import { searchDeals } from '@/server/actions/search'
import { DealList } from '@/components/deal/deal-list'
import { getLocale } from 'next-intl/server'
import { Search } from 'lucide-react'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams.q || ''
  const page = parseInt(resolvedParams.page || '1')
  const locale = await getLocale()
  const isVi = locale === 'vi'

  const { deals, total } = await searchDeals(q, page)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="glass-strong p-8 rounded-[var(--border-radius-xl)] shadow-lg border border-[var(--color-border)]/50 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text)] flex items-center justify-center gap-3">
          <Search className="w-8 h-8 text-[var(--color-primary)]" />
          {isVi ? 'Kết quả tìm kiếm' : 'Search Results'}
        </h1>
        {q && (
          <p className="text-[var(--color-text-muted)] mt-4 text-lg">
            {isVi ? 'Tìm thấy' : 'Found'} <strong className="text-[var(--color-text)]">{total}</strong> {isVi ? 'kết quả cho' : 'results for'} <strong className="text-[var(--color-primary)]">&quot;{q}&quot;</strong>
          </p>
        )}
      </div>

      <DealList deals={deals as any} locale={locale} />
    </div>
  )
}
