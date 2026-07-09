// ── SCALE PRESETS ────────────────────────────────────────────────
// Two linear multipliers drive all derived sizing.
// --scale-factor: 0.125 step per level (fonts, radii, etc.)
// --space-unit:   2px step per level (spacing, gaps)
//
// Font sizes and gaps are NOT stored here — they are derived in
// tokens/primitives.css via calc() so every persona inherits them
// automatically without server-side enumeration.
//
// Shell chrome (nav-height, avatar, button, icon) kept as discrete
// linear values since they are shell-structural, not content-scaling.

export const SCALE_PRESETS = {
  xs: {
    '--scale-factor': '0.75',
    '--space-unit': '12px',
    '--nav-height': '40px',
    '--avatar-size': '24px',
    '--button-height': '28px',
    '--icon-size': '14px',
  },
  sm: {
    '--scale-factor': '0.875',
    '--space-unit': '14px',
    '--nav-height': '48px',
    '--avatar-size': '28px',
    '--button-height': '32px',
    '--icon-size': '16px',
  },
  md: {
    '--scale-factor': '1',
    '--space-unit': '16px',
    '--nav-height': '56px',
    '--avatar-size': '32px',
    '--button-height': '36px',
    '--icon-size': '18px',
  },
  lg: {
    '--scale-factor': '1.125',
    '--space-unit': '18px',
    '--nav-height': '64px',
    '--avatar-size': '40px',
    '--button-height': '42px',
    '--icon-size': '20px',
  },
  xl: {
    '--scale-factor': '1.25',
    '--space-unit': '20px',
    '--nav-height': '72px',
    '--avatar-size': '48px',
    '--button-height': '48px',
    '--icon-size': '24px',
  },
} as const

export type ScaleKey = keyof typeof SCALE_PRESETS

// Space unit values in px (numeric) for server-side persona-space-unit computation.
export const SPACE_UNIT_PX: Record<ScaleKey, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
}
