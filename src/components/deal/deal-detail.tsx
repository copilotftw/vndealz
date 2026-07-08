'use client'

import { formatPrice, timeAgo } from '@/lib/utils'
import { TemperatureVote } from './temperature-vote'
import { PriceChart } from './price-chart'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Copy, ExternalLink, User, Tag, Clock, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function DealDetail({ deal, locale }: { deal: any, locale: string }) {
  const isVi = locale === 'vi'
  const [copied, setCopied] = useState(false)

  const copyCoupon = () => {
    if (deal.couponCode) {
      navigator.clipboard.writeText(deal.couponCode)
      setCopied(true)
      toast.success(isVi ? 'Đã copy mã giảm giá!' : 'Coupon copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Rewrite affiliate URL if needed (in real implementation, do it server-side or here)
  const affiliateUrl = deal.affiliateUrl || deal.url

  return (
    <article className="glass-strong rounded-[var(--border-radius-xl)] shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row p-[var(--card-padding)] gap-6 lg:gap-10">
        
        {/* Left column: Image */}
        <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-[var(--border-radius-lg)] overflow-hidden bg-white/50 border border-[var(--color-border)]/50 flex items-center justify-center p-4">
            <Image
              src={deal.image || 'https://utfs.io/f/placeholder.png'}
              alt={deal.title}
              fill
              className="object-contain mix-blend-multiply p-4"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
          <div className="flex justify-center">
            <TemperatureVote dealId={deal.id} temperature={deal.temperature} />
          </div>
        </div>

        {/* Right column: Info */}
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            {deal.sponsored && (
              <span className="inline-block bg-[var(--color-sponsored)] text-white text-[length:var(--font-size-xs)] font-bold px-2 py-0.5 rounded-[var(--border-radius-sm)] shadow-sm mb-2">
                {isVi ? 'Tài trợ' : 'Sponsored'}
              </span>
            )}
            <h1 className="text-[length:var(--font-size-2xl)] md:text-[length:var(--font-size-3xl)] font-bold text-[var(--color-text)] leading-tight">
              {deal.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-end gap-3 mb-6">
            {deal.price !== null && (
              <span className="text-[length:var(--font-size-3xl)] font-black text-[var(--color-danger)] leading-none">
                {formatPrice(Number(deal.price), isVi ? 'vi-VN' : 'en-US')}
              </span>
            )}
            {deal.comparePrice !== null && (
              <s className="text-[length:var(--font-size-lg)] text-[var(--color-text-muted)] leading-snug">
                {formatPrice(Number(deal.comparePrice), isVi ? 'vi-VN' : 'en-US')}
              </s>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href={affiliateUrl} target="_blank" rel="nofollow noopener" className="flex-1 inline-flex items-center justify-center rounded-[var(--border-radius-md)] bg-[var(--color-primary)] text-white hover:opacity-90 h-12 text-lg shadow-md group font-medium transition-colors">
                {isVi ? 'Tới cửa hàng' : 'Get Deal'} 
                <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            {deal.couponCode && (
              <Button 
                onClick={copyCoupon} 
                variant="outline"
                className="flex-1 h-12 text-lg border-dashed border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10"
              >
                <span className="font-mono mr-2">{deal.couponCode}</span>
                {copied ? <Check className="w-5 h-5 text-[var(--color-success)]" /> : <Copy className="w-5 h-5" />}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-y-3 text-[length:var(--font-size-sm)] text-[var(--color-text-muted)] mb-8 bg-[var(--color-surface)]/50 p-4 rounded-[var(--border-radius-md)] border border-[var(--color-border)]/50">
            {deal.merchant && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--color-text)]">{deal.merchant}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{timeAgo(deal.createdAt, locale)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <Link href={`/danh-muc/${deal.category.slug}`} className="hover:text-[var(--color-primary)] transition-colors text-[var(--color-text)]">
                {isVi ? deal.category.nameVi : deal.category.nameEn}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <Link href={`/ho-so/${deal.user.name}`} className="hover:text-[var(--color-primary)] transition-colors text-[var(--color-text)] font-medium">
                {deal.user.name}
              </Link>
            </div>
          </div>

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-a:text-[var(--color-primary)] hover:prose-a:text-[var(--color-primary)]/80">
            <p className="whitespace-pre-line text-[var(--color-text)]">{deal.description}</p>
          </div>
          
          {deal.priceHistory && deal.priceHistory.length > 0 && (
            <PriceChart data={deal.priceHistory} />
          )}
        </div>
      </div>
    </article>
  )
}
