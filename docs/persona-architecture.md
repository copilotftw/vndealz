# Persona Engine — Flexible UI Architecture

> Design document produced via the brainstorming workflow.
> Status: **Approved for planning** · Owner: frontend · Supersedes the CSS‑toggle theme engine.

---

## 1. Understanding Summary

- **What**: Replace the current CSS‑toggle theming with a **Layout Persona architecture** in which each persona transforms the *entire site* — navbar, sidebar, footer, page background, spacing, and the deal feed/cards — not merely the deal‑card DOM.
- **Why**: Today `deal-card.tsx` renders *every* layout's DOM simultaneously and hides pieces with `[data-layout]` CSS. This is memory‑heavy, hard to extend, and structurally incapable of restructuring the shell (nav/sidebar/footer are fixed).
- **Who**: Admins select one global persona + color scheme; end‑users experience a coherent, distinct site "mood" per persona.
- **Scope**: **Whole shell + feed.** Keep **only `mydealz`**. Remove `terminal`, `tiktok`, `shopee`, `bento`, `editorial`, `masonry` and all 15 legacy color schemes.
- **New content**: **5 new layout personas** (+ `mydealz` = 6 total) and **14 color schemes** (12 professional incl. one neutral `default`, plus seasonal `tet` and `christmas`).

### Non‑Goals
- No per‑page/per‑route persona overrides (global only).
- No per‑user persona choice (admin default only, for now).
- No new DB models beyond the existing `SiteConfig`.

### Assumptions
1. `mydealz` remains visually unchanged and is the safe fallback persona.
2. Personas are set globally by admin via existing `SiteConfig`.
3. i18n (vi/en), Better Auth, Prisma, Zustand are untouched; only the theme engine, shell, and deal‑card are refactored.
4. Accessibility target is **WCAG AA** contrast in both light and dark for every scheme.

---

## 2. Architecture: the Persona Engine

Six cooperating layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TOKEN LAYER (3-tier cascade)                               │
│    primitive  →  semantic  →  component                       │
│    --blue-500    --interactive   --card-bg / --grid-cols      │
│    (color schemes define primitive+semantic)                  │
│    (personas define component tokens)                         │
├─────────────────────────────────────────────────────────────┤
│ 2. PERSONA LAYER  (typed config per layout)                   │
│    tokens · shell · data · composer · motion                  │
├─────────────────────────────────────────────────────────────┤
│ 3. SHELL LAYER    <AppShell>                                  │
│    renders Nav / Sidebar / Footer VARIANTS from persona.shell │
├─────────────────────────────────────────────────────────────┤
│ 4. COMPOSER LAYER  headless DealCard.* + per-persona composer │
├─────────────────────────────────────────────────────────────┤
│ 5. DATA LAYER     server reads persona.data → Prisma select   │
├─────────────────────────────────────────────────────────────┤
│ 6. MOTION LAYER   startViewTransition() on persona switch     │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Persona config type

```ts
// src/components/theme/persona.ts
export type NavVariant     = 'standard' | 'floating' | 'command-bar' | 'minimal' | 'hidden'
export type SidebarVariant = 'tree' | 'icon-rail' | 'filter-facets' | 'none'
export type FooterVariant  = 'full' | 'compact' | 'status-bar' | 'minimal' | 'none'
export type BgVariant      = 'flat' | 'mesh' | 'paper' | 'black' | 'neutral'

export interface LayoutPersona {
  name: string
  /** React composer key used by DealFeed to pick the card renderer */
  composer: 'mydealz' | 'prism' | 'ledger' | 'vitrine' | 'pulse' | 'atlas'
  shell: {
    nav: NavVariant
    sidebar: SidebarVariant
    footer: FooterVariant
    background: BgVariant
    contentMaxWidth: string
  }
  /** Layout-aware data fetching hints (server reads these) */
  data: {
    needsImage: boolean
    needsDescription: boolean
    needsPriceHistory: boolean
    pageSize: number
  }
  /** Component-tier CSS variables (grid, radius, spacing, card treatment) */
  tokens: Record<string, string>
  motion: {
    cardEnter: string
    viewTransition: boolean
  }
}
```

### 2.2 Three‑tier token cascade

```
① Primitive   --gray-900:#0f172a   --blue-500:#3b82f6   --radius-2:8px
② Semantic    --surface-bg: var(--gray-900)   --interactive: var(--blue-500)
③ Component   --card-bg: var(--surface-bg)     --grid-cols: 4
```

Color schemes populate tiers ① and ②. Personas populate tier ③. This makes dark‑mode derivation and future custom themes surgical: change a semantic mapping, everything downstream updates.

### 2.3 Injection & switching

- `ThemeProvider` reads active persona + scheme from `SiteConfig`, injects all three token tiers as CSS variables on `<html>`, and sets `data-layout`, `data-nav`, `data-sidebar`, `data-bg` attributes.
- `<AppShell>` reads the persona from context and renders the matching Nav/Sidebar/Footer variant components.
- `DealFeed` selects the composer via `persona.composer`.
- On admin persona change, the switch is wrapped in `document.startViewTransition()` so cards morph between structures. All motion respects `prefers-reduced-motion`.

---

## 3. The 6 Layout Personas

`mydealz` is retained unchanged. The 5 new personas each restructure the **whole shell**.

| Persona | Vibe | Nav | Sidebar | Footer | Background | Card treatment | Images |
|---|---|---|---|---|---|---|---|
| **mydealz** | Classic deal feed (kept) | standard | tree | full | flat | Horizontal row card | ✅ |
| **prism** | Modular SaaS dashboard | floating pill | icon-rail | minimal | gradient mesh | Glass bento, variable 1×1 / 2×1 / 2×2 spans | ✅ |
| **ledger** | Power‑user data terminal | command‑bar (⌘K) | dense category tree | status‑bar | flat | Monospace rows, temperature column, sortable, dense | ❌ |
| **vitrine** | Luxury editorial magazine | minimal serif wordmark, hides on scroll | none | full editorial | warm paper | 1 full‑bleed hero feature + secondary serif list | ✅ |
| **pulse** | Immersive vertical social feed | hidden / overlay | none | none | black | Full‑viewport snap cards + hot‑deal "stories" rail | ✅ |
| **atlas** | Pinterest discovery wall | standard, search‑forward | filter‑facets (sticky) | compact | neutral | Masonry, variable heights, hover‑reveal actions | ✅ |

### Design intent per persona

- **prism** — Modern product surface. Asymmetric bento grid with glassmorphic cards; hottest deals get 2×2 tiles. `text-wrap: balance` on titles, `tabular-nums` on prices. Floating pill nav keeps chrome light.
- **ledger** — Bloomberg‑terminal energy for deal hunters. No images → smallest payload. Monospace, sortable columns (price, temperature, age, merchant), keyboard navigation, `⌘K` command bar. Status‑bar footer shows live counts.
- **vitrine** — Kinfolk/Net‑a‑Porter restraint. Generous whitespace, serif display headings, one large hero deal, quiet secondary list. Nav is a centered wordmark that hides on scroll. No sidebar to preserve air.
- **pulse** — TikTok‑style full‑viewport snap scroll with overlay actions (vote, save, buy) and a "stories" rail of hot deals. Chrome hidden. Mobile‑first; `env(safe-area-inset-*)` for notches.
- **atlas** — Discovery‑oriented masonry wall with a sticky faceted filter rail (category, merchant, price band, temperature). Variable card heights, hover‑reveal actions, virtualized for >50 items.

---

## 4. The 14 Color Schemes

3‑tier tokens, WCAG AA in light and dark. One neutral `default` baseline; `tet` and `christmas` are seasonal.

| # | Scheme | Primary | Character |
|---|---|---|---|
| 1 | **default** ⭐ | Slate + Blue | Clean neutral baseline |
| 2 | **midnight** | Deep slate + electric blue | Dark‑first, modern |
| 3 | **graphite** | Near‑black mono + single accent | Minimal, editorial |
| 4 | **azure** | Corporate blue | Fintech / trust |
| 5 | **emerald** | Green | Trust / growth |
| 6 | **amber** | Warm orange | Deal urgency / energy |
| 7 | **plum** | Deep purple + violet | Premium, creative |
| 8 | **rose** | Warm pink/red | Contemporary, friendly |
| 9 | **teal** | Cyan/teal | Calm, fresh |
| 10 | **sand** | Beige + terracotta | Warm, organic |
| 11 | **forest** | Deep green + moss | Grounded, natural |
| 12 | **crimson** | Bold red/maroon | Bold, high‑energy |
| 13 | **tet** 🎏 | Lucky red + gold | Lunar New Year (peak VN season) |
| 14 | **christmas** 🎄 | Pine green + red + gold/snow | Holiday |

Each scheme ships a light and dark variant derived from the same primitives via semantic remapping.

---

## 5. Decision Log

| # | Decision | Alternatives considered | Rationale |
|---|---|---|---|
| 1 | **Persona configs + headless composers** | (A) extend CSS‑toggle; (C) route‑groups per persona | Only this enables whole‑shell transformation while staying maintainable and DRY. |
| 2 | **Keep `mydealz` only**; remove all other layouts & the 15 legacy colors | Keep some legacy layouts | Clean slate per direction; avoids maintaining dead paradigms. |
| 3 | **5 new personas** across 5 paradigms (dashboard / data / editorial / immersive / discovery) | 3 or 6–7 | Maximizes paradigm diversity so each persona feels like a different product, without over‑scoping. |
| 4 | **14 color schemes, 3‑tier tokens** with auto dark derivation | Flat single‑tier vars | 3‑tier makes dark mode & future custom themes surgical; one neutral `default`. |
| 5 | **Global admin toggle via `SiteConfig`** | Per‑user / per‑route personas | YAGNI; matches current model. |
| 6 | **Layout‑aware Prisma `select` from `persona.data`** | Always fetch full object | `ledger` needs no images → smaller payloads; measurable perf win. |
| 7 | **View Transitions on persona switch** | Instant snap | Communicates the structural change; graceful fallback + reduced‑motion. |

---

## 6. Risks & Mitigations

- **Shell variant explosion** → constrain to the enumerated `NavVariant`/`SidebarVariant`/`FooterVariant` unions; each variant is one small component.
- **Persona/scheme token drift** → generate `registry.ts` via `npm run theme:generate`; add a token‑contract test asserting every persona defines the required component tokens.
- **View Transition jank** → animate only `transform`/`opacity`; disable under `prefers-reduced-motion`.
- **SSR flash** → resolve active persona server‑side in `ThemeProvider`, inject tokens before paint.

---

## 7. Verification Plan

1. **Payload**: network payload is smaller under `ledger`/… (no images fetched).
2. **Shell transform**: switching persona re‑renders nav/sidebar/footer variants, not just cards.
3. **Contrast**: automated AA check for all 14 schemes, light + dark.
4. **Container responsiveness**: a composer dropped into a narrow container reflows via container queries without media queries.
5. **Motion**: persona switch animates; disabled under reduced‑motion.
6. **Regression**: `mydealz` renders pixel‑identical to today.
