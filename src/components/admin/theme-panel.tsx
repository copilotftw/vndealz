'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { updateSiteConfig } from '@/server/actions/theme'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Palette, MonitorSmartphone, Type, LayoutGrid, Terminal, AlignLeft, BookOpen, Zap, Map, Info } from 'lucide-react'

import { AVAILABLE_LAYOUTS, AVAILABLE_COLORS, COLORS as REGISTRY_COLORS, LAYOUTS as REGISTRY_LAYOUTS } from '@/components/theme/registry'

const PERSONA_ICONS: Record<string, React.ElementType> = {
  mydealz: LayoutGrid,
  prism:   Palette,
  ledger:  Terminal,
  vitrine: BookOpen,
  pulse:   Zap,
  atlas:   Map,
}

const LAYOUTS = AVAILABLE_LAYOUTS.map(id => {
  const persona = REGISTRY_LAYOUTS[id as keyof typeof REGISTRY_LAYOUTS]
  return {
    id,
    name: persona?.name ?? id.charAt(0).toUpperCase() + id.slice(1),
    desc: `${persona?.shell.nav ?? ''} nav · ${persona?.shell.sidebar ?? ''} sidebar`,
    icon: PERSONA_ICONS[id] ?? LayoutGrid,
  }
})

const SCALE_LABELS = ['Tight', 'Compact', 'Default', 'Comfort', 'Spacious']
const SCALE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl']

const COLORS = AVAILABLE_COLORS.map(id => {
  const scheme = REGISTRY_COLORS[id]
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
    swatch: [scheme.light['--color-primary'], scheme.light['--color-accent'] || scheme.light['--color-secondary']]
  }
})

export function ThemePanel({ initialConfig }: { initialConfig: any }) {
  const t = useTranslations('admin')
  const [config, setConfig] = useState(initialConfig || { layout: 'modern', scale: 'md', colorScheme: 'default', customCss: '' })
  const [isPending, startTransition] = useTransition()

  const scaleIndex = SCALE_KEYS.indexOf(config.scale || 'md')

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSiteConfig(config)
        toast.success(t('themeUpdateSuccess'))
        setTimeout(() => {
          if ('startViewTransition' in document) {
            document.startViewTransition(() => { window.location.href = '/' })
          } else {
            window.location.href = '/'
          }
        }, 400)
      } catch (err: any) {
        toast.error(err.message || t('themeUpdateError'))
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Layout Selection */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MonitorSmartphone className="w-5 h-5 text-primary" />
          {t('themeLayout')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {LAYOUTS.map(layout => (
            <div 
              key={layout.id}
              onClick={() => setConfig({ ...config, layout: layout.id })}
              className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                config.layout === layout.id 
                  ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20' 
                  : 'border-transparent bg-muted/50 hover:bg-muted hover:border-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <layout.icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{layout.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{layout.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scale Slider */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          {t('themeScale')}
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t('themeScaleCompact')}</span>
            <span className="font-bold text-lg text-foreground">{SCALE_LABELS[scaleIndex >= 0 ? scaleIndex : 2]}</span>
            <span>{t('themeScaleSpacious')}</span>
          </div>
          <input
            type="range"
            min={0}
            max={4}
            value={scaleIndex >= 0 ? scaleIndex : 2}
            onChange={(e) => setConfig({ ...config, scale: SCALE_KEYS[parseInt(e.target.value)] })}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
            style={{ background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((scaleIndex >= 0 ? scaleIndex : 2) / 4) * 100}%, var(--color-border) ${((scaleIndex >= 0 ? scaleIndex : 2) / 4) * 100}%, var(--color-border) 100%)` }}
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            {SCALE_LABELS.map((l, i) => (
              <span key={l} className={scaleIndex === i ? 'text-primary font-bold' : ''}>{l}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {t('themeScaleHint')}
          </p>
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          {t('themeColors')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {COLORS.map(color => (
            <div 
              key={color.id}
              onClick={() => setConfig({ ...config, colorScheme: color.id })}
              className={`p-3 rounded-lg cursor-pointer transition-all border-2 flex items-center gap-3 ${
                config.colorScheme === color.id 
                  ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20' 
                  : 'border-transparent bg-muted/50 hover:bg-muted hover:border-border'
              }`}
            >
              <div className="flex -space-x-1 shrink-0">
                {color.swatch.map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-background shadow-sm" style={{ background: c }} />
                ))}
              </div>
              <span className="font-medium text-sm truncate">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          &lt;/&gt; {t('themeCustomCss')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">{t('themeCustomCssDesc')}</p>
        <Textarea 
          value={config.customCss || ''} 
          onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
          placeholder=":root { --color-primary: #3ea534; }"
          className="font-mono text-sm bg-muted/50"
          rows={6}
        />
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isPending}
          className="shadow-xl"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          {t('themeSave')}
        </Button>
      </div>
    </div>
  )
}
