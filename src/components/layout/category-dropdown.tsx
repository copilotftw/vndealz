'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { LayoutGrid, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import { getCategoryTree } from '@/server/actions/category'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

type CatNode = {
  id: string
  nameVi: string
  nameEn: string
  slug: string
  icon: string | null
  children: CatNode[]
}

export function CategoryDropdown() {
  const [categories, setCategories] = useState<CatNode[]>([])
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')

  useEffect(() => {
    getCategoryTree().then(setCategories).catch(console.error)
  }, [])

  const isActive = pathname === '/danh-muc' || pathname.startsWith('/danh-muc/')

  const renderNode = (node: CatNode) => {
    if (node.children && node.children.length > 0) {
      return (
        <DropdownMenuSub key={node.id}>
          <DropdownMenuSubTrigger className="cursor-pointer py-2 px-3">
            <div className="flex items-center flex-1">
              <div className="w-4 h-4 mr-2 flex items-center justify-center opacity-70 shrink-0">
                {node.icon && <DynamicIcon name={node.icon} />}
              </div>
              <span>{locale === 'vi' ? node.nameVi : node.nameEn}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="min-w-[200px]">
              <DropdownMenuItem render={<Link href={`/danh-muc/${node.slug}`} className="cursor-pointer py-2 px-3 font-semibold text-[var(--color-primary)]" />} key={`all-${node.id}`}>
                {t('all')} {locale === 'vi' ? node.nameVi : node.nameEn}
              </DropdownMenuItem>
              {node.children.map(renderNode)}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem render={<Link href={`/danh-muc/${node.slug}`} className="cursor-pointer py-2 px-3" />} key={node.id}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-[var(--color-text-muted)] shrink-0">
            {node.icon && <DynamicIcon name={node.icon} />}
          </div>
          {locale === 'vi' ? node.nameVi : node.nameEn}
        </div>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[length:var(--font-size-sm)] font-medium transition-all whitespace-nowrap ${
            isActive
              ? 'nav-row2-link-active'
              : 'nav-row2-link'
          }`}
        />
      }>
        <span className="opacity-70 flex items-center"><LayoutGrid className="w-4 h-4" /></span>
        {t('categories')}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[70vh] overflow-y-auto" align="start" sideOffset={8}>
        <DropdownMenuItem render={<Link href="/danh-muc" className="cursor-pointer py-2 px-3 font-bold text-[var(--color-primary)] border-b border-[var(--color-border)]/50 mb-1" />}>
          {t('allCategories')}
        </DropdownMenuItem>
        {categories.map(renderNode)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
