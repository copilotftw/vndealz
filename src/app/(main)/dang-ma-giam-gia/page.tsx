import { VoucherForm } from '@/components/deal/voucher-form'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function SubmitVoucherPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const locale = await getLocale()
  const t = await getTranslations('voucherForm')
  
  if (!session?.user) {
    redirect(`/${locale}/dang-nhap`)
  }

  const categories = await db.category.findMany({
    orderBy: { nameVi: 'asc' }
  })

  // Group into tree
  const rootCats = categories.filter(c => !c.parentId)
  const buildTree = (parent: any) => {
    const children = categories.filter(c => c.parentId === parent.id)
    if (children.length) parent.children = children.map(buildTree)
    return parent
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          {t('pageTitle')}
        </h1>
        <p className="text-[var(--color-text-muted)]">
          {t('pageDesc')}
        </p>
      </div>
      <VoucherForm categories={rootCats.map(buildTree)} />
    </div>
  )
}
