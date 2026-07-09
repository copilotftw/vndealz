# Project Overview: vndealz

## Approach
- Read existing files before writing. Don't re-read unless changed.
- Thorough in reasoning, concise in output.
- Skip files over 100KB unless required.
- No sycophantic openers or closing fluff.
- No emojis or em-dashes.
- Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading code or docs before asserting.

## 🚀 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: React 19
- **Database & ORM**: MariaDB / Prisma Client
- **Styling**: Tailwind CSS v4 & Custom CSS Grid architectures
- **Components**: shadcn/ui, Lucide Icons
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Form Validation**: Zod

---

## 📁 Detailed Directory Structure

Below is the exhaustive map of the `src/` directory and the purpose of every file:

### 1. Application Routing (`src/app/`)
*Next.js App Router endpoints defining pages and API routes.*
- `app/layout.tsx` & `globals.css`: Global HTML wrapper and root stylesheet.
- `app/favicon.ico`: Site favicon.
- **`app/(auth)/`**: Authentication flows.
  - `dang-ky/page.tsx`, `dang-nhap/page.tsx`: Registration and Login pages.
- **`app/(main)/`**: Main application routes.
  - `layout.tsx`, `template.tsx`, `loading.tsx`, `error.tsx`: Shell UI, loading skeletons, and error boundaries for the main feed.
  - `page.tsx`: The homepage / main deal feed.
  - `alerts/`: Feed and management pages for user-defined deal alerts.
  - `bao-mat/`, `dieu-khoan/`, `quy-che/`: Static legal/policy pages.
  - `cai-dat/`: User settings pages (Profile, Socials, Notifications, Preferences).
  - `canh-bao-deal/`: UI for setting up custom deal keyword alerts.
  - `dang/`, `dang-*`: Posting flows for Deals, Vouchers, Referrals, and Discussions.
  - `danh-hieu/`: User badge/gamification showcase page.
  - `danh-muc/[...slug]/`: Category-specific deal feeds.
  - `deal/[slug]/`: The Deal Detail page.
  - `ho-so/[username]/`: Public user profiles (Stats, Activity, Badges, Saved deals).
  - `lien-he/`, `ve-chung-toi/`: Contact and About pages.
  - `ma-giam-gia/`, `mien-phi/`: Feeds filtered specifically for vouchers and freebies.
  - `thao-luan/`: The community forum / discussion board.
  - `thuong-hieu/[slug]/`: Merchant/Brand specific deal feeds.
  - `tim-kiem/`: Search results page.
- **`app/quan-tri/`**: Admin Panel routes.
  - `ads/`, `affiliates/`: Monetization management.
  - `categories/`, `discussion-categories/`: Taxonomy management.
  - `deals/`: Master deal management.
  - `moderation/`: Approval queue for user-submitted deals.
  - `reports/`: User report resolution.
  - `users/`: User management.
  - `theme/`: Admin interface to toggle global UI layouts and colors.
- **`app/api/`**: Next.js Route Handlers.
  - `auth/[...all]/route.ts`: Better Auth server endpoints.
  - `uploadthing/route.ts`: Image upload endpoints.

### 2. React Components (`src/components/`)
*Reusable UI logic.*
- **`admin/`**: Admin-specific data tables, moderation queues, and forms.
- **`ads/`**: Ad banners and sponsored badges.
- **`category/`**: Navigational elements (tree menus, breadcrumbs, filter sidebars).
- **`comment/`**: Comment threads, reply forms, and reaction buttons.
- **`deal/`**:
  - `deal-card.tsx`: **Headless** compound primitives (NOT monolithic). Exports `DealCardRoot` (provides context, `container-type:inline-size`) + `DealCardImage/Title/Price/Temperature/Meta/Description/Footer/TopMeta`. Types: `DealCardData`, `ComposerProps`.
  - `deal/layouts/*.tsx`: Per-persona **composers** that assemble the primitives. One per persona: `MydealzCard` (pixel-identical to legacy), `PrismCard` (glass bento), `LedgerRow` (monospace, no image), `VitrineCard` (editorial hero+list), `PulseCard` (full-viewport snap), `AtlasCard` (masonry). `deal-list.tsx` maps `ComposerKey` → composer.
  - `deal-detail.tsx`, `deal-feed.tsx`, `deal-list.tsx`: Display. `deal-feed` reads active persona, passes `composerKey` + `persona.data` flags (pageSize/needsImage/needsDescription) to `getDeals`.
  - `deal-form.tsx`, `voucher-form.tsx`, `referral-form.tsx`, `discussion-form.tsx`: Submission forms. NOTE: all currently funnel through one `createDeal`+`dealSchema` (wrong, see Known Issues); `referral-form` is a mock (no persistence).
  - `temperature-vote.tsx`: Hot/Cold voting. `price-chart.tsx`: price graph.
- **`layout/`**: Global chrome.
  - `shell/`: **Persona shell system.** `AppShell.tsx` (server; reads persona, sets `data-nav/-sidebar/-bg`, renders regions) → `NavShell`/`SidebarShell`/`FooterShell` routers → variant impls: `FloatingNav`, `CommandBarNav`, `MinimalNav` (navs); `IconRailSidebar`, `FilterFacetsSidebar` (sidebars); `CompactFooter`. `app/(main)/layout.tsx` renders only `<AppShell>`.
  - Root: `navbar.tsx` (standard nav), `sidebar.tsx` (tree), `footer.tsx` (full), mobile nav, live search, `notification-bell.tsx` (**static mock — no data fetch yet**).
- **`profile/`**: User avatars, hover cards, badge icons.
- **`settings/`**: Settings sidebars/headers/checkbox.
- **`shared/`**: Empty states, fallbacks.
- **`theme/`**: **Layout Persona Engine.** See architecture section below.
  - `persona.ts`: `LayoutPersona` type — `{ composer, shell{nav,sidebar,footer,background,contentMaxWidth}, data{needsImage,needsDescription,needsPriceHistory,pageSize}, scaleConfig{densityFactor,usesColumnGrid,columns?,scalesFonts}, tokens, motion }`. Union types for each variant.
  - `layouts/*.ts`: **6 personas** — `mydealz`, `prism`, `ledger`, `vitrine`, `pulse`, `atlas` (each a full `LayoutPersona`).
  - `colors/*.ts`: **14 schemes** — default, midnight, graphite, azure, emerald, amber, plum, rose, teal, sand, forest, crimson, tet, christmas. Each `{ light, dark }` `SemanticTokens`.
  - `tokens/`: `primitives.ts` (raw color/radius/shadow scales), `primitives.css` (derives font-sizes + spacing from `--scale-factor`/`--persona-space-unit` via `calc()`), `semantic.ts` (`SemanticTokens`/`ColorScheme` contracts), `scales.ts` (`SCALE_PRESETS`: linear `--scale-factor` 0.125-step + `--space-unit` 2px-step, `SPACE_UNIT_PX`).
  - `registry.ts`: **auto-generated** (`npm run theme:generate`) — `LAYOUTS`, `COLORS`, `AVAILABLE_*`. Do not hand-edit.
  - `theme-provider.tsx`: `getThemeStyles()` (cached, tag `theme`) + `ThemeProvider` injects tokens/scale/persona vars + `data-layout` pre-paint.
- **`ui/`**: shadcn primitives. NOTE: uses base-ui `render={<El/>}` prop for polymorphism, NOT `asChild`.

### 3. Server Logic (`src/server/`)
*Next.js Server Actions and core business logic.*
- **`actions/`**: Next.js Mutations called directly from Client Components (e.g., `deal.ts` for posting deals, `comment.ts` for replying, `theme.ts` for admin layout changes).
- **`services/`**: Internal business logic (`notification.ts` for sending in-app/email pings).

### 4. Utilities & Libraries (`src/lib/`)
*Core engine configurations.*
- `alerts/matching-engine.ts`: Checks new deals against user keywords.
- `badges/engine.ts`: Calculates if a user earned a new badge based on activity.
- `gamification/engine.ts`: Calculates user XP, levels, and tiers.
- `auth.ts`, `db.ts`, `redis.ts`: Database and Auth client initializers.
- `temperature.ts`: Algorithm for calculating deal "hotness".
- `validations.ts`: Zod schemas for all forms.

### 5. Stylesheets (`src/styles/theme/`)
*CSS engine for the persona system.*
- `layout.css`: `.deal-grid` (grid cols from `--grid-columns*`), `[data-layout="atlas"]` masonry (multi-column), `[data-bg=...]` background variants (mesh/paper/black/neutral/flat), `[data-nav]/[data-sidebar]` hooks, `::view-transition` rules + `.deal-card-root`/`.deal-detail-root` shared-element names (`--vt-name`), reduced-motion guard. Legacy `[data-layout]` blocks (shopee/tiktok/terminal/bento/editorial/masonry) REMOVED.
- `components.css`: base input/card styles, glass utilities. `animations.css`: keyframes. `navbar.css`: scroll-aware nav.
- Import order: `primitives.css` (via globals.css) → semantic vars (injected JS) → component styles.

### 6. Miscellaneous
- **`src/hooks/`**: Custom React hooks (`use-auth`, `use-deals`, `use-media-query`).
- **`src/stores/`**: Zustand global client state (`app-store.ts`).
- **`src/i18n/` & `src/messages/`**: Internationalization configs (English & Vietnamese).
- **`src/emails/`**: React Email templates (`deal-alert.tsx`, `deal-approved.tsx`).

---

## 🗄️ Database Architecture (`prisma/schema.prisma`)
1. **Users & Auth**: Better Auth (`User`, `Session`, `Account`). `User` holds gamification stats + two untyped `Json?` blobs: `preferences`, `notificationSettings`.
2. **Deals**: `Deal` (fields incl. `type` DEAL|VOUCHER|FREEBIE|DISCUSSION, `status`, `temperature`, `image`/`description` `@db.Text`), relations `PriceHistory`, `DealImage`, `Category`, `DiscussionCategory`.
3. **Categories**: self-referencing `parentId` (unlimited nesting); separate `DiscussionCategory`.
4. **Community**: `Comment`, `Vote`, `Bookmark`, `Follow`, `MutedUser`, `Report`.
5. **Gamification**: `Badge`, `UserBadge`.
6. **Alerts/Notifications**: `DealAlert` (user rule: keyword/merchant/category/minTemperature), `Notification` (delivered event; `read`, `channel`, indexed `[userId,read,createdAt]`).
7. **Theming**: `SiteConfig` (id `default`) — global active `layout`/`colorScheme`/`scale`.

---

## 🛠️ Development Scripts
- `npm run dev`: dev server (Turbopack). `predev`/`prebuild` auto-run `theme:generate`.
- `npm run build`: `prisma generate && next build`.
- `npm run db:push`: push schema to MariaDB.
- `npm run theme:generate`: regenerate `registry.ts` from `theme/layouts` + `theme/colors`.

---

## 🧩 Persona Engine (architecture)
Replaces old CSS-toggle theming. Active persona (from `SiteConfig.layout`) transforms the WHOLE site, not just cards:
- **6 cooperating layers**: token cascade (primitive→semantic→component) · persona config · shell (nav/sidebar/footer/bg variants) · composer (per-persona DealCard assembly) · data (persona-driven Prisma `select`/`pageSize`) · motion (view transitions).
- **Scale**: `--scale-factor` (linear font multiplier) + `--persona-space-unit` (= `--space-unit × densityFactor`, server-computed). `usesColumnGrid:false` skips grid-col math; `scalesFonts:false` (pulse) pins `--scale-factor:1`.
- **Flow**: `getThemeStyles()` → `LAYOUTS[layout]` → `AppShell` sets `data-*` + renders shell variants; `DealFeed` picks composer + lean data shape. Persona switch (admin) wrapped in `startViewTransition`.
- Docs: `docs/persona-architecture.md`, `implementation_plan.md`.

## ⚠️ Known Issues (see `docs/code-review.md`, TODO in `TASKS.md`)
- **Routing facts**: NO `[locale]` URL segment (next-intl, no prefix); admin is `/quan-tri` NOT `/admin`; main routes under invisible `(main)` group. → ALL `revalidatePath('/[locale]/...')` and `/admin/...` calls in `src/server/actions/` are DEAD (target nonexistent routes). Use real paths (`/deal/[slug]`, `/quan-tri/moderation`, `/`).
- **Settings mostly store-only**: notifications ~96% cosmetic (`sendNotification` fires from 1 site; `NotificationEvent` union has 12 events vs ~25 UI toggles); several `preferences` keys dead; `defaultLanding` broken. Profile (name/bio/avatar/email) works.
- **Post forms**: 4 content types wrongly share `createDeal`/`dealSchema`; discussion can't validate (url required); `referral-form` is a mock. Should be discriminated union + per-type actions.
- **Email disabled**: gated on `RESEND_API_KEY` (`resend` null → `EMAIL_ENABLED` false in matching-engine + notification service). Re-enables automatically when key set.
- **`getDeals`** returns `any[]` (type it); runs muted/settings queries sequentially before cache.
