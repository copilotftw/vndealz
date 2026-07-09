import { getTranslations } from 'next-intl/server'
import { MessageCircle, Plus, X } from 'lucide-react'
import { getDiscussionCategoryBySlug, getDiscussionsByCategory } from '@/server/actions/discussion'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function DiscussionCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = await getTranslations('discussion')
  
  const category = await getDiscussionCategoryBySlug(slug)
  if (!category) notFound()

  const discussions = await getDiscussionsByCategory(category.id)

  return (
    <div className="w-full">
      {/* FULL WIDTH HEADER SECTION */}
      <div className="w-full seamless-header">
        <div className="w-full mx-auto px-4 pt-4" style={{ maxWidth: 'var(--content-max-width)' }}>
          
          {/* Breadcrumb Navigation */}
          <div className="text-[13px] text-[var(--color-text-muted)] font-semibold flex items-center gap-2 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href="/thao-luan" className="hover:text-white transition-colors">{t('title') || 'Diskussionen'}</Link>
            <span>›</span>
            <span className="text-white">{category.nameVi}</span>
          </div>

          {/* Header Block & Seamless Tabs */}
          <div className="mb-6">
            
            {/* Header Section */}
            <div className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{category.nameVi}</h1>
                  <p className="text-[13px] text-white/70 font-semibold leading-relaxed">
                    {category._count.deals} {t('title') || 'Diskussionen'}
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-transparent border border-white/20 text-white px-5 py-2 rounded-full font-bold hover:bg-white/10 transition-colors shrink-0 text-[15px]">
                  <Plus className="w-5 h-5" /> {t('createThread') || 'Diskussion eintragen'}
                </button>
              </div>
            </div>

            {/* Seamless Tab Bar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <button className="border-b-[3px] border-[var(--color-primary)] text-[var(--color-primary)] font-bold pb-3 px-1 mt-6 text-[15px]">
                  Alles
                </button>
                <button className="text-[var(--color-text-muted)] font-bold pb-3 px-1 mt-6 text-[15px] hover:text-white transition-colors">
                  Diskutiert
                </button>
              </div>
              <button className="flex items-center gap-2 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-bold hover:bg-white/5 mb-2 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Split Section */}
      <div className="w-full mx-auto px-4 mt-6" style={{ maxWidth: 'var(--content-max-width)' }}>
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Main Content (Discussions List) */}
          <div className="flex-1 space-y-4 min-w-0">
            {discussions.length === 0 ? (
              <div className="bg-[#1c1c1c] p-10 rounded-xl border border-white/5 text-center">
                 <p className="text-[var(--color-text-muted)] font-semibold">Chưa có bài thảo luận nào trong nhóm này.</p>
              </div>
            ) : (
              discussions.map(d => (
                <div key={d.id} className="bg-[#1c1c1c] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-bold mb-3 uppercase tracking-wider">
                     <span className="bg-white/5 px-2 py-1 rounded">Gepostet vor 3 Wo.</span>
                     <button className="hover:text-white transition-colors">
                       <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                     </button>
                   </div>
                   <Link href={`/discussion/${d.slug}`}>
                     <h3 className="text-[20px] font-bold mb-2.5 text-white cursor-pointer hover:text-[var(--color-primary)] leading-snug">{d.title}</h3>
                   </Link>
                   <p className="text-[#999] text-[15px] mb-6 line-clamp-2 leading-relaxed">{d.description}</p>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2.5">
                       <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400"></div>
                       <span className="text-[13px] font-bold text-[var(--color-text-muted)]">{d.user.name}</span>
                     </div>
                     <div className="flex items-center gap-4 text-[var(--color-text-muted)] font-bold">
                       <button className="flex items-center gap-1.5 hover:text-white transition-colors text-[13px]">
                         <MessageCircle className="w-4 h-4" /> {d._count.comments}
                       </button>
                       <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                         <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                       </button>
                     </div>
                   </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="bg-[#1c1c1c] rounded-xl p-5 border border-white/5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white text-lg">Deine letzten Aktivitäten</h2>
                <button className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-5">
                {[1, 2, 3, 4].map(i => (
                   <div key={i} className="flex gap-3 text-sm">
                     <div className="w-[50px] h-[34px] bg-white/10 rounded-md shrink-0 border border-white/10"></div>
                     <div className="flex-1">
                       <p className="line-clamp-2 text-white/90 text-xs font-bold leading-relaxed mb-1">
                         Du hast den Deal <strong>[Curve]... &quot;personalisiert&quot; KWK Aktion</strong>
                       </p>
                       <p className="text-[var(--color-text-muted)] text-[11px] font-bold flex items-center gap-1">
                         <MessageCircle className="w-3.5 h-3.5"/> 7. Jul
                       </p>
                     </div>
                   </div>
                ))}
              </div>
              {/* Fake Pagination Dots for Sidebar */}
              <div className="flex items-center justify-center gap-2 pt-6">
                <span className="text-white/30 text-xs font-bold cursor-pointer">{'<'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <span className="text-white/50 text-xs font-bold cursor-pointer">{'>'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
