export const routes = {
  home: '/',
  deal: (slug: string) => `/deal/${slug}`,
  profile: (username: string) => `/ho-so/${username}`,
  category: (...slugs: string[]) => `/danh-muc/${slugs.join('/')}`,
  brand: (slug: string) => `/thuong-hieu/${slug}`,
  discussion: '/thao-luan',
  alerts: '/canh-bao-deal',
  vouchers: '/ma-giam-gia',
  freebies: '/mien-phi',
  search: '/tim-kiem',

  settings: {
    root: '/cai-dat',
    profile: '/cai-dat/ho-so',
    preferences: '/cai-dat/tuy-chon',
    notifications: '/cai-dat/thong-bao',
    socials: '/cai-dat/mang-xa-hoi',
    followers: '/cai-dat/nguoi-theo-doi',
  },

  post: {
    deal: '/dang-deal',
    voucher: '/dang-ma-giam-gia',
    referral: '/dang-referral',
    discussion: '/dang-thao-luan',
  },

  admin: {
    root: '/quan-tri',
    moderation: '/quan-tri/kiem-duyet',
    deals: '/quan-tri/bai-dang',
    users: '/quan-tri/nguoi-dung',
    categories: '/quan-tri/danh-muc',
    discussionCategories: '/quan-tri/danh-muc-thao-luan',
    reports: '/quan-tri/bao-cao',
    ads: '/quan-tri/quang-cao',
    affiliates: '/quan-tri/doi-tac',
    theme: '/quan-tri/giao-dien',
  },
} as const
