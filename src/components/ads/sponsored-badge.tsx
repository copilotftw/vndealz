import { Badge } from '@/components/ui/badge'

export function SponsoredBadge() {
  return (
    <Badge variant="outline" className="text-[10px] uppercase font-bold text-[var(--color-primary)] border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5">
      Tài trợ
    </Badge>
  )
}
