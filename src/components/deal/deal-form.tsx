'use client'

import { useState, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
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
  const isVi = locale === 'vi'
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
        toast.success(isVi ? 'Deal đã được gửi và đang chờ duyệt!' : 'Deal submitted for moderation!')
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
        <Label htmlFor="title">{isVi ? 'Tiêu đề' : 'Title'} *</Label>
        <Input id="title" name="title" required minLength={5} maxLength={200} className="bg-white/50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{isVi ? 'Giá (VNĐ)' : 'Price'}</Label>
          <Input id="price" name="price" type="number" min="0" className="bg-white/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comparePrice">{isVi ? 'Giá gốc' : 'Compare Price'}</Label>
          <Input id="comparePrice" name="comparePrice" type="number" min="0" className="bg-white/50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="couponCode">{isVi ? 'Mã giảm giá' : 'Coupon Code'}</Label>
          <Input id="couponCode" name="couponCode" className="bg-white/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="merchant">{isVi ? 'Cửa hàng (VD: Shopee)' : 'Merchant'}</Label>
          <Input id="merchant" name="merchant" className="bg-white/50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">{isVi ? 'Danh mục' : 'Category'} *</Label>
          <Select name="categoryId" required>
            <SelectTrigger className="bg-white/50">
              <SelectValue placeholder={isVi ? 'Chọn danh mục' : 'Select category'} />
            </SelectTrigger>
            <SelectContent>
              {flatCats.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {'—'.repeat(cat.depth)} {isVi ? cat.nameVi : cat.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">{isVi ? 'Loại' : 'Type'} *</Label>
          <Select name="type" defaultValue="DEAL" required>
            <SelectTrigger className="bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEAL">Deal</SelectItem>
              <SelectItem value="VOUCHER">Voucher</SelectItem>
              <SelectItem value="FREEBIE">Freebie</SelectItem>
              <SelectItem value="DISCUSSION">{isVi ? 'Thảo luận' : 'Discussion'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">{isVi ? 'Ảnh URL' : 'Image URL'}</Label>
        <Input id="image" name="image" type="url" className="bg-white/50" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{isVi ? 'Mô tả chi tiết' : 'Description'} *</Label>
        <Textarea 
          id="description" 
          name="description" 
          required 
          minLength={10} 
          rows={6}
          className="bg-white/50 resize-y"
          placeholder={isVi ? 'Nhập chi tiết về khuyến mãi này...' : 'Enter details...'}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-[var(--color-primary)] text-white hover:opacity-90 h-12 text-lg">
        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (isVi ? 'Đăng Deal' : 'Submit Deal')}
      </Button>
    </form>
  )
}
