import { PrismaClient } from '../src/generated/prisma'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { faker } from '@faker-js/faker'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || '192.168.1.105',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'nguyen',
  password: process.env.DB_PASSWORD || 'Digimon3#',
  database: process.env.DB_NAME || 'vndealz',
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

import { hashPassword } from 'better-auth/crypto'

async function main() {
  console.log('Seeding data...')
  
  const defaultPassword = await hashPassword('1234567')

  // Create or get default admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vndealz.vn' },
    update: {},
    create: {
      email: 'admin@vndealz.vn',
      name: 'Admin',
      username: 'admin',
      role: 'ADMIN',
      emailVerified: true
    }
  })

  // Ensure admin account exists for login
  await prisma.account.upsert({
    where: { providerId_accountId: { providerId: 'credential', accountId: admin.email } },
    update: { password: defaultPassword },
    create: {
      userId: admin.id,
      accountId: admin.email,
      providerId: 'credential',
      password: defaultPassword
    }
  })

  // Create some users
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async (_, i) => {
      const email = `user${i}@example.com`
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: faker.person.fullName(),
          username: faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, ''),
          role: 'USER',
          emailVerified: true
        }
      })
      
      await prisma.account.upsert({
        where: { providerId_accountId: { providerId: 'credential', accountId: email } },
        update: { password: defaultPassword },
        create: {
          userId: user.id,
          accountId: email,
          providerId: 'credential',
          password: defaultPassword
        }
      })
      
      return user
    })
  )

  // Create a base category if none exists
  let category = await prisma.category.findFirst()
  if (!category) {
    category = await prisma.category.create({
      data: {
        nameVi: 'Công nghệ',
        nameEn: 'Technology',
        slug: 'cong-nghe',
        icon: 'Laptop'
      }
    })
  }

  // Generate 50 deals
  console.log('Generating deals...')
  const dealsData = Array.from({ length: 50 }).map(() => {
    const isFreebie = faker.datatype.boolean()
    const isVoucher = faker.datatype.boolean()
    const type = isFreebie ? 'FREEBIE' : (isVoucher ? 'VOUCHER' : 'DEAL')
    
    return {
      title: faker.commerce.productName() + ' ' + faker.commerce.productAdjective(),
      slug: faker.helpers.slugify(faker.commerce.productName() + '-' + faker.string.uuid()).toLowerCase(),
      description: faker.commerce.productDescription(),
      price: isFreebie ? 0 : parseFloat(faker.commerce.price({ min: 10000, max: 10000000 })),
      comparePrice: parseFloat(faker.commerce.price({ min: 100000, max: 20000000 })),
      url: faker.internet.url(),
      type,
      status: 'ACTIVE',
      temperature: faker.number.int({ min: 0, max: 1500 }),
      userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
      categoryId: category.id,
      image: faker.image.url()
    }
  })

  for (const deal of dealsData) {
    await prisma.deal.create({ data: deal })
  }

  console.log('Done seeding!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
