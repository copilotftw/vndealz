import { DiscussionForm } from '@/components/deal/discussion-form'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

export default async function SubmitDiscussionPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const locale = await getLocale()
  
  if (!session?.user) {
    redirect(`/${locale}/dang-nhap`)
  }

  const dealCategories = await db.category.findMany({
    orderBy: { order: 'asc' }
  })

  const discussionCategories = await db.discussionCategory.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-8 pb-16">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">
          {locale === 'vi' ? 'Bắt đầu thảo luận' : 'Diskussion starten'}
        </h1>
      </div>
      <DiscussionForm 
        dealCategories={dealCategories} 
        discussionCategories={discussionCategories} 
      />
    </div>
  )
}
