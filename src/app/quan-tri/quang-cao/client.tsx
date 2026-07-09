'use client'

import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export function AdsClient({ data }: { data: any[] }) {
  const t = useTranslations('admin')
  const columns = [
    {
      accessorKey: 'title',
      header: t('colTitle'),
      cell: ({ row }: any) => <span className="font-semibold">{row.original.title || t('noTitle')}</span>
    },
    {
      accessorKey: 'slot',
      header: t('colSlot'),
      cell: ({ row }: any) => <Badge variant="outline">{row.original.slot}</Badge>
    },
    {
      accessorKey: 'impressions',
      header: t('colImpressions'),
      cell: ({ row }: any) => <span>{row.original.impressions.toLocaleString()}</span>
    },
    {
      accessorKey: 'clicks',
      header: t('colClicks'),
      cell: ({ row }: any) => <span>{row.original.clicks.toLocaleString()}</span>
    },
    {
      accessorKey: 'active',
      header: t('colStatus'),
      cell: ({ row }: any) => {
        const active = row.original.active
        return <Badge variant={active ? 'default' : 'secondary'}>{active ? t('statusRunning') : t('statusStopped')}</Badge>
      }
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 justify-end">
          <Link href={row.original.targetUrl} target="_blank" title={t('viewLink')}>
            <Button variant="ghost" size="icon">
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </Button>
          </Link>
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

  return <DataTable columns={columns} data={data} searchKey="title" />
}
