import { Metadata } from 'next'
import { DealAlarmClient } from './client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Cảnh báo Deal',
}

export default async function DealAlarmPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/dang-nhap')

  const [alerts, categories] = await Promise.all([
    db.dealAlert.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.category.findMany({
      where: { depth: 0 },
      orderBy: { order: 'asc' },
    }),
  ])

  return <DealAlarmClient initialAlerts={alerts} categories={categories} />
}
