import { getTranslations } from 'next-intl/server'
import { getSiteConfig } from '@/server/actions/theme'
import { ThemePanel } from '@/components/admin/theme-panel'

export default async function AdminThemePage() {
  const t = await getTranslations('admin')
  const config = await getSiteConfig()

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold">{t('themeTitle')}</h1>
        <p className="text-muted-foreground mt-2">{t('themeDesc')}</p>
      </div>

      <ThemePanel initialConfig={config} />
    </div>
  )
}
