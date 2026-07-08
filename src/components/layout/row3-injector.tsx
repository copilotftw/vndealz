'use client'

import { useEffect, type ReactNode } from 'react'
import { useSetHeaderRow3 } from './header-context'

export function Row3Injector({ content, hideRow2, hideRow3 }: { content?: ReactNode; hideRow2?: boolean; hideRow3?: boolean }) {
  const configure = useSetHeaderRow3(content || null, { hideRow2, hideRow3 })

  useEffect(() => {
    configure()
    // We intentionally only want this to run once on mount (or when dependencies within configure change)
  }, [configure])

  return null
}
