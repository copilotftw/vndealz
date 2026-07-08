'use client'

import { useOptimistic, useTransition, useState } from 'react'
import { voteDeal } from '@/server/actions/deal'
import { Plus, Minus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'

export function TemperatureVote({
  dealId,
  temperature: initialTemp,
}: {
  dealId: string
  temperature: number
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [optimisticTemp, addOptimisticVote] = useOptimistic(
    initialTemp,
    (state, newVote: number) => state + newVote
  )

  const handleVote = (val: 1 | -1) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để bình chọn!')
      router.push('/dang-nhap')
      return
    }
    
    startTransition(async () => {
      addOptimisticVote(val === 1 ? 10 : -10) // Approx optimistic change
      try {
        await voteDeal(dealId, val)
      } catch (e: any) {
        toast.error(e.message || 'Lỗi bình chọn')
      }
    })
  }

  // Swipe logic for mobile
  const [touchStart, setTouchStart] = useState(0)
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const distance = touchEnd - touchStart
    if (distance > 50) handleVote(1) // swipe right -> Hot
    else if (distance < -50) handleVote(-1) // swipe left -> Cold
    setTouchStart(0)
  }

  const isHot = optimisticTemp >= 0
  
  return (
    <div 
      className="flex items-center bg-[var(--color-surface)]/80 rounded-[var(--border-radius-full)] border border-[var(--color-border)]/50 glass-subtle shadow-sm overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button 
        onClick={(e) => { e.preventDefault(); handleVote(-1) }}
        disabled={isPending}
        className="px-3 py-1.5 hover:bg-[var(--color-cold)]/10 text-[var(--color-cold)] transition-colors disabled:opacity-50"
        aria-label="Vote cold"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <span
        className={`font-bold px-2 text-[length:var(--font-size-base)] min-w-[3rem] text-center transition-all ${isHot ? 'text-[var(--color-hot)] temp-hot' : 'text-[var(--color-cold)] temp-cold'}`}
        data-temp-high={optimisticTemp > 100 ? 'true' : undefined}
      >
        {optimisticTemp}°
      </span>
      
      <button 
        onClick={(e) => { e.preventDefault(); handleVote(1) }}
        disabled={isPending}
        className="px-3 py-1.5 hover:bg-[var(--color-hot)]/10 text-[var(--color-hot)] transition-colors disabled:opacity-50"
        aria-label="Vote hot"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
