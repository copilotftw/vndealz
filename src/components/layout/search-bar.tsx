'use client'

import { Search } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useState, useEffect } from 'react'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('site-search')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative hidden md:flex items-center flex-1 max-w-md mx-4"
    >
      <Search className="absolute left-3 w-4 h-4 text-[var(--color-text-muted)]" />
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm deal, mã giảm giá... (Cmd+K)"
        className="w-full h-[var(--button-height)] pl-10 pr-4 rounded-[var(--border-radius-full)] bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 focus:border-[var(--color-primary)] outline-none text-[length:var(--font-size-sm)] transition-all placeholder:text-[var(--color-text-muted)] glass-subtle"
      />
    </form>
  )
}
