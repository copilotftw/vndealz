'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Home, Tag, PlusCircle, Bell, User, AlarmClock } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function MobileNav() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const { user } = useAuth()

  const navItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/canh-bao-deal', icon: AlarmClock, label: t('alarms') },
    { href: '/dang', icon: PlusCircle, label: t('submit'), special: true },
    { href: '/thong-bao', icon: Bell, label: t('alerts') },
    { href: user ? `/ho-so/${user.name}` : '/dang-nhap', icon: User, label: user ? t('profile') : t('login') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong z-50 md:hidden flex items-center justify-around h-16 border-t border-[var(--color-border)] px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        if (item.special) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center -mt-6 relative group">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[length:var(--font-size-xs)] font-medium truncate w-full text-center px-1">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
