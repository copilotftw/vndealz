import { getTranslations } from 'next-intl/server'
import { getDiscussionCategoryTree } from '@/server/actions/discussion-category'
import { CategoryTreeManager } from '@/components/admin/category-tree-manager'

export default async function AdminDiscussionCategoriesPage() {
  const t = await getTranslations('admin')
  const tree = await getDiscussionCategoryTree()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">{t('discussionCategoriesTitle')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('discussionCategoriesDesc')}
        </p>
      </div>

      <div className="glass-strong p-6 rounded-xl border border-border">
        <CategoryTreeManager initialTree={tree} />
      </div>
    </div>
  )
}
