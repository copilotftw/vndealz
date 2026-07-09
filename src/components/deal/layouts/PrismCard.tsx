'use client'

// Prism — glass bento card. Hot deals (temp ≥ 100) span 2 cols via CSS.

import type { ComposerProps } from '../deal-card'
import {
  DealCardRoot, DealCardImage, DealCardTitle,
  DealCardPrice, DealCardTemperature, DealCardFooter,
} from '../deal-card'

export function PrismCard({ deal, locale, index = 0, userVote = 0 }: ComposerProps) {
  const isHot = deal.temperature >= 100

  return (
    <DealCardRoot
      deal={deal} locale={locale} index={index} userVote={userVote}
      className={`flex flex-col overflow-hidden backdrop-blur-[var(--glass-blur)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-border-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 ${isHot ? 'prism-card-featured' : ''}`}
    >
      {/* Image — fills top, taller for featured */}
      <DealCardImage
        className={`relative w-full overflow-hidden rounded-t-[var(--card-border-radius)] ${isHot ? 'h-52' : 'h-40'}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
      />

      {/* Content */}
      <div className="flex flex-col gap-2 p-[var(--card-padding)] flex-1">
        {/* Temperature chip + time */}
        <div className="flex items-center justify-between">
          <DealCardTemperature />
          {deal.sponsored && (
            <span className="text-[length:var(--font-size-xs)] px-2 py-0.5 rounded-full bg-[var(--color-sponsored)] text-white font-semibold">
              AD
            </span>
          )}
        </div>

        <DealCardTitle className="text-[length:var(--font-size-base)]" lines={isHot ? 3 : 2} />
        <DealCardPrice />

        {/* Merchant */}
        {deal.merchant && (
          <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] truncate">
            {deal.merchant}
          </span>
        )}

        <div className="mt-auto pt-2">
          <DealCardFooter />
        </div>
      </div>
    </DealCardRoot>
  )
}
