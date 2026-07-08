import { formatPrice, timeAgo } from '@/lib/utils'
import { TemperatureVote } from './temperature-vote'
import { Bookmark, MessageCircle, Tag, Clock } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

type DealCardProps = {
  deal: {
    id: string; slug: string; title: string; image: string | null
    price: any; comparePrice: any; merchant: string | null
    temperature: number; sponsored: boolean; createdAt: Date; couponCode: string | null
    user: { id?: string; username?: string; name?: string; image?: string | null }
    category: { nameVi: string; nameEn: string; slug: string }
    _count: { comments: number }
  }
  locale: string
  index?: number
}

export function DealCard({ deal, locale, index = 0 }: DealCardProps) {
  const isVi = locale === 'vi'

  return (
    <article
      className="deal-card deal-card-enter group flex flex-col md:flex-row relative"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Deal image with next/image */}
      <Link href={`/deal/${deal.slug}`} className="deal-card-image relative shrink-0 block bg-white/50">
        <Image
          src={deal.image || 'https://utfs.io/f/placeholder.png'}
          alt={deal.title}
          fill
          className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 200px"
        />
        {deal.sponsored && (
          <span className="absolute top-2 left-2 bg-[var(--color-sponsored)] text-white text-[length:var(--font-size-xs)] font-bold px-2 py-0.5 rounded-[var(--border-radius-sm)] shadow-sm">
            {isVi ? 'Tài trợ' : 'Sponsored'}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-[var(--card-padding)] min-w-0">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Link href={`/deal/${deal.slug}`} className="flex-1">
            <h3 className="text-[length:var(--font-size-lg)] font-bold text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
              {deal.title}
            </h3>
          </Link>
          <Button variant="ghost" size="icon" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] shrink-0 h-8 w-8 -mt-1 -mr-1">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {deal.price && (
          <div className="flex items-end gap-2 mb-3 flex-wrap">
            <span className="text-[length:var(--font-size-2xl)] font-black text-[var(--color-danger)] leading-none">
              {formatPrice(Number(deal.price), isVi ? 'vi-VN' : 'en-US')}
            </span>
            {deal.comparePrice && (
              <s className="text-[length:var(--font-size-sm)] text-[var(--color-text-muted)] leading-relaxed">
                {formatPrice(Number(deal.comparePrice), isVi ? 'vi-VN' : 'en-US')}
              </s>
            )}
            {deal.couponCode && (
              <span className="ml-auto bg-[var(--color-surface)] border border-[var(--color-border)]/50 border-dashed text-[length:var(--font-size-sm)] font-mono px-2 py-1 rounded-[var(--border-radius-sm)] text-[var(--color-primary)]">
                {deal.couponCode}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[length:var(--font-size-sm)] text-[var(--color-text-muted)] mt-auto pt-4 border-t border-[var(--color-border)]/30">
          {deal.merchant && (
            <span className="font-semibold text-[var(--color-text)]">{deal.merchant}</span>
          )}
          <Link href={`/danh-muc/${deal.category.slug}`} className="hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors">
            <Tag className="w-3.5 h-3.5" />
            {isVi ? deal.category.nameVi : deal.category.nameEn}
          </Link>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(deal.createdAt, locale)}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <MessageCircle className="w-4 h-4" />
            {deal._count.comments}
          </span>
        </div>
      </div>
      
      {/* Floating Temperature Vote on Desktop, embedded on mobile */}
      <div className="md:absolute md:-left-4 md:-bottom-4 p-4 md:p-0 mt-2 md:mt-0 z-10 self-center md:self-auto">
        <TemperatureVote dealId={deal.id} temperature={deal.temperature} />
      </div>
    </article>
  )
}
