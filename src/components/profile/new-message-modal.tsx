'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PencilLine, Search, Smile } from 'lucide-react'
import { toast } from 'sonner'

interface NewMessageModalProps {
  recipientName: string
  isOpen: boolean
  onClose: () => void
}

export function NewMessageModal({ recipientName, isOpen, onClose }: NewMessageModalProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    
    setIsSending(true)
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSending(false)
    toast.success('Message sent to ' + recipientName)
    setMessage('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white dark:bg-[var(--color-surface)] border-none overflow-hidden gap-0 rounded-[1.5rem]">
        
        {/* Header */}
        <DialogHeader className="bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover)] px-6 py-4 flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 m-0">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-[var(--color-surface)] p-2 rounded-full shadow-sm">
              <PencilLine className="w-5 h-5 text-[var(--color-text)]" />
            </div>
            <DialogTitle className="text-xl font-bold text-[var(--color-text)] m-0">
              New Message
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* To Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[var(--color-text)]">To</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                type="text"
                value={recipientName}
                readOnly
                className="w-full bg-black/5 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-[var(--color-text)] font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[var(--color-text)]">Message</label>
            <div className="relative">
              <textarea
                className="w-full h-40 p-4 pb-12 bg-black/5 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-lg text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="absolute bottom-3 left-3 text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text)] transition-colors">
                <Smile className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover)] border-t border-black/5 dark:border-white/5 flex sm:justify-end gap-3 m-0">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isSending}
            className="font-bold text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!message.trim() || isSending} 
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 font-bold rounded-full px-8 h-10"
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
