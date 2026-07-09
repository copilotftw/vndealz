'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { moderateDeal } from '@/server/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export function ModerationQueue({ initialDeals }: { initialDeals: any[] }) {
  const t = useTranslations('admin')
  const [deals, setDeals] = useState(initialDeals)
  const [isPending, startTransition] = useTransition()

  const handleModerate = (id: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      try {
        await moderateDeal(id, action)
        setDeals(prev => prev.filter(d => d.id !== id))
        toast.success(action === 'approve' ? t('approveSuccess') : t('rejectSuccess'))
      } catch (err: any) {
        toast.error(err.message || t('moderationError'))
      }
    })
  }

  if (deals.length === 0) {
    return <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">{t('noPendingDeals')}</div>
  }

  return (
    <div className="space-y-4">
      {deals.map(deal => (
        <Card key={deal.id}>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative w-24 h-24 shrink-0 bg-muted rounded-md overflow-hidden flex items-center justify-center">
              <Image
                src={deal.image || 'https://utfs.io/f/placeholder.png'}
                alt={deal.title}
                fill
                className="object-contain p-2 mix-blend-multiply"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">{deal.title}</h3>
              <div className="text-sm text-muted-foreground mb-2 grid grid-cols-2 gap-y-1">
                <div><strong>{t('labelStore')}:</strong> {deal.merchant || 'N/A'}</div>
                <div><strong>{t('colPrice')}:</strong> {deal.price || 'N/A'}</div>
                <div><strong>{t('labelCoupon')}:</strong> {deal.couponCode || 'N/A'}</div>
                <div><strong>{t('labelPostedBy')}:</strong> {deal.user?.name}</div>
                <div className="col-span-2"><strong>{t('labelUrl')}:</strong> <a href={deal.url} target="_blank" rel="noreferrer" className="text-primary hover:underline line-clamp-1">{deal.url}</a></div>
              </div>
              <p className="text-sm line-clamp-3 bg-muted/50 p-2 rounded">{deal.description}</p>
            </div>

            <div className="flex md:flex-col justify-end gap-2 shrink-0">
              <Button
                onClick={() => handleModerate(deal.id, 'approve')}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" /> {t('approve')}
              </Button>
              <Button
                onClick={() => handleModerate(deal.id, 'reject')}
                disabled={isPending}
                variant="destructive"
              >
                <X className="w-4 h-4 mr-2" /> {t('reject')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
