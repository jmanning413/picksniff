export const BADGE_DEFS = [
  {
    id: 'first_sniff',
    emoji: '🥇',
    name: 'First Sniff',
    description: 'Took the PickSniff quiz for the first time',
  },
  {
    id: 'collector',
    emoji: '💾',
    name: 'Collector',
    description: 'Saved 10 fragrances to the wishlist',
  },
  {
    id: 'advanced_sniffer',
    emoji: '🔍',
    name: 'Advanced Sniffer',
    description: 'Used the advanced quiz filters',
  },
  {
    id: 'wardrobe',
    emoji: '💎',
    name: 'Fragrance Wardrobe',
    description: 'Built a full fragrance wardrobe',
  },
  {
    id: 'encyclopedia_worm',
    emoji: '📚',
    name: 'Encyclopedia Worm',
    description: 'Viewed 50 fragrances',
  },
  {
    id: 'reviewer',
    emoji: '⭐',
    name: 'Reviewer',
    description: 'Left their first fragrance review',
  },
  {
    id: 'social_sniffer',
    emoji: '👥',
    name: 'Social Sniffer',
    description: 'Followed 5 other users',
  },
]

export function computeBadges({ quizCount, wishlistCount, ownedCount, reviewCount }) {
  const earned = []
  if (quizCount >= 1) earned.push('first_sniff')
  if (wishlistCount >= 10) earned.push('collector')
  if (reviewCount >= 1) earned.push('reviewer')
  return earned
}
