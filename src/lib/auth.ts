import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from './db'

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
      },
      tier: {
        type: 'string',
        required: false,
        defaultValue: 'BRONZE',
      },
      points: {
        type: 'number',
        required: false,
        defaultValue: 0,
      },
      username: {
        type: 'string',
        required: true,
      },
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    'http://192.168.1.106',
    'http://192.168.1.106:3000',
    'https://vndealz.chromalabs.de',
    'http://vndealz.chromalabs.de',
    process.env.BETTER_AUTH_URL || '',
    process.env.NEXT_PUBLIC_APP_URL || '',
  ].filter(Boolean),
})

export type Session = typeof auth.$Infer.Session
