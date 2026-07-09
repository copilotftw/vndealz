'use client'

import { formatPrice, timeAgo } from '@/lib/utils'
import { TemperatureVote } from './temperature-vote'
import { PriceChart } from './price-chart'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Copy, ExternalLink, MessageCircle, Share2, Bookmark, 
  AlertCircle, MessageSquare, Plus, Flag, Clock, BadgeCheck, Tag, Check
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { toggleSaveDeal } from '@/server/actions/deal'
import { ShareDealModal } from './share-deal-modal'

export function DealDetail({ deal, locale, initialIsSaved = false }: { deal: any, locale: string, initialIsSaved?: boolean }) {
  const t = useTranslations('dealDetail')
  const [copied, setCopied] = useState(false)

  const copyCoupon = () => {
    if (deal.couponCode) {
      navigator.clipboard.writeText(deal.couponCode)
      setCopied(true)
      toast.success(t('copied'))
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isShareOpen, setIsShareOpen] = useState(false)
  
  // Collect images
  const allImages = deal.images?.length > 0 
    ? deal.images.map((img: any) => img.url) 
    : [deal.image].filter(Boolean)
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const selectedImage = allImages[selectedImageIndex] || 'https://utfs.io/f/placeholder.png'

  const handleSave = async () => {
    const previousState = isSaved
    setIsSaved(!isSaved)
    
    // Play animation
    if (!isSaved) {
      toast.success(t('savedSuccess'))
    } else {
      toast(t('unsavedSuccess'))
    }

    try {
      const res = await toggleSaveDeal(deal.id)
      setIsSaved(res.saved)
    } catch(err) {
      setIsSaved(previousState)
      toast.error(t('saveError'))
    }
  }

  const affiliateUrl = deal.affiliateUrl || deal.url

  return (
    <div className="flex flex-col gap-4">
      {/* 1. TOP SECTION (Card 1) */}
      <article
        className="deal-detail-root bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-[var(--border-radius-xl)] shadow-sm overflow-hidden flex flex-col md:flex-row"
        style={{ '--vt-name': `deal-${deal.id}` } as React.CSSProperties}
      >
        
        {/* Left: Image Gallery */}
        <div data-detail-hero className="w-full md:w-[30rem] shrink-0 bg-[var(--color-surface-hover)] relative p-4 flex gap-4 md:border-r border-[var(--color-border)]/60">
          
          {/* Thumbnails (Only show if multiple images) */}
          {allImages.length > 1 && (
            <div className="w-16 shrink-0 flex flex-col gap-2 overflow-y-auto hidden-scrollbar py-2">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border-2 transition-all ${
                    idx === selectedImageIndex ? 'border-[var(--color-primary)]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" sizes="64px" />
                </button>
              ))}
            </div>
          )}

          {/* Main Selected Image */}
          <div data-detail-image className="relative flex-1 bg-white rounded-2xl overflow-hidden shadow-sm aspect-square md:aspect-auto md:h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt={deal.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
            <Button variant="outline" size="sm" className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white border-transparent rounded-full shadow-lg text-xs font-medium px-4 h-8 transition-colors">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              {t('enlarge')}
            </Button>
          </div>
        </div>

        {/* Right: Content */}
        <div data-detail-content className="flex-1 p-5 md:p-8 flex flex-col relative">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <TemperatureVote dealId={deal.id} temperature={deal.temperature} />
            </div>
            
            <div className="flex items-center gap-4 text-[var(--color-text-muted)] text-sm font-semibold">
              <Link href={`#comments`} className="flex items-center gap-1.5 hover:text-[var(--color-text)] transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{deal._count?.comments || 0}</span>
              </Link>
              <button 
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-1.5 hover:text-[var(--color-text)] transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">{t('share')}</span>
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-1.5 hover:text-[var(--color-text)] transition-all group"
              >
                <Bookmark className={`w-5 h-5 transition-all ${isSaved ? 'fill-current text-white scale-110' : ''}`} />
                <span className={`hidden sm:inline ${isSaved ? 'text-white' : ''}`}>
                  {isSaved ? t('saved') : t('save')}
                </span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-[var(--color-text-muted)] mb-3">
            {t('posted')} {timeAgo(deal.createdAt, locale)}
          </div>

          <h1 className="text-[length:var(--font-size-xl)] md:text-[length:var(--font-size-2xl)] font-bold text-[var(--color-text)] leading-snug mb-4">
            {deal.sponsored && (
              <span className="inline-block bg-[var(--color-sponsored)] text-white text-[0.625rem] font-bold px-1.5 py-0.5 rounded shadow-sm mr-2 align-middle uppercase tracking-wide">
                {t('sponsored')}
              </span>
            )}
            {deal.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            {deal.price !== null && (
              <span className="text-[2.25rem] font-black text-[var(--color-success)] leading-none tracking-tight">
                {formatPrice(Number(deal.price), locale === 'vi' ? 'vi-VN' : 'en-US')}
              </span>
            )}
            {deal.comparePrice !== null && (
              <div className="flex items-center gap-2">
                <s className="text-[1.25rem] font-bold text-[var(--color-text-muted)] leading-snug">
                  {formatPrice(Number(deal.comparePrice), locale === 'vi' ? 'vi-VN' : 'en-US')}
                </s>
                <AlertCircle className="w-4 h-4 text-[var(--color-text-muted)] opacity-70" />
              </div>
            )}
            {deal.price !== null && deal.comparePrice !== null && deal.comparePrice > deal.price && (
              <span className="bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 text-sm font-black px-2 py-1 rounded shadow-sm">
                -{Math.round((1 - deal.price / deal.comparePrice) * 100)}%
              </span>
            )}
          </div>
          
          <div className="text-sm font-semibold text-[var(--color-text-muted)] mb-8">
            {t('distributedBy')} <span className="text-[var(--color-text)]">{deal.merchant || (deal.url ? new URL(deal.url).hostname.replace('www.', '') : 'Unknown')}</span>
          </div>

          <div className="text-sm text-[var(--color-text-muted)] mb-6 flex flex-wrap items-center gap-x-1.5">
            {t('shipsFrom')} China 
            {deal.merchant && <span>• {t('availableAt')} <strong className="text-[var(--color-text)]">{deal.merchant}</strong></span>}
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4">
            <Link href={affiliateUrl} target="_blank" rel="nofollow noopener" className="flex-1 max-w-[17.5rem] inline-flex items-center justify-center rounded-full bg-[var(--color-success)] hover:brightness-110 text-white font-bold h-12 text-[1.0625rem] shadow-sm transition-colors">
                {t('goToDeal')}
                <ExternalLink className="ml-2 w-4 h-4" />
            </Link>
            
            {deal.couponCode && (
              <Button 
                onClick={copyCoupon} 
                variant="outline"
                className="h-12 text-[1.0625rem] border-dashed border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 rounded-full"
              >
                <span className="font-mono mr-2">{deal.couponCode}</span>
                {copied ? <Check className="w-5 h-5 text-[var(--color-success)]" /> : <Copy className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>
      </article>

      {/* 2. VOTE BOX (Card 2) */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-[var(--border-radius-xl)] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="font-bold text-[length:var(--font-size-base)] text-[var(--color-text)]">
            {t('voteHelp')}
          </div>
          <div className="text-[length:var(--font-size-base)] font-bold flex items-center gap-1.5 mt-0.5">
            {t('whatDoYouThink')}
            <AlertCircle className="w-4 h-4 text-[var(--color-text-muted)] opacity-70" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Note: In a real app we'd hook these up to the actual voting API, for now it's static/UI */}
          <Button variant="outline" className="rounded-full gap-1.5 h-9 px-4 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)] border-[var(--color-border)]/80 shadow-sm">
            <span className="text-[var(--color-primary)] text-lg leading-none mt-[-2px]">↓</span> {t('cold')}
          </Button>
          <Button variant="outline" className="rounded-full gap-1.5 h-9 px-4 hover:bg-[var(--color-danger)]/5 hover:text-[var(--color-danger)] border-[var(--color-border)]/80 shadow-sm">
            <span className="text-[var(--color-danger)] text-lg leading-none mt-[-2px]">↑</span> {t('hot')}
          </Button>
        </div>
      </div>

      {/* 3. ABOUT THIS DEAL (Card 3) */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-[var(--border-radius-xl)] p-5 md:p-8 shadow-sm">
        <h2 className="text-[length:var(--font-size-xl)] font-bold mb-6 text-[var(--color-text)]">
          {t('aboutThisDeal')}
        </h2>
        
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/ho-so/${deal.user.name}`}>
            <Image 
              src={deal.user.avatar || deal.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(deal.user.name!)}`}
              width={56} height={56} 
              alt={deal.user.name || ''} 
              className="rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-0.5"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--color-text-muted)]">{t('postedBy')}</span>
              <Link href={`/ho-so/${deal.user.name}`} className="font-bold text-[var(--color-text)] hover:underline">
                {deal.user.name}
              </Link>
              {deal.user.tier === 'MODERATOR' && (
                <span className="bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30 text-[0.625rem] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1 uppercase tracking-wide">
                  <BadgeCheck className="w-3 h-3" />
                  {t('editor')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text)] mt-1.5 font-medium opacity-80">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t('memberSince')}</span>
              <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> 1.560</span>
              <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> 6.491</span>
            </div>
          </div>
        </div>

        {/* Alert Banner (Mocked for style) */}
        <div className="bg-[var(--color-surface-hover)]/50 border border-[var(--color-border)]/40 rounded-lg p-4 mb-6 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-[var(--color-danger)] shrink-0 mt-0.5" />
          <div className="flex-1 font-semibold text-[var(--color-text)]">
            {t('importTaxAlert')}
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-[var(--color-text)] leading-relaxed">
          <p className="whitespace-pre-line">{deal.description}</p>
        </div>

        {/* Edit Meta & Disclaimer */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)]/50 text-[0.8125rem] text-[var(--color-text-muted)] space-y-4">
          <p className="italic">
            {t('editedBy')} {deal.user.name}, {t('editedAgo')}
          </p>
          <p className="opacity-80">
            {t('affiliateDisclaimer')}
          </p>
        </div>
      </div>
      
      {/* 4. BOTTOM ACTION BAR */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-[var(--border-radius-xl)] p-2 md:p-3 flex flex-wrap items-center gap-1 sm:gap-2 text-sm font-semibold text-[var(--color-text-muted)] shadow-sm">
        <button className="flex items-center gap-2 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors px-3 py-2 rounded-lg">
          <MessageSquare className="w-5 h-5" />
          <span className="hidden lg:inline">{t('commentBtn')}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors px-3 py-2 rounded-lg">
          <Plus className="w-5 h-5" />
          <span className="hidden lg:inline">{t('addInfo')}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors px-3 py-2 rounded-lg">
          <Clock className="w-5 h-5" />
          <span className="hidden lg:inline">{t('expiredBtn')}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors px-3 py-2 rounded-lg">
          <Flag className="w-5 h-5" />
          <span className="hidden lg:inline">{t('reportBtn')}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors px-3 py-2 rounded-lg sm:ml-auto">
          <Bookmark className="w-5 h-5" />
          <span className="hidden lg:inline">{t('save')}</span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareDealModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        deal={deal} 
      />
    </div>
  )
}
