import { db as prisma } from './src/lib/db'

async function main() {
  console.log('Fixing DiscussionCategory names and slugs from German to English...')
  
  const updates = [
    { oldSlug: 'dauerangebote', newSlug: 'long-term-deals', nameEn: 'Long-term Deals' },
    { oldSlug: 'vorstellungsrunde', newSlug: 'introductions', nameEn: 'Introductions' },
    { oldSlug: 'fragen-gesuche', newSlug: 'questions-requests', nameEn: 'Questions & Requests' },
    { oldSlug: 'kaufen-im-ausland', newSlug: 'buying-abroad', nameEn: 'Buying Abroad' },
    { oldSlug: 'ankuendigungen', newSlug: 'announcements', nameEn: 'Announcements' },
    { oldSlug: 'shops-erfahrungen', newSlug: 'shop-reviews', nameEn: 'Shop Reviews' },
    { oldSlug: 'spartipps', newSlug: 'saving-tips', nameEn: 'Saving Tips' },
    { oldSlug: 'gewinnspiele', newSlug: 'giveaways', nameEn: 'Giveaways' }
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
          nameEn: update.nameEn
        }
      })
    } else {
      console.log(`Skipped ${update.oldSlug} (not found)`)
    }
  }
  
  console.log('Done updating DiscussionCategory!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
