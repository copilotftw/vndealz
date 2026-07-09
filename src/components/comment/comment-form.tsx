'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createComment } from '@/server/actions/comment'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CommentForm({ 
  dealId, 
  parentId,
  onSuccess 
}: { 
  dealId?: string
  parentId?: string
  onSuccess?: () => void
}) {
  const t = useTranslations('comment')
  const { user } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error(t('signInToComment'))
      router.push('/dang-nhap')
      return
    }

    if (content.trim().length < 1) return

    startTransition(async () => {
      try {
        await createComment({ content, dealId, parentId })
        setContent('')
        toast.success(t('commentSuccess'))
        onSuccess?.()
      } catch (err: any) {
        toast.error(err.message || t('commentError'))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Viết bình luận của bạn..."
        required
        minLength={1}
        maxLength={2000}
        disabled={isPending}
        className="bg-[var(--color-surface)]/50 min-h-[100px] border-[var(--color-border)]/50 focus:border-[var(--color-primary)] transition-colors"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending || !content.trim()} 
          className="bg-[var(--color-primary)] text-white hover:opacity-90"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Gửi bình luận
        </Button>
      </div>
    </form>
  )
}
