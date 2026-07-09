import type { LayoutPersona } from '../persona'

const pulse: LayoutPersona = {
  name: 'pulse',
  composer: 'pulse',

  shell: {
    nav: 'pulse-overlay',
    sidebar: 'none',
    footer: 'none',
    background: 'black',
    contentMaxWidth: '100%',
  },

  data: {
    needsImage: true,
    needsDescription: false,
    needsPriceHistory: false,
    pageSize: 10,
  },

  scaleConfig: {
    densityFactor: 1.0,
    usesColumnGrid: false,
    scalesFonts: false,
  },

  tokens: {
    '--layout-name': 'pulse',
    '--card-border-radius': '0',
    '--card-shadow': 'none',
    '--card-shadow-hover': 'none',
    '--card-border': 'none',
    '--card-bg': 'transparent',
    '--card-bg-dark': 'transparent',
    '--card-direction': 'column',
    '--card-image-width': '100%',
    '--card-image-height': '100vh',
    '--card-image-ratio': 'auto',
    '--card-padding': '0',
    '--grid-columns-base': '1',
    '--nav-style': 'none',
    '--nav-blur': 'none',
    '--nav-bg': 'transparent',
    '--nav-bg-dark': 'transparent',
    '--nav-border': 'none',
    '--sidebar-width': '0',
    '--sidebar-display': 'none',
    '--border-radius-sm': '0',
    '--border-radius-md': '4px',
    '--border-radius-lg': '8px',
    '--border-radius-xl': '16px',
    '--content-max-width': '100%',
    '--glass-bg': 'rgba(0,0,0,0.5)',
    '--glass-bg-dark': 'rgba(0,0,0,0.6)',
    '--glass-blur': 'blur(8px)',
    '--glass-border': '1px solid rgba(255,255,255,0.1)',
    '--glass-border-dark': '1px solid rgba(255,255,255,0.08)',
  },

  motion: {
    cardEnter: 'none',
    viewTransition: false,
  },
}

export default pulse
