import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import './globals.css'
import { getThemeStyles } from '@/components/theme/theme-provider'
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme/theme-provider-client'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'VNDealz — Cộng đồng săn deal #1 Việt Nam',
    template: '%s | VNDealz'
  },
  description: 'Chia sẻ và khám phá các deal, mã giảm giá, và khuyến mãi tốt nhất tại Việt Nam. Tham gia cộng đồng hàng ngàn người mua sắm thông thái.',
  keywords: ['deal', 'khuyến mãi', 'mã giảm giá', 'sale', 'voucher', 'mua sắm', 'tiết kiệm'],
  authors: [{ name: 'VNDealz' }],
  creator: 'VNDealz',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://vndealz.vn',
    title: 'VNDealz — Cộng đồng săn deal #1 Việt Nam',
    description: 'Nơi tập hợp những ưu đãi tốt nhất từ Shopee, Lazada, Tiki và hàng trăm cửa hàng khác do cộng đồng đóng góp.',
    siteName: 'VNDealz',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'VNDealz - Săn deal cùng cộng đồng'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VNDealz — Cộng đồng săn deal #1 Việt Nam',
    description: 'Nơi tập hợp những ưu đãi tốt nhất do cộng đồng đóng góp.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { css: themeCSS, layout: activeLayout } = await getThemeStyles()
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={cn(inter.className, "font-sans", geist.variable)} data-layout={activeLayout} suppressHydrationWarning>
      <head>
        {/* Theme CSS injected from DB config — no rebuild needed */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body
        className="overflow-x-hidden"
        style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          fontSize: 'var(--font-size-base)',
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
