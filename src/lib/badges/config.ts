import { Target, MessageSquare, Star, Zap, ThumbsUp, Trophy, Award, Crown, CheckCircle2, ShoppingBag, Store, Flame, Droplet, UserCheck } from 'lucide-react'

export type BadgeCategory = 'engagement' | 'deals' | 'votes' | 'social' | 'special'

export interface BadgeConfig {
  id: string
  nameVi: string
  nameEn: string
  descriptionVi: string
  descriptionEn: string
  icon: any
  color: string
  category: BadgeCategory
  threshold: number
  type: 'comments' | 'deals' | 'votes' | 'max_temp' | 'max_deal_comments' | 'social' | 'special'
  dependsOn?: string
}

export const BADGE_CONFIG: BadgeConfig[] = [
  // ─── COMMENTS ───
  {
    id: 'entertainer',
    nameVi: 'Người pha trò',
    nameEn: 'Entertainer',
    descriptionVi: '100 bình luận tạo nên một bầu không khí tuyệt vời!',
    descriptionEn: '100 comments creating a great atmosphere!',
    icon: MessageSquare,
    color: '#38bdf8', // Cyan
    category: 'engagement',
    threshold: 100,
    type: 'comments'
  },
  {
    id: 'chatter',
    nameVi: 'Người tám chuyện',
    nameEn: 'Chatter',
    descriptionVi: '500 bình luận? Bạn đúng là một người thích tán gẫu!',
    descriptionEn: '500 comments? You are a real chatterbox!',
    icon: MessageSquare,
    color: '#0ea5e9', // Blue
    category: 'engagement',
    threshold: 500,
    type: 'comments',
    dependsOn: 'entertainer'
  },
  {
    id: 'chatterbox',
    nameVi: 'Trùm chém gió',
    nameEn: 'Chatterbox',
    descriptionVi: '1000 bình luận là bằng chứng rõ ràng cho tài ăn nói của bạn.',
    descriptionEn: '1000 comments is clear proof of your talkativeness.',
    icon: MessageSquare,
    color: '#0284c7', // Dark Blue
    category: 'engagement',
    threshold: 1000,
    type: 'comments',
    dependsOn: 'chatter'
  },
  
  // ─── DEALS ───
  {
    id: 'temp',
    nameVi: 'Nhân viên tập sự',
    nameEn: 'Temp',
    descriptionVi: 'Đã đăng 10 deal chất lượng.',
    descriptionEn: 'Posted 10 quality deals.',
    icon: ShoppingBag,
    color: '#e879f9', // Pink
    category: 'deals',
    threshold: 10,
    type: 'deals'
  },
  {
    id: 'cashier',
    nameVi: 'Thu ngân',
    nameEn: 'Cashier',
    descriptionVi: 'Hơn 50 deal! Công việc ở quầy thu ngân khá mệt đấy.',
    descriptionEn: 'More than 50 deals! Working at the cash register is tiring.',
    icon: ShoppingBag,
    color: '#c084fc', // Purple
    category: 'deals',
    threshold: 50,
    type: 'deals',
    dependsOn: 'temp'
  },
  {
    id: 'shop_owner',
    nameVi: 'Chủ cửa hàng',
    nameEn: 'Shop Owner',
    descriptionVi: 'Mở khoá khi đạt hơn 100 deal.',
    descriptionEn: 'Unlocked after reaching 100 deals.',
    icon: Store,
    color: '#9333ea', // Deep Purple
    category: 'deals',
    threshold: 100,
    type: 'deals',
    dependsOn: 'cashier'
  },

  // ─── MAX TEMPERATURE ───
  {
    id: 'spark',
    nameVi: 'Tia lửa',
    nameEn: 'Spark',
    descriptionVi: 'Một trong những deal của bạn đã đạt 100°!',
    descriptionEn: 'One of your deals reached 100°!',
    icon: Flame,
    color: '#fbbf24', // Yellow
    category: 'engagement',
    threshold: 100,
    type: 'max_temp'
  },
  {
    id: 'flame',
    nameVi: 'Ngọn lửa',
    nameEn: 'Flame',
    descriptionVi: 'Một deal đã đạt 500°. Thật sự rất nóng!',
    descriptionEn: 'A deal reached 500°. Getting really hot!',
    icon: Flame,
    color: '#ea580c', // Orange
    category: 'engagement',
    threshold: 500,
    type: 'max_temp',
    dependsOn: 'spark'
  },
  {
    id: 'firestorm',
    nameVi: 'Bão lửa',
    nameEn: 'Firestorm',
    descriptionVi: 'Deal của bạn đã chạm mốc 1000°! Cẩn thận kẻo bỏng!',
    descriptionEn: 'Your deal reached 1000°! Careful not to get burned!',
    icon: Flame,
    color: '#dc2626', // Red
    category: 'engagement',
    threshold: 1000,
    type: 'max_temp',
    dependsOn: 'flame'
  },

  // ─── VOTES ───
  {
    id: 'checker',
    nameVi: 'Người thẩm định',
    nameEn: 'Checker',
    descriptionVi: 'Đã bình chọn hơn 200 deal. Bạn đang giúp cộng đồng tốt hơn!',
    descriptionEn: 'Voted on over 200 deals. You are helping the community!',
    icon: CheckCircle2,
    color: '#4ade80', // Green
    category: 'votes',
    threshold: 200,
    type: 'votes'
  },

  // ─── DEAL COMMENTS ───
  {
    id: 'c_celeb',
    nameVi: 'Người nổi tiếng C',
    nameEn: 'C-List Celeb',
    descriptionVi: 'Một deal của bạn đã nhận được hơn 50 bình luận.',
    descriptionEn: 'One of your deals received over 50 comments.',
    icon: Star,
    color: '#fde047', // Light Yellow
    category: 'engagement',
    threshold: 50,
    type: 'max_deal_comments'
  },
  {
    id: 'b_celeb',
    nameVi: 'Người nổi tiếng B',
    nameEn: 'B-List Celeb',
    descriptionVi: '250 bình luận cho một deal? Không nhiều người làm được đâu!',
    descriptionEn: '250 comments for a deal? Not many can do that!',
    icon: Star,
    color: '#eab308', // Dark Yellow
    category: 'engagement',
    threshold: 250,
    type: 'max_deal_comments',
    dependsOn: 'c_celeb'
  },

  // ─── SOCIAL/SPECIAL ───
  {
    id: 'teachers_pet',
    nameVi: 'Trò cưng',
    nameEn: 'Teacher\'s Pet',
    descriptionVi: 'Đã cập nhật avatar và viết tiểu sử.',
    descriptionEn: 'Updated avatar and bio.',
    icon: UserCheck,
    color: '#ef4444', // Red-ish
    category: 'social',
    threshold: 1,
    type: 'social'
  }
]
