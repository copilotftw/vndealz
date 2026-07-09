# TASKS

## Build ✅
- [x] `npm run build` — green. All 42 routes, no errors. Redis/social-OAuth warnings are infra-only (no key set).

## Verification plan (needs live browser + DB)
- [ ] **Payload** — switch persona to `ledger`, confirm deal JSON omits `image`/`blurHash`/`description`. Compare byte size vs `mydealz`.
- [ ] **Shell transform** — in `/quan-tri/theme`, switch each of 6 personas, confirm nav + sidebar + footer variant swaps.
- [ ] **Contrast (WCAG AA)** — all 14 schemes × light + dark. Check `--color-text` vs `--color-bg`, `--color-primary-text` vs `--color-primary`, `--color-nav-text` vs `--color-nav-bg`.
- [ ] **Container queries** — put a composer in narrow container, confirm reflow without media queries.
- [ ] **Motion** — persona switch animates via `startViewTransition`; disable via OS reduced-motion, confirm no animation.
- [ ] **Regression** — `mydealz` pixel-identical to current production feed + detail.
- [ ] **Atlas masonry** — with real variable-height content, confirm CSS multi-column packs without row gaps.
- [ ] **Load-more shape parity** — verify infinite scroll page 2+ under `ledger`/`pulse` returns same lean shape as page 1.

## Notification system ✅ (code done, needs runtime testing)
- [x] **Wire `NotificationBell`** — `src/server/actions/notification.ts` with `getNotifications`/`getUnreadCount`/`markAllRead`/`markRead`. Bell polls every 45s, dropdown fetches on open + marks all read.
- [x] **Fire missing events** — `voteDeal` fires `myDeals.dealRated`; hot threshold (once) fires `myDeals.dealHot`; `toggleFollow` fires `follows.followedPosted`; gamification fires `badges.newBadge` + `clubPoints.levelUp`.
- [ ] **Cron alert engine** — price-drop, `dealBeforeExpire`, `dealExpired`. Route `/api/cron/check-alerts` behind secret, Vercel Cron or external scheduler.
- [x] **Type settings blobs** — `preferencesSchema` + `notificationSettingsSchema`. Actions validate + deep-merge.
- [ ] **Reconcile toggles vs events** — UI has ~25 toggles; union has 12. Either implement remaining or hide orphan toggles.

## Low priority follow-ups
- [ ] **Bookmark state on load-more** — page 2+ deals don't have `initialSaved` (only page 1 hydrated server-side). Toggle still persists, just visual state resets on infinite scroll.
- [ ] **`defaultLanding` + `endlessScroll` on non-home feeds** — only `/` reads preference. Category/brand/search feeds ignore it.
