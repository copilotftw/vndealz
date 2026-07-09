import { getUserProfile } from '@/server/actions/user'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Award, Trophy, Coins } from 'lucide-react'

export default async function ProfileDefaultPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const user = await getUserProfile(decodeURIComponent(resolvedParams.username))
  const t = await getTranslations('profile')

  if (!user) notFound()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="glass-strong rounded-[var(--border-radius-xl)] p-6 border border-[var(--color-border)]/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-yellow-400/20 p-3 rounded-full text-yellow-600">
            <Coins className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t('tabs.points')}</h3>
            <p className="text-3xl font-bold">{user.points}</p>
          </div>
        </div>
      </div>
      
      <div className="glass-strong rounded-[var(--border-radius-xl)] p-6 border border-[var(--color-border)]/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-500/20 p-3 rounded-full text-purple-600">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Tier</h3>
            <p className="text-3xl font-bold">{user.tier}</p>
          </div>
        </div>
      </div>
      
      <div className="glass-strong rounded-[var(--border-radius-xl)] p-6 border border-[var(--color-border)]/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-500/20 p-3 rounded-full text-blue-600">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t('badges')}</h3>
            <p className="text-3xl font-bold">{user.userBadges.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
