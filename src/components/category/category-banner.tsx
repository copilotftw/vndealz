import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type CategoryBannerProps = {
  title: string
  subtitle: string
  images: string[]
  breadcrumbs?: { label: string; href: string }[]
}

export function CategoryBanner({ title, subtitle, images, breadcrumbs }: CategoryBannerProps) {
  return (
    <div className="w-full bg-[var(--color-nav-bg)] text-[var(--color-text)] py-12 md:py-20 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-8">
        
        {/* Left Side: Title and Breadcrumbs */}
        <div className="max-w-2xl">
          {breadcrumbs && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              {breadcrumbs.map((bc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 opacity-50" />
                  <Link href={bc.href} className="hover:text-white transition-colors">
                    {bc.label}
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)]">
            {subtitle}
          </p>
        </div>

        {/* Right Side: Masonry Images */}
        {images.length > 0 && (
          <div className="hidden md:flex gap-4 items-center shrink-0">
            {images.slice(0, 5).map((img, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-lg overflow-hidden shadow-2xl bg-[var(--color-surface)] border border-[var(--color-border)] ${
                  idx % 2 !== 0 ? 'translate-y-8' : '' // Staggered masonry effect
                }`}
                style={{
                  width: idx === 0 || idx === 4 ? '90px' : '110px',
                  height: idx === 0 || idx === 4 ? '130px' : '160px',
                  zIndex: 5 - Math.abs(idx - 2)
                }}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="150px" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full mix-blend-screen" />
    </div>
  )
}
