import type { LayoutPersona } from '../persona'

const ledger: LayoutPersona = {
  name: 'ledger',
  composer: 'ledger',

  shell: {
    nav: 'command-bar',
    sidebar: 'tree',
    footer: 'status-bar',
    background: 'flat',
    contentMaxWidth: '1400px',
  },

  data: {
    needsImage: false,
    needsDescription: false,
    needsPriceHistory: false,
    pageSize: 50,
  },

  scaleConfig: {
    densityFactor: 0.7,
    usesColumnGrid: false,
    scalesFonts: true,
  },

  tokens: {
    '--layout-name': 'ledger',
    '--card-border-radius': '0',
    '--card-shadow': 'none',
    '--card-shadow-hover': 'none',
    '--card-border': 'none',
    '--card-bg': 'transparent',
    '--card-bg-dark': 'transparent',
    '--card-direction': 'row',
    '--card-image-width': '0',
    '--card-image-height': '0',
    '--card-image-ratio': '0',
    '--card-padding': '0',
    '--grid-columns-base': '1',
    '--nav-style': 'sticky',
    '--nav-blur': 'none',
    '--nav-bg': 'var(--color-nav-bg)',
    '--nav-bg-dark': 'var(--color-nav-bg)',
    '--nav-border': '1px solid var(--color-nav-border)',
    '--sidebar-width': '240px',
    '--sidebar-display': 'block',
    '--border-radius-sm': '2px',
    '--border-radius-md': '2px',
    '--border-radius-lg': '4px',
    '--border-radius-xl': '4px',
    '--content-max-width': '1400px',
    '--glass-bg': 'var(--color-surface)',
    '--glass-bg-dark': 'var(--color-surface)',
    '--glass-blur': 'none',
    '--glass-border': '1px solid var(--color-border)',
    '--glass-border-dark': '1px solid var(--color-border)',
  },

  motion: {
    cardEnter: 'none',
    viewTransition: true,
  },
}

export default ledger
