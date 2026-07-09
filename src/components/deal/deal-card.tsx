'use client'

import { createContext, useContext } from 'react'
import { formatPrice, timeAgo } from '@/lib/utils'
import { TemperatureVote } from './temperature-vote'
import { Bookmark, MessageCircle, ExternalLink, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { UserHoverCard } from '@/components/profile/user-hover-card'

// ── SHARED TYPES ─────────────────────────────────────────────────

export type DealCardData = {
  id: string
  slug: string
  title: string
  image: string | null
  price: any
  comparePrice: any
  merchant: string | null
  temperature: number
  sponsored: boolean
  createdAt: Date
  couponCode: string | null
  url?: string | null
  description?: string | null
  blurHash?: string | null
  type?: string
  status?: string
  isNsfw?: boolean
  categoryId?: string
  priceHistory?: { price: any; createdAt: Date }[]
  user: { id?: string; name?: string; avatar?: string | null; image?: string | null; tier?: string | null }
  category: { nameVi: string; nameEn: string; slug: string }
  _count: { comments: number }
}

export type ComposerProps = {
  deal: DealCardData
  locale: string
  index?: number
  userVote?: number
  initialSaved?: boolean
}

// ── CONTEXT ───────────────────────────────────────────────────────

type DealCardContextValue = DealCardData & { locale: string; userVote: number }

const DealCardContext = createContext<DealCardContextValue | null>(null)

function useDealCard() {
  const ctx = useContext(DealCardContext)
  if (!ctx) throw new Error('DealCard primitives must be used inside DealCardRoot')
  return ctx
}

// ── PRIMITIVES ────────────────────────────────────────────────────

export function DealCardRoot({
  deal, locale, userVote = 0, index = 0,
  className = '', style, children,
}: ComposerProps & { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <DealCardContext.Provider value={{ ...deal, locale, userVote }}>
      <article
        className={`deal-card deal-card-root deal-card-enter group ${className}`}
        style={{ animationDelay: `${index * 60}ms`, containerType: 'inline-size', '--vt-name': `deal-${deal.id}` as string, ...style } as React.CSSProperties}
      >
        {children}
      </article>
    </DealCardContext.Provider>
  )
}

export function DealCardImage({ className = '', sizes }: { className?: string; sizes?: string }) {
  const { slug, image, title } = useDealCard()
  return (
    <Link href={`/deal/${slug}`} className={`deal-card-image relative shrink-0 block overflow-hidden bg-white/90 ${className}`}>
      <Image
        src={image || `https://picsum.photos/seed/${slug}/400/300`}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px'}
      />
    </Link>
  )
}

export function DealCardTitle({ className = '', lines = 2 }: { className?: string; lines?: number }) {
  const { slug, title } = useDealCard()
  return (
    <Link href={`/deal/${slug}`} className="deal-card-title-link block group-hover:text-[var(--color-primary)] transition-colors">
      <h3 className={`deal-card-title text-[var(--color-text)] leading-snug font-bold line-clamp-${lines} ${className}`}>
        {title}
      </h3>
    </Link>
  )
}

export function DealCardPrice({ className = '' }: { className?: string }) {
  const { price, comparePrice, couponCode, locale } = useDealCard()
  const isVi = locale === 'vi'
  return (
    <div className={`deal-card-price-row flex flex-wrap items-center gap-2 ${className}`}>
      {price !== null && (
        <span className="deal-card-price text-[var(--color-danger)] font-black">
          {formatPrice(Number(price), isVi ? 'vi-VN' : 'en-US')}
        </span>
      )}
      {comparePrice !== null && (
        <s className="deal-card-compare text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
          {formatPrice(Number(comparePrice), isVi ? 'vi-VN' : 'en-US')}
        </s>
      )}
      {couponCode && (
        <span className="deal-card-coupon bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] text-[var(--color-primary)] font-mono font-bold px-2 py-0.5 rounded-[var(--border-radius-sm)] uppercase tracking-wider">
          {couponCode}
        </span>
      )}
    </div>
  )
}

export function DealCardTemperature({ className = '', glass = false }: { className?: string; glass?: boolean }) {
  const { id, temperature, userVote } = useDealCard()
  return (
    <div className={className}>
      <TemperatureVote dealId={id} temperature={temperature} userVote={userVote} glass={glass} />
    </div>
  )
}

export function DealCardMeta({ className = '' }: { className?: string }) {
  const { merchant, user } = useDealCard()
  return (
    <div className={`deal-card-meta-row flex items-center justify-between ${className}`}>
      {merchant && (
        <span className="deal-card-merchant inline-flex items-center gap-1 opacity-80">
          <Store className="w-3 h-3" />
          <strong className="text-[var(--color-text)] text-[length:var(--font-size-xs)]">{merchant}</strong>
        </span>
      )}
      {user?.name && (
        <UserHoverCard user={{
          name: user.name,
          avatar: user.avatar || user.image,
          tier: (user as any).tier,
          createdAt: new Date(),
          stats: { deals: 0, comments: 0 },
        }}>
          <span className="deal-card-author inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
            <img
              src={user.avatar || user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name!)}`}
              width={20} height={20} alt="" className="rounded-full bg-gray-100"
            />
            <strong className="text-[var(--color-text)] text-[length:var(--font-size-xs)]">{user.name}</strong>
          </span>
        </UserHoverCard>
      )}
    </div>
  )
}

export function DealCardDescription({ className = '', maxChars = 200 }: { className?: string; maxChars?: number }) {
  const { description } = useDealCard()
  if (!description) return null
  return (
    <div className={`deal-card-description ${className}`}>
      {description.replace(/<[^>]*>?/gm, '').slice(0, maxChars)}
    </div>
  )
}

export function DealCardFooter({ className = '' }: { className?: string }) {
  const t = useTranslations('deal')
  const { slug, url, _count } = useDealCard()
  return (
    <div className={`deal-card-footer flex items-center justify-between pt-3 mt-3 border-t border-[var(--color-border)] ${className}`}>
      <div className="deal-card-actions flex items-center gap-3 text-[var(--color-text-muted)]">
        <Link href={`/deal/${slug}#comments`} className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium text-[length:var(--font-size-sm)]">{_count.comments}</span>
        </Link>
        <button className="hover:text-[var(--color-primary)] transition-colors" aria-label="Bookmark">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
      <a
        href={url || `/deal/${slug}`}
        target="_blank" rel="noopener noreferrer"
        className="deal-card-cta bg-[var(--color-success)] hover:brightness-110 text-white font-bold rounded-[var(--border-radius-sm)] px-3 py-1.5 inline-flex items-center gap-1.5 transition-all shadow-sm text-sm"
      >
        {t('goToDeal')}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}

export function DealCardTopMeta({ className = '' }: { className?: string }) {
  const { createdAt, locale } = useDealCard()
  return (
    <div className={`deal-card-meta-top flex items-center justify-between ${className}`}>
      <DealCardTemperature />
      <span className="deal-card-time text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] opacity-70">
        {timeAgo(createdAt, locale)}
      </span>
    </div>
  )
}
