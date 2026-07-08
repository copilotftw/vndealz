import { PrismaClient } from '../src/generated/prisma'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || '192.168.1.105',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'nguyen',
  password: process.env.DB_PASSWORD || 'Digimon3#',
  database: process.env.DB_NAME || 'vndealz',
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function promoteAdmin() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: tsx scripts/promote-admin.ts <email>')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`User with email ${email} not found. Please sign up first.`)
    process.exit(1)
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  })

  console.log(`Successfully promoted ${email} to ADMIN!`)
}

promoteAdmin().finally(() => prisma.$disconnect())
