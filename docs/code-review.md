# Code Review — Structure & Efficiency

Grounded in actual code (file:line). Ordered by impact. Not style nitpicks — real defects and cost.

## P0 — Bugs (silently broken)

### 1. Every `revalidatePath` targets a route that does not exist
~30 calls across `src/server/actions/*` use `/[locale]/...` and `/admin/...`. Neither exists:
- App has **no `[locale]` URL segment** (next-intl runs without path prefix; routes live under `src/app/(main)/`, a route group that is invisible in the URL).
- Admin is **`/quan-tri`**, not `/admin`.

So `revalidatePath('/[locale]/deal/${slug}')`, `'/[locale]/admin/moderation'`, `'/[locale]/admin/categories'` etc. match nothing → **Next.js cache is never invalidated after a mutation.** Stale pages persist until a full rebuild or the Redis 60s TTL masks it on some routes.

Fix: use real paths.
- `revalidatePath('/deal/${slug}')`
- `revalidatePath('/quan-tri/moderation')`
- `revalidatePath('/quan-tri/categories')`
- `revalidatePath('/ho-so/${name}')`
- `revalidatePath('/')` for the feed
Audit every call in `src/server/actions/` (deal.ts, category.ts, user.ts, settings.ts, theme.ts, admin actions). One shared constants file of route builders would stop this recurring.

### 2. Mid-file `import` in deal.ts
`src/server/actions/deal.ts:144` — `import { getCached, setCached, invalidateCache } from '@/lib/redis'` sits halfway down the file, yet `invalidateCache` is called at line 55 (works only via hoisting). Move all imports to top. Confusing and error-prone.

## P1 — Type safety

`: any` / `as any` hotspots (excluding generated Prisma):
```
 8  src/server/actions/deal.ts
 7  src/app/quan-tri/ads/client.tsx
 6  src/app/quan-tri/reports/client.tsx
 6  src/app/quan-tri/affiliates/client.tsx
 6  src/app/(main)/cai-dat/nguoi-theo-doi/page.tsx
 5  voucher-form.tsx / deal-form.tsx
```
- `getDeals` builds `where: any`, `orderBy: any`, `dealSelect: any`, returns `deals: any[]`. Downstream `deals as any` in deal-feed/deal-list erases all type safety on the hottest path in the app. Define a `Prisma.DealGetPayload<typeof dealSelect>` type or a hand-written `DealListItem` and thread it through instead of `any`.
- FormData parsing in `createDeal` casts each field `as string`. Zod already validates — parse the raw object, let Zod produce the typed result, drop the casts.

## P1 — Wrong shared journey (correctness, not dedup)

### 3. Four content types forced through one deal-shaped flow
Deal / Voucher / Referral / Discussion are **distinct creation journeys** but the junior copy-pasted the deal wizard four times and pointed all of them at **one server action (`createDeal`) validated by one `dealSchema`**. Consequences:

- **Discussion creation is likely broken.** `dealSchema` requires `url: z.string().url()` and `description`. A discussion has no URL — it cannot pass validation without stuffing a fake URL. Discussion has its own `discussionCategoryId`, yet rides the deal `url`/`price` shape.
- **No real per-type validation.** Every type-specific field is `.optional()`'d so all 4 fit one object — a discussion with a price passes; a voucher with no code passes; a deal missing a url is rejected even inside non-deal flows. The schema validates nothing meaningful.
- **Wrong steps copied.** Voucher/referral wizards carry the deal's Step 3 "Image Gallery" and price/comparePrice fields that don't belong to those journeys. A voucher is a code + terms + expiry; a referral is a personal invite link + reward; a discussion is title + rich body + category.
- **Referral journey is fake.** `referral-form.tsx:56-59` is a mock — `// Mock API call`, `await new Promise(r => setTimeout(r, 1000))`, then redirect. It persists nothing. There is no `REFERRAL` value in the `type` enum, no `referralSchema`, no `createReferral` action. The entire referral creation flow is a non-functional shell shipped as if real.
- **Copy-paste artifact:** `voucher-form.tsx:143` ships untranslated German `(erforderlich)`.

Fix — diverge, don't unify:
- One **discriminated-union schema**: `z.discriminatedUnion('type', [dealSchema, voucherSchema, referralSchema, discussionSchema])`, each validating only its real fields (deal: url required; voucher: code required, url optional; referral: reward + invite; discussion: no url/price/coupon, `discussionCategoryId` required).
- Distinct server actions (`createDeal`, `createVoucher`, `createReferral`, `createDiscussion`) or one `createPost` that switches on the validated union — either way, no more one-size deal shape.
- Distinct step configs per journey. Shared *presentation* primitives (Stepper, field row) are fine to reuse; shared *domain shape* is the bug.

## P2 — Duplication

### 4. Five admin `client.tsx` with copy-pasted table logic
`quan-tri/{ads,reports,affiliates,users,deals}/client.tsx` each re-implement select/filter/pagination/action-dispatch. A generic `<AdminTable columns actions data />` (you already have `@dnd-kit` and shadcn primitives) would collapse these.

## P3 — Data-fetching efficiency

- **`getDeals` fires 3–4 sequential awaits before the query**: `getMutedUserIds()`, `getSafeUserSettings()`, then the cache read, then count+findMany. `getMutedUserIds` + `getSafeUserSettings` each hit auth/session + DB on every feed load and are not part of the memoized cache key path. Run them with `Promise.all`, and cache muted/settings per-request (React `cache()`).
- **Trending path fetches 200 rows then sorts in JS on every uncached request** (`deal.ts:219`). Fine at low volume; will hurt. Consider a materialized `score` column updated by the temperature cron, or an indexed computed sort.

## P4 — Structure / organization

- **Route naming mixes languages**: `dang/`, `dang-deal/`, `dang-ma-giam-gia/` (Vietnamese) vs `alerts/`, `quan-tri/` (mixed). Not wrong, but the `revalidatePath` bug above is a direct symptom — nobody has a single source of truth for routes. Add `src/lib/routes.ts` with typed builders (`routes.deal(slug)`, `routes.admin.moderation`). Fixes P0 permanently.
- **`console.log`/`console.error` — 18 occurrences** in shipping code (`src`, excl generated). Replace with a real logger or strip. Several are `.catch(console.error)` on fire-and-forget gamification — those swallow errors silently in prod.
- **65 `'use client'` files, 21 client components import server actions directly.** Mostly fine (Next pattern), but verify none pull heavy server-only libs into the client bundle by transitive import.

## Quick wins (low risk, high tidiness)
1. `src/lib/routes.ts` + fix all `revalidatePath` (fixes P0.1).
2. Move deal.ts imports to top (P0.2).
3. Type `getDeals` return; delete `deals as any` in feed/list.
4. Strip/replace 18 `console.*`.

## Settings audit — "do they work or just store?"

Traced every setting write → consumer. Most are store-only.

### Profile (`cai-dat/ho-so`) — WORKS
`name`, `bio`, `avatar`, `email` persist via `updateProfile` and render on the public profile.
- **Security concern:** email is written straight to `user.email` (`user.ts:42`), bypassing Better Auth's verification flow. Can desync from the auth account and lets a user set an unverified email. Route email change through Better Auth's change-email API.

### Preferences (`cai-dat/tuy-chon`) — ~half work
- **Work:** `showNsfw` (deal.ts feed filter), `allowOthersToFollow` (user.ts follow guard), `autoFollowCommented` (comment.ts), `widgets.showHottest` / `showActivity` / `showDiscussions` (sidebar.tsx).
- **Dead (stored, never read):** `endlessScroll`, `widgets.showPopularCategories`, `showTopVouchers`, `showLatestNewsHome`, `showLatestNewsCategories`.
- **Broken:** `defaultLanding` — dropdown values (`popular`/`hottest`/`everything`/`mytab`/`trendingDeals`) don't match the sort enum (`hot`/`new`/`trending`), AND `DealFeed` reads `searchParams.sort` directly, not the computed default — so on first load the feed ignores this setting entirely. It only tints the `FeedTabs` highlight.

### Notifications (`cai-dat/thong-bao`) — ~96% cosmetic
25 toggles across 8 groups. Reality:
- `sendNotification` is called from **exactly one site** (`comment.ts:56`, event `myDeals.dealCommented`). So **one** toggle (in-app comment notification) does anything. The other ~24 events are never fired anywhere.
- **Email is a mock** — `notification.ts:62` is `console.log('[Email Mock]...')`. No email is ever sent. Every `notifyEmail` toggle (8 of them) is inert.
- The `NotificationEvent` union (`notification.ts:3`) lists 12 events; the UI exposes ~25. ~13 toggles reference events that don't exist in code and can never gate anything (`dealExpired`, `clubPoints.commentHelpful`, `badges.superPoster`, `messages.*`, etc.).

### Socials (`cai-dat/mang-xa-hoi`)
Actually connected-OAuth-account + password management, not social profile links (no such fields in schema). Fine, just mislabeled mentally.

### Root cause + fix
Settings are two untyped `Json?` blobs (`preferences`, `notificationSettings`) written whole-object with no Zod validation (`settings.ts:35,49`). The UI was built out fully; the consumers were never wired. Fix: (1) type both blobs with Zod, (2) either wire the missing consumers or hide toggles that do nothing, (3) fire `sendNotification` at the real mutation sites (vote, hot-threshold cron, follow, badge/gamification engines), (4) ship real email (templates already exist in `src/emails/`).

## Feature ideas (mostly finishing half-built things)

1. **Wire the notification events that already have UI + infra.** `voteDeal`, the temperature/hot-threshold cron, `follow`, the badge engine, and the gamification engine are the obvious fire sites for `myDeals.dealRated`, `myDeals.dealHot`, `follows.followedPosted`, `badges.newBadge`, `clubPoints.levelUp`. The gate + storage already exist — just call `sendNotification`.
2. **Real email delivery.** Replace the mock with Resend/SES; `src/emails/*.tsx` React Email templates are already written and unused.
3. **Make `defaultLanding` + `endlessScroll` actually drive the feed** (pass into `DealFeed`/`DealList`).
4. **Notification bell read-state** — mark-read / mark-all-read / unread badge; optional realtime via polling or SSE.
5. **Let users pick their own persona/color.** The new persona engine is admin-global only; expose it as a per-user preference (you already have the token infra + a `preferences` blob).
6. **Price-drop alerts** — `PriceHistory` model + `alerts/matching-engine` exist; a "notify me when price drops below X" per-deal watch is a small addition on top.

## Not broken, leave alone
- Theme persona engine (this session's work) — typed, compiles clean.
- Prisma generated client correctly gitignored (`/src/generated/`).
- next lint: 0 warnings; tsc: clean.
