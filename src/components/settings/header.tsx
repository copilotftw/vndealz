import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SettingsHeaderProps {
  title: string
  isPending?: boolean
  showSave?: boolean
}

export function SettingsHeader({ title, isPending = false, showSave = true }: SettingsHeaderProps) {
  const t = useTranslations('settings')
  
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10 dark:border-white/10">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">{title}</h1>
      
      {showSave && (
        <Button 
          type="submit" 
          disabled={isPending} 
          className="bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full px-8 h-10 font-bold transition-colors"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {t('profile.saveChanges')}
        </Button>
      )}
    </div>
  )
}
