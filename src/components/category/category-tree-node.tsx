'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

type CatNode = {
  id: string
  nameVi: string
  nameEn: string
  slug: string
  icon: string | null
  children: CatNode[]
}

export function CategoryTreeNode({
  nodes,
  locale,
  depth,
}: {
  nodes: CatNode[]
  locale: string
  depth: number
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {nodes.map((node) => {
        const isExpanded = expanded[node.id]
        const hasChildren = node.children.length > 0

        return (
          <div key={node.id} className="flex flex-col w-full">
            <Link
              href={`/danh-muc/${node.slug}`}
              className="flex items-center justify-between py-1.5 px-2 hover:bg-[var(--color-primary)]/10 rounded-[var(--border-radius-sm)] group transition-colors"
              style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {node.icon && (
                  <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]">
                    <DynamicIcon name={node.icon} className="w-4 h-4" />
                  </span>
                )}
                <span className="text-[length:var(--font-size-sm)] text-[var(--color-text)] truncate">
                  {locale === 'vi' ? node.nameVi : node.nameEn}
                </span>
              </div>
              {hasChildren && (
                <button
                  onClick={(e) => toggle(node.id, e)}
                  className="p-1 rounded-[var(--border-radius-sm)] hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              )}
            </Link>

            {isExpanded && hasChildren && (
              <CategoryTreeNode nodes={node.children} locale={locale} depth={depth + 1} />
            )}
          </div>
        )
      })}
    </>
  )
}
