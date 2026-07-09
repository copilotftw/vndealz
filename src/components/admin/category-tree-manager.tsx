'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, GripVertical, Trash2, Edit2, ChevronRight, ChevronDown } from 'lucide-react'

import { DynamicIcon } from '@/components/ui/dynamic-icon'

// A simplified category manager without actual dnd-kit logic for now to prevent bugs
export function CategoryTreeManager({ initialTree }: { initialTree: any[] }) {
  const [tree, setTree] = useState(initialTree)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const renderNode = (node: any, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded[node.id]

    return (
      <div key={node.id} className="w-full">
        <div 
          className="flex items-center gap-2 p-2 hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-border)] rounded-md transition-colors"
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
          
          <button 
            onClick={() => hasChildren && toggleExpand(node.id)}
            className={`p-1 rounded hover:bg-muted ${!hasChildren && 'invisible'}`}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          <div className="w-6 flex justify-center text-muted-foreground">
            <DynamicIcon name={node.icon} className="w-5 h-5" />
          </div>
          
          <div className="flex flex-col flex-1">
            <span className="font-medium text-sm text-[var(--color-text)]">{node.nameVi}</span>
            <span className="text-xs text-[var(--color-text-muted)]">/{node.slug} · {node.nameEn}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon-sm">
              <Plus className="w-4 h-4 text-[var(--color-success)]" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Edit2 className="w-4 h-4 text-[var(--color-primary)]" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Trash2 className="w-4 h-4 text-[var(--color-danger)]" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-[var(--color-primary)] text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Thêm danh mục gốc
        </Button>
      </div>

      <div className="space-y-1">
        {tree.map(node => renderNode(node, 0))}
      </div>
    </div>
  )
}
