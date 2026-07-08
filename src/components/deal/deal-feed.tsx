import { getDeals } from '@/server/actions/deal'
import { DealList } from './deal-list'
import { Link } from '@/i18n/navigation'

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

  const isVi = locale === 'vi'

  const tabs = [
    { id: 'hot', label: isVi ? 'Hot nhất' : 'Hottest' },
    { id: 'new', label: isVi ? 'Mới nhất' : 'Newest' },
    { id: 'trending', label: isVi ? 'Đang nổi' : 'Trending' },
  ]

  // Construct base url for pagination
  const params = new URLSearchParams()
  if (sort) params.set('sort', sort)

  return (
    <div className="space-y-[var(--section-gap)]">
      <div className="flex gap-2 bg-[var(--color-surface)] p-1 rounded-[var(--border-radius-lg)] glass-subtle border border-[var(--color-border)]/50 w-fit mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`?sort=${tab.id}`}
            className={`px-4 py-2 rounded-[var(--border-radius-md)] text-[length:var(--font-size-sm)] font-medium transition-all ${
              sort === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-md'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <DealList deals={deals as any} locale={locale} />

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link 
              href={`?sort=${sort}&page=${page - 1}`}
              className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--border-radius-md)] hover:bg-[var(--color-primary)]/10 transition-colors bg-[var(--color-surface)]/50"
            >
              {isVi ? 'Trước' : 'Prev'}
            </Link>
          )}
          <span className="px-4 py-2 text-[var(--color-text-muted)]">
            {isVi ? 'Trang' : 'Page'} {page} / {pages}
          </span>
          {page < pages && (
            <Link 
              href={`?sort=${sort}&page=${page + 1}`}
              className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--border-radius-md)] hover:bg-[var(--color-primary)]/10 transition-colors bg-[var(--color-surface)]/50"
            >
              {isVi ? 'Tiếp' : 'Next'}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
