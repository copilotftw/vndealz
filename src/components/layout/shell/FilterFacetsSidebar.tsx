'use client'

// Atlas persona sidebar — sticky filter facets: category, price band, temperature.

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Thermometer, Tag, DollarSign, X } from 'lucide-react'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

export function FilterFacetsSidebar({
  categories,
  locale,
}: {
  categories: Array<{ slug: string; nameVi: string; nameEn: string; icon?: string | null }>
  locale: string
}) {
  const t = useTranslations('filters')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchParams, pathname, router])

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('price')
    params.delete('temp')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchParams, pathname, router])

  const activePrice = searchParams.get('price')
  const activeTemp = searchParams.get('temp')
  const hasFilters = activePrice || activeTemp

  const PRICE_BANDS = [
    { label: t('under100k'), value: '0-100000' },
    { label: t('band100kTo500k'), value: '100000-500000' },
    { label: t('band500kTo2m'), value: '500000-2000000' },
    { label: t('over2m'), value: '2000000-' },
  ]

  const TEMP_BANDS = [
    { label: t('veryHot'), value: 'hot' },
    { label: t('warm'), value: 'warm' },
    { label: t('cold'), value: 'cold' },
  ]

  return (
    <aside className="hidden lg:block w-[17.5rem] shrink-0 sticky top-[calc(var(--nav-height)+1rem)] self-start max-h-[calc(100vh-var(--nav-height)-2rem)] overflow-y-auto">
      <div className="space-y-6 pr-2">
        {hasFilters && (
          <div className="flex items-center justify-between">
            <span className="text-[length:var(--font-size-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{t('activeFilters')}</span>
            <button
              onClick={clearAll}
              className="text-[length:var(--font-size-xs)] text-[var(--color-danger)] hover:opacity-70 flex items-center gap-1"
            >
              <X className="w-3 h-3" />{t('clearAll')}
            </button>
          </div>
        )}

        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span className="text-[length:var(--font-size-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{t('categories')}</span>
          </div>
          <nav className="space-y-0.5">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--border-radius-sm)] text-[length:var(--font-size-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)] transition-colors"
              >
                <span className="w-4 flex items-center justify-center shrink-0">
                  <DynamicIcon name={cat.icon} className="w-4 h-4" />
                </span>
                {locale === 'vi' ? cat.nameVi : cat.nameEn}
              </Link>
            ))}
          </nav>
        </div>

        {/* Price band */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span className="text-[length:var(--font-size-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{t('priceRange')}</span>
          </div>
          <div className="space-y-0.5">
            {PRICE_BANDS.map(band => (
              <button
                key={band.value}
                onClick={() => setFilter('price', band.value)}
                className={`w-full text-left px-2 py-1.5 rounded-[var(--border-radius-sm)] text-[length:var(--font-size-sm)] transition-colors ${
                  activePrice === band.value
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
                }`}
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span className="text-[length:var(--font-size-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{t('temperature')}</span>
          </div>
          <div className="space-y-0.5">
            {TEMP_BANDS.map(band => (
              <button
                key={band.value}
                onClick={() => setFilter('temp', band.value)}
                className={`w-full text-left px-2 py-1.5 rounded-[var(--border-radius-sm)] text-[length:var(--font-size-sm)] transition-colors ${
                  activeTemp === band.value
                    ? 'bg-[var(--color-hot)] text-white'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
                }`}
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
