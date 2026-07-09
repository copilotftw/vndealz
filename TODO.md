# VNDealz Code Audit — Fixes & TODO

## ✅ Fixed Now (No DB Required)

### 🚨 CRITICAL: Security
- **[db.ts](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/lib/db.ts)**: Removed hardcoded DB password (`Digimon3#`) and IP from source code. Now requires `DB_HOST` and `DB_PASSWORD` env vars — crashes fast if missing.
- Created [.env.example](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/.env.example) so devs know what's needed.

> [!CAUTION]
> The password was already in git history. You should rotate the DB password ASAP and consider running `git filter-branch` or BFG Repo Cleaner to scrub it from history.

### 🎨 Hardcoded Colors → Skin System Variables
Replaced 30+ hardcoded hex colors and Tailwind color classes with `var(--color-*)` tokens:

| File | What was hardcoded |
|---|---|
| [deal-detail.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/deal-detail.tsx) | `#F5F5F5`, `#22c55e`, `#1a3821`, `#379c14`, `#e8f5e9`, `#2e7d32`, `#a5d6a7`, `text-white`, `text-orange-600` |
| [deal-form.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/deal-form.tsx) | `#3ea534`, `#34932a` |
| [voucher-form.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/voucher-form.tsx) | `#3ea534`, `#34932a` |
| [discussion-form.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/discussion-form.tsx) | `#3ea534`, `#34932a` |
| [referral-form.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/referral-form.tsx) | `#3ea534`, `#34932a` + borders/focus |
| [notification-bell.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/layout/notification-bell.tsx) | `bg-red-500`, `bg-blue-500`, `bg-green-500` |
| [live-search-dropdown.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/layout/live-search-dropdown.tsx) | `bg-[#121212]` |
| [category-banner.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/category/category-banner.tsx) | `#181a1b`, `text-gray-400`, `bg-white`, `border-gray-800` |
| [share-deal-modal.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/share-deal-modal.tsx) | `bg-[#181818]`, `border-white/10`, `#25D366` (WhatsApp), `#1877F2` (Facebook) |
| [new-message-modal.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/profile/new-message-modal.tsx) | `#1b1b1b`, `#2b2b2b`, `#f2f2f2`, `text-gray-400` |
| [profile-actions.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/profile/profile-actions.tsx) | `bg-[#1b1b1b]` |
| [related-deals.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/related-deals.tsx) | `#e8f5e9`, `#2e7d32`, `#a5d6a7` |
| [category-tree-manager.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/admin/category-tree-manager.tsx) | `text-green-600`, `text-blue-600`, `text-red-600` |
| [badge-icon.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/profile/badge-icon.tsx) | `#cbd5e1`, `#ffffff` |
| [theme-panel.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/admin/theme-panel.tsx) | `#FF4500` fallback |
| [deal-form.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/deal-form.tsx), [voucher-form.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/voucher-form.tsx) | `border-green-500`, `text-green-500` |

### 🔗 Missing Pages
- **[/canh-bao-deal](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/app/(main)/canh-bao-deal/page.tsx)**: Mobile nav linked here but only `client.tsx` existed — created the server-side `page.tsx` wrapper.

### 🖼️ Image Performance
- **[next.config.ts](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/next.config.ts)**: 
  - Wildcard remote pattern (`**`) — user-submitted deals can have images from any domain
  - Added AVIF + WebP formats
  - Added 24h `minimumCacheTTL` 
  - Optimized `deviceSizes` and `imageSizes`

---

## 📋 TODO — Requires DB Access

When you're back on the local network with MariaDB access, run these:

### 1. Schema Migration — User Social Fields
```bash
# In prisma/schema.prisma, add to User model:
#   website       String?
#   facebook      String?
#   instagram     String?
#   youtube       String?
#   twitter       String?

npx prisma db push
npx prisma generate
```

### 2. Wire Up Settings Forms
- Update `src/server/actions/user.ts` → `updateProfile()` to accept and save the new social fields
- Update `src/app/(main)/cai-dat/ho-so/page.tsx` to include website/bio form fields that actually save
- The current social links form at `/cai-dat/mang-xa-hoi` is for OAuth account linking, which is correct

### 3. Notification Bell — Replace Mock Data
- [notification-bell.tsx](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/layout/notification-bell.tsx) currently uses hardcoded German text and fake notification items
- Wire it to `getNotifications()` server action and display real data
- Translate UI strings to Vietnamese

### 4. Deal Detail — Hardcoded Stats
- [deal-detail.tsx L256-257](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/deal-detail.tsx#L256-L257): User stats (1.560 deals, 6.491 comments) are hardcoded — fetch from DB

### 5. Deal Detail — Hardcoded "Ships From"
- [deal-detail.tsx L179](file:///Users/nguyen.dinh/Documents/My%20Projects/vndealz/src/components/deal/deal-detail.tsx#L179): "Ships From China" is hardcoded — either remove or make it a deal field

