'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createAlert, toggleAlert, deleteAlert } from '@/server/actions/alerts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Trash2, Bell, AlertTriangle } from 'lucide-react'

export function DealAlarmClient({ initialAlerts, categories }: { initialAlerts: any[], categories: any[] }) {
  const t = useTranslations('alerts')
  const locale = useLocale()
  const [alerts, setAlerts] = useState(initialAlerts)
  const [isPending, startTransition] = useTransition()

  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [minTemperature, setMinTemperature] = useState(100)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim() && !categoryId) {
      toast.error(t('validationError'))
      return
    }

    startTransition(async () => {
      try {
        const newAlert = await createAlert({
          keyword: keyword || undefined,
          categoryId: categoryId || undefined,
          minTemperature,
        })
        const cat = categories.find(c => c.id === categoryId)
        setAlerts([{ ...newAlert, category: cat ? { nameVi: cat.nameVi, nameEn: cat.nameEn } : null }, ...alerts])
        setKeyword('')
        setCategoryId('')
        setMinTemperature(100)
        toast.success(t('createSuccess'))
      } catch (err: any) {
        toast.error(err.message || t('deleteError'))
      }
    })
  }

  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      try {
        await toggleAlert(id, active)
        setAlerts(alerts.map(a => a.id === id ? { ...a, active } : a))
      } catch (err: any) {
        toast.error(t('toggleError'))
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    startTransition(async () => {
      try {
        await deleteAlert(id)
        setAlerts(alerts.filter(a => a.id !== id))
        toast.success(t('deleteSuccess'))
      } catch (err: any) {
        toast.error(t('deleteError'))
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Create Form */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          {t('newAlert')}
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('keyword')}</label>
              <Input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder={t('keywordPlaceholder')}
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('category')}</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
              >
                <option value="">{t('allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{locale === 'vi' ? cat.nameVi : (cat.nameEn || cat.nameVi)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {t('minTemp')}
              <span className="text-primary font-bold">{minTemperature}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={minTemperature}
              onChange={e => setMinTemperature(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground">{t('minTempDesc')}</p>
          </div>

          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {t('addAlert')}
          </Button>
        </form>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{t('yourAlerts')}</h2>

        {alerts.length === 0 ? (
          <div className="text-center py-12 card border-dashed">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t('noAlertsSetup')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map(alert => (
              <div key={alert.id} className={`card p-4 flex justify-between items-start transition-opacity ${!alert.active ? 'opacity-60 grayscale' : ''}`}>
                <div className="space-y-1">
                  <div className="font-bold text-lg flex items-center gap-2">
                    {alert.keyword ? `${t('keywordLabel', { keyword: alert.keyword })}` : t('allKeywords')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('categoryLabel')}: <span className="font-medium text-foreground">
                      {alert.category
                        ? (locale === 'vi' ? alert.category.nameVi : (alert.category.nameEn || alert.category.nameVi))
                        : t('all')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('minTempLabel')}: <span className="font-medium text-hot">{alert.minTemperature}°</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <Switch
                    checked={alert.active}
                    onCheckedChange={(checked) => handleToggle(alert.id, checked)}
                    disabled={isPending}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-danger hover:text-danger hover:bg-danger/10"
                    onClick={() => handleDelete(alert.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
