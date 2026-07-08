import { db } from './src/lib/db'

async function fixCategories() {
  console.log('Fixing category icons...')
  
  const iconMap: Record<string, string> = {
    'Điện tử & Công nghệ': 'Laptop',
    'Thời trang': 'Shirt',
    'Gia dụng & Nhà cửa': 'Home',
    'Thực phẩm & Đồ uống': 'Coffee',
    'Sức khỏe & Làm đẹp': 'Sparkles',
    'Game & Giải trí': 'Gamepad2',
    'Thể thao': 'Dumbbell',
    'Du lịch': 'Plane',
    'Xe cộ': 'Car',
    'Trẻ em': 'Baby',
    'Sách & VPP': 'BookOpen',
    'Tài chính': 'Wallet',
    'Dịch vụ': 'Briefcase',
    'Thú cưng': 'Cat',
    'Khác': 'Tag',
    'Máy tính': 'Monitor',
    'Laptop': 'Laptop',
    'PC & Linh kiện': 'Cpu',
    'Phần mềm': 'Code',
    'Điện thoại': 'Smartphone',
    'Phụ kiện': 'Headphones',
    'Âm thanh': 'Music',
    'TV & Màn hình': 'Tv'
  }

  for (const [name, icon] of Object.entries(iconMap)) {
    await db.category.updateMany({
      where: { nameVi: name },
      data: { icon: icon }
    })
  }

  console.log('Done fixing category icons')
}

fixCategories().catch(console.error).finally(() => process.exit(0))
