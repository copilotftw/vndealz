const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { nameVi: 'Ưu đãi thường xuyên', nameEn: 'Dauerangebote', slug: 'dauerangebote', icon: 'Clock' },
    { nameVi: 'Giới thiệu bản thân', nameEn: 'Vorstellungsrunde', slug: 'vorstellungsrunde', icon: 'Users' },
    { nameVi: 'Hỏi đáp & Yêu cầu', nameEn: 'Fragen & Gesuche', slug: 'fragen-gesuche', icon: 'HelpCircle' },
    { nameVi: 'Mua hàng nước ngoài', nameEn: 'Kaufen im Ausland', slug: 'kaufen-im-ausland', icon: 'Store' },
    { nameVi: 'Thông báo', nameEn: 'Ankündigungen', slug: 'ankuendigungen', icon: 'Megaphone' },
    { nameVi: 'Đánh giá cửa hàng', nameEn: 'Shops: Erfahrungen', slug: 'shops-erfahrungen', icon: 'Store' },
    { nameVi: 'Mẹo tiết kiệm', nameEn: 'Spartipps', slug: 'spartipps', icon: 'Lightbulb' },
    { nameVi: 'Minigame', nameEn: 'Gewinnspiele', slug: 'gewinnspiele', icon: 'Trophy' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        nameVi: cat.nameVi,
        nameEn: cat.nameEn,
        slug: cat.slug,
        icon: cat.icon,
      },
    })
  }

  // Find a user to act as author
  let user = await prisma.user.findFirst({ where: { username: 'devilsown' } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'devilsown',
        email: 'devilsown@example.com',
        name: 'devilsown',
      }
    })
  }
  
  let techfan = await prisma.user.findFirst({ where: { username: 'techfan99' } })
  if (!techfan) {
    techfan = await prisma.user.create({
      data: {
        username: 'techfan99',
        email: 'techfan99@example.com',
        name: 'techfan99',
      }
    })
  }

  const category1 = await prisma.category.findUnique({ where: { slug: 'fragen-gesuche' } })
  
  if (category1) {
    // Seed some discussions
    await prisma.deal.upsert({
      where: { slug: 'samsung-s26-ultra' },
      update: {},
      create: {
        title: 'Samsung S26 Ultra đang bán tại cửa hàng Samsung trực tiếp với giá € 699,00 (CB!)',
        slug: 'samsung-s26-ultra',
        description: 'Xin chào, tại Samsung bạn có thể mua chiếc S26 Ultra (256 GB) qua cửa hàng ưu đãi Samsung Corporate Benefits với giá € 699,00...',
        url: 'https://samsung.com',
        type: 'DISCUSSION',
        userId: user.id,
        categoryId: category1.id,
        status: 'ACTIVE',
      }
    })

    await prisma.deal.upsert({
      where: { slug: 'google-tv-streamer' },
      update: {},
      create: {
        title: 'Kinh nghiệm sử dụng Google TV Streamer mới?',
        slug: 'google-tv-streamer',
        description: 'Có ai đã dùng thử Streamer mới chưa? Có đáng để nâng cấp từ Chromecast cũ không?',
        url: 'https://store.google.com',
        type: 'DISCUSSION',
        userId: techfan.id,
        categoryId: category1.id,
        status: 'ACTIVE',
      }
    })
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
