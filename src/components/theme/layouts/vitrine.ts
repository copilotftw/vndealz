import type { LayoutPersona } from '../persona'

const vitrine: LayoutPersona = {
  name: 'vitrine',
  composer: 'vitrine',

  shell: {
    nav: 'minimal',
    sidebar: 'none',
    footer: 'full',
    background: 'paper',
    contentMaxWidth: '860px',
  },

  data: {
    needsImage: true,
    needsDescription: true,
    needsPriceHistory: false,
    pageSize: 12,
  },

  scaleConfig: {
    densityFactor: 1.5,
    usesColumnGrid: false,
    scalesFonts: true,
  },

  tokens: {
    '--layout-name': 'vitrine',
    '--card-border-radius': '0',
    '--card-shadow': 'none',
    '--card-shadow-hover': 'none',
    '--card-border': 'none',
    '--card-bg': 'transparent',
    '--card-bg-dark': 'transparent',
    '--card-direction': 'row',
    '--card-image-width': '50%',
    '--card-image-height': '360px',
    '--card-image-ratio': '3/4',
    '--card-padding': '0',
    '--grid-columns-base': '1',
    '--nav-style': 'sticky',
    '--nav-blur': 'none',
    '--nav-bg': 'var(--color-bg)',
    '--nav-bg-dark': 'var(--color-bg)',
    '--nav-border': 'none',
    '--sidebar-width': '0',
    '--sidebar-display': 'none',
    '--border-radius-sm': '0',
    '--border-radius-md': '0',
    '--border-radius-lg': '2px',
    '--border-radius-xl': '2px',
    '--content-max-width': '860px',
    '--glass-bg': 'var(--color-surface)',
    '--glass-bg-dark': 'var(--color-surface)',
    '--glass-blur': 'none',
    '--glass-border': '1px solid var(--color-border)',
    '--glass-border-dark': '1px solid var(--color-border)',
  },

  motion: {
    cardEnter: 'fade-up',
    viewTransition: true,
  },
}

export default vitrine
