'use client'

import { Siren } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function DealAlarmIcon() {
  const t = useTranslations('nav')
  return (
    <Button variant="ghost" nativeButton={false} className="nav-icon-btn h-10 px-3 gap-2 flex items-center rounded-full whitespace-nowrap" title={t('alarm')} render={
      <Link href="/alerts/manage" className="flex items-center gap-2 whitespace-nowrap">
        <Siren className="w-[var(--icon-size)] h-[var(--icon-size)] shrink-0" />
        <span className="hidden xl:inline font-bold text-sm whitespace-nowrap">{t('alarm')}</span>
      </Link>
    } />
  )
}
