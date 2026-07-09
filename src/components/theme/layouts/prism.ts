import type { LayoutPersona } from '../persona'

const prism: LayoutPersona = {
  name: 'prism',
  composer: 'prism',

  shell: {
    nav: 'floating',
    sidebar: 'icon-rail',
    footer: 'minimal',
    background: 'mesh',
    contentMaxWidth: '1400px',
  },

  data: {
    needsImage: true,
    needsDescription: false,
    needsPriceHistory: false,
    pageSize: 24,
  },

  scaleConfig: {
    densityFactor: 1.0,
    usesColumnGrid: true,
    columns: { desktop: 4, tablet: 2, mobile: 1 },
    scalesFonts: true,
  },

  tokens: {
    '--layout-name': 'prism',
    '--card-border-radius': '1rem',
    '--card-shadow': '0 2px 12px rgba(0,0,0,0.06)',
    '--card-shadow-hover': '0 8px 32px rgba(0,0,0,0.14)',
    '--card-border': '1px solid rgba(255,255,255,0.15)',
    '--card-bg': 'var(--glass-bg)',
    '--card-bg-dark': 'var(--glass-bg-dark)',
    '--card-direction': 'column',
    '--card-image-width': '100%',
    '--card-image-height': '180px',
    '--card-image-ratio': '4/3',
    '--card-padding': '1rem',
    '--grid-columns-base': '4',
    '--nav-style': 'floating',
    '--nav-blur': 'blur(16px)',
    '--nav-bg': 'var(--glass-bg)',
    '--nav-bg-dark': 'var(--glass-bg-dark)',
    '--nav-border': '1px solid rgba(255,255,255,0.15)',
    '--sidebar-width': '64px',
    '--sidebar-display': 'block',
    '--border-radius-sm': '0.5rem',
    '--border-radius-md': '0.75rem',
    '--border-radius-lg': '1rem',
    '--border-radius-xl': '1.5rem',
    '--content-max-width': '1400px',
    '--glass-bg': 'rgba(255,255,255,0.78)',
    '--glass-bg-dark': 'rgba(16,16,28,0.78)',
    '--glass-blur': 'blur(16px)',
    '--glass-border': '1px solid rgba(255,255,255,0.18)',
    '--glass-border-dark': '1px solid rgba(255,255,255,0.08)',
  },

  motion: {
    cardEnter: 'fade-up',
    viewTransition: true,
  },
}

export default prism
