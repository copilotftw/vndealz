import { DealFeed } from '@/components/deal/deal-feed'
import { getLocale } from 'next-intl/server'
import { CategoryBanner } from '@/components/category/category-banner'
import { FilterSidebar } from '@/components/category/filter-sidebar'
import { db } from '@/lib/db'

export default async function FreebiesPage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string }> }) {
  const resolvedSearchParams = await searchParams
  const locale = await getLocale()
  
  // Fetch some images for the banner
  const recentFreebies = await db.deal.findMany({
    where: { type: 'FREEBIE', status: 'ACTIVE', image: { not: null } },
    take: 5,
    orderBy: { createdAt: 'desc' }
  })
  
  const images = recentFreebies.map(d => d.image!).filter(Boolean)

  return (
    <div className="flex flex-col min-h-screen">
      <CategoryBanner 
        title="Kostenlose Ebooks"
        subtitle="72 Deals & Angebote. Alle kostenlosen Ebooks & Kindle-Deals - Juli 2026"
        breadcrumbs={[{ label: 'Freebies', href: '/mien-phi' }, { label: 'Kostenlose Ebooks', href: '#' }]}
        images={images}
      />
      <div className="flex gap-[var(--section-gap)] px-4 py-[var(--section-gap)] flex-1 max-w-[1280px] mx-auto w-full">
        <FilterSidebar />
        <main className="flex-1 min-w-0">
          <DealFeed type="FREEBIE" searchParams={resolvedSearchParams} locale={locale} />
        </main>
      </div>
    </div>
  )
}
