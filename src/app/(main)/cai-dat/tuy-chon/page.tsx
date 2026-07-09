'use client'

import { useTranslations } from 'next-intl'
import { SettingsHeader } from '@/components/settings/header'
import { SettingsCheckbox } from '@/components/settings/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { LanguageSwitch } from '@/components/layout/language-switch'
import { useState, useEffect, useTransition } from 'react'
import { getUserSettings, updatePreferences } from '@/server/actions/settings'
import { toast } from 'sonner'


export default function PreferencesPage() {
  const t = useTranslations('settings')
  const [isPending, startTransition] = useTransition()
  const [preferences, setPreferences] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    getUserSettings().then(data => setPreferences(data.preferences))
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data: Record<string, any> = {
      defaultLanding: formData.get('defaultLanding'),
      endlessScroll: formData.get('endlessScroll') === 'on',
      widgets: {
        showActivity: formData.get('w_showActivity') === 'on',
        showHottest: formData.get('w_showHottest') === 'on',
        showPopularCategories: formData.get('w_showPopularCategories') === 'on',
        showTopVouchers: formData.get('w_showTopVouchers') === 'on',
        showDiscussions: formData.get('w_showDiscussions') === 'on',
        showLatestNewsHome: formData.get('w_showLatestNewsHome') === 'on',
        showLatestNewsCategories: formData.get('w_showLatestNewsCategories') === 'on',
      },
      autoFollowCommented: formData.get('autoFollowCommented') === 'on',
      showNsfw: formData.get('showNsfw') === 'on',
      allowOthersToFollow: formData.get('allowOthersToFollow') === 'on',
    }

    startTransition(async () => {
      try {
        await updatePreferences(data)
        toast.success(t('updateSuccess'))
      } catch (err) {
        toast.error(t('updateError'))
      }
    })
  }

  if (!preferences) return null

  return (
    <div className="max-w-2xl text-[var(--color-text)]">
      <form className="space-y-0" onSubmit={handleSubmit}>
        <SettingsHeader title={t('preferences.title')} isPending={isPending} />

        {/* Landing Page */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('preferences.defaultLanding')}</h3>
          </div>
          <div className="w-2/3">
            <Select name="defaultLanding" defaultValue={preferences.defaultLanding || "hot"}>
              <SelectTrigger className="w-full bg-transparent border-white/20">
                <SelectValue placeholder={t('preferences.landingOptions.hottest')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">{t('preferences.landingOptions.hottest')}</SelectItem>
                <SelectItem value="new">{t('preferences.landingOptions.newest')}</SelectItem>
                <SelectItem value="trending">{t('preferences.landingOptions.trending')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Page Appearance */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('preferences.pageAppearance')}</h3>
          </div>
          <div className="w-2/3">
            <SettingsCheckbox id="endlessScroll" name="endlessScroll" label={t('preferences.endlessScroll')} defaultChecked={preferences.endlessScroll ?? true} />
          </div>
        </div>

        {/* Widgets */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('preferences.widgets')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="w1" name="w_showActivity" label={t('preferences.showActivity')} defaultChecked={preferences.widgets?.showActivity ?? true} />
            <SettingsCheckbox id="w2" name="w_showHottest" label={t('preferences.showHottest')} defaultChecked={preferences.widgets?.showHottest ?? true} />
            <SettingsCheckbox id="w3" name="w_showPopularCategories" label={t('preferences.showPopularCategories')} defaultChecked={preferences.widgets?.showPopularCategories ?? false} />
            <SettingsCheckbox id="w4" name="w_showTopVouchers" label={t('preferences.showTopVouchers')} defaultChecked={preferences.widgets?.showTopVouchers ?? false} />
            <SettingsCheckbox id="w5" name="w_showDiscussions" label={t('preferences.showDiscussions')} defaultChecked={preferences.widgets?.showDiscussions ?? true} />
            <SettingsCheckbox id="w6" name="w_showLatestNewsHome" label={t('preferences.showLatestNewsHome')} defaultChecked={preferences.widgets?.showLatestNewsHome ?? true} />
            <SettingsCheckbox id="w7" name="w_showLatestNewsCategories" label={t('preferences.showLatestNewsCategories')} defaultChecked={preferences.widgets?.showLatestNewsCategories ?? true} />
          </div>
        </div>

        {/* Auto Follow */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('preferences.autoFollow')}</h3>
          </div>
          <div className="w-2/3">
            <SettingsCheckbox id="autoFollow" name="autoFollowCommented" label={t('preferences.autoFollowCommented')} defaultChecked={preferences.autoFollowCommented ?? true} />
          </div>
        </div>

        {/* NSFW */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('preferences.adultContent')}</h3>
          </div>
          <div className="w-2/3">
            <SettingsCheckbox id="nsfw" name="showNsfw" label={t('preferences.showNsfw')} description={t('preferences.nsfwHint')} defaultChecked={preferences.showNsfw ?? false} />
          </div>
        </div>

        {/* Privacy */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('preferences.privacy')}</h3>
          </div>
          <div className="w-2/3">
            <SettingsCheckbox id="privacy" name="allowOthersToFollow" label={t('preferences.allowOthersToFollow')} defaultChecked={preferences.allowOthersToFollow ?? true} />
          </div>
        </div>

        {/* Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">Giao diện (Theme)</h3>
          </div>
          <div className="w-2/3">
            <ThemeToggle />
          </div>
        </div>

        {/* Language */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">Ngôn ngữ (Language)</h3>
          </div>
          <div className="w-2/3">
            <LanguageSwitch />
          </div>
        </div>
      </form>
    </div>
  )
}
