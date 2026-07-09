'use client'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarDays, MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface UserHoverCardProps {
  user: {
    name: string
    avatar?: string | null
    tier?: string
    createdAt: Date | string
    stats?: {
      deals: number
      comments: number
    }
    role?: string
  }
  children: ReactNode
}

export function UserHoverCard({ user, children }: UserHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <span className="cursor-pointer hover:underline text-[var(--color-primary)] font-bold">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 glass-strong p-4 shadow-xl z-50 rounded-xl border border-[var(--color-border)]/50">
        <div className="flex justify-between space-x-4">
          <Avatar className="w-12 h-12 ring-2 ring-[var(--color-primary)]/20">
            <AvatarImage src={user.avatar || ''} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <Link href={`/ho-so/${user.name}`} className="text-sm font-bold hover:underline">
              {user.name}
            </Link>
            
            <div className="flex items-center text-xs text-[var(--color-text-muted)] mt-1">
               <span className="font-semibold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full mr-2">
                 {user.tier || 'BRONZE'}
               </span>
               {user.role && ['ADMIN', 'MODERATOR'].includes(user.role) && (
                 <span className="flex items-center text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                   <ShieldCheck className="w-3 h-3 mr-1" /> Staff
                 </span>
               )}
            </div>
            
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-[var(--color-text-muted)]">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {(user.stats) && (
              <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-[var(--color-text)]">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3 text-[var(--color-primary)]" />
                  {user.stats.deals} Deals
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-blue-500" />
                  {user.stats.comments} Comments
                </span>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <button className="flex-1 bg-[var(--color-primary)] text-white text-xs font-bold py-1.5 rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors">
                Follow
              </button>
              <button className="flex-1 bg-black/5 dark:bg-white/5 text-[var(--color-text)] text-xs font-bold py-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                Message
              </button>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
