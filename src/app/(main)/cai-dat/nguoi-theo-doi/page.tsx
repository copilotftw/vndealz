'use client'

import { useTranslations } from 'next-intl'
import { SettingsHeader } from '@/components/settings/header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { X, Loader2 } from 'lucide-react'
import { useState, useEffect, useTransition } from 'react'
import { getFollowsAndMutes } from '@/server/actions/settings'
import { toggleFollowUser, toggleMuteUser } from '@/server/actions/user'
import { toast } from 'sonner'

export default function FollowersPage() {
  const t = useTranslations('settings')
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<any>(null)

  // Selection state
  const [selectedFollowing, setSelectedFollowing] = useState<Set<string>>(new Set())
  const [selectedMuted, setSelectedMuted] = useState<Set<string>>(new Set())

  const fetchData = () => {
    getFollowsAndMutes().then(setData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleSelection = (id: string, type: 'following' | 'muted') => {
    if (type === 'following') {
      const newSet = new Set(selectedFollowing)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      setSelectedFollowing(newSet)
    } else {
      const newSet = new Set(selectedMuted)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      setSelectedMuted(newSet)
    }
  }

  const handleUnfollow = (username: string) => {
    startTransition(async () => {
      try {
        await toggleFollowUser(username)
        toast.success(t('updateSuccess'))
        fetchData()
      } catch (e) {
        toast.error(t('updateError'))
      }
    })
  }

  const handleUnmute = (username: string) => {
    startTransition(async () => {
      try {
        await toggleMuteUser(username)
        toast.success(t('updateSuccess'))
        fetchData()
      } catch (e) {
        toast.error(t('updateError'))
      }
    })
  }

  const handleUnfollowSelected = () => {
    startTransition(async () => {
      try {
        const usernames = data.following
          .filter((f: any) => selectedFollowing.has(f.following.name))
          .map((f: any) => f.following.name)
        
        for (const name of usernames) {
          await toggleFollowUser(name)
        }
        setSelectedFollowing(new Set())
        toast.success(t('updateSuccess'))
        fetchData()
      } catch (e) {
        toast.error(t('updateError'))
      }
    })
  }

  const handleUnmuteSelected = () => {
    startTransition(async () => {
      try {
        const usernames = data.mutes
          .filter((m: any) => selectedMuted.has(m.muted.name))
          .map((m: any) => m.muted.name)
        
        for (const name of usernames) {
          await toggleMuteUser(name)
        }
        setSelectedMuted(new Set())
        toast.success(t('updateSuccess'))
        fetchData()
      } catch (e) {
        toast.error(t('updateError'))
      }
    })
  }

  if (!data) return null

  return (
    <div className="max-w-2xl text-[var(--color-text)]">
      <SettingsHeader title={t('followers.title')} showSave={false} />

      {/* Following */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
        <div className="w-1/3">
          <h3 className="font-bold text-sm">{t('followers.youFollow')}</h3>
        </div>
        <div className="w-2/3 space-y-4">
          {data.following.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No users followed.</p>
          ) : (
            <>
              {data.following.map((f: any) => (
                <div key={f.followingId} className="flex items-center justify-between p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <Checkbox 
                      checked={selectedFollowing.has(f.following.name)}
                      onCheckedChange={() => handleToggleSelection(f.following.name, 'following')}
                      className="rounded border-white/20 data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)]"
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={f.following.avatar || undefined} />
                      <AvatarFallback>{f.following.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold">{f.following.name}</span>
                  </div>
                  <button 
                    onClick={() => handleUnfollow(f.following.name)}
                    disabled={isPending}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors rounded-full"
                  >
                    {isPending && selectedFollowing.size === 0 ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  </button>
                </div>
              ))}
              
              {selectedFollowing.size > 0 && (
                <Button 
                  onClick={handleUnfollowSelected}
                  disabled={isPending}
                  className="w-full mt-4 bg-transparent border border-white/20 hover:bg-white/5 rounded-full"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t('followers.unfollowSelected')} ({selectedFollowing.size})
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Muted */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
        <div className="w-1/3">
          <h3 className="font-bold text-sm">{t('followers.muted')}</h3>
        </div>
        <div className="w-2/3 space-y-4">
          {data.mutes.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No users muted.</p>
          ) : (
            <>
              {data.mutes.map((m: any) => (
                <div key={m.mutedId} className="flex items-center justify-between p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <Checkbox 
                      checked={selectedMuted.has(m.muted.name)}
                      onCheckedChange={() => handleToggleSelection(m.muted.name, 'muted')}
                      className="rounded border-white/20 data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)]"
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={m.muted.avatar || undefined} />
                      <AvatarFallback>{m.muted.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold">{m.muted.name}</span>
                  </div>
                  <button 
                    onClick={() => handleUnmute(m.muted.name)}
                    disabled={isPending}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors rounded-full"
                  >
                    {isPending && selectedMuted.size === 0 ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  </button>
                </div>
              ))}
              
              {selectedMuted.size > 0 && (
                <Button 
                  onClick={handleUnmuteSelected}
                  disabled={isPending}
                  className="w-full mt-4 bg-transparent border border-white/20 hover:bg-white/5 rounded-full"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t('followers.unmuteSelected')} ({selectedMuted.size})
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
