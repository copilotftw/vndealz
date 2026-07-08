import { getCategoryTree } from '@/server/actions/category'
import { CategoryTreeNode } from './category-tree-node'

export async function CategoryTreeNav({ locale }: { locale: string }) {
  const tree = await getCategoryTree()

  return (
    <nav className="flex flex-col gap-1 w-full">
      <CategoryTreeNode nodes={tree} locale={locale} depth={0} />
    </nav>
  )
}
