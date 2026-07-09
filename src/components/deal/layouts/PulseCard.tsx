'use client'

// Pulse — full-viewport snap card. Chrome hidden. Black bg. Overlay actions.

import type { ComposerProps } from '../deal-card'
import { DealCardRoot, DealCardTemperature } from '../deal-card'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { formatPrice } from '@/lib/utils'
import { toggleSaveDeal } from '@/server/actions/deal'
import { Bookmark, MessageCircle, ExternalLink } from 'lucide-react'

export function PulseCard({ deal, locale, index = 0, userVote = 0, initialSaved = false }: ComposerProps) {
  const t = useTranslations('deal')
  const isVi = locale === 'vi'
  const [saved, setSaved] = useState(initialSaved)

  const onSave = async () => {
    try {
      const res = await toggleSaveDeal(deal.id)
      setSaved(res.saved)
      toast.success(res.saved ? t('dealSaved') : t('dealRemoved'))
    } catch {
      toast.error(t('signInRequired'))
    }
  }

  return (
    <DealCardRoot
      deal={deal} locale={locale} index={index} userVote={userVote}
      className="relative w-full overflow-hidden bg-black border-0 rounded-none pulse-card"
      style={{ height: '100%', minHeight: '45dvh' }}
    >
      {/* Full-bleed background image */}
      <Image
        src={deal.image || `https://picsum.photos/seed/${deal.slug}/800/1200`}
        alt={deal.title}
        fill
        className="object-cover"
        sizes="100vw"
        priority={index < 2}
      />

      {/* Gradient overlay — bottom-heavy for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Overlay content — bottom */}
      <div data-pulse-bottom className="absolute bottom-0 left-0 right-0 px-5 pb-[max(env(safe-area-inset-bottom),24px)] pt-4 flex items-end justify-between gap-4">
        {/* Left: info */}
        <div className="flex-1 min-w-0 space-y-2">
          {deal.category && (
            <span className="inline-block text-[0.6875rem] uppercase tracking-widest text-white/60 font-medium">
              {deal.category.nameEn}
            </span>
          )}
          <Link href={`/deal/${deal.slug}`}>
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-3 drop-shadow">
              {deal.title}
            </h3>
          </Link>
          {deal.price !== null && (
            <p className="text-[var(--color-accent,#FFD700)] font-black text-2xl tabular-nums drop-shadow">
              {formatPrice(Number(deal.price), isVi ? 'vi-VN' : 'en-US')}
            </p>
          )}
          {deal.merchant && (
            <p data-pulse-merchant className="text-white/60 text-sm">{deal.merchant}</p>
          )}
        </div>

        {/* Right: action rail */}
        <div className="flex flex-col items-center gap-5 shrink-0 pb-2">
          <DealCardTemperature className="text-white" glass />

          <Link
            href={`/deal/${deal.slug}#comments`}
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <MessageCircle className="w-7 h-7 drop-shadow" />
            <span className="text-[0.6875rem] font-semibold tabular-nums">{deal._count.comments}</span>
          </Link>

          <button
            onClick={onSave}
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
            aria-label="Bookmark"
          >
            <Bookmark className={`w-7 h-7 drop-shadow ${saved ? 'fill-current text-[var(--color-accent,#FFD700)]' : ''}`} />
          </button>

          <a
            href={deal.url || `/deal/${deal.slug}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-lg hover:bg-white/25 transition-all active:scale-95"
            aria-label="Go to deal"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </DealCardRoot>
  )
}
