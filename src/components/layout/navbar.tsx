'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchBar } from './search-bar'
import { useAuth } from '@/hooks/use-auth'
import { useTranslations } from 'next-intl'
import { Menu, User, Search, ChevronDown, SlidersHorizontal, Megaphone, Ticket, Gift, LayoutGrid, Plus, Tag, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserMenuDropdown } from './user-menu-dropdown'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useEffect, useRef, useState } from 'react'
import { useHeaderContext } from './header-context'
import { NotificationBell } from './notification-bell'
import { DealAlarmIcon } from './deal-alarm-icon'
import { MobileSidebar } from './mobile-sidebar'
import { CategoryDropdown } from './category-dropdown'

// ponytail: scroll direction detection hook
function useScrollDirection() {
  const [visible, setVisible] = useState(true)
  const [atTop, setAtTop] = useState(true)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setAtTop(y < 10)
        if (y < 10) {
          setVisible(true)
        } else if (y < lastY.current - 5) {
          setVisible(true)
        } else if (y > lastY.current + 5) {
          setVisible(false)
        }
        lastY.current = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { visible, atTop }
}

// ponytail: route-based row visibility
function useRowVisibility() {
  const pathname = usePathname()
  const headerCtx = useHeaderContext()

  // Pages that hide row 2 and 3
  const minimalPages = ['/dang-deal', '/settings', '/dang-nhap', '/dang-ky', '/admin', '/ho-so']
  const isMinimal = minimalPages.some(p => pathname.startsWith(p))
  
  // Pages that remove the navbar bottom border to merge with the page header
  const seamlessPages = ['/ho-so', '/thao-luan']
  const isSeamless = seamlessPages.some(p => pathname.startsWith(p))

  // Context overrides take precedence
  const showRow2 = !isMinimal && !(headerCtx?.hideRow2)
  const showRow3 = !isMinimal && !(headerCtx?.hideRow3)

  return { showRow2, showRow3, row3Content: headerCtx?.row3, isMinimal, isSeamless }
}



export function Navbar() {
  const { user, loading } = useAuth()
  const { visible, atTop } = useScrollDirection()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const { showRow2, showRow3, row3Content, isSeamless } = useRowVisibility()
  const t = useTranslations('nav')

  return (
    <>
      <div
        className={`nav-scroll-container ${
          visible ? 'nav-visible' : 'nav-hidden'
        } ${atTop ? 'nav-at-top' : 'nav-scrolled'}`}
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <nav className={`site-nav w-full ${isSeamless ? 'nav-seamless' : ''}`}>
          {/* ═══ ROW 1 — Top Bar ═══ */}
          <div className="nav-row-1">
            <div className="nav-row-inner mx-auto flex items-center h-[var(--nav-height)] px-4 gap-3" style={{ maxWidth: 'var(--content-max-width)' }}>

              {/* Logo */}
              {!mobileSearchOpen && (
                <Link href="/" className="flex items-center gap-2 font-bold text-[length:var(--font-size-xl)] shrink-0 nav-logo mr-2">
                  <span className="bg-[var(--color-primary)] text-[var(--color-primary-text)] w-8 h-8 flex items-center justify-center rounded-lg text-lg">V</span>
                  <span className="hidden sm:inline nav-logo-text">VNDealz</span>
                </Link>
              )}

              {/* Menu Button (Desktop & Mobile) */}
              {!mobileSearchOpen && (
                <div className="shrink-0">
                  <MobileSidebar user={user} />
                </div>
              )}

              {/* Search — fills remaining space */}
              <div className="flex-1 min-w-0 mx-2 flex">
                <SearchBar />
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-1 shrink-0">

                {/* Deal Alarm */}
                <div className="hidden md:block">
                  <DealAlarmIcon />
                </div>

                {/* Notifications */}
                <div className="hidden md:block">
                  <NotificationBell />
                </div>



                {/* User */}
                {!loading && !user && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" nativeButton={false} className="nav-icon-btn h-10 px-3 gap-2 flex items-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap" title={t('login')} render={
                      <Link href="/dang-nhap" className="flex items-center gap-2 whitespace-nowrap">
                        <User className="w-[var(--icon-size)] h-[var(--icon-size)] shrink-0" />
                        <span className="hidden xl:inline font-bold text-sm whitespace-nowrap">{t('login')}</span>
                      </Link>
                    } />
                  </div>
                )}

                {user && (
                  <UserMenuDropdown
                    user={user}
                    t={t}
                    triggerElement={
                      <Button variant="ghost" className="nav-icon-btn h-10 w-10 p-0 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Avatar className="h-8 w-8 border border-[var(--color-nav-border)]">
                          <AvatarImage src={user.image || ''} alt={user.name} />
                          <AvatarFallback className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    }
                  />
                )}

                {/* Submit Deal/Discussion CTA */}
                <div className="hidden sm:flex">
                  <Link href="/dang">
                    <Button className="ml-1 bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 font-bold rounded-full px-4 h-10 transition-colors shadow-none text-sm">
                      <Plus className="w-5 h-5 mr-1" />
                      {t('add')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ ROW 2 — Navigation Links ═══ */}
          {showRow2 && (
            <div className="nav-row-2">
              <div className="nav-row-inner mx-auto flex items-center px-4 gap-1 h-10 overflow-x-auto no-scrollbar" style={{ maxWidth: 'var(--content-max-width)' }}>
                <div className="-ml-3 flex shrink-0">
                  <CategoryDropdown />
                </div>
                
                {/* Vouchers Mega Menu (Dropdown) */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[length:var(--font-size-sm)] font-medium transition-all whitespace-nowrap nav-row2-link">
                      <span className="opacity-70 flex items-center"><Ticket className="w-4 h-4" /></span>
                      {t('vouchers')}
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>
                  } />
                  <DropdownMenuContent align="start" className="w-56 max-h-[70vh] overflow-y-auto">
                    <DropdownMenuItem render={<Link href="/ma-giam-gia" className="cursor-pointer py-2 px-3 font-bold text-[var(--color-primary)] border-b border-[var(--color-border)]/50 mb-1" />}>
                      {t('vouchers')}
                    </DropdownMenuItem>
                    {['OTTO', 'MediaMarkt', 'H&M', 'eBay', 'XXXLutz', 'SHEIN', 'Thalia', 'TEMU', 'IKEA', 'AliExpress', 'Zalando'].map(store => (
                      <DropdownMenuItem key={store} render={<Link href={`/ma-giam-gia/${store.toLowerCase()}`} className="cursor-pointer py-2 px-3" />}>
                        {store}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Freebies Mega Menu (Dropdown) */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[length:var(--font-size-sm)] font-medium transition-all whitespace-nowrap nav-row2-link">
                      <span className="opacity-70 flex items-center"><Gift className="w-4 h-4" /></span>
                      {t('freebies')}
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>
                  } />
                  <DropdownMenuContent align="start" className="w-72 max-h-[70vh] overflow-y-auto">
                    <DropdownMenuItem render={<Link href="/mien-phi" className="cursor-pointer py-2 px-3 font-bold text-[var(--color-primary)] border-b border-[var(--color-border)]/50 mb-1" />}>
                      {t('freebies')}
                    </DropdownMenuItem>
                    {['Quà tặng trẻ em', 'Ebook miễn phí', 'Thực phẩm miễn phí', 'Khóa học online miễn phí', 'Game miễn phí', 'Tạp chí miễn phí', 'Dùng thử miễn phí'].map(freebie => (
                      <DropdownMenuItem key={freebie} render={<Link href={`/mien-phi/${freebie.toLowerCase().replace(/ /g, '-')}`} className="cursor-pointer py-2 px-3" />}>
                        <Tag className="w-4 h-4 mr-2 text-[var(--color-text-muted)]" />
                        {freebie}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Row2Link href="/?sort=hot">{t('deals')}</Row2Link>
                <Row2Link href="/thao-luan" icon={<MessageCircle className="w-4 h-4" />} disableHighlight>{t('discussions')}</Row2Link>
              </div>
            </div>
          )}

          {/* ═══ ROW 3 — Context-dependent ═══ */}
          {showRow3 && row3Content && (
            <div className="nav-row-3">
              <div className="nav-row-inner mx-auto flex items-center px-4 h-10" style={{ maxWidth: 'var(--content-max-width)' }}>
                {row3Content}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}

// ponytail: row 2 nav link with optional icon + dropdown chevron
function Row2Link({ href, icon, children, hasDropdown, disableHighlight }: { href: string; icon?: React.ReactNode; children: React.ReactNode; hasDropdown?: boolean; disableHighlight?: boolean }) {
  const pathname = usePathname()
  const isActive = !disableHighlight && (pathname === href || (href !== '/' && pathname.startsWith(href)))

  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[length:var(--font-size-sm)] font-medium transition-all whitespace-nowrap ${
        isActive
          ? 'nav-row2-link-active'
          : 'nav-row2-link'
      }`}
    >
      {icon && <span className="opacity-70 flex items-center">{icon}</span>}
      {children}
      {hasDropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
    </Link>
  )
}

// Exported feed tabs component for pages to use in Row 3
export function FeedTabs({ sort, basePath = '' }: { sort: string; basePath?: string }) {
  const t = useTranslations('nav')

  const tabs = [
    { id: 'hot', label: t('hottest') },
    { id: 'trending', label: t('trending') },
    { id: 'all', label: t('all') },
  ]

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`${basePath}?sort=${tab.id}`}
            className={`px-3 py-1.5 rounded-full text-[length:var(--font-size-sm)] font-medium transition-all whitespace-nowrap ${
              sort === tab.id
                ? 'nav-row3-tab-active'
                : 'nav-row3-tab'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <button className="nav-icon-btn p-1.5 rounded-md" title={t('filter')}>
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}
