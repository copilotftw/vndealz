import { db } from '../src/lib/db'

const badges = [
  {
    nameVi: 'Người mới bắt đầu',
    nameEn: 'Starter',
    icon: 'Leaf',
    description: 'Đăng deal đầu tiên của bạn.',
    condition: 'FIRST_DEAL',
    points: 10,
  },
  {
    nameVi: 'Thợ săn Deal',
    nameEn: 'Deal Hunter',
    icon: 'Target',
    description: 'Đăng 10 deal.',
    condition: 'TEN_DEALS',
    points: 50,
  },
  {
    nameVi: 'Deal Nóng Bỏng',
    nameEn: 'Hot Deal',
    icon: 'Flame',
    description: 'Có một deal đạt nhiệt độ 100°.',
    condition: 'HOT_DEAL_100',
    points: 100,
  },
  {
    nameVi: 'Chuyên gia thảo luận',
    nameEn: 'Commenter',
    icon: 'MessageSquare',
    description: 'Viết 10 bình luận.',
    condition: 'TEN_COMMENTS',
    points: 20,
  },
  {
    nameVi: 'Người dùng Bạc',
    nameEn: 'Silver User',
    icon: 'Award',
    description: 'Đạt 100 điểm.',
    condition: 'POINTS_100',
    points: 0,
  },
  {
    nameVi: 'Người dùng Vàng',
    nameEn: 'Gold User',
    icon: 'Trophy',
    description: 'Đạt 500 điểm.',
    condition: 'POINTS_500',
    points: 0,
  },
  {
    nameVi: 'Người dùng Kim Cương',
    nameEn: 'Diamond User',
    icon: 'Diamond',
    description: 'Đạt 2000 điểm.',
    condition: 'POINTS_2000',
    points: 0,
  },
]

async function main() {
  console.log('Seeding badges...')
  
  for (const badge of badges) {
    const existing = await db.badge.findFirst({ where: { condition: badge.condition } })
    if (existing) {
      await db.badge.update({
        where: { id: existing.id },
        data: badge,
      })
    } else {
      await db.badge.create({ data: badge })
    }
  }

  console.log('Seeding completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
