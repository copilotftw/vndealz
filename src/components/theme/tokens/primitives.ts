// ── PRIMITIVE COLOR SCALES ────────────────────────────────────────
// Raw values only. Not injected as CSS vars — used by color scheme
// files as a shared reference to derive semantic tokens.
// WCAG AA contrast ratios are noted where relevant.

export const gray = {
  50:  '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB',
  400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151',
  800: '#1F2937', 900: '#111827', 950: '#0A0F1A',
} as const

export const slate = {
  50:  '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
  400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
  800: '#1E293B', 900: '#0F172A', 950: '#0A0F1A',
} as const

export const blue = {
  400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
} as const

export const orange = {
  400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C',
  red: '#FF4500',
} as const

export const green = {
  400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
  deep: '#14532D',
} as const

export const teal = {
  400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E',
} as const

export const purple = {
  400: '#C084FC', 500: '#A855F7', 600: '#9333EA', 700: '#7E22CE',
  deep: '#581C87',
  plum: '#3B0764',
} as const

export const pink = {
  400: '#F472B6', 500: '#EC4899', 600: '#DB2777', light: '#FDF2F8',
} as const

export const amber = {
  300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706',
  700: '#B45309',
} as const

export const red = {
  400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C',
  crimson: '#9B1C1C', deep: '#7F1D1D',
} as const

export const sand = {
  50: '#FAFAF5', 100: '#F5F0E8', 200: '#EDE8DC', 500: '#A8956E',
  700: '#6B5744', 900: '#3D2B1F',
} as const

// ── PRIMITIVE RADIUS SCALE ────────────────────────────────────────
export const radius = {
  none: '0',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const

// ── PRIMITIVE SHADOW SCALE ────────────────────────────────────────
export const shadow = {
  sm:   '0 1px 3px rgba(0,0,0,0.05)',
  md:   '0 4px 16px rgba(0,0,0,0.08)',
  lg:   '0 8px 32px rgba(0,0,0,0.12)',
  xl:   '0 16px 48px rgba(0,0,0,0.16)',
  glow: (r: number, g: number, b: number) => `0 0 24px rgba(${r},${g},${b},0.35)`,
} as const
