'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUnreadNotificationCount, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/server/actions/notifications'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDistanceToNow } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import { useTranslations, useLocale } from 'next-intl'

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('nav')
  const locale = useLocale()

  // Poll for unread count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getUnreadNotificationCount()
        setUnreadCount(count)
      } catch (e) {
        // user might not be logged in
      }
    }
    
    fetchCount()
    const interval = setInterval(fetchCount, 60000) // every 60s
    return () => clearInterval(interval)
  }, [])

  // Fetch recent notifications when popover opens
  useEffect(() => {
    if (isOpen) {
      getNotifications(5).then(setNotifications).catch(console.error)
    }
  }, [isOpen])

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.preventDefault() // prevent navigating if it's a link click wrapper
    await markNotificationAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAll = async () => {
    await markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={
        <Button variant="ghost" className="nav-icon-btn h-9 px-2 xl:px-3 gap-2" title={t('notifications')} />
      }>
        <div className="relative flex items-center justify-center">
          <Bell className="w-[var(--icon-size)] h-[var(--icon-size)]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold flex items-center justify-center px-1 animate-in zoom-in">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <span className="hidden xl:inline font-medium text-sm">{t('notifications')}</span>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">{locale === 'vi' ? 'Thông báo' : 'Notifications'}</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline" onClick={handleMarkAll}>
              <CheckCheck className="w-3 h-3 mr-1" />
              {locale === 'vi' ? 'Đánh dấu đã đọc' : 'Mark all as read'}
            </Button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              {locale === 'vi' ? 'Không có thông báo nào.' : 'No notifications.'}
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map(n => (
                <Link 
                  key={n.id} 
                  href={n.link || '#'} 
                  onClick={() => { if(!n.read) handleMarkAsRead(null as any, n.id) }}
                  className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex justify-between gap-2">
                    <div className="space-y-1">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: locale === 'vi' ? vi : enUS })}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-2 border-t bg-muted/20">
          <Link href="/thong-bao" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full text-xs h-8">
              {locale === 'vi' ? 'Xem tất cả thông báo' : 'View all notifications'}
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
