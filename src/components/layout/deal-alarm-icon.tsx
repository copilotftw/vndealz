'use client'

import { Siren } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function DealAlarmIcon() {
  const t = useTranslations('nav')
  return (
    <Link href="/deal-alarm">
      <Button variant="ghost" className="nav-icon-btn h-9 px-2 xl:px-3 gap-2" title={t('alarm')}>
        <Siren className="w-[var(--icon-size)] h-[var(--icon-size)]" />
        <span className="hidden xl:inline font-medium text-sm">{t('alarm')}</span>
      </Button>
    </Link>
  )
}
