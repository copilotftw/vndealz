import { getCategoryTree } from '@/server/actions/category'
import { CategoryTreeManager } from '@/components/admin/category-tree-manager'

export default async function AdminCategoriesPage() {
  const tree = await getCategoryTree()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <p className="text-muted-foreground mt-2">
          Kéo thả để sắp xếp danh mục. Thêm, sửa, xóa các danh mục cho hệ thống.
        </p>
      </div>

      <div className="glass-strong p-6 rounded-xl border border-border">
        <CategoryTreeManager initialTree={tree} />
      </div>
    </div>
  )
}
