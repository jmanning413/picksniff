// Shared UI constants (GAPS #12) - single source of truth for values that
// were previously copy-pasted across pages.

export const VIBE_LABELS = {
  daily: 'Daily',
  date_night: 'Date Night',
  sport: 'Sport',
  chill: 'Chill',
  formal: 'Formal',
}

export const GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unisex', label: 'Unisex' },
]

export const FILTER_ACCORDS = [
  'Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber',
  'Spicy', 'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green',
]

export const VALID_TIERS = ['budget', 'quality', 'niche']
export const VALID_VIBES = ['daily', 'date_night', 'sport', 'chill', 'formal']
export const VALID_CONCENTRATIONS = ['EDT', 'EDP', 'Parfum', 'Cologne']

export const ACCORD_DESCRIPTIONS = {
  Citrus: 'bright citrus lift',
  Floral: 'soft floral polish',
  Woody: 'smooth woods',
  Vanilla: 'creamy sweetness',
  Amber: 'warm amber depth',
  Spicy: 'a confident spicy edge',
  Fresh: 'clean freshness',
  Aromatic: 'aromatic texture',
  Fruity: 'juicy fruit energy',
  Aquatic: 'cool aquatic air',
  Green: 'crisp green character',
}

export function buildDescription(accords = []) {
  const phrases = accords.map((a) => ACCORD_DESCRIPTIONS[a]).filter(Boolean)
  if (phrases.length === 0) return 'A balanced fragrance pick from the PickSniff library.'
  if (phrases.length === 1) return `A fragrance centered on ${phrases[0]}.`
  return `A fragrance with ${phrases.slice(0, -1).join(', ')} and ${phrases.at(-1)}.`
}
