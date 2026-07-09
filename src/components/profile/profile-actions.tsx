'use client'

import { useState, useTransition } from 'react'
import { NewMessageModal } from './new-message-modal'
import { toggleFollowUser, toggleMuteUser } from '@/server/actions/user'
import { UserPlus, Mail, MoreHorizontal, Check, VolumeX } from 'lucide-react'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ProfileActionsProps {
  username: string
  initialIsFollowing?: boolean
  initialIsMuted?: boolean
}

export function ProfileActions({ username, initialIsFollowing = false, initialIsMuted = false }: ProfileActionsProps) {
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isMuted, setIsMuted] = useState(initialIsMuted)
  const [isPending, startTransition] = useTransition()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleFollow = () => {
    // Optimistic update
    const previousState = isFollowing
    setIsFollowing(!isFollowing)
    
    startTransition(async () => {
      try {
        await toggleFollowUser(username)
      } catch (e) {
        setIsFollowing(previousState)
        toast.error('Failed to follow user')
      }
    })
  }

  const handleMute = () => {
    const previousState = isMuted
    setIsMuted(!isMuted)
    setIsPopoverOpen(false)
    
    startTransition(async () => {
      try {
        await toggleMuteUser(username)
        toast.success(isMuted ? 'User unmuted' : 'User muted')
      } catch (e) {
        setIsMuted(previousState)
        toast.error('Failed to mute user')
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-3 w-full justify-center">
        <button 
          onClick={handleFollow}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-1.5 rounded-full font-bold text-sm transition-colors border ${
            isFollowing 
              ? 'bg-transparent border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5' 
              : 'bg-transparent border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button 
          onClick={() => setIsMessageOpen(true)}
          className="flex items-center gap-2 px-6 py-1.5 rounded-full font-bold text-sm transition-colors border bg-transparent border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
        >
          <Mail className="w-4 h-4" />
          Message
        </button>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors shrink-0 outline-none ${
              isMuted || isPopoverOpen
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}>
              <MoreHorizontal className="w-4 h-4" />
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-[var(--color-surface)] border-none text-white rounded-xl p-4 flex flex-col gap-4 shadow-xl" align="start" sideOffset={8}>
            <p className="text-sm font-medium leading-relaxed pr-6">
              With the mute option you can hide this user's feed.
            </p>
            <button 
              onClick={handleMute}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-bold text-sm"
            >
              <VolumeX className="w-4 h-4" />
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <NewMessageModal 
        recipientName={username} 
        isOpen={isMessageOpen} 
        onClose={() => setIsMessageOpen(false)} 
      />
    </>
  )
}
