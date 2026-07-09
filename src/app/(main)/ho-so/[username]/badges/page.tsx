import { getLocale, getTranslations } from 'next-intl/server'
import { getUserProfile } from '@/server/actions/user'
import { notFound } from 'next/navigation'
import { getUserBadges } from '@/lib/badges/engine'
import { BadgeList } from '@/components/profile/badge-list'

export default async function ProfileBadgesPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const user = await getUserProfile(decodeURIComponent(resolvedParams.username))
  if (!user) notFound()

  const t = await getTranslations('profile')
  const locale = await getLocale()
  
  const badges = await getUserBadges(user.id)

  return (
    <div className="space-y-6">
      <BadgeList badges={badges} locale={locale} />
    </div>
  )
}
