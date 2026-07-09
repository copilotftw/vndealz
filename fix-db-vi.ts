import { db as prisma } from './src/lib/db'

async function main() {
  console.log('Fixing DiscussionCategory slugs to Vietnamese...')
  
  const updates = [
    { oldSlug: 'long-term-deals', newSlug: 'uu-dai-thuong-xuyen' },
    { oldSlug: 'introductions', newSlug: 'gioi-thieu-ban-than' },
    { oldSlug: 'questions-requests', newSlug: 'hoi-dap-yeu-cau' },
    { oldSlug: 'buying-abroad', newSlug: 'mua-hang-nuoc-ngoai' },
    { oldSlug: 'announcements', newSlug: 'thong-bao' },
    { oldSlug: 'shop-reviews', newSlug: 'danh-gia-cua-hang' },
    { oldSlug: 'saving-tips', newSlug: 'meo-tiet-kiem' },
    { oldSlug: 'giveaways', newSlug: 'minigame' }
  ]
  
  for (const update of updates) {
    const cat = await prisma.discussionCategory.findUnique({
      where: { slug: update.oldSlug }
    })
    
    if (cat) {
      console.log(`Updating ${update.oldSlug} to ${update.newSlug}...`)
      await prisma.discussionCategory.update({
        where: { id: cat.id },
        data: {
          slug: update.newSlug,
        }
      })
    } else {
      console.log(`Skipped ${update.oldSlug} (not found)`)
    }
  }
  
  console.log('Done updating DiscussionCategory to Vietnamese!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
