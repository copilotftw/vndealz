import { AppShell } from '@/components/layout/shell/AppShell'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
