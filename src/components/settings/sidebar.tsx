'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Settings as SettingsIcon, Share2, Bell, Rss, VolumeX } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function SettingsSidebar() {
  const pathname = usePathname()
  const t = useTranslations('settings')

  const navItems = [
    { name: t('nav.profile'), href: '/cai-dat/ho-so', icon: User },
    { name: t('nav.preferences'), href: '/cai-dat/tuy-chon', icon: SettingsIcon },
    { name: t('nav.social'), href: '/cai-dat/mang-xa-hoi', icon: Share2 },
    { name: t('nav.notifications'), href: '/cai-dat/thong-bao', icon: Bell },
    { name: t('nav.subscriptions'), href: '/cai-dat/dang-ky', icon: Rss },
    { name: t('nav.followers'), href: '/cai-dat/nguoi-theo-doi', icon: VolumeX },
  ]

  return (
    <aside className="w-full md:w-[280px] shrink-0">
      <div className="py-4">
        <h2 className="font-bold text-2xl mb-6 px-4 text-[var(--color-text)]">{t('title')}</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/cai-dat/ho-so' && pathname === '/cai-dat')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors font-semibold text-sm ${
                  isActive 
                    ? 'text-[var(--color-primary)] border-l-4 border-[var(--color-primary)] bg-black/5 dark:bg-white/5' 
                    : 'text-[var(--color-text-muted)] border-l-4 border-transparent hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
