'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ShareDealModalProps {
  isOpen: boolean
  onClose: () => void
  deal: {
    title: string
    url: string
    image: string | null
    slug: string
  }
}

export function ShareDealModal({ isOpen, onClose, deal }: ShareDealModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  // Ensure absolute URL
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/deal/${deal.slug}` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Đã sao chép liên kết!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(deal.title + ' ' + shareUrl)}`, '_blank')
  }

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(deal.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-[var(--color-surface)] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[var(--color-border)]">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-white leading-tight">
            Chia sẻ ưu đãi này với bạn bè
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-0 flex flex-col items-center">
          
          {/* Image Preview */}
          <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-4 shadow-inner mb-8">
            <Image 
              src={deal.image || 'https://utfs.io/f/placeholder.png'} 
              alt={deal.title}
              width={160}
              height={160}
              className="object-contain w-full h-full"
            />
          </div>

          {/* Copy Link Button */}
          <button 
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)]/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Đã sao chép
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Sao chép liên kết
              </>
            )}
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs font-semibold text-white/50 tracking-wider">HOẶC</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <button 
              onClick={handleWhatsApp}
              className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-success)] hover:border-transparent transition-all group"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[var(--color-text)] group-hover:fill-white group-hover:scale-110 transition-transform"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </button>
            <button 
              onClick={handleTwitter}
              className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-black hover:border-transparent transition-all group dark:hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[var(--color-text)] group-hover:fill-white dark:group-hover:fill-black group-hover:scale-110 transition-transform"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button 
              onClick={handleFacebook}
              className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:border-transparent transition-all group"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white group-hover:scale-110 transition-transform"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
