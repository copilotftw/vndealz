import { getLocale, getTranslations } from 'next-intl/server'
import { Tag, ExternalLink, Scissors } from 'lucide-react'

export default async function StorePage({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params
  const locale = await getLocale()
  const t = await getTranslations('store')
  
  // Dummy data
  const storeName = store.charAt(0).toUpperCase() + store.slice(1)
  const vouchers = [
    { id: 1, title: '15% Rabatt auf alles', type: 'Code', code: 'WINTER15', expire: '31. Dez' },
    { id: 2, title: 'Kostenloser Versand ab 50€', type: 'Deal', expire: '31. Dez' },
    { id: 3, title: 'Bis zu 50% im Sale', type: 'Deal', expire: '31. Dez' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Store Header */}
      <div className="glass-strong p-8 rounded-[var(--border-radius-xl)] flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-[var(--color-primary)]/10"></div>
        <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 shrink-0 overflow-hidden border border-black/5 p-4">
           {/* Placeholder Logo */}
           <div className="text-4xl font-black text-black/20">{storeName[0]}</div>
        </div>
        <div className="relative z-10 text-center md:text-left flex-1 mt-4 md:mt-12">
          <h1 className="text-3xl font-bold">{storeName} {t('vouchersAndDiscounts')}</h1>
          <p className="text-[var(--color-text-muted)] mt-2">{t('storeDesc')} {storeName}.</p>
        </div>
        <div className="relative z-10 mt-4 md:mt-12 flex gap-3 shrink-0">
          <button className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-90">
             {t('visitShop')}
          </button>
        </div>
      </div>

      {/* Vouchers List */}
      <div className="space-y-4">
        {vouchers.map(v => (
          <div key={v.id} className="glass p-6 rounded-[var(--border-radius-xl)] flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--color-primary)] shrink-0">
              <Tag className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full mb-2">
                {t('verified')}
              </div>
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('validUntil')}: {v.expire}</p>
            </div>
            <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0 flex flex-col gap-2">
              {v.type === 'Code' ? (
                <div className="relative group cursor-pointer">
                  <div className="bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg px-6 py-3 font-mono font-bold text-center group-hover:border-[var(--color-primary)] transition-colors">
                    {v.code}
                  </div>
                  <div className="absolute inset-0 bg-[var(--color-primary)] text-white font-bold flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <Scissors className="w-4 h-4" /> {t('copy')}
                  </div>
                </div>
              ) : (
                <button className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 px-8 py-3 rounded-lg font-bold w-full md:w-auto">
                  {t('goToDeal')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
