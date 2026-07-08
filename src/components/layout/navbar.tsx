'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchBar } from './search-bar'
import { LanguageSwitch } from './language-switch'
import { ThemeToggle } from '../theme/theme-toggle'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth-client'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, User, Settings, LogOut, Search, ChevronDown, SlidersHorizontal, Bookmark, Activity, Tag, Megaphone, MessageCircle, Award, BarChart2, Coins, Ticket, Gift, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useRef, useState } from 'react'
import { useHeaderContext } from './header-context'
import { NotificationBell } from './notification-bell'
import { DealAlarmIcon } from './deal-alarm-icon'
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
  const minimalPages = ['/dang-deal', '/cai-dat', '/dang-nhap', '/dang-ky', '/admin']
  const isMinimal = minimalPages.some(p => pathname.startsWith(p))

  // Context overrides take precedence
  const showRow2 = !isMinimal && !(headerCtx?.hideRow2)
  const showRow3 = !isMinimal && !(headerCtx?.hideRow3)

  return { showRow2, showRow3, row3Content: headerCtx?.row3 }
}

export function Navbar() {
  const { user, loading } = useAuth()
  const locale = useLocale()
  const { visible, atTop } = useScrollDirection()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const { showRow2, showRow3, row3Content } = useRowVisibility()
  const t = useTranslations('nav')

  return (
    <>
      <div
        className={`nav-scroll-container ${
          visible ? 'nav-visible' : 'nav-hidden'
        } ${atTop ? 'nav-at-top' : 'nav-scrolled'}`}
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <nav className="site-nav w-full">
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
                  <Sheet>
                    <SheetTrigger 
                      render={
                        <Button variant="outline" size="sm" className="nav-icon-btn rounded-full h-10 px-4 flex items-center gap-2 border-[var(--color-border)] shadow-sm" />
                      }
                    >
                      <Menu className="w-5 h-5" />
                      <span className="hidden sm:inline font-semibold">{t('menu')}</span>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] glass-strong">
                      <nav className="flex flex-col gap-4 mt-4 pl-4 overflow-y-auto max-h-[85vh] no-scrollbar">
                        <h2 className="font-bold text-lg mb-2 -ml-2">{t('menu')}</h2>
                        <Link href="/" className="text-base font-semibold text-[var(--color-primary)] flex items-center gap-3">
                          <Tag className="w-5 h-5" /> {t('home')}
                        </Link>
                        <Link href="/?sort=hot" className="text-base text-[var(--color-text)] flex items-center gap-3">
                          <Activity className="w-5 h-5" /> Deals
                        </Link>
                        <Link href="/ma-giam-gia" className="text-base text-[var(--color-text)] flex items-center gap-3">
                          <Coins className="w-5 h-5" /> {t('vouchers')}
                        </Link>
                        <Link href="/danh-muc" className="text-base text-[var(--color-text)] flex items-center gap-3">
                          <Menu className="w-5 h-5" /> {t('categories')}
                        </Link>
                        <Link href="/mien-phi" className="text-base text-[var(--color-text)] flex items-center gap-3">
                          <Bookmark className="w-5 h-5" /> {t('freebies')}
                        </Link>
                        <Link href="/thao-luan" className="text-base text-[var(--color-text)] flex items-center gap-3">
                          <MessageCircle className="w-5 h-5" /> {t('discussions')}
                        </Link>
                        
                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                          <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Highlights</h3>
                          <Link href="/danh-hieu" className="text-base text-[var(--color-text)] flex items-center gap-3">
                            <Award className="w-5 h-5" /> Club
                          </Link>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--color-border)] mb-4">
                          <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Account</h3>
                          {user ? (
                            <>
                              <Link href={`/ho-so/${user.name}`} className="text-base text-[var(--color-text)] flex items-center gap-3 mb-4">
                                <User className="w-5 h-5" /> {t('profile')}
                              </Link>
                              <Link href="/cai-dat" className="text-base text-[var(--color-text)] flex items-center gap-3 mb-4">
                                <Settings className="w-5 h-5" /> {t('settings')}
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link href="/dang-nhap" className="text-base text-[var(--color-primary)] font-semibold flex items-center gap-3 mb-4">
                                <User className="w-5 h-5" /> {t('login')}
                              </Link>
                              <Link href="/dang-ky" className="text-base text-[var(--color-text)] flex items-center gap-3 mb-4">
                                <LogOut className="w-5 h-5" /> {t('register')}
                              </Link>
                            </>
                          )}
                          
                          <div className="flex items-center justify-between text-base text-[var(--color-text)] mt-4">
                            <span className="flex items-center gap-3"><Settings className="w-5 h-5 opacity-0"/> {t('appearance')}</span>
                            <ThemeToggle />
                          </div>
                          <div className="flex items-center justify-between text-base text-[var(--color-text)] mt-4">
                            <span className="flex items-center gap-3"><Settings className="w-5 h-5 opacity-0"/> {t('language')}</span>
                            <LanguageSwitch />
                          </div>
                        </div>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              )}

              {/* Search — fills remaining space */}
              <div className={`flex-1 min-w-0 mx-2 ${mobileSearchOpen ? 'flex' : 'hidden md:flex'}`}>
                <SearchBar />
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-1 shrink-0">
                {!mobileSearchOpen && (
                  <div className="md:hidden">
                    <Button variant="ghost" size="icon" className="nav-icon-btn h-9 w-9" onClick={() => setMobileSearchOpen(true)}>
                      <Search className="w-[var(--icon-size)] h-[var(--icon-size)]" />
                    </Button>
                  </div>
                )}
                {mobileSearchOpen && (
                  <Button variant="ghost" size="sm" className="md:hidden ml-1" onClick={() => setMobileSearchOpen(false)}>
                    {t('cancel') || 'Hủy'}
                  </Button>
                )}

                {/* Deal Alarm */}
                <div className={`hidden sm:block ${mobileSearchOpen ? 'md:hidden' : ''}`}>
                  <DealAlarmIcon />
                </div>

                {/* Notifications */}
                <div className={`hidden sm:block ${mobileSearchOpen ? 'md:hidden' : ''}`}>
                  <NotificationBell />
                </div>



                {/* User */}
                {!loading && !user && (
                  <div className={`hidden sm:flex items-center ${mobileSearchOpen ? 'md:hidden' : ''}`}>
                    <Link href="/dang-nhap">
                      <Button variant="ghost" size="icon" className="nav-icon-btn" title={t('login')}>
                        <User className="w-[var(--icon-size)] h-[var(--icon-size)]" />
                      </Button>
                    </Link>
                  </div>
                )}

                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className={`relative h-8 w-8 rounded-full ${mobileSearchOpen ? 'hidden md:flex' : ''}`} />}>
                      <Avatar className="h-8 w-8 border border-[var(--color-nav-border)]">
                        <AvatarImage src={user.image || ''} alt={user.name} />
                        <AvatarFallback className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 glass" align="end">
                      <div className="px-2 py-1.5 font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-[var(--color-text)]">{user.name}</p>
                          <p className="text-xs leading-none text-[var(--color-text-muted)]">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}`} className="w-full flex items-center" />}>
                        <Coins className="mr-3 h-4 w-4" />
                        <span>{t('clubPoints')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}?tab=saved`} className="w-full flex items-center" />}>
                        <Bookmark className="mr-3 h-4 w-4" />
                        <span>{t('savedPosts')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}`} className="w-full flex items-center" />}>
                        <Activity className="mr-3 h-4 w-4" />
                        <span>{t('activity')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}?tab=deals`} className="w-full flex items-center" />}>
                        <Tag className="mr-3 h-4 w-4" />
                        <span>{t('postedDeals')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}?tab=discussions`} className="w-full flex items-center" />}>
                        <MessageCircle className="mr-3 h-4 w-4" />
                        <span>{t('postedDiscussions')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href="/danh-hieu" className="w-full flex items-center" />}>
                        <Award className="mr-3 h-4 w-4" />
                        <span>{t('badges')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/ho-so/${user.name}?tab=stats`} className="w-full flex items-center" />}>
                        <BarChart2 className="mr-3 h-4 w-4" />
                        <span>{t('statistics')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href="/cai-dat" className="w-full flex items-center" />}>
                        <Settings className="mr-3 h-4 w-4" />
                        <span>{t('settings')}</span>
                      </DropdownMenuItem>
                      {['ADMIN', 'MODERATOR'].includes((user as any).role) && (
                        <DropdownMenuItem className="cursor-pointer py-2" render={<Link href="/admin" className="w-full flex items-center text-[var(--color-primary)]" />}>
                          <Settings className="mr-3 h-4 w-4" />
                          <span>{t('admin')}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer py-2 text-[var(--color-danger)] focus:text-[var(--color-danger)] focus:bg-[var(--color-danger)]/10"
                        onClick={() => authClient.signOut()}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>{t('logout')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Submit Deal CTA */}
                <Link href="/dang-deal" className={`hidden sm:flex ${mobileSearchOpen ? 'md:hidden' : ''}`}>
                  <Button className="nav-cta-btn font-bold rounded-full h-9 px-5 text-[length:var(--font-size-sm)]">
                    + {t('submit')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ═══ ROW 2 — Navigation Links ═══ */}
          {showRow2 && (
            <div className="nav-row-2 border-t border-[var(--color-nav-border)]/30">
              <div className="nav-row-inner mx-auto flex items-center px-4 gap-1 h-10 overflow-x-auto no-scrollbar" style={{ maxWidth: 'var(--content-max-width)' }}>
                <CategoryDropdown />
                <Row2Link href="/ma-giam-gia" icon={<Ticket className="w-4 h-4" />} hasDropdown>{t('vouchers')}</Row2Link>
                <Row2Link href="/mien-phi" icon={<Gift className="w-4 h-4" />} hasDropdown>{t('freebies')}</Row2Link>
                <Row2Link href="/?sort=hot">{t('deals')}</Row2Link>
                <Row2Link href="/thao-luan" icon={<MessageCircle className="w-4 h-4" />}>{t('discussions')}</Row2Link>
              </div>
            </div>
          )}

          {/* ═══ ROW 3 — Context-dependent ═══ */}
          {showRow3 && row3Content && (
            <div className="nav-row-3 border-t border-[var(--color-nav-border)]/20">
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
function Row2Link({ href, icon, hasDropdown, children }: { href: string; icon?: React.ReactNode; hasDropdown?: boolean; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

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
