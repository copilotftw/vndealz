// Next.js 16: proxy.ts replaces middleware.ts
// Handles i18n locale routing via next-intl

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export const proxy = createMiddleware(routing)

export const config = {
  // Match all pathnames except: _next, api, static files
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
