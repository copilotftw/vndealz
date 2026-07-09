'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'

export function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const sort = searchParams.get('sort') || 'hot'
  const hideExpired = searchParams.get('hideExpired') === 'true'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)

  const updateParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete('page') // Reset page on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (localMin) params.set('minPrice', localMin)
    else params.delete('minPrice')
    
    if (localMax) params.set('maxPrice', localMax)
    else params.delete('maxPrice')
    
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    const q = searchParams.get('q') || ''
    router.push(`${pathname}?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="glass-strong rounded-[var(--border-radius-xl)] p-5 space-y-8 sticky top-24">
      <div className="flex items-center justify-between border-b border-[var(--color-border)]/50 pb-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" /> Bộ lọc
        </h2>
        <button onClick={handleReset} className="text-sm text-[var(--color-text-muted)] hover:text-current">
          Xóa bộ lọc
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Sắp xếp theo</h3>
        <div className="relative">
          <select 
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-3 appearance-none font-medium"
          >
            <option value="hot">Độ hot (Cao - Thấp)</option>
            <option value="new">Mới nhất</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)] pointer-events-none" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Tùy chọn hiển thị</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={hideExpired}
            onChange={(e) => updateParam('hideExpired', e.target.checked ? 'true' : '')}
            className="w-5 h-5 rounded border-[var(--color-border)]" 
          />
          <span>Ẩn Deal đã hết hạn</span>
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Giá</h3>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="0 đ" 
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={handlePriceApply}
            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-2 text-sm" 
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="100,000 đ" 
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={handlePriceApply}
            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] rounded-lg p-2 text-sm" 
          />
        </div>
      </div>
    </div>
  )
}
