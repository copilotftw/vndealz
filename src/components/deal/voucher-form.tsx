'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { createDeal } from '@/server/actions/deal'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Link as LinkIcon, Settings, Image as ImageIcon, FileText, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

const STEPS = [
  { id: 1, nameKey: 'stepLink', icon: LinkIcon },
  { id: 2, nameKey: 'stepEssentials', icon: Settings },
  { id: 3, nameKey: 'stepGallery', icon: ImageIcon },
  { id: 4, nameKey: 'stepDescription', icon: FileText },
  { id: 5, nameKey: 'stepReview', icon: CheckCircle2 }
]

export function VoucherForm({ categories }: { categories: any[] }) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('deal')
  const vt = useTranslations('voucherForm')
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')
  
  // Flatten tree for select
  const flatCats: any[] = []
  const flatten = (nodes: any[], depth = 0) => {
    nodes.forEach(n => {
      flatCats.push({ ...n, depth })
      if (n.children) flatten(n.children, depth + 1)
    })
  }
  flatten(categories)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step < 5) {
      setStep(s => s + 1)
      return
    }

    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await createDeal(formData)
        toast.success(t('submitSuccess'))
        router.push('/')
      } catch (err: any) {
        toast.error(err.message || 'Error submitting deal')
      }
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto items-start">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 glass-strong rounded-[var(--border-radius-xl)] p-4 sticky top-24">
        <h2 className="text-xl font-bold mb-6 px-2">{locale === 'vi' ? 'Đăng Voucher' : 'Submit Voucher'}</h2>
        <div className="flex flex-col space-y-1">
          {STEPS.map((s) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isPast = step > s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                    : 'text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  isActive ? 'border-[var(--color-primary)]' : isPast ? 'border-[var(--color-success)] text-[var(--color-success)]' : 'border-current opacity-50'
                }`}>
                  {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                {t(s.nameKey as any)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Form Area */}
      <form onSubmit={handleSubmit} className="flex-1 glass-strong rounded-[var(--border-radius-xl)] p-6 md:p-10 shadow-xl min-h-[500px] flex flex-col">
        
        {/* Step 1: Link */}
        <div className={step === 1 ? 'block flex-1' : 'hidden'}>
          <div className="text-center max-w-2xl mx-auto mb-10 mt-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">{vt('step1Title')}</h2>
            <p className="text-lg text-[var(--color-text-muted)] mb-10">{vt('step1Desc')}</p>
            <div className="flex flex-col gap-4 max-w-xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <Input 
                  id="couponCode" 
                  name="couponCode" 
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={vt('step1CodePlaceholder')} 
                  className="bg-black/5 dark:bg-white/5 border-[var(--color-border)] h-12 text-base rounded-lg px-4 flex-1" 
                />
                <Input 
                  id="url" 
                  name="url" 
                  type="url" 
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder={vt('step1LinkPlaceholder')} 
                  className="bg-black/5 dark:bg-white/5 border-[var(--color-border)] h-12 text-base rounded-lg px-4 flex-[2]" 
                />
                <Button 
                  type="button" 
                  onClick={() => setStep(2)} 
                  disabled={!code && !url}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white h-12 px-6 rounded-lg font-bold"
                >
                  {vt('step1Submit')}
                </Button>
              </div>
              <Button type="button" onClick={() => setStep(2)} variant="ghost" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                {vt('step1NoLink')}
              </Button>
            </div>
          </div>
        </div>

        {/* Step 2: Essentials */}
        <div className={step === 2 ? 'block flex-1 space-y-6' : 'hidden'}>
          <h2 className="text-2xl font-bold mb-6">{t('step2Title')}</h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">{t('title')} (erforderlich)</Label>
            <Input id="title" name="title" required minLength={5} maxLength={140} className="bg-white/50" placeholder={t('step2TitlePlaceholder')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">{t('price')} (VNĐ)</Label>
              <Input id="price" name="price" type="number" min="0" className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comparePrice">{t('comparePrice')}</Label>
              <Input id="comparePrice" name="comparePrice" type="number" min="0" className="bg-white/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="merchant">{t('merchant')}</Label>
              <Input id="merchant" name="merchant" className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{t('type')}</Label>
              <Select name="type" defaultValue="VOUCHER">
                <SelectTrigger className="bg-white/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEAL">Deal</SelectItem>
                  <SelectItem value="VOUCHER">Voucher</SelectItem>
                  <SelectItem value="FREEBIE">Freebie</SelectItem>
                  <SelectItem value="DISCUSSION">{t('discussion')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Step 3: Image Gallery */}
        <div className={step === 3 ? 'block flex-1 space-y-6' : 'hidden'}>
          <h2 className="text-2xl font-bold mb-6">{t('step3Title')}</h2>
          <p className="text-[var(--color-text-muted)]">{t('step3Desc')}</p>
          <div className="space-y-4">
            <Label htmlFor="image">{t('imageUrl')}</Label>
            <Input id="image" name="image" type="url" className="bg-white/50 h-12" placeholder="https://..." />
            <div className="aspect-video w-full max-w-sm mx-auto bg-black/5 dark:bg-white/5 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-[var(--color-text-muted)] gap-3">
               <ImageIcon className="w-10 h-10 opacity-50" />
               <span className="text-sm">{t('step3ImagePlaceholder')}</span>
            </div>
          </div>
        </div>

        {/* Step 4: Description */}
        <div className={step === 4 ? 'block flex-1 space-y-6' : 'hidden'}>
          <h2 className="text-2xl font-bold mb-6">{t('step4Title')}</h2>
          <p className="text-[var(--color-text-muted)] mb-4">{t('step4Desc')}</p>
          <div className="space-y-2 h-64">
            <Textarea 
              id="description" 
              name="description" 
              required={step === 4}
              minLength={10} 
              className="bg-white/50 resize-none h-full"
              placeholder={t('enterDetails')}
            />
          </div>
        </div>

        {/* Step 5: Final Review */}
        <div className={step === 5 ? 'block flex-1 space-y-6' : 'hidden'}>
          <h2 className="text-2xl font-bold mb-6">{t('step5Title')}</h2>
          <div className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="categoryId">{t('step5Category')}</Label>
              <Select name="categoryId" required={step === 5}>
                <SelectTrigger className="bg-white/50 h-12">
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {flatCats.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {'—'.repeat(cat.depth)} {locale === 'vi' ? cat.nameVi : cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">{t('step5CategoryDesc')}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-[var(--color-border)] flex items-center justify-between mt-auto">
          {step > 1 ? (
             <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="rounded-full px-6">
                {t('back')}
             </Button>
          ) : <div></div>}
          
          {step < 5 ? (
            <Button type="button" onClick={() => setStep(s => s + 1)} className="rounded-full px-8 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-current border border-[var(--color-border)]">
              {t('next')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending} className="rounded-full px-8 bg-[var(--color-success)] hover:brightness-110 text-white font-bold">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : t('submitDeal')}
            </Button>
          )}
        </div>

      </form>
    </div>
  )
}
