import { getDeals } from '@/server/actions/deal'
import { DealList } from './deal-list'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

import { getTranslations } from 'next-intl/server'

export async function DealFeed({ 
  searchParams, 
  locale,
  type,
  categorySlug,
}: { 
  searchParams: { sort?: string; page?: string }
  locale: string
  type?: string
  categorySlug?: string
}) {
  const sort = (searchParams?.sort as any) || 'hot'
  const page = parseInt(searchParams?.page || '1')

  const { deals, total, pages } = await getDeals({
    sort,
    type,
    categorySlug,
    page,
  })

  // Get current user session
  const session = await auth.api.getSession({ headers: await headers() })
  let userVotes: Record<string, number> = {}

  if (session?.user && deals.length > 0) {
    const dealIds = deals.map(d => d.id)
    const votes = await db.vote.findMany({
      where: { userId: session.user.id, dealId: { in: dealIds } }
    })
    votes.forEach(v => {
      userVotes[v.dealId] = v.value
    })
  }

  const t = await getTranslations('common')

  // Construct base url for pagination
  const params = new URLSearchParams()
  if (sort) params.set('sort', sort)

  return (
    <div className="space-y-[var(--section-gap)]">
      {/* ponytail: tabs moved to navbar row 3 via HeaderContext */}

      <DealList deals={deals as any} locale={locale} userVotes={userVotes} />

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link 
              href={`?sort=${sort}&page=${page - 1}`}
              className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--border-radius-md)] hover:bg-[var(--color-primary)]/10 transition-colors bg-[var(--color-surface)]/50"
            >
              {t('previous')}
            </Link>
          )}
          <span className="px-4 py-2 text-[var(--color-text-muted)]">
            {t('page')} {page} / {pages}
          </span>
          {page < pages && (
            <Link 
              href={`?sort=${sort}&page=${page + 1}`}
              className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--border-radius-md)] hover:bg-[var(--color-primary)]/10 transition-colors bg-[var(--color-surface)]/50"
            >
              {t('next')}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
