# Complete Layout & Theme Overhaul (Updated)

## Design Principles
1. **Colors decoupled from layout** — Nav/bg colors come from the color scheme, not hardcoded per layout
2. **Scale slider** — Controls font size AND column count for multi-column layouts
3. **Glass effects** — Increase transparency to actually show the glass/frosted effect
4. **Each layout resembles its namesake** — Not just CSS tweaks but genuine structural differences

## 5 Layouts

| Layout | Grid | Card Style | Nav Style | Key Visual |
|--------|------|------------|-----------|------------|
| **Modern** | 2-4 cols (scale-dependent) | Glass cards, rounded corners, image top, hover lift+glow | Frosted glass sticky nav with strong blur | Glass morphism everywhere |
| **MyDealz** | 1 col list | Horizontal: image left (150px square), temp badge, title, price, description, "Zum Deal" CTA | Solid `--color-primary` top bar | Deal list feed like mydealz.de screenshot |
| **Shopee** | 4-6 cols (scale-dependent) | Vertical product card: square 1:1 image, title 2 lines, bold price, small border | Solid `--color-primary` bar + sub-nav with trending keywords | Dense product grid like shopee.vn |
| **AliExpress** | 3-5 cols (scale-dependent) | Vertical card: white bg, product image, title, price in red/pink, clean minimal | White nav bar with `--color-primary` search button, clean top | Clean product grid like AliExpress |
| **Amazon** | 3-5 cols (scale-dependent) | Vertical card: white bg, image top, title 2 lines, price bold, "Prime"-style badge | Solid `--color-primary` top bar + light gray sub-nav | Utilitarian grid like Amazon.de |
| **Minimalist** | 1 col list | Text-focused: tiny 60px thumbnail, title+price inline, zero decoration | Simple thin bar, no glass, no blur | Reddit/HN-style density |

## Scale Slider Mapping

| Scale | Value | Font Base | Columns (grid layouts) |
|-------|-------|-----------|----------------------|
| XS | 1 | 0.75rem | max cols (6 for Shopee, 5 for AliExpress, 4 for Modern) |
| SM | 2 | 0.8125rem | -1 col |
| MD | 3 | 0.875rem | default cols |
| LG | 4 | 1rem | -1 col |
| XL | 5 | 1.125rem | min cols (2) |

> Larger scale = bigger cards = fewer columns. Slider goes 1→5.

## Files to Change

### [theme-tokens.ts](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/theme/theme-tokens.ts)
- Rewrite all 5 `LAYOUT_PRESETS` — no color values, only structural tokens
- Scale presets include a `--grid-columns-base` that layouts multiply

### [theme-provider.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/theme/theme-provider.tsx)
- Rewrite CSS: strong `[data-layout]` overrides per layout
- Enhanced glass effects with more transparency
- Scale-responsive column count via CSS `calc()`

### [deal-card.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/deal-card.tsx)
- All elements present in HTML, CSS shows/hides per layout
- Card structure supports both vertical (grid) and horizontal (list) via `--card-direction`

### [navbar.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/layout/navbar.tsx)
- Same HTML, visual differences via CSS `[data-layout]` selectors
- All nav styles use `--color-primary` from color scheme (not hardcoded)

### [theme-panel.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/admin/theme-panel.tsx)
- Replace scale buttons with `<input type="range" min="1" max="5">`
- Show current scale label + preview text

## Verification
- Switch each layout, visually verify against reference screenshots
- Test scale slider end-to-end
- Verify color scheme changes independently of layout
