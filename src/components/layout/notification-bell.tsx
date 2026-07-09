'use client'

import * as React from 'react'
import { useState } from 'react'
import { Bell, Mail, Settings, Check, MessageCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'

export function NotificationBell({ customTrigger }: { customTrigger?: React.ReactNode }) {
  const [hasUnread, setHasUnread] = useState(true)
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'alerts' | 'messages'>('alerts')
  const isMobile = useMediaQuery("(max-width: 768px)")

  const trigger = customTrigger || (
    <div className="nav-icon-btn h-10 px-3 gap-2 flex items-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer">
      <div className="relative flex items-center justify-center shrink-0">
        <Bell className="w-[var(--icon-size)] h-[var(--icon-size)]" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--color-danger)] rounded-full border-2 border-white dark:border-[var(--color-nav-bg)]" />
        )}
      </div>
      <span className="hidden xl:inline font-bold text-sm whitespace-nowrap">Thông báo</span>
    </div>
  )

  const content = (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)]/50 shrink-0">
        <button 
           onClick={() => setActiveTab('messages')}
           className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-colors ${activeTab === 'messages' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-current'}`}
        >
           <Mail className="w-5 h-5" />
        </button>
        <button 
           onClick={() => setActiveTab('alerts')}
           className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-colors ${activeTab === 'alerts' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-current'}`}
        >
           <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]/30 bg-black/5 dark:bg-white/5 shrink-0">
         <button className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 hover:underline">
            <Check className="w-3.5 h-3.5" /> Đánh dấu tất cả đã đọc
         </button>
         <div className="flex items-center gap-3">
            {activeTab === 'messages' && <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />}
            <Settings className="w-4 h-4 text-[var(--color-text-muted)] cursor-pointer hover:text-current" />
         </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-safe max-h-[60vh] md:max-h-[400px]">
         {activeTab === 'alerts' ? (
            <div className="divide-y divide-[var(--color-border)]/30">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-4 flex gap-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                     <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] shrink-0 text-white flex items-center justify-center font-bold">S</div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm">
                           Deal <strong>Google Pixel 10 Pro 128 GB</strong> mà bạn đang theo dõi đã có thêm bình luận từ <strong>Schorsche</strong> và 147 người khác
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                           <MessageCircle className="w-3 h-3" /> 4 giờ, 34 phút trước
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="divide-y divide-[var(--color-border)]/30">
               {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 flex gap-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                     <div className="w-10 h-10 rounded-full bg-[var(--color-success)] shrink-0 flex items-center justify-center text-white text-xl">🐸</div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-sm">fabi1</h4>
                           <span className="text-xs text-[var(--color-text-muted)]">7 Thg 7</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] truncate mt-0.5">Chào bạn, mình muốn giới thiệu bạn dùng Curve...</p>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {/* We can't use asChild. base-ui uses render prop or children. Since trigger is a ReactNode, if we pass it as a child, it might be wrapped in a button. If we pass render, it replaces the element. Let's try render. */}
        {React.isValidElement(trigger) ? (
           <SheetTrigger render={trigger} />
        ) : (
           <SheetTrigger>{trigger}</SheetTrigger>
        )}
        <SheetContent side="bottom" className="w-full p-0 rounded-t-2xl overflow-hidden glass-strong shadow-2xl border-t border-[var(--color-border)]/50 outline-none flex flex-col h-[75vh]">
          {/* Add a visually hidden title for accessibility so screen readers don't complain */}
          <SheetHeader className="sr-only">
            <SheetTitle>Thông báo</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden flex flex-col pt-2">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-2 shrink-0" />
            {content}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {React.isValidElement(trigger) ? (
         <PopoverTrigger render={trigger} />
      ) : (
         <PopoverTrigger>{trigger}</PopoverTrigger>
      )}
      
      <PopoverContent align="end" className="w-[380px] p-0 rounded-2xl overflow-hidden glass-strong shadow-2xl border border-[var(--color-border)]/50 mt-2 z-[60]">
        {content}
      </PopoverContent>
    </Popover>
  )
}
