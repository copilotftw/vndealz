import { z } from 'zod'

export const dealSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  url: z.string().url(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional(),
  couponCode: z.string().max(50).optional(),
  merchant: z.string().max(100).optional(),
  categoryId: z.string().cuid(),
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

export const themeSchema = z.object({
  layout: z.enum(['modern', 'minimalist', 'mydealz', 'aliexpress', 'shopee']),
  scale: z.enum(['xs', 'sm', 'md', 'lg', 'xl']),
  colorScheme: z.enum([
    'default', 'dark-orange', 'ocean', 'forest', 'sunset', 'midnight',
    'rose', 'monochrome', 'tet', 'christmas', 'mid-autumn', 'national-day',
  ]),
  customCss: z.string().max(10000).optional(),
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
