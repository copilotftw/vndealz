'use client'

// Ledger persona nav — dense top bar with ⌘K command trigger.

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLocale, useTranslations } from 'next-intl'
import { UserMenuDropdown } from '@/components/layout/user-menu-dropdown'
import { NotificationBell } from '@/components/layout/notification-bell'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Plus } from 'lucide-react'

export function CommandBarNav() {
  const { user, loading: isLoading } = useAuth()
  const locale = useLocale()
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-nav-border)] bg-[var(--color-nav-bg)]">
      <div className="flex items-center h-10 px-4 gap-4 max-w-[var(--content-max-width)] mx-auto font-mono text-[length:var(--font-size-sm)]">
        {/* Logo — compact */}
        <Link href="/" className="font-black text-[var(--color-primary)] tracking-tight shrink-0 text-sm">
          VNDealz<span className="text-[var(--color-text-muted)] font-normal">/ledger</span>
        </Link>

        <div className="w-px h-4 bg-[var(--color-border)]" />

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-4 text-[var(--color-text-muted)]">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">{t('deals')}</Link>
          <Link href="/ma-giam-gia" className="hover:text-[var(--color-primary)] transition-colors">{t('vouchers')}</Link>
          <Link href="/thao-luan" className="hover:text-[var(--color-primary)] transition-colors">{t('forum')}</Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ⌘K trigger */}
        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded border border-[var(--color-border)] bg-[var(--color-nav-input-bg)] text-[var(--color-text-muted)] text-xs font-mono hover:border-[var(--color-primary)] transition-colors"
        >
          <Search className="w-3 h-3" />
          <span>Search</span>
          <kbd className="ml-2 opacity-60">⌘K</kbd>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isLoading && user ? (
            <>
              <NotificationBell />
              <Link href="/dang" className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                <Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">Post</span>
              </Link>
              <UserMenuDropdown
                user={user}
                t={t}
                triggerElement={
                  <button className="rounded-full ring-1 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback className="text-[0.625rem]">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </button>
                }
                contentWidth="w-44 font-mono text-sm"
              />
            </>
          ) : (
            <Link href="/dang-nhap" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">[{t('signIn')}]</Link>
          )}
        </div>
      </div>
    </header>
  )
}
