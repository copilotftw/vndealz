'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// ponytail: minimal context — pages set row visibility + row3 content
interface HeaderState {
  hideRow2: boolean
  hideRow3: boolean
  row3: ReactNode | null
}

interface HeaderContextValue extends HeaderState {
  setHideRow2: (v: boolean) => void
  setHideRow3: (v: boolean) => void
  setRow3: (node: ReactNode | null) => void
}

const HeaderContext = createContext<HeaderContextValue | null>(null)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [hideRow2, setHideRow2] = useState(false)
  const [hideRow3, setHideRow3] = useState(false)
  const [row3, setRow3] = useState<ReactNode | null>(null)

  return (
    <HeaderContext.Provider value={{ hideRow2, hideRow3, row3, setHideRow2, setHideRow3, setRow3 }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeaderContext() {
  return useContext(HeaderContext)
}

// ponytail: hook for pages to set row3 content + row visibility on mount
export function useSetHeaderRow3(node: ReactNode | null, opts?: { hideRow2?: boolean; hideRow3?: boolean }) {
  const ctx = useContext(HeaderContext)
  // Use useCallback to avoid re-renders, but call setters in an effect-free way
  // Pages should wrap this in useEffect
  const configure = useCallback(() => {
    if (!ctx) return
    ctx.setRow3(node)
    if (opts?.hideRow2 !== undefined) ctx.setHideRow2(opts.hideRow2)
    if (opts?.hideRow3 !== undefined) ctx.setHideRow3(opts.hideRow3)
  }, [ctx, node, opts?.hideRow2, opts?.hideRow3])

  return configure
}
