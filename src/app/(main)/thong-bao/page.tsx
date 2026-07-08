import { getNotifications, markAllNotificationsAsRead } from '@/server/actions/notifications'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Bell, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Thông báo | VNDealz',
}

export default async function NotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect('/dang-nhap')
  }

  // Fetch more notifications for the full page
  const notifications = await getNotifications(50)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 pb-12 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" />
            Thông báo
          </h1>
          <p className="text-muted-foreground mt-2">
            Xem lịch sử thông báo của bạn.
          </p>
        </div>
        
        <form action={async () => {
          'use server'
          await markAllNotificationsAsRead()
        }}>
          <Button variant="outline" size="sm">
            <CheckCheck className="w-4 h-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
        </form>
      </div>

      <div className="card divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Bạn chưa có thông báo nào.
          </div>
        ) : (
          notifications.map(n => (
            <Link 
              key={n.id}
              href={n.link || '#'}
              className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 mt-2 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="space-y-1">
                <p className={`text-base ${!n.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {n.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {n.body}
                </p>
                <p className="text-xs text-muted-foreground/80 mt-2">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
