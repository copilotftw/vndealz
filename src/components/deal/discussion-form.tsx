'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { createDeal } from '@/server/actions/deal'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function DiscussionForm({ 
  dealCategories, 
  discussionCategories 
}: { 
  dealCategories: any[],
  discussionCategories: any[]
}) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('discussionForm')
  const [isPending, startTransition] = useTransition()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDiscCat, setSelectedDiscCat] = useState<string | null>(null)
  const [selectedDealCat, setSelectedDealCat] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!title || !description || !selectedDiscCat) {
      toast.error('Please fill in all required fields')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('type', 'DISCUSSION')
    formData.append('discussionCategoryId', selectedDiscCat)
    if (selectedDealCat) {
      formData.append('categoryId', selectedDealCat)
    }

    startTransition(async () => {
      try {
        await createDeal(formData)
        toast.success('Discussion started successfully!')
        router.push('/discussion')
      } catch (err: any) {
        toast.error(err.message || 'Error creating discussion')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass-strong p-8 rounded-2xl border border-[var(--color-border)]/50">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <label className="text-sm font-bold text-[var(--color-text)]">
            {t('titleLabel')}
          </label>
          <span className="text-xs text-[var(--color-text-muted)]">
            {t('charsLeft', { count: 140 - title.length })}
          </span>
        </div>
        <Input 
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={t('titlePlaceholder')} 
          className="h-12 text-base"
          maxLength={140}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <label className="text-sm font-bold text-[var(--color-text)]">
            {t('descLabel')}
          </label>
        </div>
        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
          {/* Mock Editor Toolbar */}
          <div className="flex items-center gap-1 p-2 border-b border-[var(--color-border)] bg-[var(--color-nav-bg)]">
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8 font-serif font-bold">B</Button>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8 italic font-serif">I</Button>
            <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8">≡</Button>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8">-</Button>
            <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8">☺</Button>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8">🔗</Button>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8">🖼</Button>
          </div>
          <Textarea 
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border-0 focus-visible:ring-0 rounded-none resize-y min-h-[200px] text-base p-4"
            required
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-[var(--color-text)]">
            {t('catLabel')}
          </label>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {t('catDesc')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {discussionCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedDiscCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
                selectedDiscCat === cat.id 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                  : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-text-muted)] text-[var(--color-text)]'
              }`}
            >
              <Plus className={`w-4 h-4 ${selectedDiscCat === cat.id ? 'opacity-0 w-0' : 'opacity-50'}`} />
              {locale === 'vi' ? cat.nameVi : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Deal Categories (Optional) */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]/50">
        <p className="text-sm text-[var(--color-text-muted)]">
          {t('dealCatLabel')}
        </p>
        <div className="flex flex-wrap gap-2">
          {dealCategories.filter(c => !c.parentId).map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedDealCat(selectedDealCat === cat.id ? null : cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
                selectedDealCat === cat.id 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                  : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-text-muted)] text-[var(--color-text)]'
              }`}
            >
              <Plus className={`w-4 h-4 ${selectedDealCat === cat.id ? 'opacity-0 w-0' : 'opacity-50'}`} />
              {locale === 'vi' ? cat.nameVi : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 text-base font-bold bg-[#3ea534] hover:bg-[#34932a] text-white"
        >
          {t('submit')}
        </Button>
      </div>
    </form>
  )
}
