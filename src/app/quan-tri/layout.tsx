import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Navbar } from '@/components/layout/navbar'
import { HeaderProvider } from '@/components/layout/header-context'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session || !['ADMIN', 'MODERATOR'].includes((session.user as any).role)) {
    redirect('/')
  }

  return (
    <HeaderProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
        <Navbar />
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-60 md:shrink-0 h-auto md:h-full border-b md:border-b-0 md:border-r border-[var(--color-border)]">
            <AdminSidebar />
          </div>
          <main className="flex-1 p-4 sm:p-6 page-enter overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </HeaderProvider>
  )
}
