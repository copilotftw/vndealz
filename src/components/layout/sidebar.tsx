import { db } from '@/lib/db'
import { Link } from '@/i18n/navigation'
import { CategoryTreeNav } from '../category/category-tree-nav'
import { Button } from '../ui/button'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function requireMod() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s || !['ADMIN', 'MODERATOR'].includes((s.user as any).role)) throw new Error('Forbidden')
  return s
}

export async function Sidebar({ locale }: { locale: string }) {
  // Fetch top 5 hottest active deals for trending
  const trendingDeals = await db.deal.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { temperature: 'desc' },
    take: 5,
    include: { category: true }
  })

  return (
    <div className="space-y-[var(--section-gap)] sticky top-[calc(var(--nav-height)+var(--section-gap))] w-[var(--sidebar-width)] flex-shrink-0">
      
      {/* Đăng deal CTA */}
      <Link href="/dang-deal" className="block">
        <Button className="w-full bg-[var(--color-primary)] text-white hover:opacity-90 h-12 text-[length:var(--font-size-base)] shadow-lg hover:shadow-xl transition-all">
          <PlusCircle className="mr-2 h-5 w-5" />
          {locale === 'vi' ? 'Đăng deal mới' : 'Submit Deal'}
        </Button>
      </Link>

      {/* Trending deals */}
      <section className="glass-subtle rounded-[var(--border-radius-lg)] p-[var(--card-padding)] shadow-sm">
        <h3 className="text-[length:var(--font-size-lg)] font-bold mb-4 text-[var(--color-hot)] flex items-center gap-2">
          🔥 {locale === 'vi' ? 'Nóng nhất' : 'Trending'}
        </h3>
        <div className="space-y-4">
          {trendingDeals.map(deal => (
            <Link key={deal.id} href={`/deal/${deal.slug}`} className="flex gap-3 group">
              <div className="relative w-16 h-16 rounded-[var(--border-radius-sm)] overflow-hidden bg-white border border-[var(--color-border)]/50 flex-shrink-0">
                <Image 
                  src={deal.image || 'https://utfs.io/f/placeholder.png'} 
                  alt={deal.title}
                  fill
                  className="object-contain p-1 group-hover:scale-110 transition-transform"
                  sizes="64px"
                />
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <p className="text-[length:var(--font-size-sm)] font-medium text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {deal.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[length:var(--font-size-xs)] font-bold text-[var(--color-hot)]">{deal.temperature}°</span>
                  <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] line-clamp-1">{deal.category.nameVi}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category navigation */}
      <section className="glass-subtle rounded-[var(--border-radius-lg)] p-[var(--card-padding)] shadow-sm">
        <h3 className="text-[length:var(--font-size-lg)] font-bold mb-4 flex items-center gap-2">
          📂 {locale === 'vi' ? 'Danh mục' : 'Categories'}
        </h3>
        <CategoryTreeNav locale={locale} />
      </section>

      {/* Ad slot */}
      {/* <AdBanner slot="sidebar" /> */}
    </div>
  )
}
