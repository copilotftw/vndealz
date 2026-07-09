'use client'

import type { ComposerProps } from '../deal-card'
import {
  DealCardRoot, DealCardImage, DealCardTitle, DealCardPrice,
  DealCardDescription, DealCardMeta, DealCardFooter, DealCardTopMeta,
} from '../deal-card'

export function MydealzCard({ deal, locale, index = 0, userVote = 0 }: ComposerProps) {
  return (
    <DealCardRoot deal={deal} locale={locale} index={index} userVote={userVote}>
      <DealCardImage />

      <div className="deal-card-content">
        <DealCardTopMeta />
        <DealCardTitle />
        <DealCardPrice className="mt-1" />
        <DealCardDescription />
        <DealCardMeta className="mt-auto pt-2" />
        <DealCardFooter />
      </div>
    </DealCardRoot>
  )
}
