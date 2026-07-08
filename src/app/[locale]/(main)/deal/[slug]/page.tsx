import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { DealDetail } from '@/components/deal/deal-detail'
import { CommentThread } from '@/components/comment/comment-thread'
import { getLocale } from 'next-intl/server'

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

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-[var(--section-gap)]">
      <DealDetail deal={deal} locale={locale} />
      
      <div className="bg-[var(--color-surface)]/50 glass-subtle p-6 rounded-[var(--border-radius-xl)] border border-[var(--color-border)]/50">
        <h2 className="text-[length:var(--font-size-xl)] font-bold mb-6 text-[var(--color-text)]">
          {locale === 'vi' ? 'Bình luận' : 'Comments'}
        </h2>
        <CommentThread dealId={deal.id} locale={locale} />
      </div>
    </div>
  )
}
