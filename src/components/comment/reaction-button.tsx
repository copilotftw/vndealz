'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { reactToComment } from '@/server/actions/comment'
import { ThumbsUp } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ReactionButton({ commentId, initialCount }: { commentId: string; initialCount: number }) {
  const t = useTranslations('comment')
  const [count, setCount] = useState(initialCount)
  const [isReacted, setIsReacted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { user } = useAuth()
  const router = useRouter()

  const handleReact = () => {
    if (!user) {
      toast.error(t('signInToReact'))
      router.push('/dang-nhap')
      return
    }

    if (isReacted) return

    setCount(prev => prev + 1)
    setIsReacted(true)

    startTransition(async () => {
      try {
        await reactToComment(commentId)
      } catch (err) {
        setCount(prev => prev - 1)
        setIsReacted(false)
        toast.error(t('reactionError'))
      }
    })
  }

  return (
    <button 
      onClick={handleReact}
      disabled={isPending || isReacted}
      className={`flex items-center gap-1.5 text-[length:var(--font-size-xs)] font-medium transition-colors ${
        isReacted 
          ? 'text-[var(--color-primary)] cursor-default' 
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
      }`}
    >
      <ThumbsUp className={`w-3.5 h-3.5 ${isReacted ? 'fill-current' : ''}`} />
      Hữu ích ({count})
    </button>
  )
}
