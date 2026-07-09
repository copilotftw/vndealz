'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { getDeals, getSavedDealIds } from '@/server/actions/deal'
import type { ComposerProps, DealCardData } from './deal-card'
import type { ComposerKey } from '@/components/theme/persona'
import { MydealzCard } from './layouts/MydealzCard'
import { PrismCard }   from './layouts/PrismCard'
import { LedgerRow }   from './layouts/LedgerRow'
import { VitrineCard } from './layouts/VitrineCard'
import { PulseCard }   from './layouts/PulseCard'
import { AtlasCard }   from './layouts/AtlasCard'

const COMPOSERS: Record<ComposerKey, React.ComponentType<ComposerProps>> = {
  mydealz: MydealzCard,
  prism:   PrismCard,
  ledger:  LedgerRow,
  vitrine: VitrineCard,
  pulse:   PulseCard,
  atlas:   AtlasCard,
}

export function DealList({
  deals: initialDeals,
  locale,
  userVotes = {},
  userSaved,
  composerKey = 'mydealz',
  sort,
  type,
  categorySlug,
  merchant,
  initialPages,
  pageSize,
  dataFlags,
  infiniteScroll = true,
  priceMin,
  priceMax,
  tempFilter,
}: {
  deals: DealCardData[]
  locale: string
  userVotes?: Record<string, number>
  userSaved?: Set<string>
  composerKey?: ComposerKey
  sort?: string
  type?: string
  categorySlug?: string
  merchant?: string
  initialPages: number
  pageSize?: number
  dataFlags?: { needsImage?: boolean; needsDescription?: boolean; needsPriceHistory?: boolean }
  infiniteScroll?: boolean
  priceMin?: number
  priceMax?: number
  tempFilter?: 'hot' | 'warm' | 'cold'
}) {
  const [deals, setDeals] = useState<DealCardData[]>(initialDeals)
  const [savedIds, setSavedIds] = useState<Set<string>>(userSaved ?? new Set())
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialPages > 1)
  const [isLoading, setIsLoading] = useState(false)
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '200px' })

  useEffect(() => {
    if (infiniteScroll !== false && inView && hasMore && !isLoading) loadMore()
  }, [inView, hasMore, isLoading, infiniteScroll])

  const loadMore = async () => {
    setIsLoading(true)
    try {
      const nextPage = page + 1
      const res = await getDeals({ sort: sort as any, type, categorySlug, merchant, page: nextPage, limit: pageSize, data: dataFlags, priceMin, priceMax, tempFilter })
      if (res.deals.length > 0) {
        const newDeals = res.deals as DealCardData[]
        setDeals(prev => [...prev, ...newDeals])
        setPage(nextPage)
        // Hydrate bookmark state for newly loaded deals
        const newIds = newDeals.map(d => d.id)
        getSavedDealIds(newIds).then(saved => {
          if (saved.length > 0) {
            setSavedIds(prev => new Set([...prev, ...saved]))
          }
        }).catch(() => {})
      }
      setHasMore(nextPage < res.pages)
    } catch (err) {
      console.error('Failed to load more deals:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)]">
        <p>{locale === 'vi' ? 'Chưa có deal nào' : 'No deals yet'}</p>
      </div>
    )
  }

  const Composer = COMPOSERS[composerKey] ?? MydealzCard

  return (
    <div className="flex flex-col">
      <div className="deal-grid">
        {deals.map((deal, i) => (
          <Composer
            key={deal.id}
            deal={deal}
            locale={locale}
            index={i}
            userVote={userVotes[deal.id] ?? 0}
            initialSaved={savedIds.has(deal.id)}
          />
        ))}
      </div>

      {hasMore && (
        infiniteScroll !== false
          ? <div ref={ref} className="py-8 flex justify-center mt-4">
              {isLoading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />}
            </div>
          : <div className="py-8 flex justify-center mt-4">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] disabled:opacity-50 transition-colors"
              >
                {isLoading ? <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current" /> : (locale === 'vi' ? 'Tải thêm' : 'Load more')}
              </button>
            </div>
      )}
    </div>
  )
}
