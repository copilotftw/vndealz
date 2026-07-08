// (main) layout — navbar + sidebar + main content + footer
// Uses glass effect on navbar, sidebar slide animation
// TODO: Junior — import and wire up Navbar, Sidebar, Footer, MobileNav components

import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Footer } from '@/components/layout/footer'
import { getLocale } from 'next-intl/server'
import { CategoryPills } from '@/components/category/category-pills'
import { Suspense } from 'react'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with glass effect */}
      <Navbar 
        categoryPills={
          <Suspense fallback={<div className="h-8 bg-[var(--color-surface)]/20 animate-pulse rounded-full w-full"></div>}>
            <CategoryPills locale={locale} />
          </Suspense>
        }
      />

      {/* Main content area with sidebar */}
      <div className="site-content flex gap-[var(--section-gap)] px-4 py-[var(--section-gap)] flex-1">
        <main className="flex-1 min-w-0 page-enter">
          {children}
        </main>
        <aside className="site-sidebar sidebar-enter hidden lg:block">
          <Sidebar locale={locale} />
        </aside>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
