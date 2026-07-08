import { db } from '@/lib/db'
import Image from 'next/image'

export async function AdBanner({ slot }: { slot: string }) {
  // Find an active ad for this slot
  const ad = await db.adPlacement.findFirst({
    where: { 
      slot, 
      active: true,
      OR: [
        { startsAt: null, endsAt: null },
        { startsAt: { lte: new Date() }, endsAt: { gte: new Date() } }
      ]
    }
  })

  if (!ad) return null

  // Increment impression asynchronously (don't await so it doesn't block render)
  // In a real app, this should be done via an API endpoint or tracking pixel to cache effectively,
  // but for now we'll do it server-side.
  db.adPlacement.update({
    where: { id: ad.id },
    data: { impressions: { increment: 1 } }
  }).catch(() => {})

  return (
    <a 
      href={ad.targetUrl} 
      target="_blank" 
      rel="sponsored noopener"
      className="block relative w-full overflow-hidden rounded-[var(--border-radius-md)] border border-border bg-muted group"
    >
      <div className="absolute top-1 right-1 z-10 px-1.5 py-0.5 bg-black/40 text-white text-[10px] uppercase tracking-wider rounded-sm backdrop-blur-sm">
        Tài trợ
      </div>
      {ad.imageUrl ? (
        <div className="relative w-full aspect-[4/1] md:aspect-[8/1]">
          <Image 
            src={ad.imageUrl} 
            alt={ad.title || 'Quảng cáo'} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      ) : (
        <div className="w-full aspect-[4/1] md:aspect-[8/1] flex items-center justify-center p-4 text-center">
          <span className="font-semibold text-lg">{ad.title}</span>
        </div>
      )}
    </a>
  )
}
