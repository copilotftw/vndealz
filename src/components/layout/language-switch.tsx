'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'

export function LanguageSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const onToggle = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi'
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <button 
      onClick={onToggle}
      disabled={isPending}
      className="px-2 py-1 rounded-[var(--border-radius-sm)] hover:bg-[var(--color-primary)]/10 text-[length:var(--font-size-lg)] transition-colors opacity-80 hover:opacity-100 disabled:opacity-50"
      title={locale === 'vi' ? 'Switch to English' : 'Đổi sang tiếng Việt'}
    >
      {locale === 'vi' ? '🇬🇧' : '🇻🇳'}
    </button>
  )
}
