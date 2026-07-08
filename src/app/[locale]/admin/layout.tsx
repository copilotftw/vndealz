import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session || !['ADMIN', 'MODERATOR'].includes((session.user as any).role)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      <AdminSidebar />
      <main className="flex-1 p-6 page-enter overflow-auto">
        {children}
      </main>
    </div>
  )
}
