'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { 
  Menu, Tag, Activity, Coins, Bookmark, MessageCircle, 
  Award, User, Settings, LogOut, ChevronRight, ChevronLeft,
  Palette, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '../theme/theme-toggle'
import { LanguageSwitch } from './language-switch'
import { getCategoryTree } from '@/server/actions/category'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { useEffect } from 'react'

type CatNode = {
  id: string
  nameVi: string
  nameEn: string
  slug: string
  icon: string | null
  children: CatNode[]
}

interface MobileSidebarProps {
  user: any
}

export function MobileSidebar({ user }: MobileSidebarProps) {
  const t = useTranslations('nav')
  const [activeMenu, setActiveMenu] = useState<'main' | 'categories' | 'freebies' | 'vouchers'>('main')
  const [categories, setCategories] = useState<CatNode[]>([])

  useEffect(() => {
    getCategoryTree().then(setCategories).catch(console.error)
  }, [])

  const FREEBIES = ['Quà tặng trẻ em', 'Ebook miễn phí', 'Thực phẩm miễn phí', 'Khóa học online miễn phí', 'Game miễn phí', 'Tạp chí miễn phí', 'Dùng thử miễn phí']
  const VOUCHERS = ['OTTO', 'MediaMarkt', 'H&M', 'eBay', 'XXXLutz', 'SHEIN', 'Thalia', 'TEMU', 'IKEA', 'AliExpress', 'Zalando']

  return (
    <Sheet onOpenChange={(open) => { if (!open) setActiveMenu('main') }}>
      <SheetTrigger 
        render={
          <Button variant="outline" size="sm" className="nav-icon-btn rounded-full h-10 px-4 flex items-center gap-2 border-[var(--color-border)] shadow-sm" />
        }
      >
        <Menu className="w-5 h-5" />
        <span className="hidden sm:inline font-semibold">{t('menu')}</span>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[300px] glass-strong p-0 overflow-hidden">
        {/* Main Menu */}
        <div className={`absolute top-0 left-0 w-full h-full p-6 transition-transform duration-300 ${activeMenu === 'main' ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="flex flex-col gap-4 overflow-y-auto h-full no-scrollbar pb-10">
            <h2 className="font-bold text-lg mb-2">{t('menu')}</h2>
            <Link href="/" className="text-base font-semibold text-[var(--color-primary)] flex items-center gap-3">
              <Tag className="w-5 h-5" /> {t('home')}
            </Link>
            <Link href="/?sort=hot" className="text-base text-[var(--color-text)] flex items-center gap-3">
              <Activity className="w-5 h-5" /> Deals
            </Link>

            <button onClick={() => setActiveMenu('categories')} className="text-base text-[var(--color-text)] flex items-center justify-between gap-3 w-full text-left">
              <div className="flex items-center gap-3"><Menu className="w-5 h-5" /> {t('categories')}</div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button onClick={() => setActiveMenu('vouchers')} className="text-base text-[var(--color-text)] flex items-center justify-between gap-3 w-full text-left">
              <div className="flex items-center gap-3"><Coins className="w-5 h-5" /> {t('vouchers')}</div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button onClick={() => setActiveMenu('freebies')} className="text-base text-[var(--color-text)] flex items-center justify-between gap-3 w-full text-left">
              <div className="flex items-center gap-3"><Bookmark className="w-5 h-5" /> {t('freebies')}</div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

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
              
              <div className="flex items-center justify-between text-base text-[var(--color-text)] mt-4 mb-4">
                <span className="flex items-center gap-3"><Palette className="w-5 h-5" /> {t('appearance')}</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between text-base text-[var(--color-text)] mt-4">
                <span className="flex items-center gap-3"><Globe className="w-5 h-5" /> {t('language')}</span>
                <LanguageSwitch />
              </div>
            </div>
          </nav>
        </div>

        {/* Categories Panel */}
        <div className={`absolute top-0 left-0 w-full h-full p-6 transition-transform duration-300 ${activeMenu === 'categories' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center mb-6">
            <button onClick={() => setActiveMenu('main')} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-border)] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg ml-2">{t('categories')}</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)] no-scrollbar pb-10">
            <Link href="/danh-muc" className="text-base font-bold text-[var(--color-primary)] block py-3 border-b border-[var(--color-border)] mb-2">
              Tất cả danh mục
            </Link>
            {/* Categories List */}
            {categories.map(cat => (
              <Link key={cat.id} href={`/danh-muc/${cat.slug}`} className="text-base flex items-center py-3 text-[var(--color-text)]">
                {cat.icon ? <DynamicIcon name={cat.icon} className="w-4 h-4 mr-3 opacity-50" /> : <Tag className="w-4 h-4 mr-3 opacity-50" />}
                {cat.nameVi}
              </Link>
            ))}
          </div>
        </div>

        {/* Vouchers Panel */}
        <div className={`absolute top-0 left-0 w-full h-full p-6 transition-transform duration-300 ${activeMenu === 'vouchers' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center mb-6">
            <button onClick={() => setActiveMenu('main')} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-border)] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg ml-2">{t('vouchers')}</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)] no-scrollbar pb-10">
            <Link href="/ma-giam-gia" className="text-base font-bold text-[var(--color-primary)] block py-3 border-b border-[var(--color-border)] mb-2">
              Tất cả mã giảm giá
            </Link>
            {VOUCHERS.map(store => (
              <Link key={store} href={`/ma-giam-gia/${store.toLowerCase()}`} className="text-base block py-3 text-[var(--color-text)]">
                {store}
              </Link>
            ))}
          </div>
        </div>

        {/* Freebies Panel */}
        <div className={`absolute top-0 left-0 w-full h-full p-6 transition-transform duration-300 ${activeMenu === 'freebies' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center mb-6">
            <button onClick={() => setActiveMenu('main')} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-border)] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg ml-2">{t('freebies')}</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)] no-scrollbar pb-10">
            <Link href="/mien-phi" className="text-base font-bold text-[var(--color-primary)] block py-3 border-b border-[var(--color-border)] mb-2">
              Tất cả đồ miễn phí
            </Link>
            {FREEBIES.map(freebie => (
              <Link key={freebie} href={`/mien-phi/${freebie.toLowerCase().replace(/ /g, '-')}`} className="text-base flex items-center py-3 text-[var(--color-text)]">
                <Tag className="w-4 h-4 mr-3 opacity-50" /> {freebie}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
