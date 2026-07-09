import { getTranslations } from 'next-intl/server'
import { Bell, BellRing, Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AlertsManagePage() {
  const t = await getTranslations('alerts')

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BellRing className="w-8 h-8 text-[var(--color-primary)]" />
            {t('dealAlerts')} {t('manageTitle')}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">{t('manageDesc')}</p>
        </div>
        <Button className="bg-[var(--color-primary)] text-white gap-2 font-bold rounded-full">
          <Plus className="w-5 h-5" /> {t('newAlert')}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Dummy Alarm Items */}
        {[
          { keyword: 'macbook pro', matches: 12, active: true },
          { keyword: 'iphone 15', matches: 45, active: true },
          { keyword: 'samsung s24', matches: 0, active: false }
        ].map((alarm, i) => (
          <div key={i} className="glass-strong p-6 rounded-[var(--border-radius-xl)] border border-[var(--color-border)]/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${alarm.active ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)]'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{alarm.keyword}</h3>
                <p className="text-[var(--color-text-muted)] text-sm">{alarm.matches} {t('matchesFound')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${alarm.active ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-black/5 dark:bg-white/5'}`}>
                {alarm.active ? t('active') : t('paused')}
              </span>
              <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
