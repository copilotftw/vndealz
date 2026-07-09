'use client'

import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

export function AffiliatesClient({ data }: { data: any[] }) {
  const t = useTranslations('admin')

  const columns = [
    {
      accessorKey: 'merchant',
      header: t('colMerchant'),
      cell: ({ row }: any) => <span className="font-semibold">{row.original.merchant}</span>
    },
    {
      accessorKey: 'urlPattern',
      header: t('colUrlPattern'),
      cell: ({ row }: any) => <code className="text-xs bg-muted px-2 py-1 rounded">{row.original.urlPattern}</code>
    },
    {
      accessorKey: 'affiliateTag',
      header: t('colAffiliateTag'),
      cell: ({ row }: any) => <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{row.original.affiliateTag}</code>
    },
    {
      accessorKey: 'active',
      header: t('colStatus'),
      cell: ({ row }: any) => {
        const active = row.original.active
        return <Badge variant={active ? 'default' : 'secondary'}>{active ? t('statusActive') : t('statusInactive')}</Badge>
      }
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="icon" title={t('editBtn')}>
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" title={t('deleteBtn')}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} searchKey="merchant" />
}
