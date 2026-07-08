import { PrismaClient } from '../src/generated/prisma'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || '192.168.1.105',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'nguyen',
  password: process.env.DB_PASSWORD || 'Digimon3#',
  database: process.env.DB_NAME || 'vndealz',
  connectionLimit: 1,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 'default' } })
  console.log('CURRENT CONFIG:', config)
}

main().finally(() => prisma.$disconnect())
