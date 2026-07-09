import { getLocale } from 'next-intl/server'
import { Bell, Search, SlidersHorizontal, ChevronDown, Plus } from 'lucide-react'

export default async function AlertsFeedPage() {
  const locale = await getLocale()

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]/50">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Deal-Alarme
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">Lass uns für dich auf Deal-Jagd gehen!</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:opacity-90">
          <Plus className="w-5 h-5" /> Neuer Deal-Alarm
        </button>
      </div>

      <div className="flex gap-6 border-b border-[var(--color-border)] px-2">
         <button className="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold pb-3 px-2 flex items-center gap-2">Feed <span className="bg-[var(--color-primary)] text-white text-[10px] px-1.5 py-0.5 rounded-full">85</span></button>
         <button className="text-[var(--color-text-muted)] font-bold pb-3 px-2">Verwalten</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="glass-strong rounded-[var(--border-radius-xl)] p-5 space-y-6 border border-[var(--color-border)]/50 sticky top-24">
            
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Filter</h2>
              <button className="text-sm text-[var(--color-text-muted)]">Zurücksetzen</button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Sortieren</h3>
              <div className="relative">
                <select className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-3 appearance-none font-medium">
                  <option>Neueste Alarme</option>
                  <option>Heißeste Alarme</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-[var(--color-border)]" />
                <span>Offline Angebote ausblenden</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-[var(--color-border)]" />
                <span>Abgelaufenes ausblenden</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-[var(--color-border)]" />
                <span>Gesehene Deals ausblenden</span>
              </label>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--color-border)]/50">
              <h3 className="font-semibold">Alarmbegriff</h3>
              <div className="relative">
                <select className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-3 appearance-none">
                  <option>Alarm-Schlagwort wählen</option>
                  <option>S26 Ultra</option>
                  <option>Google Pixel</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--color-border)]/50">
              <h3 className="font-semibold">Händler</h3>
              <div className="relative">
                <select className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-3 appearance-none text-[var(--color-text-muted)]">
                  <option>z.B.: Amazon...</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--color-border)]/50">
              <h3 className="font-semibold">Preis</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="€ 0" className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-2 text-sm" />
                <span>-</span>
                <input type="number" placeholder="€ 68.089" className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-2 text-sm" />
              </div>
            </div>

          </div>
        </div>

        {/* Feed List */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="flex items-center justify-between px-2">
             <span className="text-[var(--color-primary)] font-bold cursor-pointer hover:underline">Als gesehen markieren</span>
          </div>
          
          <div className="glass-strong p-6 rounded-[var(--border-radius-xl)] flex flex-col md:flex-row gap-6 border border-green-500/30 relative">
             <div className="absolute top-0 right-0 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-bl-xl rounded-tr-xl font-bold text-xs">
               Ungesehen
             </div>
             <div className="w-32 h-32 bg-black/5 dark:bg-white/5 rounded-xl shrink-0"></div>
             <div className="flex-1 space-y-2">
               <div className="text-red-500 font-bold flex items-center gap-1">3372°</div>
               <h3 className="font-bold text-lg hover:text-[var(--color-primary)] cursor-pointer">[Zalando] [CB] DFB 2024 Heimtrikot / Auswärtstrikot Flock mit Spielername 38,72€</h3>
               <div className="flex items-center gap-2 font-bold">
                 <span className="text-xl text-[var(--color-primary)]">38,72€</span>
                 <span className="line-through text-[var(--color-text-muted)] text-sm">64,79€</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
