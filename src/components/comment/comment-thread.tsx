import { getComments } from '@/server/actions/comment'
import { CommentForm } from './comment-form'
import { timeAgo } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp } from 'lucide-react'
import { ReactionButton } from './reaction-button'

import { getTranslations } from 'next-intl/server'

function CommentNode({ node, locale, depth = 0 }: { node: any, locale: string, depth?: number }) {
  
  return (
    <div className={`flex gap-4 ${depth > 0 ? 'mt-4 border-l-2 border-[var(--color-border)]/30 pl-4' : 'mb-6'}`}>
      <Avatar className="w-10 h-10 shrink-0 border border-[var(--color-border)]/50">
        <AvatarImage src={node.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(node.user.name!)}`} />
        <AvatarFallback>{node.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-[var(--color-text)] hover:underline cursor-pointer">{node.user.name}</span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {timeAgo(node.createdAt, locale)}
          </span>
        </div>
        
        <p className="text-sm text-[var(--color-text)] whitespace-pre-line leading-relaxed mb-2">
          {node.content}
        </p>
        
        <div className="flex items-center gap-4 mt-2">
          <ReactionButton commentId={node.id} initialCount={node.helpfulCount} />
          {/* We omit reply inline state for server component simplicity, or use a client wrapper for Reply button */}
        </div>

        {node.children && node.children.length > 0 && (
          <div className="mt-4">
            {node.children.map((child: any) => (
              <CommentNode key={child.id} node={child} locale={locale} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export async function CommentThread({ dealId, locale }: { dealId: string, locale: string }) {
  const comments = await getComments(dealId)
  const t = await getTranslations('dealDetail')
  
  return (
    <div id="comments" className="mt-8">
      {/* 1. Comment Input Box */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-[var(--border-radius-xl)] p-4 md:p-5 flex gap-3 md:gap-4 shadow-sm mb-6">
        <Avatar className="w-10 h-10 md:w-12 md:h-12 shrink-0 border border-[var(--color-border)]/50">
           {/* Mock avatar for current user for UI purposes */}
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser`} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CommentForm dealId={dealId} />
        </div>
      </div>
      
      {/* 2. Comments Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--color-border)]/40">
        <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          {comments.length} {t('commentBtn')}
        </h3>
        <div className="flex items-center gap-3">
          <select className="bg-transparent text-sm font-medium border border-[var(--color-border)]/60 rounded-full px-3 py-1.5 outline-none cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors">
            <option>{t('oldestFirst')}</option>
            <option>{t('newestFirst')}</option>
            <option>{t('mostHelpful')}</option>
          </select>
        </div>
      </div>
      
      {/* 3. Comments List */}
      <div className="space-y-6">
        {comments.map((comment: any) => (
          <CommentNode key={comment.id} node={comment} locale={locale} />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-[var(--color-text-muted)] py-8 font-medium">
            {t('noComments')}
          </p>
        )}
      </div>
    </div>
  )
}
