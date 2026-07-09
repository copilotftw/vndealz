import { db } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { LAYOUTS, COLORS } from './registry'
import { SCALE_PRESETS, SPACE_UNIT_PX, type ScaleKey } from './tokens/scales'

type ThemeResult = { css: string; layout: string }

async function generateTheme(): Promise<ThemeResult> {
  const config = await db.siteConfig.findUnique({ where: { id: 'default' } })

  const layoutKey = (config?.layout as keyof typeof LAYOUTS) || 'mydealz'
  const persona = LAYOUTS[layoutKey]
  const scaleKey = (config?.scale as ScaleKey) || 'md'
  const scale = SCALE_PRESETS[scaleKey]
  const colorKey = (config?.colorScheme as keyof typeof COLORS) || 'default'
  const colors = COLORS[colorKey]

  const scaleConfig = persona.scaleConfig

  // Grid columns: non-grid personas skip entirely (usesColumnGrid = false).
  let gridCols: number
  let gridColsTablet: number
  let gridColsMobile: number

  // Scale offset: xs=+2, sm=+1, md=0, lg=-1, xl=-2 (larger scale → fewer columns)
  const SCALE_COL_OFFSET: Record<ScaleKey, number> = { xs: 2, sm: 1, md: 0, lg: -1, xl: -2 }
  const colOffset = SCALE_COL_OFFSET[scaleKey]

  if (!scaleConfig.usesColumnGrid) {
    gridCols = 1
    gridColsTablet = 1
    gridColsMobile = 1
  } else if (scaleConfig.columns) {
    gridCols       = Math.max(1, scaleConfig.columns.desktop + colOffset)
    gridColsTablet = Math.max(1, scaleConfig.columns.tablet + Math.round(colOffset / 2))
    gridColsMobile = scaleConfig.columns.mobile  // mobile stays fixed (already minimal)
  } else {
    const base = parseInt((persona.tokens as Record<string, string>)['--grid-columns-base'] || '4')
    const baseDesktop = Math.max(1, Math.min(8, base))
    gridCols       = Math.max(1, baseDesktop + colOffset)
    gridColsTablet = Math.max(1, Math.min(3, baseDesktop - 1) + Math.round(colOffset / 2))
    gridColsMobile = Math.min(2, baseDesktop - 2)  // mobile stays fixed
  }

  // --persona-space-unit: scale's space-unit * persona density factor.
  const spaceUnitPx = SPACE_UNIT_PX[scaleKey]
  const personaSpaceUnit = `${Math.round(spaceUnitPx * scaleConfig.densityFactor)}px`

  // Personas that opt out of font scaling get --scale-factor:1 injected last.
  const scaleFontOverride: Record<string, string> = scaleConfig.scalesFonts ? {} : { '--scale-factor': '1' }

  // Merge order: tokens → scale → scale-font-override → colors.light → computed vars.
  const allVars: Record<string, string> = {
    ...(persona.tokens as Record<string, string>),
    ...(scale as Record<string, string>),
    ...scaleFontOverride,
    ...(colors.light as Record<string, string>),
    '--persona-space-unit': personaSpaceUnit,
    '--grid-columns':        String(gridCols),
    '--grid-columns-tablet': String(gridColsTablet),
    '--grid-columns-mobile': String(gridColsMobile),
  }

  const lightVars = Object.entries(allVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

  // Dark mode overrides: color scheme dark tokens + persona dark token overrides.
  const darkOverrides: Record<string, string> = {
    ...(colors.dark as Record<string, string>),
  }
  const tokens = persona.tokens as Record<string, string>
  if (tokens['--card-bg-dark'])      darkOverrides['--card-bg']      = tokens['--card-bg-dark']
  if (tokens['--nav-bg-dark'])       darkOverrides['--nav-bg']       = tokens['--nav-bg-dark']
  if (tokens['--glass-bg-dark'])     darkOverrides['--glass-bg']     = tokens['--glass-bg-dark']
  if (tokens['--glass-border-dark']) darkOverrides['--glass-border'] = tokens['--glass-border-dark']

  const darkVars = Object.entries(darkOverrides)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

  let css = `:root{${lightVars}}.dark{${darkVars}}`
  if (config?.customCss) css += config.customCss

  return { css, layout: layoutKey }
}

const cachedTheme = unstable_cache(generateTheme, ['theme-styles'], { tags: ['theme'] })

export async function getThemeStyles(): Promise<ThemeResult> {
  try {
    return await cachedTheme()
  } catch {
    return generateTheme()
  }
}
