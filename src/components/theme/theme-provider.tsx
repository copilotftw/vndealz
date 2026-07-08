import { db } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { LAYOUTS, COLORS } from './registry'
import { SCALE_PRESETS, type ScaleKey } from './tokens/scales'

type ThemeResult = { css: string; layout: string }

async function generateTheme(): Promise<ThemeResult> {
  const config = await db.siteConfig.findUnique({ where: { id: 'default' } })

  const layoutKey = (config?.layout as keyof typeof LAYOUTS) || 'modern'
  const layout = LAYOUTS[layoutKey]
  const scale = SCALE_PRESETS[(config?.scale as ScaleKey) || 'md']
  const colorKey = (config?.colorScheme as keyof typeof COLORS) || 'default'
  const colors = COLORS[colorKey]

  // Calculate actual grid columns: base + offset (clamped to 1-8)
  const base = parseInt(layout['--grid-columns-base'] || '4')
  const offset = parseInt(scale['--grid-column-offset'] || '0')
  const gridCols = Math.max(1, Math.min(8, base + offset))
  const gridColsTablet = Math.min(3, gridCols)
  const gridColsMobile = Math.min(2, gridCols)

  // Merge layout + scale + light colors → :root
  const allVars = { ...layout, ...scale, ...colors.light, '--grid-columns': String(gridCols), '--grid-columns-tablet': String(gridColsTablet), '--grid-columns-mobile': String(gridColsMobile) }
  const lightVars = Object.entries(allVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

  // Dark mode overrides
  const darkOverrides: Record<string, string> = { ...colors.dark }
  if (layout['--card-bg-dark']) darkOverrides['--card-bg'] = layout['--card-bg-dark']
  if (layout['--nav-bg-dark']) darkOverrides['--nav-bg'] = layout['--nav-bg-dark']
  if (layout['--glass-bg-dark']) darkOverrides['--glass-bg'] = layout['--glass-bg-dark']
  if (layout['--glass-border-dark']) darkOverrides['--glass-border'] = layout['--glass-border-dark']
  const darkVars = Object.entries(darkOverrides)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

  let css = `:root{${lightVars}}.dark{${darkVars}}`

  // Append admin custom CSS if any
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
