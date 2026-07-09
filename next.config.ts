import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

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

export default withNextIntl(nextConfig)
