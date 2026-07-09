'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Coins, Bookmark, Activity, Tag, MessageCircle, Award, BarChart2,
  Settings, Shield, LogOut, Moon, Sun, Globe,
} from 'lucide-react'

export function UserMenuDropdown({
  user,
  t,
  triggerElement,
  align = 'end',
  contentWidth = 'w-56',
}: {
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string }
  t: (key: string) => string
  triggerElement: React.ReactElement
  align?: 'start' | 'center' | 'end'
  contentWidth?: string
}) {
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const router = useRouter()

  const toggleLocale = () => {
    const next = locale === 'vi' ? 'en' : 'vi'
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={triggerElement} />
      <DropdownMenuContent className={contentWidth} align={align}>
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          {user.email && <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>}
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}`} className="w-full flex items-center" />}>
          <Coins className="mr-3 h-4 w-4" /><span>{t('clubPoints')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}/saved`} className="w-full flex items-center" />}>
          <Bookmark className="mr-3 h-4 w-4" /><span>{t('savedPosts')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}/activity`} className="w-full flex items-center" />}>
          <Activity className="mr-3 h-4 w-4" /><span>{t('activity')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}/deals`} className="w-full flex items-center" />}>
          <Tag className="mr-3 h-4 w-4" /><span>{t('postedDeals')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}/thao-luan`} className="w-full flex items-center" />}>
          <MessageCircle className="mr-3 h-4 w-4" /><span>{t('discussions')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}/badges`} className="w-full flex items-center" />}>
          <Award className="mr-3 h-4 w-4" /><span>{t('badges')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}/stats`} className="w-full flex items-center" />}>
          <BarChart2 className="mr-3 h-4 w-4" /><span>{t('statistics')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href="/cai-dat" className="w-full flex items-center" />}>
          <Settings className="mr-3 h-4 w-4" /><span>{t('settings')}</span>
        </DropdownMenuItem>
        {['ADMIN', 'MODERATOR'].includes((user as any).role) && (
          <DropdownMenuItem className="cursor-pointer py-2" render={<Link href="/quan-tri" className="w-full flex items-center text-[var(--color-primary)]" />}>
            <Shield className="mr-3 h-4 w-4" /><span>{t('admin')}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer py-2" closeOnClick={false} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Moon className="mr-3 h-4 w-4" /> : <Sun className="mr-3 h-4 w-4" />}
          <span>{t('appearance')}</span>
          <span className="ml-auto text-xs opacity-50">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2" closeOnClick={false} onClick={toggleLocale}>
          <Globe className="mr-3 h-4 w-4" />
          <span>{t('language')}</span>
          <span className="ml-auto text-xs opacity-50">{locale === 'vi' ? 'VI' : 'EN'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer py-2 text-[var(--color-danger)] focus:text-[var(--color-danger)] focus:bg-[var(--color-danger)]/10"
          onClick={() => authClient.signOut()}
        >
          <LogOut className="mr-3 h-4 w-4" /><span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
