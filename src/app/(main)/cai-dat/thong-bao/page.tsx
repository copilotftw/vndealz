'use client'

import { useTranslations } from 'next-intl'
import { SettingsHeader } from '@/components/settings/header'
import { SettingsCheckbox } from '@/components/settings/checkbox'
import { useState, useEffect, useTransition } from 'react'
import { getUserSettings, updateNotificationSettings } from '@/server/actions/settings'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function NotificationsPage() {
  const t = useTranslations('settings')
  const [isPending, startTransition] = useTransition()
  const [settings, setSettings] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    getUserSettings().then(data => setSettings(data.notificationSettings))
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Helper to get boolean
    const b = (name: string) => formData.get(name) === 'on'

    const data: Record<string, any> = {
      browser: { pm: b('n-pm') },
      general: { mention: b('n-gen-mention'), notifyEmail: b('n-gen-email') },
      myDeals: {
        dealRated: b('n-my-1'),
        dealCommented: b('n-my-2'),
        dealHot: b('n-my-3'),
        dealInfoAdded: b('n-my-4'),
        dealBeforeExpire: b('n-my-5'),
        dealExpired: b('n-my-6'),
        dealUnexpired: b('n-my-7'),
        dealCheckActive: b('n-my-8'),
        dealStats: b('n-my-9'),
        notifyEmail: b('n-my-email')
      },
      followedDeals: {
        followedCommented: b('n-fol-1'),
        followedInfoAdded: b('n-fol-2')
      },
      myAddedInfo: {
        infoLiked: b('n-info-1'),
        notifyEmail: b('n-info-email')
      },
      clubPoints: {
        levelUp: b('n-cp-1'),
        loseBenefits: b('n-cp-2'),
        commentHelpful: b('n-cp-3'),
        pointsVoted: b('n-cp-4'),
        refUsed: b('n-cp-5'),
        notifyEmail: b('n-cp-email')
      },
      badges: {
        newBadge: b('n-bg-1'),
        superPoster: b('n-bg-2'),
        notifyEmail: b('n-bg-email')
      },
      follows: {
        followedPosted: b('n-f-1'),
        notifyEmail: b('n-f-email')
      },
      messages: {
        notifyEmail: b('n-m-email')
      }
    }

    startTransition(async () => {
      try {
        await updateNotificationSettings(data)
        toast.success(t('updateSuccess'))
      } catch (err) {
        toast.error(t('updateError'))
      }
    })
  }

  if (!settings) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>

  return (
    <div className="max-w-2xl text-[var(--color-text)]">
      <form className="space-y-0" onSubmit={handleSubmit}>
        <SettingsHeader title={t('notifications.title')} isPending={isPending} />

        {/* Browser */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.browser')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-pm" name="n-pm" label={t('notifications.pm')} defaultChecked={settings.browser?.pm ?? false} />
          </div>
        </div>

        {/* General */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.general')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-gen-mention" name="n-gen-mention" label={t('notifications.mention')} defaultChecked={settings.general?.mention ?? true} />
            <SettingsCheckbox id="n-gen-email" name="n-gen-email" label={t('notifications.notifyEmail')} defaultChecked={settings.general?.notifyEmail ?? false} />
          </div>
        </div>

        {/* My Deals */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.myDeals')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-my-1" name="n-my-1" label={t('notifications.dealRated')} defaultChecked={settings.myDeals?.dealRated ?? true} />
            <SettingsCheckbox id="n-my-2" name="n-my-2" label={t('notifications.dealCommented')} defaultChecked={settings.myDeals?.dealCommented ?? true} />
            <SettingsCheckbox id="n-my-3" name="n-my-3" label={t('notifications.dealHot')} defaultChecked={settings.myDeals?.dealHot ?? true} />
            <SettingsCheckbox id="n-my-4" name="n-my-4" label={t('notifications.dealInfoAdded')} defaultChecked={settings.myDeals?.dealInfoAdded ?? true} />
            <SettingsCheckbox id="n-my-5" name="n-my-5" label={t('notifications.dealBeforeExpire')} defaultChecked={settings.myDeals?.dealBeforeExpire ?? true} />
            <SettingsCheckbox id="n-my-6" name="n-my-6" label={t('notifications.dealExpired')} defaultChecked={settings.myDeals?.dealExpired ?? true} />
            <SettingsCheckbox id="n-my-7" name="n-my-7" label={t('notifications.dealUnexpired')} defaultChecked={settings.myDeals?.dealUnexpired ?? true} />
            <SettingsCheckbox id="n-my-8" name="n-my-8" label={t('notifications.dealCheckActive')} defaultChecked={settings.myDeals?.dealCheckActive ?? true} />
            <SettingsCheckbox id="n-my-9" name="n-my-9" label={t('notifications.dealStats')} defaultChecked={settings.myDeals?.dealStats ?? true} />
            <SettingsCheckbox id="n-my-email" name="n-my-email" label={t('notifications.notifyEmail')} defaultChecked={settings.myDeals?.notifyEmail ?? false} />
          </div>
        </div>

        {/* Followed Deals */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.followedDeals')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-fol-1" name="n-fol-1" label={t('notifications.followedCommented')} defaultChecked={settings.followedDeals?.followedCommented ?? true} />
            <SettingsCheckbox id="n-fol-2" name="n-fol-2" label={t('notifications.followedInfoAdded')} defaultChecked={settings.followedDeals?.followedInfoAdded ?? true} />
          </div>
        </div>

        {/* My Added Info */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.myAddedInfo')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-info-1" name="n-info-1" label={t('notifications.infoLiked')} defaultChecked={settings.myAddedInfo?.infoLiked ?? true} />
            <SettingsCheckbox id="n-info-email" name="n-info-email" label={t('notifications.notifyEmail')} defaultChecked={settings.myAddedInfo?.notifyEmail ?? false} />
          </div>
        </div>

        {/* Club Points */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.clubPoints')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-cp-1" name="n-cp-1" label={t('notifications.levelUp')} defaultChecked={settings.clubPoints?.levelUp ?? true} />
            <SettingsCheckbox id="n-cp-2" name="n-cp-2" label={t('notifications.loseBenefits')} defaultChecked={settings.clubPoints?.loseBenefits ?? true} />
            <SettingsCheckbox id="n-cp-3" name="n-cp-3" label={t('notifications.commentHelpful')} defaultChecked={settings.clubPoints?.commentHelpful ?? true} />
            <SettingsCheckbox id="n-cp-4" name="n-cp-4" label={t('notifications.pointsVoted')} defaultChecked={settings.clubPoints?.pointsVoted ?? true} />
            <SettingsCheckbox id="n-cp-5" name="n-cp-5" label={t('notifications.refUsed')} defaultChecked={settings.clubPoints?.refUsed ?? true} />
            <SettingsCheckbox id="n-cp-email" name="n-cp-email" label={t('notifications.notifyEmail')} defaultChecked={settings.clubPoints?.notifyEmail ?? false} />
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.badges')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-bg-1" name="n-bg-1" label={t('notifications.newBadge')} defaultChecked={settings.badges?.newBadge ?? true} />
            <SettingsCheckbox id="n-bg-2" name="n-bg-2" label={t('notifications.superPoster')} defaultChecked={settings.badges?.superPoster ?? true} />
            <SettingsCheckbox id="n-bg-email" name="n-bg-email" label={t('notifications.notifyEmail')} defaultChecked={settings.badges?.notifyEmail ?? false} />
          </div>
        </div>

        {/* Follows */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.follows')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-f-1" name="n-f-1" label={t('notifications.followedPosted')} defaultChecked={settings.follows?.followedPosted ?? true} />
            <SettingsCheckbox id="n-f-email" name="n-f-email" label={t('notifications.notifyEmail')} defaultChecked={settings.follows?.notifyEmail ?? false} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('notifications.messages')}</h3>
          </div>
          <div className="w-2/3 space-y-4">
            <SettingsCheckbox id="n-m-email" name="n-m-email" label={t('notifications.notifyEmail')} defaultChecked={settings.messages?.notifyEmail ?? false} />
          </div>
        </div>

      </form>
    </div>
  )
}
