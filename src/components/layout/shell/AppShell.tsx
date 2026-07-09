import { getThemeStyles } from '@/components/theme/theme-provider'
import { LAYOUTS } from '@/components/theme/registry'
import { HeaderProvider } from '@/components/layout/header-context'
import { MobileNav } from '@/components/layout/mobile-nav'
import { NavShell } from './NavShell'
import { SidebarShell } from './SidebarShell'
import { FooterShell } from './FooterShell'
import { getLocale } from 'next-intl/server'
import type { LayoutPersona } from '@/components/theme/persona'

export async function AppShell({ children }: { children: React.ReactNode }) {
  const { layout } = await getThemeStyles()
  const locale = await getLocale()

  const persona = LAYOUTS[layout as keyof typeof LAYOUTS] as LayoutPersona
  const { nav, sidebar, footer, background, contentMaxWidth } = persona.shell

  const isPulse = nav === 'pulse-overlay'

  return (
    <HeaderProvider>
      <div
        className="shell-bg min-h-screen flex flex-col"
        data-nav={nav}
        data-sidebar={sidebar}
        data-bg={background}
        style={{ '--content-max-width': contentMaxWidth } as React.CSSProperties}
      >
        <NavShell variant={nav} />

        {isPulse ? (
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        ) : (
          <div className="site-content flex gap-[var(--section-gap)] px-4 py-[var(--section-gap)] flex-1">
            <main className="flex-1 min-w-0">
              {children}
            </main>
            <SidebarShell variant={sidebar} locale={locale} />
          </div>
        )}

        <FooterShell variant={footer} locale={locale} />
        <MobileNav />
      </div>
    </HeaderProvider>
  )
}
