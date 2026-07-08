# VNDealz — Complete Build Guide

> **What is this?** A deal-sharing community website like mydealz.de, but for Vietnam.
> Users post deals, vote hot/cold, comment, and the best deals rise to the top.
> Admins can completely change the website's look (layout, scale, colors) from a control panel.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Why](#2-tech-stack--why)
3. [Project Setup](#3-project-setup)
4. [Database Schema](#4-database-schema)
5. [Core Libraries](#5-core-libraries)
6. [Dynamic Theming System](#6-dynamic-theming-system)
7. [Internationalization (i18n)](#7-internationalization-i18n)
8. [Authentication](#8-authentication)
9. [Hierarchical Categories](#9-hierarchical-categories)
10. [Deal System](#10-deal-system)
11. [Moderation System](#11-moderation-system)
12. [Comment System](#12-comment-system)
13. [User System](#13-user-system)
14. [Admin Panel](#14-admin-panel)
15. [Monetization](#15-monetization)
16. [Component Guide](#16-component-guide)
17. [Pages & Routing](#17-pages--routing)
18. [Deployment](#18-deployment)
19. [Build Order Checklist](#19-build-order-checklist)

---

## 1. Project Overview

### What does the website do?
```
┌─────────────────────────────────────────────────────────────┐
│                         VNDealz                             │
│                                                             │
│  USER posts a deal ──→ Goes to PENDING queue                │
│                              │                              │
│                    MODERATOR reviews it                      │
│                       │              │                       │
│                    APPROVE         REJECT                    │
│                       │              │                       │
│                  Goes PUBLIC      Author notified            │
│                       │                                     │
│              Other users SEE it                             │
│                  │         │                                │
│              VOTE 🔥/❄️   COMMENT                           │
│                  │                                          │
│          Temperature rises/falls                            │
│                  │                                          │
│          HOT deals shown first on homepage                  │
└─────────────────────────────────────────────────────────────┘
```

### Key features at a glance
- **Deal feed** with Hot/New/Trending tabs
- **Temperature voting** — community votes deals up (🔥) or down (❄️)
- **Hierarchical categories** — unlimited nesting (Electronics → Computers → Laptops → Gaming Laptops)
- **All deals moderated** — every deal must be approved by a moderator before going public
- **Dynamic theming** — admin can switch entire website look: 5 layouts × 5 scales × 12 color schemes = 300 combinations
- **Bilingual** — Vietnamese (default) + English
- **Monetization** — affiliate links, sponsored deals, ad banners

### Infrastructure
```
┌──────────────┐       ┌──────────────────┐       ┌─────────────┐
│   Browser    │──────→│  192.168.1.106   │──────→│192.168.1.105│
│   (User)     │       │  nginx + PM2     │       │  MariaDB    │
│              │◄──────│  Next.js app     │◄──────│  Database   │
└──────────────┘       └──────────────────┘       └─────────────┘
       ↑                        ↑
       │                Cloudflare Tunnel
       └────────────── vndealz.yourdomain.com
```

---

## 2. Tech Stack & Why

### Why each tool was chosen (explain to your team)

| Package | What it does | Why THIS one and not something else |
|---|---|---|
| **Next.js 16.2** | Full-stack React framework | App Router gives us server components (fast pages), server actions (no separate API), and Turbopack (fast dev). It's the industry standard in 2026. |
| **React 19.2** | UI library | Comes with Next.js 16. Has server components, `use()` hook, and `useOptimistic()` which we need for voting. |
| **TypeScript 5.7** | Type-safe JavaScript | Catches bugs before they happen. Non-negotiable for a project this size. |
| **Tailwind CSS 4.3** | Utility CSS framework | v4 compiles to native CSS (faster). We use it WITH CSS variables so the admin theme system works. |
| **shadcn/ui** (Base UI) | Pre-built components | Gives us buttons, cards, dialogs, tables etc. We OWN the code (copied into our project), so we can customize everything. |
| **Prisma 7** | Database ORM | Has first-class MariaDB support via `@prisma/adapter-mariadb`. Auto-generates TypeScript types from our schema. Has Prisma Studio for visual DB browsing. |
| **Better Auth ~1.7** | Authentication | Modern replacement for NextAuth. TypeScript-first, plugin ecosystem, directly supports MariaDB. |
| **Zod 4.4** | Form/data validation | Validates user input on both client and server. Type-safe. |
| **Zustand 5.0** | Client-side state | For things like "is sidebar open?", "list vs grid view?". Much simpler than Redux. |
| **next-intl** | Translations (i18n) | The standard i18n library for Next.js App Router. Handles /vi/ and /en/ URL prefixes. |
| **@dnd-kit** | Drag and drop | For the admin category tree manager — lets admins reorder categories by dragging. |
| **Uploadthing** | Image uploads | Dead simple file uploads. Creates an S3-compatible bucket for deal images and avatars. |
| **React Email + Resend** | Sending emails | For deal alerts, moderation notifications. React Email lets us write emails as React components. |
| **lucide-react** | Icons | Clean icon set that matches shadcn/ui style. |
| **date-fns** | Date formatting | Lightweight. Supports Vietnamese locale for "2 giờ trước" style timestamps. |
| **PM2** | Process manager | Keeps our Next.js app running on the server. Auto-restarts on crash. |

### Version reference (install the LATEST of each)
```
next@16.2.10  react@19.2.x  tailwindcss@4.3.2  prisma@7.x
better-auth@~1.7.x  zod@4.4.x  zustand@5.0.x  next-intl@latest
@dnd-kit/core@latest  @dnd-kit/sortable@latest  @dnd-kit/utilities@latest
uploadthing@latest  react-email@latest  resend@latest
lucide-react@latest  date-fns@latest  slugify@latest  shadcn@4.13+
```

---

## 3. Project Setup

### 3.1 Create the project
```bash
cd /Users/nguyen.dinh/Documents/My\ Projects/vndealz
npx -y create-next-app@latest ./ \
  --typescript --tailwind --eslint --app --turbopack \
  --src-dir --import-alias "@/*" --skip-install
npm install
```
> **What this does**: Creates a Next.js 16 project in the current folder with TypeScript, Tailwind, ESLint, App Router, Turbopack, and a `src/` directory. `--skip-install` avoids interactive prompts, then `npm install` installs cleanly.

### 3.2 Install all dependencies
```bash
# Production dependencies
npm i prisma @prisma/client @prisma/adapter-mariadb \
  better-auth zod zustand next-intl \
  lucide-react date-fns slugify \
  uploadthing @uploadthing/react \
  react-email resend \
  @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Dev dependencies
npm i -D @types/node
```

### 3.3 Initialize shadcn/ui
```bash
npx shadcn@latest init -b base
```
> When prompted: style = `new-york`, base color = `neutral`, CSS variables = `yes`.
> `-b base` means use **Base UI** (the new default) instead of Radix UI.

Then add all the components we'll need:
```bash
npx shadcn@latest add button card input textarea select \
  dialog dropdown-menu avatar badge tabs toast table \
  sheet separator skeleton switch label popover command \
  accordion tooltip slider radio-group
```
> **What this does**: Copies component source code into `src/components/ui/`. You own this code and can edit it freely.

### 3.4 Initialize Prisma
```bash
npx prisma init --datasource-provider mysql
```
> Creates `prisma/schema.prisma` and `.env` file.

### 3.5 Configure `.env`
```env
DATABASE_URL="mysql://nguyen:Digimon3%23@192.168.1.105:3306/vndealz"

# Better Auth
BETTER_AUTH_SECRET="replace-with-random-32-char-string"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OAuth (get these from Google/Facebook developer consoles)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# File uploads (get from uploadthing.com dashboard)
UPLOADTHING_TOKEN=""

# Email (get from resend.com dashboard)
RESEND_API_KEY=""
```
> ⚠️ **GOTCHA**: The `#` in password `Digimon3#` must be URL-encoded as `%23`. This is already done above.

### 3.6 Complete file structure
Create all these folders and empty files first. This gives you a map of the entire project before writing code.

```
src/
├── app/
│   ├── layout.tsx                          # ROOT layout — loads fonts, injects theme CSS
│   ├── globals.css                         # Tailwind imports + CSS variable fallbacks
│   ├── [locale]/                           # i18n wrapper — /vi/... and /en/...
│   │   ├── layout.tsx                      # Provides translations to all children
│   │   ├── (auth)/                         # Auth pages (no navbar/sidebar)
│   │   │   ├── layout.tsx                  # Centered card layout for auth forms
│   │   │   ├── dang-nhap/page.tsx          # Login page
│   │   │   └── dang-ky/page.tsx            # Register page
│   │   ├── (main)/                         # Main pages (with navbar + sidebar)
│   │   │   ├── layout.tsx                  # Navbar + Sidebar + <main> wrapper
│   │   │   ├── page.tsx                    # HOMEPAGE — deal feed
│   │   │   ├── deal/[slug]/page.tsx        # Deal detail page
│   │   │   ├── ma-giam-gia/page.tsx        # Voucher codes listing
│   │   │   ├── mien-phi/page.tsx           # Freebies listing
│   │   │   ├── thao-luan/page.tsx          # Discussion threads
│   │   │   ├── danh-muc/[...slug]/page.tsx # Category page (catch-all for nesting)
│   │   │   ├── tim-kiem/page.tsx           # Search results
│   │   │   └── dang-deal/page.tsx          # Submit new deal form
│   │   ├── ho-so/[username]/page.tsx       # Public user profile
│   │   ├── cai-dat/page.tsx                # User settings
│   │   └── admin/                          # Admin panel (protected)
│   │       ├── layout.tsx                  # Admin sidebar + content area
│   │       ├── page.tsx                    # Dashboard with stats
│   │       ├── deals/page.tsx              # Manage all deals
│   │       ├── users/page.tsx              # Manage users
│   │       ├── reports/page.tsx            # Review user reports
│   │       ├── moderation/page.tsx         # Approve/reject pending deals
│   │       ├── categories/page.tsx         # Category tree manager
│   │       ├── affiliates/page.tsx         # Affiliate link configs
│   │       ├── ads/page.tsx                # Ad placement manager
│   │       └── theme/page.tsx              # THEME CONTROL PANEL
│   └── api/
│       ├── auth/[...all]/route.ts          # Better Auth API handler
│       └── uploadthing/route.ts            # Uploadthing API handler
│
├── components/
│   ├── deal/
│   │   ├── deal-card.tsx                   # Single deal card (used in lists)
│   │   ├── deal-list.tsx                   # Maps array of deals → DealCard components
│   │   ├── deal-feed.tsx                   # Tabs (Hot/New/Trending) + DealList + pagination
│   │   ├── deal-form.tsx                   # Deal submission form with validation
│   │   ├── deal-detail.tsx                 # Full deal view (used on deal/[slug] page)
│   │   └── temperature-vote.tsx            # 🔥/❄️ vote buttons + temperature number
│   ├── comment/
│   │   ├── comment-thread.tsx              # Recursive threaded comment tree
│   │   ├── comment-form.tsx                # Comment textarea + submit button
│   │   └── reaction-button.tsx             # "Helpful ✓" toggle button
│   ├── category/
│   │   ├── category-breadcrumb.tsx         # Breadcrumb: Home > Electronics > Computers > Laptops
│   │   ├── category-tree-nav.tsx           # Sidebar: expandable category tree navigation
│   │   └── category-pills.tsx             # Horizontal scrollable category chips (top nav)
│   ├── layout/
│   │   ├── navbar.tsx                      # Top navigation bar
│   │   ├── sidebar.tsx                     # Right sidebar (trending, ads, categories)
│   │   ├── footer.tsx                      # Site footer
│   │   ├── mobile-nav.tsx                  # Bottom tab bar (mobile only)
│   │   └── language-switch.tsx             # 🇻🇳/🇬🇧 toggle button
│   ├── admin/
│   │   ├── admin-sidebar.tsx               # Admin navigation links
│   │   ├── stats-cards.tsx                 # Dashboard stat cards
│   │   ├── moderation-queue.tsx            # Pending deals list with approve/reject
│   │   ├── data-table.tsx                  # Reusable sortable/filterable table
│   │   ├── category-tree-manager.tsx       # Drag-drop category tree editor
│   │   ├── theme-panel.tsx                 # Layout/scale/color scheme selector
│   │   └── affiliate-form.tsx              # Affiliate config CRUD form
│   ├── ads/
│   │   ├── ad-banner.tsx                   # Renders ad by slot (sidebar/in-feed/detail)
│   │   └── sponsored-badge.tsx             # "Tài trợ" label chip
│   ├── theme/
│   │   ├── theme-provider.tsx              # Reads DB config → generates CSS variable string
│   │   └── theme-tokens.ts                # ALL preset definitions (layouts, scales, colors)
│   ├── ui/                                 # shadcn components (auto-generated, don't edit unless needed)
│   └── shared/
│       ├── search-bar.tsx                  # Search input (Cmd+K shortcut)
│       ├── pagination.tsx                  # Page navigation
│       └── empty-state.tsx                 # "No results" placeholder
│
├── server/
│   └── actions/                            # Server Actions (called from components, run on server)
│       ├── deal.ts                         # createDeal, voteDeal, getDeals, expireDeal
│       ├── comment.ts                      # createComment, deleteComment, reactToComment
│       ├── category.ts                     # getCategoryTree, createCategory, moveCategory, deleteCategory
│       ├── user.ts                         # updateProfile, toggleBookmark, getUserProfile
│       ├── admin.ts                        # getDashboardStats, moderateDeal, banUser
│       ├── search.ts                       # searchDeals (full-text search)
│       ├── report.ts                       # createReport, resolveReport
│       └── theme.ts                        # getSiteConfig, updateSiteConfig
│
├── lib/
│   ├── db.ts                               # Prisma client singleton
│   ├── auth.ts                             # Better Auth server configuration
│   ├── auth-client.ts                      # Better Auth client (for React hooks)
│   ├── validations.ts                      # All Zod schemas
│   ├── temperature.ts                      # Temperature calculation algorithm
│   ├── affiliate.ts                        # Affiliate URL rewriting logic
│   └── utils.ts                            # cn(), formatPrice(), timeAgo(), generateSlug()
│
├── i18n/
│   ├── routing.ts                          # Locale config: ['vi', 'en'], default: 'vi'
│   ├── request.ts                          # next-intl request handler
│   └── navigation.ts                       # Localized Link, useRouter, usePathname
│
├── messages/
│   ├── vi.json                             # All Vietnamese UI strings
│   └── en.json                             # All English UI strings
│
├── hooks/
│   ├── use-auth.ts                         # Convenience wrapper for auth session
│   └── use-deals.ts                        # Client-side deal helpers if needed
│
├── stores/
│   └── app-store.ts                        # Zustand store: sidebar open, view mode (list/grid), dark mode
│
└── prisma/
    ├── schema.prisma                       # Database schema (ALL tables)
    └── seed.ts                             # Seeds categories + admin user + default theme config
```

> **WHY this structure?**
> - `(auth)` and `(main)` are **route groups** (parentheses = no URL segment). They let us use different layouts: auth pages have a centered card layout, main pages have navbar+sidebar.
> - `[locale]` makes every URL start with `/vi/` or `/en/`.
> - `[...slug]` is a **catch-all** route, so `/danh-muc/dien-tu/may-tinh/laptop` works with any depth.
> - `server/actions/` contains **Server Actions** — functions that run on the server but can be called directly from React components. No REST API needed.

---

## 4. Database Schema

### How the tables relate to each other
```
User ─────────┬── Deal (user posts deals)
              ├── Vote (user votes on deals)
              ├── Comment (user comments on deals)
              ├── Bookmark (user saves deals)
              ├── DealAlert (user sets keyword alerts)
              ├── Report (user reports content)
              ├── Session (auth sessions)
              └── Account (OAuth accounts: Google, Facebook)

Deal ─────────┬── Vote (deals receive votes)
              ├── Comment (deals have comments)
              ├── Bookmark (deals get bookmarked)
              └── Category (deal belongs to one category)

Category ─────┬── Category (self-referencing: parent → children)
              └── Deal (category has many deals)

Comment ──────┬── Comment (self-referencing: parent → replies)
              └── CommentReaction (comments get "helpful" reactions)

SiteConfig ── Single row table: stores current layout, scale, colorScheme

AffiliateConfig ── One row per merchant (Shopee, Lazada, etc.)
AdPlacement ── One row per ad slot/campaign
Verification ── Email verification tokens (used by Better Auth)
```

### Important schema decisions to understand

**1. Categories are a TREE (self-referencing)**
```
Category table:
┌────┬──────────┬──────────┬───────┐
│ id │ nameVi   │ parentId │ depth │
├────┼──────────┼──────────┼───────┤
│ A  │ Điện tử  │ NULL     │ 0     │ ← root (no parent)
│ B  │ Máy tính │ A        │ 1     │ ← child of A
│ C  │ Laptop   │ B        │ 2     │ ← child of B (grandchild of A)
│ D  │ Thời trang│ NULL    │ 0     │ ← another root
└────┴──────────┴──────────┴───────┘

This creates:
├── Điện tử (depth 0)
│   └── Máy tính (depth 1)
│       └── Laptop (depth 2)
├── Thời trang (depth 0)
```
- `parentId` points to the parent category's `id`. NULL = root category.
- `depth` is stored for convenience (avoids counting parents every time).
- When viewing "Điện tử", we show deals from Điện tử AND all descendants (Máy tính, Laptop, etc.).

**2. Deals ALWAYS start as PENDING**
```
User submits → status = "PENDING"
Mod approves → status = "ACTIVE"   (now visible to everyone)
Mod rejects  → status = "REJECTED" (only author sees it)
Community marks expired → status = "EXPIRED"
```
The public feed ONLY shows `status = "ACTIVE"` deals. No exceptions.

**3. Votes use a compound unique constraint**
```
@@unique([userId, dealId])
```
This means one user can only have ONE vote per deal. If they vote again, we UPSERT (update the existing vote).

**4. SiteConfig is a single-row table**
```
┌─────────┬─────────┬───────┬──────────────┐
│ id      │ layout  │ scale │ colorScheme  │
├─────────┼─────────┼───────┼──────────────┤
│ default │ modern  │ md    │ default      │
└─────────┴─────────┴───────┴──────────────┘
```
There's only ever ONE row with `id = "default"`. When admin changes the theme, we update this row. The root layout reads this row on every request to inject the right CSS.

### Write the full schema
Copy the full Prisma schema from the code section below into `prisma/schema.prisma`. The schema is long but straightforward — each model maps to one database table.

> ⚠️ **GOTCHA**: MariaDB uses `provider = "mysql"` in Prisma. There's no separate "mariadb" provider.

> ⚠️ **GOTCHA**: The `@@fulltext([title, description])` index on Deal requires MariaDB's InnoDB with FULLTEXT support. Make sure MariaDB is version 10.0+.

> ⚠️ **GOTCHA**: Prisma doesn't support true enums for MySQL/MariaDB — use `String` fields with comments indicating valid values instead.

After writing the schema:
```bash
npx prisma db push      # Creates all tables in MariaDB
npx prisma generate      # Generates TypeScript types for all models
```

### Seed the database
Write `prisma/seed.ts` to insert:
1. **15 root categories** with Vietnamese and English names, slug, emoji icon, and order
2. **Example nested categories** under "Điện tử": Máy tính → Laptop, Điện thoại
3. **Default SiteConfig** row: layout="modern", scale="md", colorScheme="default"
4. **Admin user**: username="admin", email="admin@vndealz.vn", role="ADMIN"

Run with: `npx tsx prisma/seed.ts`

---

## 5. Core Libraries

These are small utility files that many parts of the app depend on. Build them FIRST.

### `src/lib/db.ts` — Prisma client singleton
**What**: Creates one Prisma database connection and reuses it.
**Why**: In development, Next.js hot-reloads files which would create a new DB connection each time, eventually exhausting the connection pool.
**How**: Store Prisma client on `globalThis` so it survives hot reloads.

### `src/lib/auth.ts` — Better Auth server config
**What**: Configures Better Auth with MariaDB, Google OAuth, Facebook OAuth, and email/password.
**Key settings**:
- `database`: Use `prismaAdapter(db, { provider: 'mysql' })`
- `emailAndPassword`: `{ enabled: true }`
- `socialProviders`: Google + Facebook with env vars
- `session.expiresIn`: 30 days in seconds
- `user.additionalFields`: Add `username`, `role`, `points`, `tier`, `locale` to the session

### `src/lib/auth-client.ts` — Better Auth React client
**What**: Creates the client-side auth hooks (`useSession`, `signIn`, `signUp`, `signOut`).
**How**: `createAuthClient({ baseURL: process.env.NEXT_PUBLIC_APP_URL })`

### `src/app/api/auth/[...all]/route.ts` — Auth API route
**What**: Catch-all route that handles all auth requests (login, register, callback, session).
**How**: `export const { GET, POST } = toNextJsHandler(auth)`
> This is literally 3 lines of code. Better Auth handles everything.

### `src/lib/validations.ts` — Zod schemas
**What**: Defines the shape and rules for all user input.
**Schemas to create**:
- `dealSchema` — title (5-200 chars), description (10-5000), url (valid URL), price (positive), categoryId, type, etc.
- `commentSchema` — content (1-2000 chars), dealId, parentId
- `reportSchema` — targetType (deal/comment/user), targetId, reason (5-500)
- `categorySchema` — nameVi, nameEn, slug (lowercase-dashes-only), icon, parentId, order
- `themeSchema` — layout (one of 5 presets), scale (xs/sm/md/lg/xl), colorScheme (one of 12)
- `affiliateSchema` — merchant name, affiliateTag, urlPattern (regex)
- `adSchema` — slot (sidebar/in-feed/deal-detail), targetUrl, imageUrl, dates

### `src/lib/temperature.ts` — Temperature algorithm
**What**: Calculates a deal's "temperature" score from its votes.
**How it works**:
```
For each vote:
  - If vote is < 24 hours old → full weight (×1)
  - If vote is 24-72 hours old → half weight (×0.5)
  - If vote is > 72 hours old → quarter weight (×0.25)
Temperature = sum of all weighted votes (rounded)
```
This means recent votes matter more. A deal with 50 votes from today is hotter than one with 100 votes from last week.

### `src/lib/affiliate.ts` — URL rewriting
**What**: When a user clicks "Go to deal", we check if we have an affiliate config for that merchant. If yes, we append our affiliate tag to the URL.
**Example**: User posts a Shopee link → we have AffiliateConfig for "shopee" with tag `ref=vndealz` → outbound link becomes `shopee.vn/product?ref=vndealz`

### `src/lib/utils.ts` — Helpers
- `cn(...classes)` — merges Tailwind classes (uses `clsx` + `tailwind-merge`)
- `formatPrice(number)` — formats as Vietnamese currency: `₫1.500.000`
- `timeAgo(date, locale)` — "2 giờ trước" or "2 hours ago"
- `generateSlug(title)` — "Laptop Dell XPS 15" → "laptop-dell-xps-15-k7x9m" (adds random suffix to avoid duplicates)

---

## 6. Dynamic Theming System

> **This is the most complex feature.** Read this section carefully.

### How it works (the big picture)
```
Admin opens Theme Panel → picks Layout + Scale + Color Scheme → clicks Save
    │
    ▼
updateSiteConfig() server action updates the SiteConfig table in MariaDB
    │
    ▼
revalidatePath('/') tells Next.js to re-render the root layout
    │
    ▼
Root layout calls getThemeStyles() which reads SiteConfig from DB
    │
    ▼
getThemeStyles() looks up the matching preset objects from theme-tokens.ts
    │
    ▼
Generates a CSS string with all the variables: ":root { --color-primary: #FF4500; ... }"
    │
    ▼
Injects into <head> as a <style> tag
    │
    ▼
ALL components use var(--color-primary), var(--card-padding), etc.
    │
    ▼
Website instantly looks different. Same HTML, different CSS variables.
```

### The three dimensions of theming

**Dimension 1: LAYOUT** (5 presets)
Controls the structural appearance — card shape, grid vs list, sidebar visibility.

| Preset | What it looks like |
|---|---|
| `modern` | Rounded cards, subtle shadows, glassmorphism nav, list view, sidebar |
| `minimalist` | No shadows, thin borders, compact, narrow max-width, no rounded corners |
| `mydealz` | Classic deal list (image left, content right), colored nav bar, sidebar |
| `aliexpress` | 4-column GRID of product cards (image on top), NO sidebar, square images |
| `shopee` | 5-column dense grid, tiny cards, small rounded corners, colored nav |

Each preset is a JavaScript object with ~20 CSS variable values:
```ts
modern: {
  '--card-border-radius': '1rem',       // rounded corners
  '--card-shadow': '0 1px 3px ...',     // subtle shadow
  '--card-direction': 'row',            // horizontal layout (image left, text right)
  '--grid-columns': '1',               // single column list
  '--sidebar-display': 'block',         // sidebar visible
  '--content-max-width': '1200px',
  // ... etc
}
aliexpress: {
  '--card-direction': 'column',         // vertical layout (image top, text bottom)
  '--grid-columns': '4',               // 4 products per row
  '--sidebar-display': 'none',          // no sidebar
  '--content-max-width': '1400px',
  // ... etc
}
```

**Dimension 2: SCALE** (5 levels)
Controls sizes — fonts, padding, button heights, avatar sizes.

| Scale | Base font | Card padding | Feels like |
|---|---|---|---|
| `xs` | 12px | 0.5rem | Very compact, information-dense |
| `sm` | 13px | 0.625rem | Compact |
| `md` | 14px | 0.75rem | **Default** — balanced |
| `lg` | 16px | 1rem | Comfortable, spacious |
| `xl` | 18px | 1.25rem | Large, accessibility-friendly |

**Dimension 3: COLOR SCHEME** (12 presets, each with light + dark mode)

| Scheme | Colors | When to use |
|---|---|---|
| `default` | Red-orange + gold | Default VNDealz brand |
| `dark-orange` | Deep orange + amber | Alternative warm look |
| `ocean` | Blue + cyan | Cool, professional |
| `forest` | Green + brown | Natural, earthy |
| `sunset` | Pink + orange | Warm, playful |
| `midnight` | Catppuccin-inspired purple/blue | Dark-mode lovers |
| `rose` | Pink + red | Feminine, Valentine's |
| `monochrome` | Black + white + gray | Minimal |
| `tet` 🧧 | Red + gold | **Tết Nguyên Đán** (Lunar New Year) |
| `christmas` 🎄 | Red + green + gold | **Giáng Sinh** (Christmas) |
| `mid-autumn` 🏮 | Orange + warm yellow | **Tết Trung Thu** (Mid-Autumn Festival) |
| `national-day` 🇻🇳 | Red + gold star | **Quốc Khánh 2/9** (National Day) |

Each color scheme defines TWO sets of colors (light mode + dark mode) with these variables:
```
--color-bg          (page background)
--color-surface     (card/panel background)
--color-primary     (buttons, links, nav)
--color-primary-hover
--color-primary-text (text ON primary-colored buttons)
--color-secondary
--color-accent
--color-text        (main body text)
--color-text-muted  (secondary/help text)
--color-border      (borders, dividers)
--color-hot         (hot vote / fire emoji)
--color-cold        (cold vote / ice emoji)
--color-success     (approve, success messages)
--color-danger      (reject, error messages)
--color-sponsored   (sponsored deal badge)
```

### ⚠️ CRITICAL RULE for all components

**NEVER hardcode colors or sizes in components.** Always use CSS variables.

```tsx
// ❌ WRONG — this ignores the theme
<div className="bg-white text-gray-900 p-4 rounded-lg text-sm">

// ✅ CORRECT — this respects the theme
<div className="bg-[var(--color-surface)] text-[var(--color-text)] p-[var(--card-padding)] rounded-[var(--border-radius-lg)] text-[length:var(--font-size-sm)]">
```

> Yes, the CSS variable syntax in Tailwind is verbose. But this is what makes the theme system work. When admin switches from "Modern" to "Shopee" layout, every component automatically adapts because the CSS variables change.

### Files to create (code the complex parts)

**`src/components/theme/theme-tokens.ts`** — Contains ALL preset definitions as exported objects. This is the "database" of all theme options. ~300 lines. **Code this fully** — see the detailed preset tables above. Every CSS variable for every preset.

**`src/components/theme/theme-provider.tsx`** — Server-side function that:
1. Reads `SiteConfig` from DB
2. Looks up layout preset, scale preset, and color scheme from `theme-tokens.ts`
3. Merges all CSS variables into one string
4. Returns a CSS string like `:root { --color-primary: #FF4500; --card-padding: 0.75rem; ... } .dark { --color-primary: #FF5722; ... }`
5. Appends any `customCss` from the SiteConfig row

**`src/app/layout.tsx`** — Root layout calls `getThemeStyles()` and injects it:
```tsx
<head>
  <style dangerouslySetInnerHTML={{ __html: await getThemeStyles() }} />
</head>
```

**`src/app/globals.css`** — Base styles using CSS variables:
- `body { background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-base); }`
- Utility classes for common patterns: `.deal-card`, `.deal-grid`, `.site-nav`, `.site-sidebar`, `.site-content`

**`src/components/admin/theme-panel.tsx`** — Client component with:
- Layout selector: 5 clickable cards with name + description, highlighted when selected
- Scale selector: 5 buttons in a row (XS S M L XL)
- Color scheme selector: 12 cards with name + color preview dots (4 small circles showing primary/secondary/accent/bg)
- Custom CSS textarea (for advanced admin overrides)
- Save button → calls `updateSiteConfig()` server action

**`src/server/actions/theme.ts`** — Two server actions:
- `getSiteConfig()` — reads the SiteConfig row
- `updateSiteConfig(data)` — validates with `themeSchema`, updates DB, calls `revalidatePath('/', 'layout')` to refresh all pages

---

## 7. Internationalization (i18n)

### How it works
```
User visits vndealz.com → redirected to /vi/ (default)
User clicks 🇬🇧 → redirected to /en/ (same page, English text)
URL structure: /vi/deal/laptop-dell → /en/deal/laptop-dell
```

### Setup files (follow next-intl docs)
1. `src/i18n/routing.ts` — defines `locales: ['vi', 'en']` and `defaultLocale: 'vi'`
2. `src/i18n/request.ts` — loads the right JSON message file based on locale
3. `src/i18n/navigation.ts` — creates localized `Link`, `useRouter`, `usePathname`, `redirect`
4. `next.config.ts` — wrap with `createNextIntlPlugin`
5. `src/app/[locale]/layout.tsx` — wraps children in `<NextIntlClientProvider>`

### Translation files structure
`src/messages/vi.json` and `src/messages/en.json` with these key groups:
- `nav.*` — navigation items (Trang chủ, Deals, Mã giảm giá, etc.)
- `deal.*` — deal-related (Nóng nhất, Mới nhất, Hết hạn, Xem deal, etc.)
- `auth.*` — auth forms (Đăng nhập, Email, Mật khẩu, etc.)
- `admin.*` — admin panel (Bảng điều khiển, Kiểm duyệt, Duyệt, Từ chối, etc.)
- `common.*` — shared (Lưu, Hủy, Xóa, Đang tải, Tài trợ, etc.)
- `categories.*` — category names (duplicated from DB for static UI like pills)

### Using translations in components
```tsx
// Server component:
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('deal')
<h1>{t('hot')}</h1>  // → "Nóng nhất" or "Hottest"

// Client component:
import { useTranslations } from 'next-intl'
const t = useTranslations('nav')
<button>{t('login')}</button>  // → "Đăng nhập" or "Login"
```

### Language switch component
A button in the navbar that toggles between 🇻🇳 and 🇬🇧. On click, it navigates to the same path but with the other locale prefix.

---

## 8. Authentication

### Flow
```
User clicks "Đăng nhập" → Auth page with 3 options:
  1. "Đăng nhập bằng Google" → Google OAuth flow → callback → session created
  2. "Đăng nhập bằng Facebook" → Facebook OAuth flow → callback → session created
  3. Email + password form → Better Auth validates → session created

Session stored in DB (Session table) + cookie.
On every request, middleware/layout checks session for protected routes.
```

### Implementation
- **Login page** (`dang-nhap/page.tsx`): Two OAuth buttons (Google, Facebook) + email/password form
- **Register page** (`dang-ky/page.tsx`): Username + email + password form + OAuth buttons
- **Auth client**: Use `authClient.signIn.social({ provider: 'google' })` for OAuth, `authClient.signIn.email({ email, password })` for email
- **Protected routes**: In admin layout, check session role. If not ADMIN/MODERATOR, redirect.
- **User menu**: Avatar dropdown in navbar with profile link, settings, logout

> ⚠️ **GOTCHA**: For Google/Facebook OAuth to work locally, set callback URL to `http://localhost:3000/api/auth/callback/google` (and facebook) in their developer consoles.

---

## 9. Hierarchical Categories

### The problem
We need categories like:
```
Điện tử & Công nghệ
├── Máy tính
│   ├── Laptop
│   │   ├── Laptop Gaming
│   │   └── Laptop Văn phòng
│   └── PC để bàn
├── Điện thoại
│   ├── iPhone
│   └── Android
└── Phụ kiện
```

And admins should be able to add/edit/delete/reorder/move these at any time.

### How it's stored in the database
Single `Category` table with `parentId` pointing to its parent. `depth` field caches the nesting level. `order` field for sorting within siblings.

### Server actions needed (`src/server/actions/category.ts`)

**`getCategoryTree()`** — returns all categories as a nested tree structure:
1. Fetch ALL categories from DB ordered by depth, then order
2. Build a Map of id → node (with empty `children` array)
3. Loop through all categories: if it has a parentId, push it into parent's children array. If no parent, it's a root.
4. Return roots array (each root has .children recursively)

**`getCategoryWithDescendants(slug)`** — given a category slug, returns an array of ALL category IDs including itself and ALL descendants at any depth. Used when filtering deals: viewing "Điện tử" should show deals in Máy tính, Laptop, etc.

**`getCategoryBreadcrumb(slug)`** — walks UP the tree from leaf to root, returns path array. Used for breadcrumb navigation: Home > Điện tử > Máy tính > Laptop

**`createCategory(input)`** — creates a new category. Calculates `depth` from parent's depth + 1. Only ADMIN/MODERATOR can call this.

**`moveCategory(id, newParentId)`** — moves a category to a new parent. Must:
1. Check for circular reference (can't move A under its own descendant)
2. Update parentId and depth
3. Recursively update depth of ALL descendants

**`deleteCategory(id)`** — deletes a category. Rules:
1. Cannot delete if it has children (must delete/move children first)
2. Moves all deals in this category to parent category (or "Khác" if no parent)

**`reorderCategories(updates)`** — takes array of `{id, order}` pairs and batch-updates. Called after drag-and-drop.

### Category browsing route
`/danh-muc/[...slug]` is a catch-all route. The slug array contains the path:
- `/vi/danh-muc/dien-tu` → slug = `['dien-tu']`
- `/vi/danh-muc/dien-tu/may-tinh/laptop` → slug = `['dien-tu', 'may-tinh', 'laptop']`

The page takes the LAST slug segment, gets its descendants, and shows all deals in those categories.

### Admin category manager
`category-tree-manager.tsx` — client component:
- Renders the tree recursively with indentation based on depth
- Each node shows: drag handle | expand/collapse arrow | icon | Vietnamese name (English name) | /slug | edit/delete/add-child buttons
- Uses `@dnd-kit` for drag-and-drop reordering
- Dialog popup for add/edit with inputs: nameVi, nameEn, slug, icon
- Calls server actions on every change

---

## 10. Deal System

### Deal card — what to show
```
┌──────────────────────────────────────────────────────────────┐
│ ┌──────────┐                                                 │
│ │          │  Laptop Dell XPS 15 - Giảm 30%                  │
│ │  IMAGE   │  ₫25.990.000  ₫̶3̶7̶.̶0̶0̶0̶.̶0̶0̶0̶                     │
│ │ (200×150)│  Shopee · Điện tử > Laptop · 2 giờ trước        │
│ │          │  💬 24 bình luận                                 │
│ └──────────┘  [🔥 +1]  156°  [-1 ❄️]        [Tài trợ]       │
└──────────────────────────────────────────────────────────────┘
```

In grid layouts (aliexpress/shopee), the card is vertical:
```
┌────────────────┐
│    IMAGE       │
│   (square)     │
├────────────────┤
│ Product Title  │
│ ₫25.990.000    │
│ 156° · 💬24    │
└────────────────┘
```

Both layouts use the SAME `deal-card.tsx` component. The CSS variable `--card-direction` switches between `row` (horizontal) and `column` (vertical).

### Deal detail page
Shows: full image, title, price + compare price, coupon code (copy button), merchant link (affiliate-rewritten), description (markdown or plain text), category breadcrumb, author info, vote buttons, comment thread.

### Deal submission form
Fields: URL, title, price, compare price (optional), coupon code (optional), merchant name, category (nested dropdown/select), type (Deal/Voucher/Freebie/Discussion), image upload, description (textarea), expiry date (optional).

Validation: use `dealSchema` from Zod. Check for duplicate URL before saving.

On submit: calls `createDeal()` server action → status = PENDING → shows success message "Deal đã được gửi và đang chờ kiểm duyệt".

### Temperature voting
- Two buttons: 🔥 (+1) and ❄️ (-1)
- Temperature number displayed between them
- Color: red if positive, blue if negative, gray if zero
- Uses `useTransition()` for loading state and `useOptimistic()` for instant visual feedback
- Calls `voteDeal(dealId, value)` server action
- Server recalculates temperature using weighted formula (see lib/temperature.ts)

### Server actions (`src/server/actions/deal.ts`)
- `createDeal(formData)` — validates, checks duplicate URL, creates with status PENDING
- `voteDeal(dealId, value)` — upserts vote, recalculates temperature, awards points if deal reaches 100°
- `getDeals(opts)` — fetches active deals with sorting (hot/new/trending), filtering by type/category, pagination. When filtering by category, includes all descendant categories.
- `expireDeal(dealId)` — marks as EXPIRED (only author, mod, or admin)

---

## 11. Moderation System

### Every deal goes through moderation
```
┌────────────┐     ┌──────────────────┐     ┌──────────────┐
│ User posts │────→│ PENDING (hidden) │────→│ Mod reviews  │
│ a deal     │     │ in mod queue     │     │ in /admin/   │
└────────────┘     └──────────────────┘     │ moderation   │
                                            └──────┬───────┘
                                              │         │
                                         APPROVE    REJECT
                                              │         │
                                              ▼         ▼
                                         ACTIVE    REJECTED
                                        (public)   (hidden)
```

### Admin moderation page (`/admin/moderation`)
- Lists all deals with `status = "PENDING"` ordered by creation date
- Each pending deal shows: title, URL (clickable), author username, category, description preview
- Two action buttons: ✅ Approve (sets status to ACTIVE) and ❌ Reject (sets status to REJECTED)
- After action, the deal disappears from the queue
- Badge in admin sidebar shows pending count: "Kiểm duyệt (5)"

### User-facing feedback
- After submitting: toast "Deal đã được gửi và đang chờ kiểm duyệt"
- In user's profile/settings: section showing their pending deals with ⏳ badge
- If rejected: notification or visual indicator (optional, Phase 2)

---

## 12. Comment System

### Structure
- Threaded/nested comments (reply to a comment creates a child)
- Each comment shows: avatar, username, tier badge, content, time ago, helpful count, reply button
- "Helpful ✓" reaction button — toggles on/off. When a comment gets 3+ helpful reactions, the author earns 10 points.
- Reply button toggles an inline comment form below the comment.

### Server actions (`src/server/actions/comment.ts`)
- `createComment(input)` — creates comment with userId, dealId, optional parentId
- `reactToComment(commentId)` — toggles helpful reaction (create or delete). Updates helpfulCount. Awards points at threshold.
- `deleteComment(commentId)` — soft delete (only author or mod)

### Rendering
`comment-thread.tsx` is recursive:
```tsx
function CommentNode({ comment }) {
  return (
    <div style={{ marginLeft: `${depth * 24}px` }}>
      <CommentContent comment={comment} />
      <ReactionButton commentId={comment.id} count={comment.helpfulCount} />
      <ReplyButton />
      {showReplyForm && <CommentForm parentId={comment.id} />}
      {comment.replies.map(reply => <CommentNode comment={reply} />)}
    </div>
  )
}
```

---

## 13. User System

### User profile page (`/ho-so/[username]`)
Shows: avatar, display name, username, bio, member since date, tier badge (Đồng/Bạc/Vàng/Kim Cương), points, deal count, comment count, list of their active deals.

### User settings page (`/cai-dat`)
Edit: display name, bio, avatar (upload), preferred language. Password change. Email change.

### Bookmarks
Heart/bookmark icon on each deal card. Toggle calls `toggleBookmark(dealId)` server action. Bookmarked deals viewable in user settings or profile.

### Points and tiers
- 10 points when your deal reaches 100° temperature
- 10 points when your comment gets 3+ helpful reactions
- Tiers: Đồng (0), Bạc (10+), Vàng (30+), Kim Cương (300+)
- Tier badge shown next to username on comments and deal cards

---

## 14. Admin Panel

### Access control
Admin layout (`admin/layout.tsx`) checks session:
- If not logged in → redirect to login
- If logged in but role is not ADMIN or MODERATOR → redirect to homepage with error
- MODERATOR can: moderate deals, manage categories, manage reports
- ADMIN can: everything MODERATOR can + manage users + manage affiliates + manage ads + change theme

### Pages

| Page | What it shows | Key actions |
|---|---|---|
| `/admin` (dashboard) | Stats cards: total deals, total users, pending moderation count, pending reports, active ads | — |
| `/admin/moderation` | Pending deals queue | Approve, Reject |
| `/admin/deals` | All deals (any status) with search/filter | Edit, Delete, Feature, Expire |
| `/admin/users` | All users with role badges | Ban, promote to Mod, demote |
| `/admin/reports` | Pending reports | View reported content, Resolve, Dismiss |
| `/admin/categories` | Category tree manager | Add, Edit, Delete, Reorder (drag-drop), Move |
| `/admin/theme` | Theme control panel | Switch layout, scale, colors. Save applies globally. |
| `/admin/affiliates` | Affiliate configs table | Add/edit merchant + affiliate tag + URL pattern |
| `/admin/ads` | Ad placements table | Add/edit ads for sidebar, in-feed, deal-detail slots |

### Reusable admin components
- `data-table.tsx` — Generic table component with column sorting, text filter, pagination. Used for deals, users, reports, affiliates, ads.
- `stats-cards.tsx` — Grid of stat cards. Each card: icon, label, number. Fetched via `getDashboardStats()`.

---

## 15. Monetization

### 1. Affiliate links
- `AffiliateConfig` table: one row per merchant (e.g., Shopee, Lazada, Tiki)
- Each row has: merchant name, affiliate tag (e.g., `ref=vndealz`), URL pattern (regex to match)
- When a deal card renders the "Go to deal" button, the server rewrites the URL using `rewriteAffiliateUrl()`
- Admin manages configs in `/admin/affiliates`

### 2. Sponsored deals
- Deals with `sponsored = true` get a "Tài trợ" badge and can be pinned to top positions
- Admin can toggle `sponsored` flag on any deal from `/admin/deals`

### 3. Ad placements
- Three ad slots: `sidebar` (right sidebar banner), `in-feed` (between every 5th deal), `deal-detail` (on deal detail page)
- `AdPlacement` table: slot, image URL, target URL, impression/click counters, start/end dates
- `ad-banner.tsx` server component: queries DB for active ad matching the slot, renders image+link
- Tracks impressions (on render) and clicks (on click) via server actions
- Admin manages ads in `/admin/ads`

---

## 16. Component Guide

### How components connect to the theme system

Every component MUST follow these patterns:

**Backgrounds**: `bg-[var(--color-surface)]` for cards, `bg-[var(--color-bg)]` for page bg
**Text**: `text-[var(--color-text)]` for body, `text-[var(--color-text-muted)]` for secondary
**Buttons**: `bg-[var(--color-primary)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-hover)]`
**Font sizes**: `text-[length:var(--font-size-sm)]`, `text-[length:var(--font-size-base)]`, etc.
**Spacing**: `p-[var(--card-padding)]`, `gap-[var(--card-gap)]`, `mb-[var(--section-gap)]`
**Borders**: `rounded-[var(--border-radius-md)]`, `border-[var(--color-border)]`

> ⚠️ **Tailwind CSS variable syntax**: For font sizes, you MUST use `text-[length:var(--font-size-base)]` (with `length:` prefix). Without it, Tailwind treats it as a color. This is a Tailwind v4 quirk.

### Key component behaviors

**`deal-card.tsx`**
- Has TWO display modes controlled by CSS: horizontal (list) and vertical (grid)
- The CSS variable `--card-direction` determines this: `row` = horizontal, `column` = vertical
- The `.deal-card` and `.deal-card-image` CSS classes handle both modes
- Expired deals: add `opacity-60 grayscale` CSS
- Sponsored deals: show `<SponsoredBadge />`

**`deal-feed.tsx`**
- Server component with Tabs (Hot / New / Trending)
- Each tab is a link that adds `?sort=hot` to the URL
- Reads `searchParams` to know which tab is active
- Calls `getDeals({ sort })` and passes to `<DealList />`
- `<DealList />` wraps deals in a `<div className="deal-grid">` (grid columns controlled by theme)
- Inserts `<AdBanner slot="in-feed" />` between every 5th deal

**`temperature-vote.tsx`**
- Client component (needs onClick handlers)
- Uses `useTransition()` for loading state
- Uses `useOptimistic()` to show vote result instantly before server responds
- Two icon buttons + temperature number between them

**`category-tree-nav.tsx`**
- Server component in sidebar
- Calls `getCategoryTree()` to get nested tree
- Renders recursively with expanding/collapsing (using `<details>` or state)
- Each node links to `/danh-muc/full/path/of/slugs`

**`navbar.tsx`**
- Sticky top (controlled by `--nav-style`)
- Contents: Logo | SearchBar (Cmd+K) | CategoryPills (horizontal scroll of root categories) | LanguageSwitch | Auth (login button or user avatar dropdown)
- Mobile: hamburger → Sheet (slide-in drawer)

**`sidebar.tsx`**
- Hidden when `--sidebar-display: none` (aliexpress layout)
- Shows: Trending deals (top 5 by temperature), Ad slot, Category tree nav
- Desktop only — hidden on mobile via `hidden lg:block`

---

## 17. Pages & Routing

### URL structure
All pages are under `[locale]` route:
```
/vi/                            → Homepage (deal feed)
/vi/deal/laptop-dell-xps-k7x9m → Deal detail
/vi/ma-giam-gia                → Voucher codes (deals with type=VOUCHER)
/vi/mien-phi                   → Freebies (deals with type=FREEBIE)
/vi/thao-luan                  → Discussions (deals with type=DISCUSSION)
/vi/danh-muc/dien-tu           → Category: Electronics (all descendants)
/vi/danh-muc/dien-tu/laptop    → Category: Electronics > Laptop
/vi/tim-kiem?q=dell&category=laptop → Search results
/vi/dang-deal                  → Submit new deal form (auth required)
/vi/ho-so/johndoe              → User profile
/vi/cai-dat                    → User settings (auth required)
/vi/dang-nhap                  → Login
/vi/dang-ky                    → Register
/vi/admin                      → Admin dashboard (admin/mod only)
/vi/admin/moderation           → Moderation queue
/vi/admin/categories           → Category tree manager
/vi/admin/theme                → Theme control panel
... etc
```

### Route groups explained
```
app/[locale]/
├── (auth)/          ← NO navbar, NO sidebar. Just a centered card.
│   ├── layout.tsx   ← Simple centered layout
│   ├── dang-nhap/   ← Login
│   └── dang-ky/     ← Register
├── (main)/          ← HAS navbar + sidebar + footer
│   ├── layout.tsx   ← Full layout with nav, sidebar, main content area
│   ├── page.tsx     ← Homepage
│   └── deal/[slug]/ ← Deal detail
└── admin/           ← HAS admin sidebar (different from main sidebar)
    ├── layout.tsx   ← Admin layout with admin sidebar + content area
    └── page.tsx     ← Dashboard
```

The parentheses `(auth)` and `(main)` create route groups — they affect layout but don't add to the URL path.

---

## 18. Deployment

### Build
```bash
npm run build
```

### PM2 config (`ecosystem.config.js` in project root)
```js
module.exports = {
  apps: [{
    name: 'vndealz',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/opt/vndealz',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'mysql://nguyen:Digimon3%23@192.168.1.105:3306/vndealz',
      // ... all other env vars
    }
  }]
}
```

### Deploy script
```bash
ssh user@192.168.1.106
cd /opt/vndealz
git pull origin main
npm ci                      # Clean install (faster than npm install)
npx prisma db push          # Apply any schema changes
npx prisma generate         # Regenerate types
npm run build               # Build production bundle
pm2 restart vndealz         # Restart the app
```

### nginx reverse proxy
```nginx
server {
    listen 80;
    server_name vndealz.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then set up Cloudflare tunnel pointing to this nginx server.

---

## 19. Build Order Checklist

Follow this exact order. Each step depends on previous ones.

### Phase A: Foundation
- [ ] **A1** — Create Next.js project, install all dependencies (Step 3.1–3.2)
- [ ] **A2** — Initialize shadcn, add all UI components (Step 3.3)
- [ ] **A3** — Initialize Prisma, configure .env (Step 3.4–3.5)
- [ ] **A4** — Create ALL folders and empty files (Step 3.6)
- [ ] **A5** — Write Prisma schema (Step 4)
- [ ] **A6** — Push schema to MariaDB: `npx prisma db push && npx prisma generate`
- [ ] **A7** — Write and run seed script: `npx tsx prisma/seed.ts`
- [ ] **A8** — Write core libs: db.ts, utils.ts, validations.ts, temperature.ts, affiliate.ts (Step 5)

### Phase B: Theme System (do this EARLY — all components depend on it)
- [ ] **B1** — Write `theme-tokens.ts` with ALL presets (5 layouts, 5 scales, 12 color schemes)
- [ ] **B2** — Write `theme-provider.tsx` (reads DB → generates CSS string)
- [ ] **B3** — Write `globals.css` with CSS variable base styles + utility classes
- [ ] **B4** — Write root `layout.tsx` that injects theme CSS
- [ ] **B5** — Test: change SiteConfig row manually in DB, refresh page, verify CSS changes

### Phase C: Auth + i18n
- [ ] **C1** — Write auth.ts, auth-client.ts, auth API route (Step 8)
- [ ] **C2** — Set up i18n: routing.ts, request.ts, navigation.ts, next.config.ts (Step 7)
- [ ] **C3** — Write vi.json and en.json translation files
- [ ] **C4** — Write `[locale]/layout.tsx` with NextIntlClientProvider

### Phase D: Layout Components
- [ ] **D1** — `navbar.tsx` — logo, search bar, category pills, lang switch, auth buttons
- [ ] **D2** — `sidebar.tsx` — trending deals, ad slot, category tree nav
- [ ] **D3** — `footer.tsx`
- [ ] **D4** — `mobile-nav.tsx` — bottom tabs for mobile
- [ ] **D5** — `language-switch.tsx` — 🇻🇳/🇬🇧 toggle
- [ ] **D6** — `(main)/layout.tsx` — assembles navbar + sidebar + main content
- [ ] **D7** — `(auth)/layout.tsx` — centered card layout

### Phase E: Category System
- [ ] **E1** — Write `server/actions/category.ts` (all functions)
- [ ] **E2** — `category-tree-nav.tsx` — sidebar tree navigation
- [ ] **E3** — `category-breadcrumb.tsx` — breadcrumb navigation
- [ ] **E4** — `category-pills.tsx` — horizontal scroll chips (top nav)
- [ ] **E5** — `danh-muc/[...slug]/page.tsx` — category page

### Phase F: Deal System
- [ ] **F1** — Write `server/actions/deal.ts` (createDeal, voteDeal, getDeals, expireDeal)
- [ ] **F2** — `temperature-vote.tsx` — vote buttons + temperature display
- [ ] **F3** — `deal-card.tsx` — single deal card (uses CSS var classes!)
- [ ] **F4** — `deal-list.tsx` — maps deals → DealCard
- [ ] **F5** — `deal-feed.tsx` — tabs + DealList + pagination
- [ ] **F6** — `deal-detail.tsx` — full deal view
- [ ] **F7** — `deal-form.tsx` — submission form
- [ ] **F8** — Homepage `(main)/page.tsx` — renders DealFeed
- [ ] **F9** — Deal detail page `deal/[slug]/page.tsx`
- [ ] **F10** — Submit page `dang-deal/page.tsx`
- [ ] **F11** — Voucher page `ma-giam-gia/page.tsx` (DealFeed with type=VOUCHER filter)
- [ ] **F12** — Freebie page `mien-phi/page.tsx` (DealFeed with type=FREEBIE filter)
- [ ] **F13** — Discussion page `thao-luan/page.tsx` (DealFeed with type=DISCUSSION filter)

### Phase G: Comments
- [ ] **G1** — Write `server/actions/comment.ts`
- [ ] **G2** — `comment-form.tsx`
- [ ] **G3** — `reaction-button.tsx`
- [ ] **G4** — `comment-thread.tsx` (recursive)
- [ ] **G5** — Integrate into deal detail page

### Phase H: Search + User
- [ ] **H1** — Write `server/actions/search.ts`
- [ ] **H2** — `search-bar.tsx` with Cmd+K shortcut
- [ ] **H3** — Search results page `tim-kiem/page.tsx`
- [ ] **H4** — Write `server/actions/user.ts`
- [ ] **H5** — User profile page `ho-so/[username]/page.tsx`
- [ ] **H6** — User settings page `cai-dat/page.tsx`
- [ ] **H7** — Auth pages: login `dang-nhap/page.tsx`, register `dang-ky/page.tsx`

### Phase I: Admin Panel
- [ ] **I1** — `admin/layout.tsx` — admin sidebar + auth check
- [ ] **I2** — `admin-sidebar.tsx` — nav links with pending count badges
- [ ] **I3** — `data-table.tsx` — reusable table component
- [ ] **I4** — Write `server/actions/admin.ts` (stats, moderate, ban, affiliates, ads)
- [ ] **I5** — Dashboard `admin/page.tsx` with stats-cards
- [ ] **I6** — Moderation queue `admin/moderation/page.tsx`
- [ ] **I7** — Category tree manager `admin/categories/page.tsx` + `category-tree-manager.tsx`
- [ ] **I8** — Write `server/actions/theme.ts`
- [ ] **I9** — Theme panel `admin/theme/page.tsx` + `theme-panel.tsx`
- [ ] **I10** — Users management `admin/users/page.tsx`
- [ ] **I11** — Reports `admin/reports/page.tsx` + `server/actions/report.ts`
- [ ] **I12** — Affiliates `admin/affiliates/page.tsx`
- [ ] **I13** — Ads `admin/ads/page.tsx` + `ad-banner.tsx` + `sponsored-badge.tsx`

### Phase J: Polish + Deploy
- [ ] **J1** — Dark mode toggle (class on `<html>`)
- [ ] **J2** — Mobile responsiveness pass on all pages
- [ ] **J3** — Empty states for no results
- [ ] **J4** — Loading skeletons
- [ ] **J5** — Error boundaries
- [ ] **J6** — SEO: meta tags, OpenGraph images, structured data
- [ ] **J7** — Test full flow: register → submit deal → moderate → vote → comment
- [ ] **J8** — Test theme switching: all 5 layouts × a few colors
- [ ] **J9** — Test category tree: add/edit/delete/move/reorder
- [ ] **J10** — Write ecosystem.config.js, nginx config
- [ ] **J11** — Deploy to 192.168.1.106
- [ ] **J12** — Set up Cloudflare tunnel

---

*Generated: July 8, 2026. Keep this file as the single source of truth for the VNDealz project.*
