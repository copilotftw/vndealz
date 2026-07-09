'use client'

// Vitrine persona nav — centered serif wordmark, hides on scroll down.

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useTranslations } from 'next-intl'
import { NotificationBell } from '@/components/layout/notification-bell'
import { UserMenuDropdown } from '@/components/layout/user-menu-dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Plus, Bell } from 'lucide-react'

export function MinimalNav() {
  const { user, loading: isLoading } = useAuth()
  const t = useTranslations('nav')
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < 60) setVisible(true)
        else if (y < lastY.current - 8) setVisible(true)
        else if (y > lastY.current + 8) setVisible(false)
        lastY.current = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-[var(--color-bg)] border-b border-[var(--color-border)] transition-transform duration-500 ease-in-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-[var(--content-max-width)] mx-auto flex items-center justify-between h-14 px-8">
        {/* Left: search */}
        <Link href="/tim-kiem" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
          <Search className="w-4 h-4" />
        </Link>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="font-serif tracking-widest uppercase text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
          style={{ fontFamily: '"Georgia", "Times New Roman", serif', letterSpacing: '0.25em' }}
        >
          VNDealz
        </Link>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {!isLoading && (user ? (
            <>
              <NotificationBell customTrigger={
                <button className="flex items-center justify-center w-8 h-8 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
              } />
              <Link
                href="/dang"
                className="flex items-center gap-1 text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors uppercase tracking-widest"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('post')}</span>
              </Link>
              <UserMenuDropdown
                user={user}
                t={t}
                triggerElement={
                  <button className="rounded-full ring-1 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback className="text-[0.625rem]">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
            </>
          ) : (
            <Link href="/dang-nhap" className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors uppercase tracking-widest">
              {t('signIn')}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
