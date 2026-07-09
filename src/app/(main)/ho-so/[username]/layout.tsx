import { getUserProfile, checkIsFollowing, checkIsMuted } from '@/server/actions/user'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getLocale, getTranslations } from 'next-intl/server'
import { ProfileTabs } from '@/components/profile/profile-tabs'
import { ProfileActions } from '@/components/profile/profile-actions'
import { getUserBadges } from '@/lib/badges/engine'
import { BadgeIcon } from '@/components/profile/badge-icon'
import { BADGE_CONFIG } from '@/lib/badges/config'

export default async function ProfileLayout({ params, children }: { params: Promise<{ username: string }>, children: React.ReactNode }) {
  const resolvedParams = await params
  const user = await getUserProfile(decodeURIComponent(resolvedParams.username))
  const locale = await getLocale()
  const t = await getTranslations('profile')

  if (!user) notFound()

  const badges = await getUserBadges(user.id)
  const topBadges = badges.filter(b => b.isUnlocked).slice(0, 4)
  
  const [isFollowing, isMuted] = await Promise.all([
    user.name ? checkIsFollowing(user.name) : Promise.resolve(false),
    user.name ? checkIsMuted(user.name) : Promise.resolve(false)
  ])

  return (
    <div className="w-full">
      {/* Profile Header Area - stretches full width, white background */}
      <div className="seamless-header flex flex-col items-center border-b border-[var(--color-border)]/50">
        <div className="w-full px-4" style={{ maxWidth: 'var(--content-max-width)' }}>
          {/* Profile Card */}
          <div className="max-w-4xl mx-auto bg-black/5 dark:bg-[#2b2b2b] rounded-[1.5rem] relative mt-16 pb-6 shadow-sm">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-[6px] border-white dark:border-[#1a1a1a] shadow-sm absolute -top-12">
                <AvatarImage src={user.avatar || '/fallback-avatar.png'} className="object-cover" />
                <AvatarFallback className="bg-transparent" />
              </Avatar>
              
              <div className="pt-16 flex flex-col items-center text-center px-4 w-full">
                <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">{user.name}</h1>
                <p className="text-[var(--color-text-muted)] text-[15px] font-semibold mb-4">
                  {t('joined')} {new Date(user.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                </p>
                
                <div className="flex items-center gap-2 text-[15px] font-bold mb-4">
                  <span>{(user as any)._count.deals} {t('dealsPosted')}</span>
                  <span className="text-[var(--color-text-muted)] mx-1">•</span>
                  <span>{(user as any)._count.comments} {t('comments')}</span>
                </div>

                {topBadges.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {topBadges.map(badge => {
                      const config = BADGE_CONFIG.find(c => c.id === badge.badgeId)
                      if (!config) return null
                      return (
                        <div key={badge.badgeId} className="w-6 h-6 shrink-0 relative" title={locale === 'vi' ? config.nameVi : config.nameEn}>
                          <BadgeIcon 
                            icon={config.icon} 
                            color={config.color} 
                            className="w-full h-full scale-[0.35] origin-top-left absolute top-0 left-0" 
                          />
                        </div>
                      )
                    })}
                    {badges.filter(b => b.isUnlocked).length > 4 && (
                      <span className="text-[var(--color-text-muted)] tracking-widest leading-none ml-1">...</span>
                    )}
                  </div>
                )}
                
                {user.bio && <p className="text-sm font-medium italic mt-2 text-[var(--color-text-muted)]">"{user.bio}"</p>}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center w-full">
            <ProfileActions username={user.name || ''} initialIsFollowing={isFollowing} initialIsMuted={isMuted} />
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-8 w-full overflow-x-auto no-scrollbar max-w-5xl mx-auto">
            <ProfileTabs username={user.name || ''} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full mx-auto pt-8 px-4" style={{ maxWidth: 'var(--content-max-width)' }}>
        {children}
      </div>
    </div>
  )
}
