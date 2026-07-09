'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'


export function LanguageSwitch() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi'
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <Button 
      variant="ghost" 
      onClick={toggleLocale}
      className="nav-icon-btn rounded-full font-semibold text-base h-10 w-10 flex items-center justify-center p-0"
      title={locale === 'vi' ? 'Switch to English' : 'Đổi sang Tiếng Việt'}
    >
      <span>{locale === 'vi' ? 'EN' : 'VI'}</span>
    </Button>
  )
}
