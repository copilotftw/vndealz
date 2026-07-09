'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Tag, Scissors, MessageCircle, Megaphone, ChevronRight } from 'lucide-react'

export default function AddContentPage() {
  const t = useTranslations('addContent')

  const options = [
    {
      id: 'deal',
      href: '/dang-deal',
      icon: <Tag className="w-8 h-8 text-[var(--color-primary)]" />,
      title: t('deal.title'),
      desc: t('deal.desc'),
    },
    {
      id: 'voucher',
      href: '/dang-ma-giam-gia',
      icon: <Scissors className="w-8 h-8 text-[var(--color-primary)]" />,
      title: t('voucher.title'),
      desc: t('voucher.desc'),
    },
    {
      id: 'discussion',
      href: '/dang-thao-luan',
      icon: <MessageCircle className="w-8 h-8 text-[var(--color-primary)]" />,
      title: t('discussion.title'),
      desc: t('discussion.desc'),
    },
    {
      id: 'referral',
      href: '/dang-ma-gioi-thieu',
      icon: <Megaphone className="w-8 h-8 text-[var(--color-primary)]" />,
      title: t('referral.title'),
      desc: t('referral.desc'),
    },
  ]

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-12 text-[var(--color-text)]">
        {t('title')}
      </h1>
      
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <Link 
            key={option.id} 
            href={option.href}
            className="flex items-center gap-6 p-6 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 hover:bg-[var(--color-surface)]/80 hover:border-[var(--color-border)] transition-all group relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              {option.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                {option.title}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                {option.desc}
              </p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
              <ChevronRight className="w-6 h-6" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
