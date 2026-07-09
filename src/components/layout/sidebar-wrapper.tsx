'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Only show sidebar on the home page or category pages
  // Hide on settings, profile, and other full-width pages
  if (pathname.startsWith('/settings') || pathname.startsWith('/ho-so') || pathname.startsWith('/alerts')) {
    return null
  }
  
  // The user requested "only show it in home page", but usually it's also on /danh-muc
  // We'll hide it on the specific pages requested to be full-width
  if (pathname !== '/' && !pathname.startsWith('/danh-muc')) {
    return null
  }

  return (
    <aside className="site-sidebar sidebar-enter hidden lg:block">
      {children}
    </aside>
  )
}
