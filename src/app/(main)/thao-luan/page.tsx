import { getTranslations } from 'next-intl/server'
import { MessageCircle, Plus, X } from 'lucide-react'
import { getDiscussionCategories, getRecentDiscussions } from '@/server/actions/discussion'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import Link from 'next/link'

export default async function DiscussionsPage() {
  const t = await getTranslations('discussion')
  
  const [categories, discussions] = await Promise.all([
    getDiscussionCategories(),
    getRecentDiscussions()
  ])

  return (
    <div className="w-full">
      {/* FULL WIDTH HEADER SECTION */}
      <div className="w-full seamless-header">
        <div className="w-full mx-auto px-4 pt-6" style={{ maxWidth: 'var(--content-max-width)' }}>
          {/* Top Wide Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold">{t('title')}</h1>
              <p className="text-[var(--color-text-muted)] mt-1">324.260 {t('title')}</p>
            </div>
            <button className="flex items-center gap-2 bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-2 rounded-full font-bold hover:bg-[var(--color-primary)]/5 transition-colors">
              <Plus className="w-5 h-5" /> {t('createThread')}
            </button>
          </div>

          {/* Categories Grid (Max 8 items / 2 rows) */}
          <div className="mb-6 rounded-xl border border-white/10 bg-black/20">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-bold text-white">Alle Diskussions-Kategorien</h2>
              <button className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
              {categories.slice(0, 8).map((c) => (
                <Link key={c.id} href={`/thao-luan/nhom/${c.slug}`} className="flex items-start gap-4 hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                  <div className="bg-white/10 p-3 rounded-xl shrink-0 text-white">
                    <DynamicIcon name={c.icon || 'MessageCircle'} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">{c.nameVi}</h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mt-1.5 font-medium">
                      <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {c._count.deals}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Fake Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pb-4">
              <span className="text-white/30 text-xs font-bold cursor-pointer">{'<'}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <span className="text-white/50 text-xs font-bold cursor-pointer">{'>'}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <button className="border-b-[3px] border-[var(--color-primary)] text-[var(--color-primary)] font-bold pb-3 px-1 mt-2 text-[15px]">Alles</button>
              <button className="text-[var(--color-text-muted)] font-bold pb-3 px-1 mt-2 hover:text-white transition-colors text-[15px]">Diskutiert</button>
            </div>
            <button className="flex items-center gap-2 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-bold hover:bg-white/5 mb-2 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Split Section */}
      <div className="w-full mx-auto px-4 mt-6" style={{ maxWidth: 'var(--content-max-width)' }}>
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Main Content (Discussions List) */}
          <div className="flex-1 space-y-4 min-w-0">
            {discussions.map(d => (
              <div key={d.id} className="bg-[#1c1c1c] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                 <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold mb-3">
                   <span>{d.discussionCategory?.nameVi}</span>
                   <span className="flex items-center gap-1">
                     <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>
                     Aktualisiert vor: 1 Tg.
                   </span>
                 </div>
                 <Link href={`/discussion/${d.slug}`}>
                   <h3 className="text-[22px] font-bold mb-3 text-white cursor-pointer hover:text-[var(--color-primary)] leading-snug">{d.title}</h3>
                 </Link>
                 <p className="text-[var(--color-text-muted)] text-[15px] mb-6 line-clamp-2 leading-relaxed">{d.description}</p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2.5">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400"></div>
                     <span className="text-sm font-bold text-[var(--color-text-muted)]">{d.user.name}</span>
                   </div>
                   <div className="flex items-center gap-4 text-[var(--color-text-muted)] font-bold">
                     <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                       <MessageCircle className="w-5 h-5" /> {d._count.comments}
                     </button>
                     <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                       <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                     </button>
                   </div>
                 </div>
              </div>
            ))}
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
                {[1, 2, 3].map(i => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
