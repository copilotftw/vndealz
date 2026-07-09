import type { SidebarVariant } from '@/components/theme/persona'
import { Sidebar } from '@/components/layout/sidebar'
import { SidebarWrapper } from '@/components/layout/sidebar-wrapper'
import { IconRailSidebar } from './IconRailSidebar'
import { FilterFacetsSidebar } from './FilterFacetsSidebar'
import { db } from '@/lib/db'

export async function SidebarShell({ variant, locale }: { variant: SidebarVariant; locale: string }) {
  if (variant === 'none') return null

  if (variant === 'icon-rail') {
    return <IconRailSidebar />
  }

  if (variant === 'filter-facets') {
    const categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      take: 20,
      select: { slug: true, nameVi: true, nameEn: true, icon: true },
    })
    return <FilterFacetsSidebar categories={categories} locale={locale} />
  }

  // tree (default) — existing Sidebar inside pathname-aware SidebarWrapper
  return (
    <SidebarWrapper>
      <Sidebar locale={locale} />
    </SidebarWrapper>
  )
}
