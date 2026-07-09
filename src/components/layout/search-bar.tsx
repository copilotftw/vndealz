'use client'

import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { LiveSearchDropdown } from './live-search-dropdown'

export function SearchBar({ mobile }: { mobile?: boolean }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('nav')

  useEffect(() => {
    if (mobile) return // no keyboard shortcut for mobile variant
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const q = query.trim()
      setIsDropdownOpen(false)
      
      // Save to history
      try {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
        const newHistory = [q, ...history.filter((h: string) => h !== q)].slice(0, 5)
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      } catch(e) {}
      
      router.push(`/tim-kiem?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className="relative flex-1 w-full z-50">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full"
      >
        <Search className="absolute left-3 w-4 h-4 text-[var(--color-text-muted)]" />
        <input
          ref={inputRef}
          id={mobile ? 'site-search-mobile' : 'site-search'}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsDropdownOpen(true)
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsDropdownOpen(true)
          }}
          placeholder={mobile ? t('searchMobile') : t('search')}
          autoFocus={mobile}
          autoComplete="off"
          className="w-full h-[var(--button-height)] pl-10 pr-10 rounded-full bg-[var(--color-bg)]/60 border border-[var(--color-border)]/50 focus:border-[var(--color-primary)] outline-none text-[length:var(--font-size-sm)] text-[var(--color-text)] transition-all placeholder:text-[var(--color-text-muted)]/60"
        />
        {query && (
          <button 
            type="button" 
            onClick={() => {
              setQuery('')
              setIsDropdownOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 p-1 rounded-full hover:bg-[var(--color-border)]/50 transition-colors"
          >
            <X className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        )}
      </form>
      
      <LiveSearchDropdown 
        query={query} 
        isOpen={isDropdownOpen} 
        onClose={() => setIsDropdownOpen(false)} 
      />
    </div>
  )
}

