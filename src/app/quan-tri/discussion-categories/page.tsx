import { getDiscussionCategoryTree } from '@/server/actions/discussion-category'
import { CategoryTreeManager } from '@/components/admin/category-tree-manager'

export default async function AdminDiscussionCategoriesPage() {
  const tree = await getDiscussionCategoryTree()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Quản lý chuyên mục thảo luận</h1>
        <p className="text-muted-foreground mt-2">
          Kéo thả để sắp xếp. Thêm, sửa, xóa các chuyên mục cho Forum (Thảo luận).
        </p>
      </div>

      <div className="glass-strong p-6 rounded-xl border border-border">
        <CategoryTreeManager initialTree={tree} />
      </div>
    </div>
  )
}
