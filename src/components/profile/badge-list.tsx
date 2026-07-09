'use client'

import { useTranslations } from 'next-intl'
import { BadgeIcon } from './badge-icon'
import { UserBadgeProgress } from '@/lib/badges/engine'
import { BADGE_CONFIG } from '@/lib/badges/config'

interface BadgeListProps {
  badges: UserBadgeProgress[]
  locale?: string
}

export function BadgeList({ badges, locale = 'vi' }: BadgeListProps) {
  const t = useTranslations('profile')

  return (
    <div className="flex flex-col rounded-[var(--border-radius-xl)] bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)]/50">
      {badges.map((badge, index) => {
        const config = BADGE_CONFIG.find(c => c.id === badge.badgeId)
        if (!config) return null
        const isLast = index === badges.length - 1
        const name = locale === 'vi' ? config.nameVi : config.nameEn
        const description = locale === 'vi' ? config.descriptionVi : config.descriptionEn
        
        return (
          <div 
            key={badge.badgeId}
            className={`flex items-start gap-4 p-6 ${!isLast ? 'border-b border-[var(--color-border)]/50' : ''}`}
          >
            <BadgeIcon 
              icon={config.icon} 
              color={config.color}
              isLocked={!badge.isUnlocked && badge.progress === 0}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-lg leading-none">{name}</h3>
                
                {/* Right side info (Date, Progress, or Gesperrt) */}
                <div className="shrink-0 text-sm font-medium">
                  {badge.lockedText ? (
                    <span className="px-2 py-1 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] text-xs uppercase">
                      {badge.lockedText}
                    </span>
                  ) : badge.isUnlocked ? (
                    <span className="text-[var(--color-text-muted)]">
                      {badge.unlockedAt 
                        ? badge.unlockedAt.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Unlocked'}
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">
                      {badge.progress}/{config.threshold}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-[var(--color-text)] mb-3">{description}</p>
              
              {/* Progress Bar (only show if not completely locked and not fully unlocked) */}
              {!badge.isUnlocked && !badge.lockedText && (
                <div className="w-full h-2 bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (badge.progress / config.threshold) * 100))}%`,
                      backgroundColor: config.color
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
