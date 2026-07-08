// ── SCALE PRESETS ────────────────────────────────────────────────
// Each scale defines sizing AND a column offset
// Layouts with grid use: max(1, base_columns + column_offset)

export const SCALE_PRESETS = {
  xs: {
    '--font-size-xs': '0.625rem', '--font-size-sm': '0.6875rem', '--font-size-base': '0.75rem',
    '--font-size-lg': '0.875rem', '--font-size-xl': '1rem', '--font-size-2xl': '1.25rem',
    '--card-gap': '0.375rem', '--section-gap': '0.75rem',
    '--nav-height': '40px', '--avatar-size': '24px', '--button-height': '28px', '--icon-size': '14px',
    '--grid-column-offset': '2', // more columns at small scale
  },
  sm: {
    '--font-size-xs': '0.6875rem', '--font-size-sm': '0.75rem', '--font-size-base': '0.8125rem',
    '--font-size-lg': '0.9375rem', '--font-size-xl': '1.125rem', '--font-size-2xl': '1.5rem',
    '--card-gap': '0.5rem', '--section-gap': '1rem',
    '--nav-height': '48px', '--avatar-size': '28px', '--button-height': '32px', '--icon-size': '16px',
    '--grid-column-offset': '1',
  },
  md: {
    '--font-size-xs': '0.75rem', '--font-size-sm': '0.8125rem', '--font-size-base': '0.875rem',
    '--font-size-lg': '1rem', '--font-size-xl': '1.25rem', '--font-size-2xl': '1.75rem',
    '--card-gap': '0.75rem', '--section-gap': '1.25rem',
    '--nav-height': '56px', '--avatar-size': '32px', '--button-height': '36px', '--icon-size': '18px',
    '--grid-column-offset': '0', // base columns
  },
  lg: {
    '--font-size-xs': '0.8125rem', '--font-size-sm': '0.875rem', '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem', '--font-size-xl': '1.5rem', '--font-size-2xl': '2rem',
    '--card-gap': '1rem', '--section-gap': '1.5rem',
    '--nav-height': '64px', '--avatar-size': '40px', '--button-height': '42px', '--icon-size': '20px',
    '--grid-column-offset': '-1', // fewer columns at large scale
  },
  xl: {
    '--font-size-xs': '0.875rem', '--font-size-sm': '1rem', '--font-size-base': '1.125rem',
    '--font-size-lg': '1.25rem', '--font-size-xl': '1.75rem', '--font-size-2xl': '2.5rem',
    '--card-gap': '1.25rem', '--section-gap': '2rem',
    '--nav-height': '72px', '--avatar-size': '48px', '--button-height': '48px', '--icon-size': '24px',
    '--grid-column-offset': '-2',
  },
} as const

export type ScaleKey = keyof typeof SCALE_PRESETS
