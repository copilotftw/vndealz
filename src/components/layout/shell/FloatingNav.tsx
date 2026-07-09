'use client'

// Prism persona nav — floating pill with blur backdrop, centered links.

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLocale, useTranslations } from 'next-intl'
import { SearchBar } from '@/components/layout/search-bar'
import { NotificationBell } from '@/components/layout/notification-bell'
import { UserMenuDropdown } from '@/components/layout/user-menu-dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function FloatingNav() {
  const { user, loading: isLoading } = useAuth()
  const locale = useLocale()
  const t = useTranslations('nav')

  const [scrolled, setScrolled] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] shadow-lg'
            : 'bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)]'
        }`}
        style={{ backdropFilter: 'var(--glass-blur)' }}
      >
        {/* Logo */}
        <Link href="/" className="font-black text-[var(--color-primary)] shrink-0 mr-2 text-lg">
          VNDealz
        </Link>

        {/* Search — takes remaining space */}
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!isLoading && user ? (
            <>
              <NotificationBell />
              <Link href="/dang">
                <Button size="sm" className="rounded-full gap-1 h-8 px-3">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">{t('post')}</span>
                </Button>
              </Link>
              <UserMenuDropdown
                user={user}
                t={t}
                triggerElement={
                  <button className="rounded-full ring-2 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback className="text-xs">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
            </>
          ) : (
            <Link href="/dang-nhap">
              <Button size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs">{t('signIn')}</Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
