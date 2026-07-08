# VNDealz — Junior Developer Task List

> **How to use this file**: Work through tasks top-to-bottom. Each `[ ]` is a task. Mark `[x]` when done. Check PLAN.md for detailed instructions on each task. Every file already exists as a skeleton with TODO comments — your job is to fill them in.
>
> **Important rules**:
> - NEVER hardcode colors/sizes. Always use CSS vars: `var(--color-primary)`, `var(--font-size-base)`, etc.
> - Use `backdrop-filter` ONLY, never `-webkit-backdrop-filter` (Chrome conflict)
> - Use glass effects (`.glass`, `.glass-subtle`, `.glass-strong` classes) where indicated
> - All deals start as PENDING — public feed shows only ACTIVE deals
> - Read the TODO comments in each file before implementing

---

## ✅ Already Done (by senior dev)
- [x] Project initialized (Next.js 16 + TypeScript + Tailwind + App Router)
- [x] All dependencies installed
- [x] Directory structure created (82 source files)
- [x] Prisma schema written (`prisma/schema.prisma`)
- [x] Seed script written (`prisma/seed.ts`)
- [x] `.env` configured (DB, auth secrets)
- [x] Core libs: `db.ts`, `utils.ts`, `validations.ts`, `temperature.ts`, `affiliate.ts`
- [x] Theme system: `theme-tokens.ts` (all 5 layouts × 5 scales × 12 color schemes)
- [x] Theme provider: `theme-provider.tsx` (CSS generator with glass effects + animations)
- [x] `globals.css` with CSS variable base styles
- [x] Root layout with theme CSS injection
- [x] i18n: `routing.ts`, `request.ts`, `navigation.ts`, `proxy.ts` (locale routing)
- [x] Translation files: `vi.json`, `en.json`
- [x] Locale layout with NextIntlClientProvider
- [x] Route group layouts: `(main)`, `(auth)`, `admin`
- [x] Category server actions (fully implemented — tree, breadcrumb, CRUD)
- [x] Theme server actions (fully implemented — getSiteConfig, updateSiteConfig)
- [x] Zustand store (`app-store.ts` — sidebar, dark mode)
- [x] PM2 ecosystem config
- [x] `next.config.ts` with next-intl plugin
- [x] Navbar, Sidebar, Footer, MobileNav skeletons
- [x] DealCard skeleton with stagger animation + typed props
- [x] DealList with grid wrapper
- [x] TemperatureVote skeleton with hot/cold styling
- [x] All page stubs with TODO instructions
- [x] All server action stubs with function signatures

---

## Phase 1 — Database Setup
- [ ] **1.1** Push schema to MariaDB: `npx prisma db push`
- [ ] **1.2** Generate Prisma client: `npx prisma generate`
- [ ] **1.3** Run seed: `npx tsx prisma/seed.ts`
- [ ] **1.4** Verify in Prisma Studio: `npx prisma studio` → check categories, SiteConfig, admin user

## Phase 2 — shadcn/ui Components
- [ ] **2.1** Init shadcn: `npx shadcn@latest init -b base`
- [ ] **2.2** Add all components:
```bash
npx shadcn@latest add button card input textarea select \
  dialog dropdown-menu avatar badge tabs sonner table \
  sheet separator skeleton switch label popover command \
  accordion tooltip slider radio-group
```

## Phase 3 — Auth Setup
- [ ] **3.1** `src/lib/auth.ts` — Uncomment and configure Better Auth with prismaAdapter, Google OAuth, Facebook OAuth, email/password. See PLAN.md Step 8.
- [ ] **3.2** `src/lib/auth-client.ts` — Uncomment createAuthClient
- [ ] **3.3** `src/app/api/auth/[...all]/route.ts` — Uncomment the handler
- [ ] **3.4** `src/hooks/use-auth.ts` — Use authClient.useSession()
- [ ] **3.5** Set up Google OAuth credentials (console.cloud.google.com) → update .env
- [ ] **3.6** Set up Facebook OAuth credentials (developers.facebook.com) → update .env
- [ ] **3.7** Test: `npm run dev`, visit /vi/dang-nhap, try Google login

## Phase 4 — Layout Components (use glass effects!)
- [ ] **4.1** `navbar.tsx` — Add: logo, SearchBar, CategoryPills, LanguageSwitch, auth buttons/avatar dropdown. Use `.glass` class on nav. Hamburger menu on mobile → Sheet drawer.
- [ ] **4.2** `sidebar.tsx` — Add: trending deals (top 5), CategoryTreeNav, AdBanner slot, "Đăng deal" CTA. Use `.glass-subtle` for sections. Make sticky.
- [ ] **4.3** `footer.tsx` — Add: about/contact/privacy/terms links, social links, language switch, copyright. Use `.glass-subtle` background.
- [ ] **4.4** `mobile-nav.tsx` — Add: 5 tab icons (Home, Tag, +, Bell, User). Use `.glass-strong` background. Active tab uses `--color-primary`.
- [ ] **4.5** `language-switch.tsx` — Use `usePathname` + `useRouter` from `@/i18n/navigation` to toggle locale.
- [ ] **4.6** `search-bar.tsx` — Input with search icon, Cmd+K keyboard shortcut, navigate to `/tim-kiem?q=...`. Use glass styling.

## Phase 5 — Category Components
- [ ] **5.1** `category-breadcrumb.tsx` — Call `getCategoryBreadcrumb(slug)`, render as Links with ChevronRight separators
- [ ] **5.2** `category-tree-nav.tsx` — Call `getCategoryTree()`, render recursively with expanding/collapsing. Each node links to `/danh-muc/path/of/slugs`.
- [ ] **5.3** `category-pills.tsx` — Fetch root categories, render as horizontal scrollable chips. Active category highlighted.

## Phase 6 — Deal Server Actions
- [ ] **6.1** `server/actions/deal.ts` → `createDeal` — Validate with dealSchema, check duplicate URL, create with `status: 'PENDING'`, revalidate moderation page
- [ ] **6.2** `server/actions/deal.ts` → `voteDeal` — Upsert vote, recalculate temperature, award 10 points if deal reaches 100°
- [ ] **6.3** `server/actions/deal.ts` → `getDeals` — Query `WHERE status='ACTIVE'`, support sort/type/category filter, include category descendants via `getCategoryWithDescendants`
- [ ] **6.4** `server/actions/deal.ts` → `expireDeal` — Check ownership or mod role, set status to EXPIRED

## Phase 7 — Deal Components
- [ ] **7.1** `deal-card.tsx` — Fill in: merchant link, category name, bookmark button, TemperatureVote, SponsoredBadge. Link card to `/deal/[slug]`. Use `next/image` with `sizes` for the thumbnail.
- [ ] **7.2** `temperature-vote.tsx` — Wire up `useTransition` + `useOptimistic`, call `voteDeal` server action. Add glow animation on high temp. **Mobile:** Implement swipe-right for hot, swipe-left for cold using touch events.
- [ ] **7.3** `deal-feed.tsx` — Server component: read `searchParams.sort`, call `getDeals()`, render tabs (Hot/New/Trending) as Links, DealList, Pagination. Insert AdBanner every 5th deal.
- [ ] **7.4** `deal-form.tsx` — Form with all fields (url, title, price, comparePrice, couponCode, merchant, category select, type, image upload, description, expiresAt). Validate with dealSchema. Call createDeal. Show success toast.
- [ ] **7.5** `deal-detail.tsx` — Full deal view: large image, title, price, coupon copy button, affiliate link, description, category breadcrumb, author info, vote buttons.

## Phase 8 — Pages (main routes)
- [ ] **8.1** `(main)/page.tsx` — Homepage: render `<DealFeed />`
- [ ] **8.2** `deal/[slug]/page.tsx` — Fetch deal by slug, render DealDetail + CommentThread
- [ ] **8.3** `ma-giam-gia/page.tsx` — DealFeed with `type=VOUCHER` filter
- [ ] **8.4** `mien-phi/page.tsx` — DealFeed with `type=FREEBIE` filter
- [ ] **8.5** `thao-luan/page.tsx` — DealFeed with `type=DISCUSSION` filter
- [ ] **8.6** `danh-muc/[...slug]/page.tsx` — Get last slug, fetch breadcrumb + descendant deals, render CategoryBreadcrumb + DealList
- [ ] **8.7** `tim-kiem/page.tsx` — Read `searchParams.q`, call `searchDeals()`, render results
- [ ] **8.8** `dang-deal/page.tsx` — Check auth, render DealForm

## Phase 9 — Comment System
- [ ] **9.1** `server/actions/comment.ts` → `createComment` — Validate, create comment with userId, dealId, parentId
- [ ] **9.2** `server/actions/comment.ts` → `reactToComment` — Toggle HELPFUL reaction, update helpfulCount, award 10 points at 3+
- [ ] **9.3** `server/actions/comment.ts` → `deleteComment` — Check ownership or mod role
- [ ] **9.4** `comment-thread.tsx` — Fetch comments for deal, render recursively with depth indentation. Each: avatar, username, tier badge, content, timeAgo, helpful count, reply button.
- [ ] **9.5** `comment-form.tsx` — Textarea + submit button, validate with commentSchema, call createComment
- [ ] **9.6** `reaction-button.tsx` — Toggle helpful reaction, call reactToComment

## Phase 10 — Auth Pages
- [ ] **10.1** `dang-nhap/page.tsx` — Google OAuth button, Facebook OAuth button, email/password form. Use `authClient.signIn.social()` and `authClient.signIn.email()`. Glass card styling from auth layout.
- [ ] **10.2** `dang-ky/page.tsx` — Username + email + password + confirm password form + OAuth buttons. Use `authClient.signUp.email()`.

## Phase 11 — User System
- [ ] **11.1** `server/actions/user.ts` → `updateProfile` — Update name, bio, avatar, locale
- [ ] **11.2** `server/actions/user.ts` → `toggleBookmark` — Create or delete bookmark
- [ ] **11.3** `server/actions/user.ts` → `getUserProfile` — Fetch user with deal count, comment count
- [ ] **11.4** `ho-so/[username]/page.tsx` — Fetch user, show avatar, name, bio, tier badge, points, deals list
- [ ] **11.5** `cai-dat/page.tsx` — Edit name, bio, avatar upload, language preference, password change

## Phase 12 — Search
- [ ] **12.1** `server/actions/search.ts` → `searchDeals` — Use MariaDB FULLTEXT: `Prisma.$queryRaw` with `MATCH(title,description) AGAINST(? IN BOOLEAN MODE)`, only `status='ACTIVE'`
- [ ] **12.2** `tim-kiem/page.tsx` — Render search results, show query in heading

## Phase 13 — Admin Panel
- [ ] **13.1** `admin/layout.tsx` — Add auth check: redirect if not ADMIN/MODERATOR
- [ ] **13.2** `admin-sidebar.tsx` — Nav links with icons (lucide-react), pending moderation count badge
- [ ] **13.3** `data-table.tsx` — Generic table: accept columns + data, column sorting, text filter, pagination
- [ ] **13.4** `server/actions/admin.ts` → `getDashboardStats` — Count deals, users, pending, reports, ads
- [ ] **13.5** `server/actions/admin.ts` → `moderateDeal` — Set status ACTIVE/REJECTED, set moderatedBy/moderatedAt
- [ ] **13.6** `server/actions/admin.ts` → `getPendingDeals` — Fetch WHERE status='PENDING'
- [ ] **13.7** `server/actions/admin.ts` → `banUser`, `promoteUser` — Update user role
- [ ] **13.8** `admin/page.tsx` — Dashboard: render StatsCards
- [ ] **13.9** `admin/moderation/page.tsx` — Render ModerationQueue with approve/reject
- [ ] **13.10** `moderation-queue.tsx` — List pending deals, approve/reject buttons calling moderateDeal
- [ ] **13.11** `admin/categories/page.tsx` — Render CategoryTreeManager
- [ ] **13.12** `category-tree-manager.tsx` — Full drag-drop tree with @dnd-kit. See PLAN.md Step 9.
- [ ] **13.13** `admin/theme/page.tsx` — Render ThemePanel
- [ ] **13.14** `theme-panel.tsx` — Layout/scale/color pickers with preview. See PLAN.md Step 6.
- [ ] **13.15** `admin/deals/page.tsx` — DataTable with all deals
- [ ] **13.16** `admin/users/page.tsx` — DataTable with all users
- [ ] **13.17** `admin/reports/page.tsx` — DataTable with reports + resolve/dismiss
- [ ] **13.18** `server/actions/report.ts` → Implement createReport, resolveReport
- [ ] **13.19** `admin/affiliates/page.tsx` — DataTable + AffiliateForm
- [ ] **13.20** `affiliate-form.tsx` — Form for merchant, affiliateTag, urlPattern
- [ ] **13.21** `admin/ads/page.tsx` — DataTable + ad form

## Phase 14 — Ad Components
- [ ] **14.1** `ad-banner.tsx` — Query AdPlacement by slot (where active + within dates), render image+link, track impressions via server action
- [ ] **14.2** Wire ad banners: sidebar slot in Sidebar, in-feed slot in DealFeed (every 5th deal), deal-detail slot in DealDetail

## Phase 15 — Uploadthing Setup
- [ ] **15.1** Create uploadthing account, get token, update .env
- [ ] **15.2** Create file router (`src/lib/uploadthing.ts`) with routes: `dealImage` and `avatar`
- [ ] **15.3** Wire `src/app/api/uploadthing/route.ts`
- [ ] **15.4** Use `<UploadButton>` in DealForm for deal images
- [ ] **15.5** Use `<UploadButton>` in settings page for avatar

## Phase 16 — Email Notifications
- [ ] **16.1** Create Resend account, get API key, update .env
- [ ] **16.2** Create email templates (React Email): deal approved, deal rejected, deal alert match
- [ ] **16.3** Send notification email when moderator approves/rejects a deal
- [ ] **16.4** DealAlert system: when new deal is approved, check DealAlerts table for keyword/merchant/category matches, send emails

## Phase 17 — Polish & Glass Effects
- [ ] **17.1** Dark mode toggle button (uses `useAppStore().toggleDarkMode()`)
- [ ] **17.2** Mobile responsiveness pass — test all pages on 375px, 768px, 1024px
- [ ] **17.3** Add `.glass-subtle` to all card/panel backgrounds where appropriate
- [ ] **17.4** Verify `.page-enter` animation on all route changes
- [ ] **17.5** Verify `.deal-card-enter` stagger animation on feed pages
- [ ] **17.6** Verify `.sidebar-enter` animation on sidebar
- [ ] **17.7** Empty states: use EmptyState component on all pages with no data
- [ ] **17.8** Loading skeletons: add Skeleton components while data loads
- [ ] **17.9** Error boundaries on each route group
- [ ] **17.10** SEO: add metadata to each page (title, description, OpenGraph)

## Phase 18 — Caching with Redis
- [ ] **18.1** Connect to Redis on 192.168.1.106:6379 (`src/lib/redis.ts` is ready)
- [ ] **18.2** Implement `cached()` function in `src/server/actions/deal.ts` for `getDeals` (use `CACHE_KEYS.dealFeed`)
- [ ] **18.3** Implement `cached()` in `src/server/actions/category.ts` for `getCategoryTree`
- [ ] **18.4** Add `invalidateTag()` calls on deal/vote creation and category updates

## Phase 19 — Testing & Deploy
- [ ] **19.1** Full flow test: register → submit deal → moderate (approve) → vote → comment
- [ ] **19.2** Test moderation: submit deal → check it's hidden → approve → check it appears
- [ ] **19.3** Theme test: switch to each of the 5 layouts, verify layout changes
- [ ] **19.4** Theme test: switch to Tet/Christmas/Mid-Autumn color schemes
- [ ] **19.5** Theme test: switch to XS and XL scale, verify sizing
- [ ] **19.6** Category test: add/edit/delete/reorder categories in admin
- [ ] **19.7** Category test: browse nested category URLs
- [ ] **19.8** Build production: `npm run build` — fix any errors
- [ ] **19.9** Deploy to 192.168.1.106:
```bash
scp -r ./ user@192.168.1.106:/opt/vndealz
ssh user@192.168.1.106
cd /opt/vndealz && npm ci && npx prisma db push && npx prisma generate && npm run build
pm2 start ecosystem.config.js
```
- [ ] **19.10** Configure nginx reverse proxy (see PLAN.md Step 18)
- [ ] **19.11** Set up Cloudflare tunnel
- [ ] **19.12** Test PWA installability (manifest.json and next-pwa are already configured)

---

## 🚀 FUTURE MILESTONES (Do not start until Phase 19 is fully deployed)

### Milestone 1: Notifications & Price Tracking
- [ ] Implement `PriceHistory` tracking chart on `deal-detail.tsx` using `recharts`.
- [ ] Build in-app Notification center (bell icon in Navbar). Create alerts for DEAL_APPROVED, DEAL_REJECTED.

### Milestone 2: Merchants & Analytics
- [ ] Create `/cua-hang/[slug]` pages for Merchants with deals filtered by merchant.
- [ ] Track deal views and outbound clicks in the `DealView` table. 
- [ ] Build Admin Analytics Dashboard with charts for views, votes, and affiliate clicks.

### Milestone 3: Gamification & Social
- [ ] Build Badge system: calculate points and award badges in `voteDeal` and `createDeal` actions.
- [ ] Implement `Follow` logic so users can follow each other.
- [ ] Implement `DealCollection` pages so users can curate "Best Laptops 2026" lists.

### Milestone 4: API & Extensibility
- [ ] Create REST API endpoints authenticated via `ApiKey` table.
- [ ] Create `Webhook` dispatcher to ping external URLs when deals are approved.
- [ ] Add RSS feed route handlers (`/api/rss/deals`).

---

## Quick Reference — CSS Classes

| Class | Effect |
|---|---|
| `.glass` | Glassmorphism with blur (uses theme tokens) |
| `.glass-subtle` | Light glass — for sections/panels |
| `.glass-strong` | Heavy glass — for modals/overlays |
| `.deal-card` | Theme-aware card (direction, shadow, radius from CSS vars) |
| `.deal-grid` | Grid with columns from `--grid-columns` var |
| `.site-nav` | Navbar (position, blur, bg from theme) |
| `.site-sidebar` | Sidebar (width, display from theme) |
| `.site-content` | Max-width container |
| `.page-enter` | Fade-up animation on page load |
| `.sidebar-enter` | Slide-in animation |
| `.deal-card-enter` | Stagger fade-in (use `style={{ animationDelay }}`) |
| `.toast-enter` | Slide-in from right |
| `.dialog-overlay` | Blurred dark overlay for modals |
| `.temp-hot` | Red color + glow for hot temperature |
| `.temp-cold` | Blue color for cold temperature |

## Quick Reference — CSS Variables

```
Colors: var(--color-bg), var(--color-surface), var(--color-primary), var(--color-text), var(--color-text-muted), var(--color-border), var(--color-hot), var(--color-cold), var(--color-success), var(--color-danger), var(--color-sponsored)
Fonts: var(--font-size-xs), var(--font-size-sm), var(--font-size-base), var(--font-size-lg), var(--font-size-xl), var(--font-size-2xl)
Spacing: var(--card-padding), var(--card-gap), var(--section-gap)
Radius: var(--border-radius-sm), var(--border-radius-md), var(--border-radius-lg), var(--border-radius-xl)
Layout: var(--nav-height), var(--avatar-size), var(--button-height), var(--icon-size), var(--content-max-width), var(--sidebar-width)
```

**Tailwind syntax**: `text-[var(--color-primary)]`, `bg-[var(--color-surface)]`, `p-[var(--card-padding)]`, `rounded-[var(--border-radius-md)]`, `text-[length:var(--font-size-lg)]`

> ⚠️ For font sizes use `text-[length:var(...)]` with `length:` prefix, otherwise Tailwind treats it as a color.
