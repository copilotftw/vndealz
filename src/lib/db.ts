// Prisma 7: requires driver adapter for direct DB connection
import { PrismaClient } from '@/generated/prisma'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

function createPrismaClient() {
  if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
    throw new Error('Missing required DB_* environment variables. See .env.example')
  }
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'nguyen',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'vndealz',
    connectionLimit: 5,
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prismaV3: PrismaClient }
export const db = globalForPrisma.prismaV3 || createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaV3 = db
