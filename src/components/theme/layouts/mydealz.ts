import type { LayoutPersona } from '../persona'

const mydealz: LayoutPersona = {
  name: 'mydealz',
  composer: 'mydealz',

  shell: {
    nav: 'standard',
    sidebar: 'tree',
    footer: 'full',
    background: 'flat',
    contentMaxWidth: '1300px',
  },

  data: {
    needsImage: true,
    needsDescription: true,
    needsPriceHistory: true,
    pageSize: 20,
  },

  scaleConfig: {
    densityFactor: 1.0,
    usesColumnGrid: false,
    scalesFonts: true,
  },

  tokens: {
    '--layout-name': 'mydealz',
    '--card-border-radius': '0.5rem',
    '--card-shadow': '0 1px 3px rgba(0,0,0,0.05)',
    '--card-shadow-hover': '0 4px 16px rgba(0,0,0,0.1)',
    '--card-border': '1px solid var(--color-border)',
    '--card-bg': 'var(--color-surface)',
    '--card-bg-dark': 'var(--color-surface)',
    '--card-direction': 'row',
    '--card-image-width': '160px',
    '--card-image-height': '160px',
    '--card-image-ratio': '1/1',
    '--card-padding': '1rem',
    '--grid-columns-base': '1',
    '--nav-style': 'sticky',
    '--nav-blur': 'none',
    '--nav-bg': 'var(--color-nav-bg)',
    '--nav-bg-dark': 'var(--color-nav-bg)',
    '--nav-border': '1px solid var(--color-nav-border)',
    '--sidebar-width': '320px',
    '--sidebar-display': 'block',
    '--border-radius-sm': '0.375rem',
    '--border-radius-md': '0.5rem',
    '--border-radius-lg': '0.75rem',
    '--border-radius-xl': '1rem',
    '--content-max-width': '1300px',
    '--glass-bg': 'rgba(255,255,255,0.85)',
    '--glass-bg-dark': 'rgba(30,30,30,0.85)',
    '--glass-blur': 'blur(8px)',
    '--glass-border': '1px solid rgba(255,255,255,0.12)',
    '--glass-border-dark': '1px solid rgba(255,255,255,0.06)',
  },

  motion: {
    cardEnter: 'fade-up',
    viewTransition: true,
  },
}

export default mydealz
