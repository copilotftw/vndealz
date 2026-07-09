'use client'

// Ledger — dense monospace data row. No image.

import type { ComposerProps } from '../deal-card'
import { DealCardRoot, DealCardTemperature, DealCardPrice } from '../deal-card'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

export function LedgerRow({ deal, locale, index = 0, userVote = 0 }: ComposerProps) {
  return (
    <DealCardRoot
      deal={deal} locale={locale} index={index} userVote={userVote}
      className="flex flex-row items-center gap-3 border-b border-[var(--color-border)] px-2 py-2 bg-transparent hover:bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] transition-colors group/row font-mono"
      style={{ animationDelay: `${index * 20}ms` }}
    >
      {/* Temperature — fixed width */}
      <div className="shrink-0 w-20">
        <DealCardTemperature />
      </div>

      {/* Title — flex-1, truncated */}
      <Link
        href={`/deal/${deal.slug}`}
        className="flex-1 min-w-0 text-[length:var(--font-size-sm)] text-[var(--color-text)] truncate hover:text-[var(--color-primary)] transition-colors"
      >
        {deal.title}
      </Link>

      {/* Price */}
      <div className="shrink-0 hidden sm:block">
        <DealCardPrice />
      </div>

      {/* Merchant */}
      {deal.merchant && (
        <span className="shrink-0 hidden md:block text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] w-28 truncate">
          {deal.merchant}
        </span>
      )}

      {/* Age */}
      <span className="shrink-0 text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] w-16 text-right tabular-nums">
        {timeAgo(deal.createdAt, locale)}
      </span>

      {/* External link — show on row hover */}
      <a
        href={deal.url || `/deal/${deal.slug}`}
        target="_blank" rel="noopener noreferrer"
        className="shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        aria-label="Go to deal"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </DealCardRoot>
  )
}
