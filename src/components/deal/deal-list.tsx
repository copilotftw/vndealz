// DealList — maps deals array → DealCard, wraps in .deal-grid
// TODO: Junior — add empty state when no deals

import { DealCard } from './deal-card'

type Deal = Parameters<typeof DealCard>[0]['deal']

export function DealList({ deals, locale }: { deals: Deal[]; locale: string }) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)]">
        {/* TODO: EmptyState component */}
        <p>Chưa có deal nào</p>
      </div>
    )
  }
  return (
    <div className="deal-grid">
      {deals.map((deal, i) => (
        <DealCard key={deal.id} deal={deal} locale={locale} index={i} />
      ))}
    </div>
  )
}
