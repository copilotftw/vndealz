import { ReferralForm } from '@/components/deal/referral-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function SubmitReferralPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const locale = await getLocale()
  const t = await getTranslations('referralForm')
  
  if (!session?.user) {
    redirect(`/${locale}/dang-nhap`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 hidden">
        {/* Hidden but good for SEO or screen readers if needed */}
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          {t('sidebarTitle')}
        </h1>
      </div>
      <ReferralForm />
    </div>
  )
}
