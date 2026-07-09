import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, locale = 'vi-VN') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: locale === 'vi-VN' ? 'VND' : 'USD' }).format(price)
}

export function timeAgo(date: Date | string, locale = 'vi') {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + (locale === 'vi' ? ' năm trước' : ' years ago')
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + (locale === 'vi' ? ' tháng trước' : ' months ago')
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + (locale === 'vi' ? ' ngày trước' : ' days ago')
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + (locale === 'vi' ? ' giờ trước' : ' hours ago')
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + (locale === 'vi' ? ' phút trước' : ' minutes ago')
  return locale === 'vi' ? 'Vừa xong' : 'Just now'
}

export function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
