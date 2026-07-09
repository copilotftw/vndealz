import { getDeals } from '@/server/actions/deal'
import { DealList } from './deal-list'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { getThemeStyles } from '@/components/theme/theme-provider'
import { getSafeUserSettings } from '@/server/actions/settings'
import { LAYOUTS } from '@/components/theme/registry'
import type { ComposerKey } from '@/components/theme/persona'

export async function DealFeed({
  searchParams,
  locale,
  type,
  categorySlug,
  merchant,
  defaultSort,
}: {
  searchParams: { sort?: string; page?: string; price?: string; temp?: string }
  locale: string
  type?: string
  categorySlug?: string
  merchant?: string
  defaultSort?: string
}) {
  const sort = (searchParams?.sort as any) || defaultSort || 'hot'
  const page = parseInt(searchParams?.page || '1')

  let priceMin: number | undefined
  let priceMax: number | undefined
  if (searchParams?.price) {
    const [minStr, maxStr] = searchParams.price.split('-')
    if (minStr !== '') priceMin = Number(minStr)
    if (maxStr !== '') priceMax = Number(maxStr)
  }
  const tempFilter = searchParams?.temp as 'hot' | 'warm' | 'cold' | undefined

  // Read active persona + user settings in parallel.
  const [{ layout }, userSettings] = await Promise.all([
    getThemeStyles(),
    getSafeUserSettings(),
  ])
  const composerKey = layout as ComposerKey
  const persona = LAYOUTS[composerKey as keyof typeof LAYOUTS] ?? LAYOUTS.mydealz
  const infiniteScroll = (userSettings.preferences as Record<string, any>)?.endlessScroll ?? true

  const dataFlags = {
    needsImage: persona.data.needsImage,
    needsDescription: persona.data.needsDescription,
    needsPriceHistory: persona.data.needsPriceHistory,
  }

  const { deals, pages } = await getDeals({
    sort, type, categorySlug, merchant, page,
    limit: persona.data.pageSize,
    data: dataFlags,
    priceMin,
    priceMax,
    tempFilter,
  })

  const session = await auth.api.getSession({ headers: await headers() })
  let userVotes: Record<string, number> = {}
  let userSaved: Set<string> = new Set()

  if (session?.user && deals.length > 0) {
    const dealIds = deals.map(d => d.id)
    const [votes, bookmarks] = await Promise.all([
      db.vote.findMany({ where: { userId: session.user.id, dealId: { in: dealIds } } }),
      db.bookmark.findMany({ where: { userId: session.user.id, dealId: { in: dealIds } }, select: { dealId: true } }),
    ])
    votes.forEach(v => { userVotes[v.dealId] = v.value })
    bookmarks.forEach(b => userSaved.add(b.dealId))
  }

  return (
    <div className="space-y-[var(--section-gap)]">
      <DealList
        deals={deals}
        locale={locale}
        userVotes={userVotes}
        userSaved={userSaved}
        composerKey={composerKey}
        sort={sort}
        type={type}
        categorySlug={categorySlug}
        merchant={merchant}
        initialPages={pages}
        pageSize={persona.data.pageSize}
        dataFlags={dataFlags}
        infiniteScroll={infiniteScroll}
        priceMin={priceMin}
        priceMax={priceMax}
        tempFilter={tempFilter}
      />
    </div>
  )
}
