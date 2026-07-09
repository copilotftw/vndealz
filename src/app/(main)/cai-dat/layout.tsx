import { SettingsSidebar } from '@/components/settings/sidebar'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row gap-8 py-8">
      {/* Sidebar Navigation */}
      <SettingsSidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
