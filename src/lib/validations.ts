import { z } from 'zod'

export const dealSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  url: z.string().url(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional(),
  couponCode: z.string().max(50).optional(),
  merchant: z.string().max(100).optional(),
  categoryId: z.string().cuid().optional().nullable(),
  discussionCategoryId: z.string().cuid().optional().nullable(),
  type: z.enum(['DEAL', 'VOUCHER', 'FREEBIE', 'DISCUSSION']).default('DEAL'),
  image: z.string().url().optional(),
  expiresAt: z.date().optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  dealId: z.string().cuid().optional(),
  parentId: z.string().cuid().optional(),
})

export const reportSchema = z.object({
  targetType: z.enum(['deal', 'comment', 'user']),
  targetId: z.string().cuid(),
  reason: z.string().min(5).max(500),
})

export const categorySchema = z.object({
  nameVi: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  icon: z.string().max(10).optional(),
  parentId: z.string().cuid().nullable().optional(),
  order: z.number().int().default(0),
})

export const discussionCategorySchema = z.object({
  nameVi: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  icon: z.string().max(20).optional(),
  parentId: z.string().cuid().nullable().optional(),
  order: z.number().int().default(0),
})

export const themeSchema = z.object({
  layout: z.enum(['mydealz', 'prism', 'ledger', 'vitrine', 'pulse', 'atlas']),
  scale: z.enum(['xs', 'sm', 'md', 'lg', 'xl']),
  colorScheme: z.enum([
    'default', 'midnight', 'graphite', 'azure', 'emerald', 'amber',
    'plum', 'rose', 'teal', 'sand', 'forest', 'crimson', 'tet', 'christmas',
  ]),
  customCss: z.string().max(10000).nullable().optional(),
})

export const affiliateSchema = z.object({
  merchant: z.string().min(1),
  affiliateTag: z.string().min(1),
  urlPattern: z.string().min(1),
  active: z.boolean().default(true),
})

export const adSchema = z.object({
  slot: z.enum(['sidebar', 'in-feed', 'deal-detail']),
  title: z.string().optional(),
  imageUrl: z.string().url().optional(),
  targetUrl: z.string().url(),
  active: z.boolean().default(true),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
})

export const preferencesSchema = z.object({
  defaultLanding: z.enum(['hot', 'new', 'trending']).default('hot'),
  endlessScroll: z.boolean().default(true),
  showNsfw: z.boolean().default(false),
  autoFollowCommented: z.boolean().default(false),
  allowOthersToFollow: z.boolean().default(true),
  widgets: z.object({
    showActivity: z.boolean().default(true),
    showHottest: z.boolean().default(true),
    showPopularCategories: z.boolean().default(false),
    showTopVouchers: z.boolean().default(false),
    showDiscussions: z.boolean().default(true),
    showLatestNewsHome: z.boolean().default(false),
    showLatestNewsCategories: z.boolean().default(false),
  }).optional(),
}).partial()

export const notificationSettingsSchema = z.object({
  browser: z.object({ pm: z.boolean().default(false) }).optional(),
  general: z.object({ mention: z.boolean().default(true), notifyEmail: z.boolean().default(false) }).optional(),
  myDeals: z.object({
    dealRated: z.boolean().default(true),
    dealCommented: z.boolean().default(true),
    dealHot: z.boolean().default(true),
    dealInfoAdded: z.boolean().default(true),
    dealBeforeExpire: z.boolean().default(true),
    dealExpired: z.boolean().default(true),
    dealUnexpired: z.boolean().default(true),
    dealCheckActive: z.boolean().default(true),
    dealStats: z.boolean().default(true),
    notifyEmail: z.boolean().default(false),
  }).optional(),
  followedDeals: z.object({
    followedCommented: z.boolean().default(true),
    followedInfoAdded: z.boolean().default(true),
  }).optional(),
  myAddedInfo: z.object({ infoLiked: z.boolean().default(true), notifyEmail: z.boolean().default(false) }).optional(),
  clubPoints: z.object({
    levelUp: z.boolean().default(true),
    loseBenefits: z.boolean().default(true),
    commentHelpful: z.boolean().default(true),
    pointsVoted: z.boolean().default(true),
    refUsed: z.boolean().default(true),
    notifyEmail: z.boolean().default(false),
  }).optional(),
  badges: z.object({ newBadge: z.boolean().default(true), superPoster: z.boolean().default(true), notifyEmail: z.boolean().default(false) }).optional(),
  follows: z.object({ followedPosted: z.boolean().default(true), notifyEmail: z.boolean().default(false) }).optional(),
  messages: z.object({ notifyEmail: z.boolean().default(false) }).optional(),
}).partial()
