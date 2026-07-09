'use client'

import { useTranslations } from 'next-intl'
import { SettingsHeader } from '@/components/settings/header'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SubscriptionsPage() {
  const t = useTranslations('settings')

  return (
    <div className="max-w-2xl text-[var(--color-text)]">
      <form className="space-y-0" onSubmit={(e) => { e.preventDefault() }}>
        <SettingsHeader title={t('subscriptions.title')} showSave={false} />

        <div className="py-8">
          <h2 className="text-xl font-bold mb-2">{t('subscriptions.title')}</h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            {t('subscriptions.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Select>
                <SelectTrigger className="w-full bg-transparent border-[var(--color-border)] h-12">
                  <SelectValue placeholder={t('subscriptions.selectSubscription')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>{t('subscriptions.selectSubscription')}</SelectItem>
                  <SelectItem value="tech">Tech & Electronics</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="button" 
              disabled 
              className="bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)] hover:bg-black/20 dark:hover:bg-white/20 rounded-full px-8 h-12 font-bold transition-colors w-full sm:w-auto sm:min-w-[160px]"
            >
              {t('subscriptions.subscribe')}
            </Button>
          </div>
        </div>

      </form>
    </div>
  )
}
