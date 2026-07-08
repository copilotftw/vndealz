'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { Home, Tag, PlusCircle, Bell, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function MobileNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const { user } = useAuth()
  const isVi = locale === 'vi'

  const navItems = [
    { href: '/', icon: Home, label: isVi ? 'Trang chủ' : 'Home' },
    { href: '/danh-muc', icon: Tag, label: isVi ? 'Danh mục' : 'Categories' },
    { href: '/dang-deal', icon: PlusCircle, label: isVi ? 'Đăng deal' : 'Submit', special: true },
    { href: '/thong-bao', icon: Bell, label: isVi ? 'Thông báo' : 'Alerts' },
    { href: user ? `/ho-so/${user.name}` : '/dang-nhap', icon: User, label: user ? (isVi ? 'Hồ sơ' : 'Profile') : (isVi ? 'Đăng nhập' : 'Login') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong z-50 lg:hidden flex items-center justify-around h-16 border-t border-[var(--color-border)] px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        if (item.special) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center -mt-6 relative group">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[length:var(--font-size-xs)] mt-1 font-medium text-[var(--color-primary)]">
                {item.label}
              </span>
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
