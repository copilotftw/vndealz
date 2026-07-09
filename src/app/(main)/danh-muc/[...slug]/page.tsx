import { DealFeed } from '@/components/deal/deal-feed'
import { getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { Row3Injector } from '@/components/layout/row3-injector'
import { FeedTabs } from '@/components/layout/navbar'

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<{ sort?: string; page?: string }> }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const categorySlug = resolvedParams.slug[resolvedParams.slug.length - 1]
  const locale = await getLocale()
  
  const sort = (resolvedSearchParams.sort as 'hot' | 'new') || 'hot'

  const category = await db.category.findUnique({
    where: { slug: categorySlug }
  })

  if (!category) {
    notFound()
  }

  return (
    <div key={sort || 'hot'} className="ios-page-enter">
      <Row3Injector content={<FeedTabs sort={sort || 'hot'} basePath={`/danh-muc/${resolvedParams.slug.join('/')}`} />} />
      
      {/* Category Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-xl mb-6 glass p-6 flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 z-10">
          {category.icon ? (
            <DynamicIcon name={category.icon} className="w-8 h-8" />
          ) : (
            <span className="text-2xl font-bold">{category.nameVi.charAt(0)}</span>
          )}
        </div>
        <div className="text-center md:text-left z-10">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            {locale === 'en' ? category.nameEn : category.nameVi}
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Tất cả các ưu đãi, mã giảm giá và khuyến mãi mới nhất thuộc danh mục {locale === 'en' ? category.nameEn : category.nameVi}.
          </p>
        </div>
      </div>

      <DealFeed categorySlug={categorySlug} searchParams={resolvedSearchParams} locale={locale} />
    </div>
  )
}
