import type { LayoutPersona } from '../persona'

const atlas: LayoutPersona = {
  name: 'atlas',
  composer: 'atlas',

  shell: {
    nav: 'standard',
    sidebar: 'filter-facets',
    footer: 'compact',
    background: 'neutral',
    contentMaxWidth: '1440px',
  },

  data: {
    needsImage: true,
    needsDescription: false,
    needsPriceHistory: false,
    pageSize: 32,
  },

  scaleConfig: {
    densityFactor: 1.0,
    usesColumnGrid: true,
    columns: { desktop: 4, tablet: 3, mobile: 2 },
    scalesFonts: true,
  },

  tokens: {
    '--layout-name': 'atlas',
    '--card-border-radius': '0.75rem',
    '--card-shadow': '0 2px 8px rgba(0,0,0,0.06)',
    '--card-shadow-hover': '0 8px 24px rgba(0,0,0,0.12)',
    '--card-border': '1px solid var(--color-border)',
    '--card-bg': 'var(--color-surface)',
    '--card-bg-dark': 'var(--color-surface)',
    '--card-direction': 'column',
    '--card-image-width': '100%',
    '--card-image-height': 'auto',
    '--card-image-ratio': 'auto',
    '--card-padding': '0.75rem',
    '--grid-columns-base': '4',
    '--nav-style': 'sticky',
    '--nav-blur': 'none',
    '--nav-bg': 'var(--color-nav-bg)',
    '--nav-bg-dark': 'var(--color-nav-bg)',
    '--nav-border': '1px solid var(--color-nav-border)',
    '--sidebar-width': '280px',
    '--sidebar-display': 'block',
    '--border-radius-sm': '0.5rem',
    '--border-radius-md': '0.75rem',
    '--border-radius-lg': '1rem',
    '--border-radius-xl': '1.25rem',
    '--content-max-width': '1440px',
    '--glass-bg': 'rgba(255,255,255,0.85)',
    '--glass-bg-dark': 'rgba(20,20,20,0.85)',
    '--glass-blur': 'blur(8px)',
    '--glass-border': '1px solid rgba(255,255,255,0.12)',
    '--glass-border-dark': '1px solid rgba(255,255,255,0.06)',
  },

  motion: {
    cardEnter: 'fade-up',
    viewTransition: true,
  },
}

export default atlas
