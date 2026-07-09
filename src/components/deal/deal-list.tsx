'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { DealCard } from './deal-card'
import { getDeals } from '@/server/actions/deal'

type Deal = Parameters<typeof DealCard>[0]['deal']

export function DealList({ 
  deals: initialDeals, 
  locale, 
  userVotes = {},
  sort,
  type,
  categorySlug,
  merchant,
  initialPages
}: { 
  deals: Deal[]; 
  locale: string; 
  userVotes?: Record<string, number>;
  sort?: string;
  type?: string;
  categorySlug?: string;
  merchant?: string;
  initialPages: number;
}) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialPages > 1)
  const [isLoading, setIsLoading] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px'
  })

  // Load more deals when scrolling down
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore()
    }
  }, [inView, hasMore, isLoading])

  const loadMore = async () => {
    setIsLoading(true)
    try {
      const nextPage = page + 1
      const res = await getDeals({
        sort: sort as any,
        type,
        categorySlug,
        merchant,
        page: nextPage
      })

      if (res.deals.length > 0) {
        setDeals(prev => [...prev, ...(res.deals as Deal[])])
        setPage(nextPage)
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
        {/* TODO: EmptyState component */}
        <p>{locale === 'vi' ? 'Chưa có deal nào' : 'No deals yet'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="deal-grid">
        {deals.map((deal, i) => (
          <DealCard key={deal.id} deal={deal} locale={locale} index={i} userVote={userVotes[deal.id] || 0} />
        ))}
      </div>
      
      {hasMore && (
        <div ref={ref} className="py-8 flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      )}
    </div>
  )
}
