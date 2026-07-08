import { db } from './db'

// Rewrites a deal URL to include affiliate tag if we have a config for that merchant
export async function rewriteAffiliateUrl(url: string, merchant: string | null): Promise<string> {
  if (!merchant) return url
  const config = await db.affiliateConfig.findUnique({ where: { merchant, active: true } })
  if (!config || !new RegExp(config.urlPattern).test(url)) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${config.affiliateTag}`
}
