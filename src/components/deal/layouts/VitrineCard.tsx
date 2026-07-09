'use client'

// Vitrine — luxury editorial. First deal = full hero; rest = serif text rows.

import type { ComposerProps } from '../deal-card'
import {
  DealCardRoot, DealCardImage, DealCardTitle,
  DealCardPrice, DealCardDescription, DealCardTemperature,
} from '../deal-card'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export function VitrineCard({ deal, locale, index = 0, userVote = 0 }: ComposerProps) {
  const isHero = index === 0

  if (isHero) {
    return (
      <DealCardRoot
        deal={deal} locale={locale} index={index} userVote={userVote}
        className="flex flex-col md:flex-row gap-10 items-start border-b border-[var(--color-border)] pb-16 mb-8 bg-transparent"
      >
        {/* Hero image — half width on desktop */}
        <DealCardImage
          className="w-full md:w-1/2 aspect-[4/3] rounded-sm overflow-hidden"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Hero content */}
        <div className="flex-1 flex flex-col gap-5 py-4">
          {deal.category && (
            <span
              className="text-[length:var(--font-size-xs)] uppercase tracking-[0.2em] text-[var(--color-text-muted)] border-b border-[var(--color-text-muted)] pb-1 w-fit"
              style={{ fontFamily: 'inherit' }}
            >
              {deal.category.nameEn}
            </span>
          )}
          <DealCardTitle
            className="text-3xl md:text-4xl font-light leading-tight"
            lines={4}
          />
          <DealCardPrice className="text-lg" />
          <DealCardDescription className="text-[length:var(--font-size-base)] leading-relaxed text-[var(--color-text-muted)]" maxChars={300} />
          <div className="flex items-center gap-6 mt-4">
            <DealCardTemperature />
            <a
              href={deal.url || `/deal/${deal.slug}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 uppercase tracking-widest text-[length:var(--font-size-xs)] border-b border-[var(--color-text)] pb-0.5 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
            >
              Xem deal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </DealCardRoot>
    )
  }

  // Secondary — editorial list item
  return (
    <DealCardRoot
      deal={deal} locale={locale} index={index} userVote={userVote}
      className="flex flex-row gap-6 items-start border-b border-[var(--color-border)] py-6 bg-transparent group/vitrine"
    >
      {/* Small image */}
      <DealCardImage
        className="w-24 h-24 shrink-0 rounded-sm overflow-hidden"
        sizes="96px"
      />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {deal.category && (
          <span className="text-[length:var(--font-size-xs)] uppercase tracking-widest text-[var(--color-text-muted)]">
            {deal.category.nameEn}
          </span>
        )}
        <DealCardTitle className="text-[length:var(--font-size-lg)] font-normal leading-snug" lines={2} />
        <DealCardPrice className="text-[length:var(--font-size-sm)]" />
      </div>

      {/* Side: temp + link */}
      <div className="shrink-0 flex flex-col items-end gap-3">
        <DealCardTemperature />
        <a
          href={deal.url || `/deal/${deal.slug}`}
          target="_blank" rel="noopener noreferrer"
          className="opacity-0 group-hover/vitrine:opacity-100 transition-opacity text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </DealCardRoot>
  )
}
