import { getSiteConfig } from '@/server/actions/theme'
import { ThemePanel } from '@/components/admin/theme-panel'

export default async function AdminThemePage() {
  const config = await getSiteConfig()

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold">Cấu hình Giao diện</h1>
        <p className="text-muted-foreground mt-2">
          Thay đổi hoàn toàn diện mạo của VNDealz thông qua hệ thống Theming động. 
          Các thay đổi sẽ được áp dụng ngay lập tức cho toàn bộ người dùng.
        </p>
      </div>

      <ThemePanel initialConfig={config} />
    </div>
  )
}
