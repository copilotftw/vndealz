import { getComments } from '@/server/actions/comment'
import { CommentForm } from './comment-form'
import { timeAgo } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp } from 'lucide-react'
import { ReactionButton } from './reaction-button'

function CommentNode({ node, locale, depth = 0 }: { node: any, locale: string, depth?: number }) {
  const isVi = locale === 'vi'
  
  return (
    <div className={`flex gap-4 ${depth > 0 ? 'mt-4 border-l-2 border-[var(--color-border)]/30 pl-4' : 'mb-6'}`}>
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage src={node.user.image || ''} />
        <AvatarFallback>{node.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="glass-subtle bg-[var(--color-surface)]/50 rounded-[var(--border-radius-md)] p-4 border border-[var(--color-border)]/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[var(--color-text)]">{node.user.name}</span>
            {node.user.tier && (
              <span className="text-[length:var(--font-size-xs)] px-1.5 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-[var(--border-radius-sm)] font-medium">
                {node.user.tier}
              </span>
            )}
            <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] ml-auto">
              {timeAgo(node.createdAt, locale)}
            </span>
          </div>
          <p className="text-[length:var(--font-size-sm)] text-[var(--color-text)] whitespace-pre-line leading-relaxed">
            {node.content}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-2 px-2">
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
  
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h3 className="text-[length:var(--font-size-lg)] font-bold mb-4 flex items-center gap-2">
          💬 {locale === 'vi' ? 'Bình luận' : 'Comments'} ({comments.length})
        </h3>
        <CommentForm dealId={dealId} />
      </div>
      
      <div className="space-y-6">
        {comments.map((comment: any) => (
          <CommentNode key={comment.id} node={comment} locale={locale} />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-[var(--color-text-muted)] py-8">
            {locale === 'vi' ? 'Chưa có bình luận nào. Hãy là người đầu tiên!' : 'No comments yet. Be the first to comment!'}
          </p>
        )}
      </div>
    </div>
  )
}
