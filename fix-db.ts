import { db as prisma } from './src/lib/db'

async function main() {
  console.log('Fixing categories...')
  
  const discussionSlugs = [
    'dauerangebote',
    'vorstellungsrunde',
    'fragen-gesuche',
    'kaufen-im-ausland',
    'ankuendigungen',
    'shops-erfahrungen',
    'spartipps',
    'gewinnspiele'
  ]
  
  // Find them in Category table
  const wrongCats = await prisma.category.findMany({
    where: {
      slug: { in: discussionSlugs }
    }
  })
  
  console.log(`Found ${wrongCats.length} wrongly placed categories.`)
  
  for (const cat of wrongCats) {
    // Check if it exists in DiscussionCategory
    const exists = await prisma.discussionCategory.findUnique({
      where: { slug: cat.slug }
    })
    
    if (!exists) {
      console.log(`Moving ${cat.nameVi} to DiscussionCategory...`)
      await prisma.discussionCategory.create({
        data: {
          nameVi: cat.nameVi,
          nameEn: cat.nameEn,
          slug: cat.slug,
          icon: cat.icon,
          order: cat.order,
          depth: cat.depth
        }
      })
    }
    
    console.log(`Deleting ${cat.slug} from Category table...`)
    await prisma.category.delete({
      where: { id: cat.id }
    })
  }
  
  console.log('Done fixing DB!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
