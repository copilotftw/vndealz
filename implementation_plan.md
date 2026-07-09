# Implementation Plan — Persona Engine (Flexible UI Architecture)

> Companion to [`docs/persona-architecture.md`](docs/persona-architecture.md).
> Goal: replace the CSS‑toggle theme engine with a **Layout Persona** system that transforms the whole site (shell + feed), keeping only `mydealz`, and ship **5 new personas** + **14 color schemes**.

## User Review Required
> [!IMPORTANT]
> - **Destructive**: removes 6 layouts and all 15 legacy color scheme files.
> - **Major refactor**: `deal-card.tsx` becomes headless; global shell (`Navbar`, `Sidebar`, `Footer`) becomes variant‑driven.
> - **Prisma**: server components will vary `select`/`pageSize` by active persona.
> - Confirm before Phase 1 begins.

---

## Phase 0 — Scaffolding & Removal
1. **[NEW]** `src/components/theme/persona.ts` — the `LayoutPersona` type + shell/data/motion/scaleConfig unions (see design doc §2.1 + Scale Integration below).
2. **[DELETE]** legacy layouts: `terminal.ts`, `tiktok.ts`, `shopee.ts`, `bento.ts`, `editorial.ts`, `masonry.ts`.
3. **[DELETE]** all 15 legacy color files under `src/components/theme/colors/`.
4. **[KEEP]** `mydealz.ts` (migrated to the new persona shape in Phase 1).
5. **[MODIFY]** `theme:generate` script + `registry.ts` to emit `PERSONAS` and `COLOR_SCHEMES` maps of the new types.
6. **[MODIFY]** `src/components/theme/tokens/scales.ts` — overhaul to linear multipliers (see Scale Integration).

## Phase 0.5 — Scale System Overhaul

**Problem with current system:**
- Font size steps are non-linear (xs→sm: +0.0625rem, md→lg: +0.125rem — double jump).
- `--grid-column-offset` breaks single-column personas: mydealz has `--grid-columns-base:1`, xs adds +2, server injects `--grid-columns:3` (wrong).
- No density profile — `ledger` (dense rows) and `vitrine` (airy editorial) get the same `--card-gap`.
- `pulse` overlay fonts must not scale — full-viewport snap text is position-absolute; scaling breaks the layout.

**Changes:**

### scales.ts — replace 7 discrete values with 2 linear multipliers
Remove: all font-size-*, card-gap, section-gap, grid-column-offset.
Keep: shell chrome (nav-height, avatar-size, button-height, icon-size — already linear at 8px/4px steps).
Add:
- `--scale-factor`: `0.75 / 0.875 / 1.0 / 1.125 / 1.25` (fixed 0.125 step)
- `--space-unit`: `12px / 14px / 16px / 18px / 20px` (fixed 2px step)

### tokens/primitives.css — CSS derives fonts & spacing from scale vars
```css
:root {
  --font-size-xs:   calc(0.625rem  * var(--scale-factor));
  --font-size-sm:   calc(0.75rem   * var(--scale-factor));
  --font-size-base: calc(0.875rem  * var(--scale-factor));
  --font-size-lg:   calc(1rem      * var(--scale-factor));
  --font-size-xl:   calc(1.25rem   * var(--scale-factor));
  --font-size-2xl:  calc(1.5rem    * var(--scale-factor));
  --card-gap:       calc(var(--persona-space-unit) * 0.75);
  --section-gap:    calc(var(--persona-space-unit) * 1.25);
}
```

### LayoutPersona type — add scaleConfig
```ts
scaleConfig: {
  densityFactor: number      // multiplies --space-unit → --persona-space-unit
  usesColumnGrid: boolean    // false = skip --grid-columns-* calc entirely
  columns?: { desktop: number; tablet: number; mobile: number }
  scalesFonts: boolean       // false = inject --scale-factor:1 for this persona
}
```

Persona density targets:
| Persona  | densityFactor | usesColumnGrid | scalesFonts |
|----------|---------------|----------------|-------------|
| mydealz  | 1.0           | false          | true        |
| prism    | 1.0           | true           | true        |
| ledger   | 0.7           | false          | true        |
| vitrine  | 1.5           | false          | true        |
| pulse    | 1.0           | false          | false       |
| atlas    | 1.0           | true           | true        |

### theme-provider.tsx — persona-aware injection
- Inject `--scale-factor`, `--space-unit`, shell chrome vars from scale preset.
- Compute `--persona-space-unit` server-side: `space-unit-px * densityFactor` (injected as px string).
- Skip `--grid-columns-*` calculation when `!usesColumnGrid`.
- When `!scalesFonts`, inject `--scale-factor: 1` as an additional override after the scale vars.

## Phase 1 — Token System (3‑tier)
1. **[NEW]** `src/components/theme/tokens/primitives.ts` — raw scales (`--gray-*`, `--blue-*`, `--radius-*`, `--shadow-*`).
2. **[NEW]** `src/components/theme/tokens/primitives.css` — CSS derivations for fonts/spacing using `--scale-factor` and `--persona-space-unit` (see Phase 0.5).
3. **[NEW]** `src/components/theme/tokens/semantic.ts` — intent mappings (`--surface-bg`, `--text-primary`, `--interactive`, `--border-subtle`).
4. **[MODIFY]** `src/styles/theme/components.css` — consume component‑tier tokens only.
5. **[NEW]** token‑contract test: every persona defines all required component tokens; every scheme defines all semantic tokens (light + dark).

## Phase 2 — Color Schemes (14)
Create `src/components/theme/colors/*.ts`, each exporting light + dark semantic maps derived from shared primitives:
`default` ⭐, `midnight`, `graphite`, `azure`, `emerald`, `amber`, `plum`, `rose`, `teal`, `sand`, `forest`, `crimson`, `tet` 🎏, `christmas` 🎄.
- Validate **WCAG AA** contrast for text/interactive pairs in both modes.

## Phase 3 — Headless DealCard + Composers
1. **[MODIFY]** `src/components/deal/deal-card.tsx` → headless: `DealCardContext` + `DealCard.Root/Image/Title/Price/Meta/Temperature`. `Root` uses `container-type: inline-size`; sub‑components use `@container` queries.
2. **[NEW]** `src/components/deal/layouts/`:
   - `MydealzCard.tsx` (composes existing look — pixel‑identical)
   - `PrismCard.tsx` · `LedgerRow.tsx` · `VitrineCard.tsx` · `PulseCard.tsx` · `AtlasCard.tsx`
3. **[MODIFY]** `deal-feed.tsx` / `deal-list.tsx` — pick composer via `persona.composer`; remove all hidden‑DOM branches.

## Phase 4 — Shell Transformation
1. **[NEW]** `src/components/layout/shell/AppShell.tsx` — reads persona, lays out nav/sidebar/footer regions + background.
2. **[MODIFY]** `Navbar` → variants: `standard | floating | command-bar | minimal | hidden`.
3. **[MODIFY]** `Sidebar` → variants: `tree | icon-rail | filter-facets | none`.
4. **[MODIFY]** `Footer` → variants: `full | compact | status-bar | minimal | none`.
5. **[MODIFY]** `app/(main)/layout.tsx` — render through `<AppShell>`.
6. **[NEW]** background treatments (`mesh | paper | black | neutral | flat`) in `layout.css`.

## Phase 5 — The 5 New Personas
Author each `src/components/theme/layouts/*.ts` config (tokens + shell + data + motion) and finalize its composer:
- **prism** — bento grid, glass, floating nav, icon‑rail, gradient mesh.
- **ledger** — monospace rows, temperature column, command‑bar, tree sidebar, status‑bar; `data.needsImage=false`.
- **vitrine** — hero feature + serif list, minimal hides‑on‑scroll nav, no sidebar, paper bg.
- **pulse** — full‑viewport snap feed + stories rail, hidden chrome, black bg, mobile‑first, safe‑area insets.
- **atlas** — masonry wall, sticky filter‑facets sidebar, hover‑reveal, virtualized >50 items.

## Phase 6 — Layout‑aware Data + Motion
1. **[MODIFY]** `app/(main)/page.tsx` + feed pages — read active persona server‑side; build `select`/`pageSize` from `persona.data` (skip images/description/priceHistory when unused).
2. **[MODIFY]** `theme-provider.tsx` — SSR‑resolve persona, inject 3 token tiers + `data-*` attributes pre‑paint.
3. **[NEW]** persona switch wrapped in `document.startViewTransition()`; `view-transition-name` on cards; disabled under `prefers-reduced-motion`.
4. **[MODIFY]** `app/quan-tri/theme/` admin UI — pick from new personas + 14 schemes with live preview.

---

## Verification Plan
1. **Payload** smaller under `ledger` (no image fetch) — check network tab.
2. **Shell transform** — persona switch changes nav/sidebar/footer variants, not just cards.
3. **Contrast** — automated AA pass for all 14 schemes, light + dark.
4. **Container queries** — composer in a narrow container reflows without media queries.
5. **Motion** — switch animates; disabled under reduced‑motion.
6. **Regression** — `mydealz` pixel‑identical to current production.

## Rollout
- Land Phases 0–2 behind the scenes (no visible change; `mydealz` still active).
- Phases 3–6 incrementally; keep `mydealz` as default in `SiteConfig` until QA signs off each new persona.
