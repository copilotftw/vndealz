import { LucideIcon } from 'lucide-react'

interface BadgeIconProps {
  icon: LucideIcon
  color?: string
  isLocked?: boolean
  className?: string
}

export function BadgeIcon({ icon: Icon, color = '#cbd5e1', isLocked = false, className = '' }: BadgeIconProps) {
  const bgColor = isLocked ? 'var(--color-surface-hover)' : color
  const iconColor = isLocked ? 'var(--color-text-muted)' : '#ffffff'

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: '64px',
        height: '74px', // slight elongation for a taller hexagon
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        backgroundColor: bgColor,
        opacity: isLocked ? 0.7 : 1
      }}
    >
      <Icon 
        size={32} 
        color={iconColor} 
        strokeWidth={2}
        className={isLocked ? 'opacity-50' : ''}
      />
    </div>
  )
}
