import { Metadata } from 'next'
import { DealFeed } from '@/components/deal/deal-feed'
import { getLocale } from 'next-intl/server'

interface BrandPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const p = await params
  const brandName = p.slug.toUpperCase()
  return {
    title: `Khuyến mãi, Mã giảm giá ${brandName}`,
    description: `Tổng hợp các deal, khuyến mãi và mã giảm giá tốt nhất từ ${brandName}.`,
  }
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const p = await params
  const sp = await searchParams
  // The slug is often something like "shopee", "lazada", "tiki"
  const merchantSlug = decodeURIComponent(p.slug)
  const locale = await getLocale()
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="bg-card border border-[var(--color-border)] rounded-xl p-6 text-center space-y-2">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">
          Khuyến mãi {merchantSlug.toUpperCase()}
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Cập nhật các deal và mã giảm giá mới nhất từ {merchantSlug.charAt(0).toUpperCase() + merchantSlug.slice(1)}.
        </p>
      </div>

      <DealFeed 
        searchParams={sp as any}
        locale={locale}
        merchant={merchantSlug}
      />
    </div>
  )
}
