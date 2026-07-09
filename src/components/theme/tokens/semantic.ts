// ── SEMANTIC TOKEN CONTRACT ───────────────────────────────────────
// Every color scheme must export an object satisfying ColorScheme.
// ThemeProvider merges .light into :root and .dark into .dark{}.
// Token names map 1:1 to CSS custom properties.

export interface SemanticTokens {
  // Page & surface
  '--color-bg': string
  '--color-surface': string

  // Brand / interactive
  '--color-primary': string
  '--color-primary-hover': string
  '--color-primary-text': string
  '--color-secondary': string
  '--color-accent': string

  // Text
  '--color-text': string
  '--color-text-muted': string

  // Structural
  '--color-border': string

  // Deal temperature
  '--color-hot': string
  '--color-cold': string

  // Semantic states
  '--color-success': string
  '--color-danger': string
  '--color-sponsored': string

  // Navigation surface (may differ from page bg)
  '--color-nav-bg': string
  '--color-nav-text': string
  '--color-nav-text-muted': string
  '--color-nav-border': string
  '--color-nav-input-bg': string
}

export interface ColorScheme {
  light: SemanticTokens
  dark: SemanticTokens
}
