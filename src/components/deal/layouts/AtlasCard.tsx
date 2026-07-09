'use client'

// Atlas — masonry discovery wall. Variable image height. Hover-reveal actions.

import type { ComposerProps } from '../deal-card'
import {
  DealCardRoot, DealCardImage, DealCardTitle,
  DealCardPrice, DealCardTemperature, DealCardMeta,
} from '../deal-card'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { toggleSaveDeal } from '@/server/actions/deal'
import { Bookmark, ExternalLink } from 'lucide-react'

// Image aspect ratios cycle to produce natural masonry rhythm
const ASPECT_RATIOS = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[16/9]', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[16/9]', 'aspect-square']

export function AtlasCard({ deal, locale, index = 0, userVote = 0, initialSaved = false }: ComposerProps) {
  const aspectClass = ASPECT_RATIOS[index % ASPECT_RATIOS.length]
  const t = useTranslations('deal')
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
      className="relative flex flex-col overflow-hidden rounded-[var(--card-border-radius)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-200 group/atlas"
    >
      {/* Variable-height image — no fixed height, aspect-ratio drives masonry rhythm */}
      <div className={`relative w-full overflow-hidden ${aspectClass}`}>
        <DealCardImage
          className="absolute inset-0 w-full h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/atlas:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
          <Link
            href={`/deal/${deal.slug}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="View deal"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={onSave}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Save deal"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Temperature chip — always visible top-left */}
        <div className="absolute top-2 left-2">
          <DealCardTemperature />
        </div>

        {/* Sponsored badge */}
        {deal.sponsored && (
          <div className="absolute top-2 right-2">
            <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-[var(--color-sponsored)] text-white font-semibold uppercase tracking-wide">
              AD
            </span>
          </div>
        )}
      </div>

      {/* Content — compact, no fixed height */}
      <div className="flex flex-col gap-1.5 p-3">
        <DealCardTitle
          className="text-[length:var(--font-size-sm)] font-medium leading-snug"
          lines={3}
        />

        <div className="flex items-center justify-between gap-2 mt-1">
          <DealCardPrice className="text-[length:var(--font-size-base)]" />
          {deal.merchant && (
            <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] truncate max-w-[40%] shrink-0">
              {deal.merchant}
            </span>
          )}
        </div>

        <DealCardMeta className="mt-1" />
      </div>
    </DealCardRoot>
  )
}
