import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { DealDetail } from '@/components/deal/deal-detail'
import { CommentThread } from '@/components/comment/comment-thread'
import { getLocale } from 'next-intl/server'
import { Row3Injector } from '@/components/layout/row3-injector'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { RelatedDeals } from '@/components/deal/related-deals'

export default async function DealPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const locale = await getLocale()
  
  const deal = await db.deal.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      user: { select: { id: true, name: true, avatar: true, tier: true } },
      category: true,
      priceHistory: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!deal) return notFound()
  
  const serializedDeal = {
    ...deal,
    price: deal.price ? Number(deal.price) : null,
    comparePrice: deal.comparePrice ? Number(deal.comparePrice) : null,
  }

  const breadcrumb = (
    <div className="flex items-center gap-1.5 text-[length:var(--font-size-sm)] text-[var(--color-nav-text-muted)] w-full">
      <Link href="/danh-muc" className="hover:text-[var(--color-primary)] transition-colors">
        {locale === 'vi' ? 'Danh mục' : 'Categories'}
      </Link>
      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      <Link href={`/danh-muc/${deal.category.slug}`} className="hover:text-[var(--color-primary)] transition-colors font-medium text-[var(--color-nav-text)]">
        {locale === 'vi' ? deal.category.nameVi : deal.category.nameEn}
      </Link>
    </div>
  )

  return (
    <div className="max-w-[850px] mx-auto flex flex-col gap-2">
      <Row3Injector content={breadcrumb} />
      <DealDetail deal={serializedDeal as any} locale={locale} />
      
      <RelatedDeals categorySlug={deal.category.slug} currentDealId={deal.id} locale={locale} />

      <CommentThread dealId={deal.id} locale={locale} />
    </div>
  )
}
