export const modern = {
  
    '--layout-name': 'modern',
    '--card-border-radius': '1rem',
    '--card-shadow': '0 2px 12px rgba(0,0,0,0.06)',
    '--card-shadow-hover': '0 12px 40px rgba(0,0,0,0.12)',
    '--card-border': '1px solid rgba(255,255,255,0.18)',
    '--card-bg': 'rgba(255,255,255,0.55)',
    '--card-bg-dark': 'rgba(30,30,30,0.45)',
    '--card-direction': 'column',
    '--card-image-width': '100%',
    '--card-image-height': 'auto',
    '--card-image-ratio': '4/3',
    '--card-padding': '0',
    '--grid-columns-base': '3', // scale adjusts this: xs→4, xl→2
    '--nav-style': 'sticky',
    '--nav-blur': 'blur(20px) saturate(180%)',
    '--nav-bg': 'var(--color-nav-bg)',
    '--nav-bg-dark': 'var(--color-nav-bg)',
    '--nav-border': '1px solid var(--color-nav-border)',
    '--sidebar-width': '320px',
    '--sidebar-display': 'block',
    '--border-radius-sm': '0.5rem',
    '--border-radius-md': '0.75rem',
    '--border-radius-lg': '1rem',
    '--border-radius-xl': '1.5rem',
    '--content-max-width': '1300px',
    // Glass tokens — strong transparency
    '--glass-bg': 'rgba(255,255,255,0.45)',
    '--glass-bg-dark': 'rgba(25,25,25,0.45)',
    '--glass-blur': 'blur(20px) saturate(180%)',
    '--glass-border': '1px solid rgba(255,255,255,0.2)',
    '--glass-border-dark': '1px solid rgba(255,255,255,0.08)',
  } as const;

export default modern;
