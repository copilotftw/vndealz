import { getDeals } from '@/server/actions/deal'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

export async function RelatedDeals({ categorySlug, currentDealId, locale }: { categorySlug: string, currentDealId: string, locale: string }) {
  const { deals } = await getDeals({ categorySlug, limit: 12, sort: 'hot' })
  const filteredDeals = deals.filter(d => d.id !== currentDealId).slice(0, 8)
  
  if (filteredDeals.length === 0) return null
  
  const t = await getTranslations('dealDetail')

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-[length:var(--font-size-xl)] font-bold mb-4 text-[var(--color-text)]">
        {t('relatedDeals')}
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {filteredDeals.map(deal => (
          <Link href={`/deal/${deal.slug}`} key={deal.id} className="group shrink-0 w-[160px] md:w-[180px] snap-start bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-[var(--border-radius-lg)] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative">
            
            {/* Temp badge */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-[var(--color-danger)] text-xs font-bold px-1.5 py-0.5 rounded-sm shadow-sm z-10 border border-[var(--color-border)]/20">
              {deal.temperature}°
            </div>

            <div className="relative aspect-square w-full bg-white flex items-center justify-center p-2 border-b border-[var(--color-border)]/40">
              <Image
                src={deal.image || 'https://utfs.io/f/placeholder.png'}
                alt={deal.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="200px"
              />
            </div>
            
            <div className="p-3 flex-1 flex flex-col">
              <h4 className="text-[13px] font-semibold text-[var(--color-text)] line-clamp-3 leading-snug group-hover:text-[var(--color-primary)] transition-colors mb-3">
                {deal.title}
              </h4>
              
              <div className="mt-auto flex flex-col gap-1">
                {deal.price !== null && (
                  <span className="text-[15px] font-black text-[var(--color-success)] leading-none">
                    {formatPrice(Number(deal.price), locale === 'vi' ? 'vi-VN' : 'en-US')}
                  </span>
                )}
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                  {deal.comparePrice !== null && (
                    <s className="text-[11px] text-[var(--color-text-muted)] font-medium">
                      {formatPrice(Number(deal.comparePrice), locale === 'vi' ? 'vi-VN' : 'en-US')}
                    </s>
                  )}
                  {deal.comparePrice !== null && deal.price !== null && (
                    <span className="bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30 text-[10px] font-bold px-1 py-0.5 rounded-sm">
                      -{Math.round((1 - Number(deal.price) / Number(deal.comparePrice)) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
