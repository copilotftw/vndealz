'use client'

import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Check, Trash2, Ban } from 'lucide-react'
import Link from 'next/link'

export function ReportsClient({ data }: { data: any[] }) {
  const t = useTranslations('admin')

  const columns = [
    {
      accessorKey: 'targetType',
      header: t('colType'),
      cell: ({ row }: any) => {
        const type = row.original.targetType
        const map: Record<string, string> = { DEAL: 'Deal', COMMENT: t('typeComment'), USER: t('typeUser') }
        return <Badge variant="outline">{map[type] || type}</Badge>
      }
    },
    {
      accessorKey: 'reason',
      header: t('colReason'),
      cell: ({ row }: any) => (
        <span className="font-medium truncate max-w-[300px] block" title={row.original.reason}>
          {row.original.reason}
        </span>
      )
    },
    { accessorKey: 'reporter', header: t('colReporter') },
    {
      accessorKey: 'status',
      header: t('colStatus'),
      cell: ({ row }: any) => {
        const s = row.original.status
        return <Badge variant={s === 'PENDING' ? 'destructive' : 'secondary'}>{s}</Badge>
      }
    },
    { accessorKey: 'createdAt', header: t('colTime') },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        if (row.original.status !== 'PENDING') return null
        return (
          <div className="flex items-center gap-2 justify-end">
            <Link href={`/deal/${row.original.targetId}`} target="_blank" title={t('viewLink')}>
              <Button variant="ghost" size="icon">
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="w-4 h-4 text-orange-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Ban className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )
      }
    }
  ]

  return <DataTable columns={columns} data={data} searchKey="reason" />
}
