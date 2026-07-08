// Only badges with real earning conditions exist (GAPS #13); add new ones
// ONLY together with the code in computeBadges that awards them.
export const BADGE_DEFS = [
  {
    id: 'first_sniff',
    icon: 'medal',
    name: 'First Sniff',
    description: 'Took the PickSniff quiz for the first time',
  },
  {
    id: 'collector',
    icon: 'bookmark',
    name: 'Collector',
    description: 'Saved 10 fragrances to the wishlist',
  },
]

export function computeBadges({ quizCount, wishlistCount }) {
  const earned = []
  if (quizCount >= 1) earned.push('first_sniff')
  if (wishlistCount >= 10) earned.push('collector')
  return earned
}
