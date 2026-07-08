'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'
import { Globe } from 'lucide-react'

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
      size="sm" 
      onClick={toggleLocale}
      className="nav-icon-btn rounded-full gap-2 px-3 font-semibold"
      title={locale === 'vi' ? 'Switch to English' : 'Đổi sang Tiếng Việt'}
    >
      <Globe className="w-4 h-4 opacity-70" />
      <span>{locale === 'vi' ? 'EN' : 'VI'}</span>
    </Button>
  )
}
