'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowUpRight, History, Clock } from 'lucide-react'
import { getLiveSearchSuggestions } from '@/server/actions/search'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { formatPrice } from '@/lib/utils'

interface LiveSearchDropdownProps {
  query: string
  isOpen: boolean
  onClose: () => void
}

type SuggestionResults = Awaited<ReturnType<typeof getLiveSearchSuggestions>>

export function LiveSearchDropdown({ query, isOpen, onClose }: LiveSearchDropdownProps) {
  const [results, setResults] = useState<SuggestionResults | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load history on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      setHistory(stored)
    } catch(e) {}
  }, [isOpen])

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await getLiveSearchSuggestions(query)
        setResults(data)
      } catch (err) {
        console.error('Failed to fetch search suggestions', err)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  const hasSuggestions = results && (results.merchants.length > 0 || results.categories.length > 0)
  const hasDeals = results && results.deals.length > 0
  const hasUsers = results && results.users.length > 0
  
  // Filter history based on current query if query is less than 2 chars (so it shows full history) or if it matches
  const filteredHistory = history.filter(h => query ? h.toLowerCase().includes(query.toLowerCase()) : true).slice(0, 5)

  if (!results && !isLoading && filteredHistory.length === 0) return null

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 w-full mt-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[85vh] overflow-y-auto page-enter"
      style={{
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
      }}
    >
      {isLoading && !results && (
        <div className="p-4 text-center text-sm text-[var(--color-text-muted)]">Đang tìm kiếm...</div>
      )}

      {results && !hasSuggestions && !hasDeals && !hasUsers && !isLoading && (
        <div className="p-4 text-center text-sm text-[var(--color-text-muted)]">Không tìm thấy kết quả phù hợp cho &quot;{query}&quot;</div>
      )}

      {/* History */}
      {filteredHistory.length > 0 && (!results || (!hasSuggestions && !hasDeals && !hasUsers)) && (
        <div className="py-2 border-b border-[var(--color-border)]/50">
          <h3 className="px-4 py-2 text-sm font-bold text-[var(--color-text-muted)]">Tìm kiếm gần đây</h3>
          {filteredHistory.map(h => (
            <Link 
              key={h} 
              href={`/tim-kiem?q=${encodeURIComponent(h)}`}
              className="flex items-center px-4 py-2 hover:bg-white/5 transition-colors gap-3"
              onClick={onClose}
            >
              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
              <div className="flex-1 flex items-baseline gap-2">
                <span className="font-semibold text-sm">{h}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Vorschläge (Suggestions) */}
      {hasSuggestions && (
        <div className="py-2 border-b border-[var(--color-border)]/50">
          <h3 className="px-4 py-2 text-sm font-bold text-[var(--color-text-muted)]">Gợi ý</h3>
          
          {results.merchants.map(merchant => (
            <Link 
              key={merchant.id} 
              href={`/thuong-hieu/${merchant.slug}`}
              className="flex items-center px-4 py-2 hover:bg-white/5 transition-colors gap-3"
              onClick={onClose}
            >
              <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
              <div className="flex-1 flex items-baseline gap-2">
                <span className="font-semibold text-sm">{merchant.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">Thương hiệu</span>
              </div>
              {merchant.logo ? (
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden">
                  <Image src={merchant.logo} alt={merchant.name} width={20} height={20} className="object-contain" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-[var(--color-border)]" />
              )}
            </Link>
          ))}

          {results.categories.map(cat => (
            <Link 
              key={cat.id} 
              href={`/danh-muc/${cat.slug}`}
              className="flex items-center px-4 py-2 hover:bg-white/5 transition-colors gap-3"
              onClick={onClose}
            >
              <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
              <div className="flex-1 flex items-baseline gap-2">
                <span className="font-semibold text-sm">{cat.nameVi}</span>
                <span className="text-xs text-[var(--color-text-muted)]">Danh mục</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--color-text-muted)]" />
            </Link>
          ))}
        </div>
      )}

      {/* Deals */}
      {hasDeals && (
        <div className="py-2 border-b border-[var(--color-border)]/50">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)]">Deals</h3>
            <Link 
              href={`/tim-kiem?q=${encodeURIComponent(query)}`}
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
              onClick={onClose}
            >
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-1">
            {results.deals.map(deal => (
              <Link 
                key={deal.id}
                href={`/deal/${deal.slug}`}
                className="flex items-start gap-4 px-4 py-3 hover:bg-white/5 transition-colors"
                onClick={onClose}
              >
                {/* Deal Image */}
                <div className="w-14 h-14 shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-[var(--color-border)]/50">
                  {deal.image ? (
                    <Image src={deal.image} alt={deal.title} width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-border)]/30" />
                  )}
                </div>
                
                {/* Deal Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-[var(--color-hot)] text-sm">{deal.temperature}°</span>
                    <h4 className="font-bold text-sm leading-snug line-clamp-2">{deal.title}</h4>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {deal.price !== null && (
                      <span className="font-bold text-[var(--color-primary)] text-sm">{formatPrice(deal.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Users (Mitglied) */}
      {hasUsers && (
        <div className="py-2">
          {results.users.map(user => (
            <Link 
              key={user.id} 
              href={`/ho-so/${user.username}`}
              className="flex items-center px-4 py-2 hover:bg-white/5 transition-colors gap-3"
              onClick={onClose}
            >
              <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
              <div className="flex-1 flex items-baseline gap-2">
                <span className="font-semibold text-sm">{user.name || user.username}</span>
                <span className="text-xs text-[var(--color-text-muted)]">Thành viên</span>
              </div>
              {user.avatar ? (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image src={user.avatar} alt={user.username} width={24} height={24} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-[var(--color-border)] flex items-center justify-center">
                  <span className="text-[10px] font-bold">{(user.name || user.username).charAt(0).toUpperCase()}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
