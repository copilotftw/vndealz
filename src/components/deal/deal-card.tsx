import { formatPrice, timeAgo } from '@/lib/utils'
import { TemperatureVote } from './temperature-vote'
import { Bookmark, MessageCircle, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { UserHoverCard } from '@/components/profile/user-hover-card'

type DealCardProps = {
  deal: {
    id: string; slug: string; title: string; image: string | null
    price: any; comparePrice: any; merchant: string | null
    temperature: number; sponsored: boolean; createdAt: Date; couponCode: string | null
    url?: string | null; description?: string | null
    user: { id?: string; name?: string; avatar?: string | null; image?: string | null }
    category: { nameVi: string; nameEn: string; slug: string }
    _count: { comments: number }
  }
  locale: string
  index?: number
  userVote?: number
}

// ponytail: single component, layout driven entirely by CSS vars (--card-direction, --card-image-*)
export function DealCard({ deal, locale, index = 0, userVote = 0 }: DealCardProps) {
  const t = useTranslations('deal')
  const isVi = locale === 'vi'

  return (
    <article
      className="deal-card deal-card-enter group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image — sizing controlled by CSS vars */}
      <Link href={`/deal/${deal.slug}`} className="deal-card-image relative shrink-0 block rounded-[var(--border-radius-sm)] overflow-hidden bg-white/90">
        <Image
          src={deal.image || 'https://picsum.photos/seed/' + deal.slug + '/400/300'}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
        />
        {deal.sponsored && (
          <span className="absolute top-2 left-2 bg-[var(--color-sponsored)] text-white text-[length:var(--font-size-xs)] font-bold px-2 py-0.5 rounded-[var(--border-radius-sm)] shadow-sm z-10">
            {t('sponsored')}
          </span>
        )}
      </Link>

      {/* Content — adapts via container queries in CSS */}
      <div className="deal-card-content">
        {/* Top: Temperature + Time */}
        <div className="deal-card-meta-top">
          <TemperatureVote dealId={deal.id} temperature={deal.temperature} userVote={userVote} />
          <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] opacity-70">
            {timeAgo(deal.createdAt, locale)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/deal/${deal.slug}`} className="block group-hover:text-[var(--color-primary)] transition-colors">
          <h3 className="deal-card-title text-[var(--color-text)] line-clamp-2 leading-snug font-bold">
            {deal.title}
          </h3>
        </Link>

        {/* Price row */}
        <div className="deal-card-price-row">
          {deal.price !== null && (
            <span className="deal-card-price text-[var(--color-danger)] font-black">
              {formatPrice(Number(deal.price), locale === 'vi' ? 'vi-VN' : 'en-US')}
            </span>
          )}
          {deal.comparePrice !== null && (
            <s className="text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
              {formatPrice(Number(deal.comparePrice), locale === 'vi' ? 'vi-VN' : 'en-US')}
            </s>
          )}
          {deal.couponCode && (
            <span className="deal-card-coupon bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] text-[var(--color-primary)] font-mono font-bold px-2 py-0.5 rounded-[var(--border-radius-sm)] uppercase tracking-wider">
              {deal.couponCode}
            </span>
          )}
        </div>

        {/* Description — shown in MyDealz, hidden in grid layouts via CSS */}
        {deal.description && (
          <div className="deal-card-description">
            {deal.description.replace(/<[^>]*>?/gm, '').slice(0, 200)}
          </div>
        )}

        {/* Merchant + Author (hidden in grid layouts via CSS) */}
        <div className="deal-card-meta-row">
          {deal.merchant && (
            <span>
              <span className="opacity-60">{t('at')}</span>{' '}
              <strong className="text-[var(--color-text)]">{deal.merchant}</strong>
            </span>
          )}
          {deal.user?.name && (
            <UserHoverCard user={{
              name: deal.user.name,
              avatar: deal.user.avatar || deal.user.image,
              tier: (deal.user as any).tier,
              createdAt: new Date(), // We don't have createdAt in the deal query currently, will pass dummy for now or update query later
              stats: { deals: 0, comments: 0 } // dummy stats for now
            }}>
              <span className="deal-card-author">
                <img
                  src={deal.user.avatar || deal.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(deal.user.name!)}`}
                  width={16} height={16} alt="" className="rounded-full inline-block align-text-bottom"
                />
                {' '}<strong className="text-[var(--color-text)]">{deal.user.name}</strong>
              </span>
            </UserHoverCard>
          )}
        </div>

        {/* Footer: actions */}
        <div className="deal-card-footer">
          <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
            <Link href={`/deal/${deal.slug}#comments`} className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium text-[length:var(--font-size-sm)]">{deal._count.comments}</span>
            </Link>
            <button className="hover:text-[var(--color-primary)] transition-colors" aria-label="Bookmark">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
          <a
            href={deal.url || `/deal/${deal.slug}`}
            target="_blank" rel="noopener noreferrer"
            className="deal-card-cta bg-[var(--color-success)] hover:brightness-110 text-white font-bold rounded-[var(--border-radius-sm)] inline-flex items-center gap-1.5 transition-all shadow-sm"
          >
            {t('goToDeal')}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
