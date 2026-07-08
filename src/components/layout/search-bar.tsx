'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

export function SearchBar({ mobile }: { mobile?: boolean }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const t = useTranslations('nav')

  useEffect(() => {
    if (mobile) return // no keyboard shortcut for mobile variant
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('site-search')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full flex-1"
    >
      <Search className="absolute left-3 w-4 h-4 text-[var(--color-text-muted)]" />
      <input
        id={mobile ? 'site-search-mobile' : 'site-search'}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={mobile ? t('searchMobile') : t('search')}
        autoFocus={mobile}
        className="w-full h-[var(--button-height)] pl-10 pr-4 rounded-full bg-[var(--color-bg)]/60 border border-[var(--color-border)]/50 focus:border-[var(--color-primary)] outline-none text-[length:var(--font-size-sm)] text-[var(--color-text)] transition-all placeholder:text-[var(--color-text-muted)]/60"
      />
    </form>
  )
}
