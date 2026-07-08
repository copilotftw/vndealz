// Server-side function: reads SiteConfig from DB → generates CSS variable string
// Injected into <head> via <style> tag in root layout. No rebuild needed.
// IMPORTANT: Use backdrop-filter ONLY, never -webkit-backdrop-filter (Chrome conflict)

import { db } from '@/lib/db'
import {
  LAYOUT_PRESETS, SCALE_PRESETS, COLOR_SCHEMES,
  type LayoutKey, type ScaleKey, type ColorSchemeKey,
} from './theme-tokens'

export async function getThemeStyles(): Promise<string> {
  const config = await db.siteConfig.findUnique({ where: { id: 'default' } })

  const layout = LAYOUT_PRESETS[(config?.layout as LayoutKey) || 'modern']
  const scale = SCALE_PRESETS[(config?.scale as ScaleKey) || 'md']
  const colors = COLOR_SCHEMES[(config?.colorScheme as ColorSchemeKey) || 'default']

  // Merge layout + scale + light colors → :root
  const lightVars = Object.entries({ ...layout, ...scale, ...colors.light })
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

  // Dark mode overrides
  const darkVars = Object.entries(colors.dark)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

  let css = `:root{${lightVars}}.dark{${darkVars}}`

  // ── Layout utility classes (same HTML, different look) ──
  css += `
.deal-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--card-gap);
}
@media (max-width: 1024px) { .deal-grid { grid-template-columns: repeat(min(2, var(--grid-columns)), 1fr); } }
@media (max-width: 640px) { .deal-grid { grid-template-columns: 1fr; } }

.deal-card {
  display: flex;
  flex-direction: var(--card-direction);
  background: var(--card-bg);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  border: var(--card-border);
  padding: var(--card-padding);
  transition: box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}
.deal-card:hover {
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-2px);
}

.deal-card-image {
  width: var(--card-image-width);
  height: var(--card-image-height);
  aspect-ratio: var(--card-image-ratio);
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
}
.deal-card:hover .deal-card-image { transform: scale(1.03); }
/* In column layout, image is full-width */
@container (min-width: 0) {
  .deal-card[data-direction="column"] .deal-card-image { width: 100%; }
}

/* ── Glass effect classes ── */
/* IMPORTANT: Use backdrop-filter ONLY — never -webkit-backdrop-filter (Chrome conflict) */
.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
}
.dark .glass {
  background: var(--glass-bg-dark);
  border: var(--glass-border-dark);
}
.glass-strong {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(20px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.25);
}
.dark .glass-strong {
  background: rgba(20,20,20,0.75);
  border: 1px solid rgba(255,255,255,0.1);
}
.glass-subtle {
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.12);
}
.dark .glass-subtle {
  background: rgba(30,30,30,0.4);
  border: 1px solid rgba(255,255,255,0.05);
}

/* ── Navbar ── */
.site-nav {
  position: var(--nav-style);
  top: 0;
  z-index: 50;
  backdrop-filter: var(--nav-blur);
  background: var(--nav-bg);
  height: var(--nav-height);
  transition: background 0.3s ease, backdrop-filter 0.3s ease;
}
.dark .site-nav { background: var(--nav-bg-dark); }

.site-sidebar {
  width: var(--sidebar-width);
  display: var(--sidebar-display);
  flex-shrink: 0;
}
.site-content {
  max-width: var(--content-max-width);
  margin: 0 auto;
}

/* ── Page transitions ── */
.page-enter {
  animation: pageSlideIn 0.35s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes pageSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Sidebar slide ── */
.sidebar-enter {
  animation: sidebarSlide 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes sidebarSlide {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* ── Deal card stagger animation ── */
.deal-card-enter {
  animation: dealCardFadeIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes dealCardFadeIn {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Temperature glow ── */
.temp-hot { color: var(--color-hot); transition: text-shadow 0.3s ease; }
.temp-hot[data-temp-high="true"] {
  text-shadow: 0 0 12px var(--color-hot), 0 0 24px rgba(255,69,0,0.3);
}
.temp-cold { color: var(--color-cold); }

/* ── Modal / dialog glass overlay ── */
.dialog-overlay {
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
}

/* ── Smooth transitions on interactive elements ── */
button, a, [role="button"] {
  transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
}

/* ── Toast slide-in ── */
.toast-enter {
  animation: toastSlide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes toastSlide {
  from { opacity: 0; transform: translateX(100%) scale(0.9); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
`

  // Append admin custom CSS if any
  if (config?.customCss) css += config.customCss

  return css
}
