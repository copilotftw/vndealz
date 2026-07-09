import type { NavVariant } from '@/components/theme/persona'
import { Navbar } from '@/components/layout/navbar'
import { FloatingNav } from './FloatingNav'
import { CommandBarNav } from './CommandBarNav'
import { MinimalNav } from './MinimalNav'
import { PulseOverlayNav } from './PulseOverlayNav'

export function NavShell({ variant }: { variant: NavVariant }) {
  switch (variant) {
    case 'hidden':        return null
    case 'pulse-overlay': return <PulseOverlayNav />
    case 'floating':      return <FloatingNav />
    case 'command-bar':   return <CommandBarNav />
    case 'minimal':       return <MinimalNav />
    case 'standard':
    default:              return <Navbar />
  }
}
