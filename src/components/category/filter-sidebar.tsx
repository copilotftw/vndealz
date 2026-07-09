'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { HelpCircle } from 'lucide-react'

export function FilterSidebar() {
  const t = useTranslations('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSort = searchParams.get('sort') || 'hot'
  const currentTemp = searchParams.get('temp') || 'all'
  
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // reset page on filter change
    params.delete('page')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-[var(--sidebar-width)] flex-shrink-0 sticky top-[calc(var(--nav-height)+var(--section-gap))] space-y-[var(--section-gap)] hidden md:block">
      <div className="glass-subtle rounded-[var(--border-radius-lg)] p-5 shadow-sm space-y-8 border border-[var(--color-border)]/60">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Filter</h2>
          <button 
            onClick={() => router.push('?', { scroll: false })}
            className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            Zurücksetzen
          </button>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-[var(--color-text)]">Sortieren</Label>
          <Select value={currentSort} onValueChange={(val) => updateQuery('sort', val || '')}>
            <SelectTrigger className="w-full bg-black/5 dark:bg-white/5 border-transparent h-10">
              <SelectValue placeholder="Sortieren nach..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">Heißeste</SelectItem>
              <SelectItem value="new">Neueste</SelectItem>
              <SelectItem value="discussed">Meistdiskutiert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Settings (Mocked as checkboxes for visual accuracy, could wire up later) */}
        <div className="space-y-4">
          <Label className="text-sm font-bold text-[var(--color-text)]">Einstellungen</Label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded-md border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors flex items-center justify-center">
                {/* empty checkbox */}
              </div>
              <span className="text-sm text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
                Offline Angebote ausblenden
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded-md border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors flex items-center justify-center">
                {/* empty checkbox */}
              </div>
              <span className="text-sm text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
                Abgelaufenes ausblenden
              </span>
            </label>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-[var(--color-text)]">Temperatur</Label>
            <HelpCircle className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <RadioGroup value={currentTemp} onValueChange={(val) => updateQuery('temp', val || '')} className="gap-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="all" id="temp-all" />
                <span className={`text-sm transition-colors ${currentTemp === 'all' ? 'text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
                  Alle
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">355</span>
            </label>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="20" id="temp-20" />
                <span className={`text-sm transition-colors ${currentTemp === '20' ? 'text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
                  20° & mehr
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">355</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="100" id="temp-100" />
                <span className={`text-sm transition-colors ${currentTemp === '100' ? 'text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
                  100° & mehr
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">355</span>
            </label>
          </RadioGroup>
        </div>

      </div>
    </div>
  )
}
