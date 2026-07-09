'use client'

// Pulse persona nav — minimal fixed overlay in top-right corner.
// Full-viewport scroll feed = no header bar; user actions via corner menu.

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useTranslations } from 'next-intl'
import { NotificationBell } from '@/components/layout/notification-bell'
import { UserMenuDropdown } from '@/components/layout/user-menu-dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Plus, Bell } from 'lucide-react'

export function PulseOverlayNav() {
  const { user, loading: isLoading } = useAuth()
  const t = useTranslations('nav')

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Link
        href="/"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        title={t('home')}
      >
        <Home className="w-4 h-4" />
      </Link>

      {!isLoading && (user ? (
        <>
          <NotificationBell customTrigger={
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          } />
          <Link
            href="/dang"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 transition-colors"
            title={t('post')}
          >
            <Plus className="w-4 h-4" />
          </Link>
          <UserMenuDropdown
            user={user}
            t={t}
            triggerElement={
              <button className="rounded-full ring-2 ring-white/20 hover:ring-white/50 transition-all">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback className="text-sm bg-black/40 text-white">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </button>
            }
          />
        </>
      ) : (
        <Link
          href="/dang-nhap"
          className="flex items-center justify-center h-9 px-4 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm hover:bg-black/60 transition-colors"
        >
          {t('signIn')}
        </Link>
      ))}
    </div>
  )
}
