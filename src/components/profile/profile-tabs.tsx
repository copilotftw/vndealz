'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface ProfileTabsProps {
  username: string
}

export function ProfileTabs({ username }: ProfileTabsProps) {
  const pathname = usePathname()
  const t = useTranslations('profile')
  const [activeHref, setActiveHref] = useState('')

  useEffect(() => {
    setActiveHref(decodeURIComponent(pathname))
  }, [pathname])

  const tabs = [
    { id: 'points', label: t('tabs.points'), href: `/ho-so/${username}` },
    { id: 'saved', label: t('tabs.saved'), href: `/ho-so/${username}/saved` },
    { id: 'activity', label: t('tabs.activity'), href: `/ho-so/${username}/activity` },
    { id: 'deals', label: t('tabs.deals'), href: `/ho-so/${username}/deals` },
    { id: 'referrals', label: t('tabs.referrals'), href: `/ho-so/${username}/referrals` },
    { id: 'discussions', label: t('tabs.discussions'), href: `/ho-so/${username}/discussions` },
    { id: 'badges', label: t('tabs.badges'), href: `/ho-so/${username}/badges` },
    { id: 'stats', label: t('tabs.stats'), href: `/ho-so/${username}/stats` },
  ]

  return (
    <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar pt-2 px-4 relative">
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--color-border)]/50" />
      {tabs.map(tab => {
        const isActive = activeHref === tab.href || activeHref === `/en${tab.href}` || activeHref === `/vi${tab.href}`
        return (
          <Link 
            key={tab.id} 
            href={tab.href}
            onClick={() => setActiveHref(tab.href)}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap focus:outline-none transition-colors relative z-10 ${
              isActive 
                ? 'text-[var(--color-text)]' 
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
