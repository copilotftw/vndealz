import { getTranslations } from 'next-intl/server'
import { Share2, MessageCircle, AlertTriangle, Bookmark } from 'lucide-react'
import { getDiscussionBySlug, getRecentDiscussions } from '@/server/actions/discussion'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function DiscussionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = await getTranslations('discussion')
  
  const [discussion, recent] = await Promise.all([
    getDiscussionBySlug(slug),
    getRecentDiscussions()
  ])

  if (!discussion) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
        <Link href="/discussion" className="hover:text-primary">{t('title')}</Link>
        <span>/</span>
        <span>{discussion.discussionCategory?.nameVi}</span>
      </div>

      {/* Main Post */}
      <div className="glass-strong rounded-[var(--border-radius-xl)] border border-[var(--color-border)]/50 overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{discussion.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)] mb-6 border-b border-[var(--color-border)]/50 pb-4">
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)]">
               <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">{discussion.user.name?.charAt(0).toUpperCase()}</div>
               {discussion.user.name}
            </div>
            <span>{t('posted')} {new Date(discussion.createdAt).toLocaleDateString()}</span>
            <div className="flex items-center gap-1 ml-auto">
               <button className="flex items-center gap-1 hover:text-[var(--color-text)]"><Share2 className="w-4 h-4"/> {t('share')}</button>
               <button className="flex items-center gap-1 hover:text-[var(--color-text)] ml-2"><Bookmark className="w-4 h-4"/> {t('save')}</button>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>{discussion.description}</p>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5"/> {discussion._count.comments} {t('replies')}
        </h2>
      </div>

      {/* Current Discussions (Carousel) */}
      <div className="pt-10">
        <h2 className="font-bold text-lg mb-4">{t('title')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {recent.filter(d => d.id !== discussion.id).map(d => (
             <div key={d.id} className="min-w-[280px] w-[280px] glass-subtle p-4 rounded-xl border border-[var(--color-border)]/50 shrink-0">
                <div className="text-xs text-[var(--color-text-muted)] mb-2 flex items-center justify-between">
                  <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded">{d.discussionCategory?.nameVi}</span>
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/discussion/${d.slug}`}>
                  <h3 className="font-bold text-sm mb-2 line-clamp-2 hover:text-[var(--color-primary)] cursor-pointer">{d.title}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-4 text-[var(--color-text-muted)] text-xs">
                  <MessageCircle className="w-3 h-3"/> {d._count.comments} {t('replies')}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}
