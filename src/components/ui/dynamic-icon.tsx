import * as React from "react"
import {
  Laptop, Smartphone, Gamepad2, Tv, Headphones, Monitor, 
  Home, Coffee, Pizza, Shirt, Watch, Car, Plane, Gift,
  Tag, Leaf, Target, Flame, MessageSquare, Award, Trophy, Diamond,
  Sparkles, Dumbbell, Baby, BookOpen, Wallet, Briefcase, Cat, Cpu, Code, Music,
  HelpCircle,
  LucideIcon
} from "lucide-react"

export const iconMap: Record<string, LucideIcon> = {
  Laptop, Smartphone, Gamepad2, Tv, Headphones, Monitor,
  Home, Coffee, Pizza, Shirt, Watch, Car, Plane, Gift,
  Tag, Leaf, Target, Flame, MessageSquare, Award, Trophy, Diamond,
  Sparkles, Dumbbell, Baby, BookOpen, Wallet, Briefcase, Cat, Cpu, Code, Music
}

export function DynamicIcon({ name, className }: { name?: string | null, className?: string }) {
  if (!name) return <Tag className={className} />
  
  const Icon = iconMap[name] || HelpCircle
  return <Icon className={className} />
}
