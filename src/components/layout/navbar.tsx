'use client'

import { Link } from '@/i18n/navigation'
import { SearchBar } from './search-bar'
import { LanguageSwitch } from './language-switch'
import { ThemeToggle } from '../theme/theme-toggle'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth-client'
import { useLocale } from 'next-intl'
import { Menu, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navbar({ categoryPills }: { categoryPills?: React.ReactNode }) {
  const { user, loading } = useAuth()
  const locale = useLocale()

  return (
    <nav className="site-nav glass flex items-center px-4 gap-4 w-full border-b border-[var(--color-border)]/20 z-50">
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="text-[var(--color-text)]">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] glass-strong">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-bold text-[var(--color-primary)]">Trang Chủ</Link>
              <Link href="/danh-muc" className="text-lg text-[var(--color-text)]">Danh Mục</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo */}
      <Link href="/" className="font-bold text-[length:var(--font-size-xl)] text-[var(--color-primary)]">
        VNDealz
      </Link>

      {/* Desktop Search */}
      <SearchBar />

      {/* Desktop Category Pills */}
      <div className="hidden lg:flex flex-1 overflow-hidden max-w-lg">
        {categoryPills}
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <LanguageSwitch />
        
        {!loading && !user && (
          <div className="hidden sm:flex gap-2">
            <Link href="/dang-nhap">
              <Button variant="ghost" className="text-[var(--color-text)] hover:text-[var(--color-primary)]">
                {locale === 'vi' ? 'Đăng nhập' : 'Login'}
              </Button>
            </Link>
            <Link href="/dang-ky">
              <Button className="bg-[var(--color-primary)] text-white hover:opacity-90">
                {locale === 'vi' ? 'Đăng ký' : 'Sign Up'}
              </Button>
            </Link>
          </div>
        )}

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ''} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">{user.name}</p>
                  <p className="text-xs leading-none text-[var(--color-text-muted)]">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link href={`/ho-so/${user.name}`} className="w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{locale === 'vi' ? 'Hồ sơ' : 'Profile'}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/cai-dat" className="w-full flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{locale === 'vi' ? 'Cài đặt' : 'Settings'}</span>
                </Link>
              </DropdownMenuItem>
              {['ADMIN', 'MODERATOR'].includes((user as any).role) && (
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/admin" className="w-full flex items-center text-[var(--color-primary)]">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{locale === 'vi' ? 'Quản trị' : 'Admin'}</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-[var(--color-danger)] focus:text-[var(--color-danger)] focus:bg-[var(--color-danger)]/10"
                onClick={() => authClient.signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{locale === 'vi' ? 'Đăng xuất' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}
