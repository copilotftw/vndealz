import createNextIntlPlugin from 'next-intl/plugin'
import withPWAInit from 'next-pwa'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' }, // Uploadthing
      { protocol: 'https', hostname: 'shopee.vn' },
      { protocol: 'https', hostname: 'lazada.vn' },
      { protocol: 'https', hostname: 'tiki.vn' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      // Add more merchant domains as needed
    ],
  },
}

// @ts-expect-error type mismatch with next-pwa
export default withPWA(withNextIntl(nextConfig))
