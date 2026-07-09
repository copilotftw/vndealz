'use client'

import { useState } from 'react'
import { Bell, Mail, Settings, Check, MessageCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function NotificationBell() {
  const [hasUnread, setHasUnread] = useState(true)
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'alerts' | 'messages'>('alerts')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="nav-icon-btn h-10 px-3 gap-2 flex items-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
        <div className="relative flex items-center justify-center shrink-0">
          <Bell className="w-[var(--icon-size)] h-[var(--icon-size)]" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--color-danger)] rounded-full border-2 border-white dark:border-[var(--color-nav-bg)]" />
          )}
        </div>
        <span className="hidden xl:inline font-bold text-sm whitespace-nowrap">Thông báo</span>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-[380px] p-0 rounded-2xl overflow-hidden glass-strong shadow-2xl border border-[var(--color-border)]/50 mt-2 z-[60]">
        
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)]/50">
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
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]/30 bg-black/5 dark:bg-white/5">
           <button className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 hover:underline">
              <Check className="w-3.5 h-3.5" /> Alles als gelesen markieren
           </button>
           <div className="flex items-center gap-3">
              {activeTab === 'messages' && <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />}
              <Settings className="w-4 h-4 text-[var(--color-text-muted)] cursor-pointer hover:text-current" />
           </div>
        </div>

        {/* Content List */}
        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
           {activeTab === 'alerts' ? (
              <div className="divide-y divide-[var(--color-border)]/30">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 flex gap-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                       <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] shrink-0 text-white flex items-center justify-center font-bold">F</div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm">
                             Der Deal <strong>Google Pixel 10 Pro 128 GB</strong> dem Du folgst, wurde von <strong>Schorsche</strong> und 147 weiteren kommentiert
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                             <MessageCircle className="w-3 h-3" /> vor 4 h, 34 m
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
                             <span className="text-xs text-[var(--color-text-muted)]">7. Jul</span>
                          </div>
                          <p className="text-sm text-[var(--color-text-muted)] truncate mt-0.5">Hi, Werbe dich gerne für curve. Biete dir 3...</p>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
