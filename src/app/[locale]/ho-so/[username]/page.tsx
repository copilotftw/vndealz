import { getUserProfile } from '@/server/actions/user'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { DealList } from '@/components/deal/deal-list'
import { CalendarDays, Trophy, MessageCircle, ShoppingBag } from 'lucide-react'
import { getLocale } from 'next-intl/server'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const user = await getUserProfile(decodeURIComponent(resolvedParams.username))
  const locale = await getLocale()
  const isVi = locale === 'vi'

  if (!user) notFound()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="glass-strong border-none shadow-xl overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/50 opacity-20 absolute inset-0" />
        <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 pt-12">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg ring-2 ring-[var(--color-primary)]/20">
            <AvatarImage src={user.avatar || ''} />
            <AvatarFallback className="text-3xl">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[var(--color-text)]">{user.name}</h1>
              {user.tier && (
                <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold px-3 py-1 rounded-full text-sm border border-[var(--color-primary)]/20 shadow-sm">
                  {user.tier}
                </span>
              )}
            </div>
            
            <p className="text-[var(--color-text-muted)] max-w-2xl mb-4 text-sm whitespace-pre-line">
              {user.bio || (isVi ? 'Chưa có tiểu sử.' : 'No bio yet.')}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-md shadow-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>{user.points} {isVi ? 'điểm' : 'points'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-md shadow-sm">
                <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
                <span>{(user as any)._count.deals} {isVi ? 'deals đã đăng' : 'deals posted'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-md shadow-sm">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span>{(user as any)._count.comments} {isVi ? 'bình luận' : 'comments'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-md shadow-sm">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span>{isVi ? 'Tham gia' : 'Joined'} {new Date(user.createdAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Deals */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[var(--color-text)]">
          <ShoppingBag className="w-6 h-6 text-[var(--color-primary)]" />
          {isVi ? 'Deals gần đây' : 'Recent Deals'}
        </h2>
        
        {user.recentDeals.length > 0 ? (
          <DealList deals={user.recentDeals as any} locale={locale} />
        ) : (
          <div className="text-center py-16 glass-subtle rounded-xl border border-dashed border-[var(--color-border)]">
            <p className="text-[var(--color-text-muted)] text-lg">
              {isVi ? 'Người dùng này chưa đăng deal nào.' : 'This user has not posted any deals yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
