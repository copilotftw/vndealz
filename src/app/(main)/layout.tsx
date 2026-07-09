// (main) layout — navbar + sidebar + main content + footer
// Uses glass effect on navbar, sidebar slide animation

import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Footer } from '@/components/layout/footer'
import { MobileNav } from '@/components/layout/mobile-nav'
import { getLocale } from 'next-intl/server'
import { CategoryPills } from '@/components/category/category-pills'
import { Suspense } from 'react'

import { HeaderProvider } from '@/components/layout/header-context'
import { SidebarWrapper } from '@/components/layout/sidebar-wrapper'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  
  return (
    <HeaderProvider>
      <div className="min-h-screen flex flex-col">
        {/* Navbar with glass effect */}
        <Navbar />

      {/* Main content area with sidebar */}
      <div className="site-content flex gap-[var(--section-gap)] px-4 py-[var(--section-gap)] flex-1">
        <main className="flex-1 min-w-0">
          {children}
        </main>
        <SidebarWrapper>
          <Sidebar locale={locale} />
        </SidebarWrapper>
      </div>

      <Footer locale={locale} />
      
        {/* Mobile bottom navigation — visible on tablet and below */}
        <MobileNav />
      </div>
    </HeaderProvider>
  )
}

