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
import { Loader2 } from 'lucide-react'

export function DealForm({ categories }: { categories: any[] }) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('deal')
  const [isPending, startTransition] = useTransition()
  
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
    <form onSubmit={handleSubmit} className="space-y-6 glass-strong p-6 rounded-[var(--border-radius-xl)] shadow-xl max-w-2xl mx-auto">
      
      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <Input id="url" name="url" type="url" required placeholder="https://..." className="bg-white/50" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{t('title')} *</Label>
        <Input id="title" name="title" required minLength={5} maxLength={200} className="bg-white/50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t('price')} (VNĐ)</Label>
          <Input id="price" name="price" type="number" min="0" className="bg-white/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comparePrice">{t('comparePrice')}</Label>
          <Input id="comparePrice" name="comparePrice" type="number" min="0" className="bg-white/50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="couponCode">{t('couponCode')}</Label>
          <Input id="couponCode" name="couponCode" className="bg-white/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="merchant">{t('merchant')}</Label>
          <Input id="merchant" name="merchant" className="bg-white/50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">{t('category')} *</Label>
          <Select name="categoryId" required>
            <SelectTrigger className="bg-white/50">
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">{t('type')} *</Label>
          <Select name="type" defaultValue="DEAL" required>
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

      <div className="space-y-2">
        <Label htmlFor="image">{t('imageUrl')}</Label>
        <Input id="image" name="image" type="url" className="bg-white/50" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('description')} *</Label>
        <Textarea 
          id="description" 
          name="description" 
          required 
          minLength={10} 
          rows={6}
          className="bg-white/50 resize-y"
          placeholder={t('enterDetails')}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-[var(--color-primary)] text-white hover:opacity-90 h-12 text-lg">
        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : t('submitDeal')}
      </Button>
    </form>
  )
}
