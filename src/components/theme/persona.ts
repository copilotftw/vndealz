// ── LAYOUT PERSONA TYPE ──────────────────────────────────────────
// Each persona transforms the entire site: shell, feed, data fetching,
// and motion. Color schemes are separate; they populate token tiers ①②.
// Personas populate token tier ③ (component tokens).

export type NavVariant     = 'standard' | 'floating' | 'command-bar' | 'minimal' | 'hidden' | 'pulse-overlay'
export type SidebarVariant = 'tree' | 'icon-rail' | 'filter-facets' | 'none'
export type FooterVariant  = 'full' | 'compact' | 'status-bar' | 'minimal' | 'none'
export type BgVariant      = 'flat' | 'mesh' | 'paper' | 'black' | 'neutral'
export type ComposerKey    = 'mydealz' | 'prism' | 'ledger' | 'vitrine' | 'pulse' | 'atlas'

export interface PersonaScaleConfig {
  /**
   * Multiplied against --space-unit to produce --persona-space-unit.
   * < 1.0 = dense (ledger), 1.0 = balanced, > 1.0 = airy (vitrine).
   */
  densityFactor: number

  /**
   * Whether this persona renders a CSS column grid.
   * false = skip --grid-columns-* computation in ThemeProvider entirely.
   * Single-column personas (pulse, ledger, vitrine, mydealz) set false.
   */
  usesColumnGrid: boolean

  /**
   * Column count per viewport for grid-based personas.
   * Ignored when usesColumnGrid = false.
   */
  columns?: {
    desktop: number
    tablet: number
    mobile: number
  }

  /**
   * Whether --scale-factor applies to font sizes for this persona.
   * false = pulse (overlay text is position-absolute; scaling breaks geometry).
   * ThemeProvider injects an override --scale-factor:1 after scale vars when false.
   */
  scalesFonts: boolean
}

export interface LayoutPersona {
  name: string

  /** React composer key — DealFeed picks the card renderer by this. */
  composer: ComposerKey

  shell: {
    nav: NavVariant
    sidebar: SidebarVariant
    footer: FooterVariant
    background: BgVariant
    contentMaxWidth: string
  }

  /** Layout-aware data fetching hints read server-side for Prisma select/pageSize. */
  data: {
    needsImage: boolean
    needsDescription: boolean
    needsPriceHistory: boolean
    pageSize: number
  }

  /** UI scale integration config — controls how SCALE_PRESETS apply to this persona. */
  scaleConfig: PersonaScaleConfig

  /** Component-tier CSS variables (grid, radius, spacing, card treatment). */
  tokens: Record<string, string>

  motion: {
    cardEnter: string
    viewTransition: boolean
  }
}
