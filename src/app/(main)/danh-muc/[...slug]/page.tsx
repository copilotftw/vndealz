// Category page — catch-all for nested categories
// URL: /vi/danh-muc/dien-tu/may-tinh/laptop → slug=['dien-tu','may-tinh','laptop']
// TODO: Junior — get last slug, fetch breadcrumb + descendant deals, render
import { DealFeed } from '@/components/deal/deal-feed'
import { getLocale } from 'next-intl/server'

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<{ sort?: string; page?: string }> }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const categorySlug = resolvedParams.slug[resolvedParams.slug.length - 1]
  const locale = await getLocale()

  return (
    <div>
      <DealFeed categorySlug={categorySlug} searchParams={resolvedSearchParams} locale={locale} />
    </div>
  )
}
