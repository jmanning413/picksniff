// Nose Test scoring engine. Pure, no I/O, no React. Mirrors the matchEngine.mjs
// convention: all logic lives here, the page is a thin UI shell over it.
//
// Research basis: docs/NOSE-TEST.md (the science) and docs/NOSE-TEST-SCRIPT.md
// (the question spec). Every loading below traces to a section there.
//
// ############################################################################
// ## WORDING FREEZE. Read docs/NOSE-TEST.md 2.7 before editing any question. ##
// ############################################################################
// Verbal labels do not nudge odour judgements, they can invert them. Herz & von
// Clef showed the identical molecule rated pleasant as "parmesan cheese" and
// disgusting as "vomit". The exact wording of every prompt below is therefore
// part of the instrument, not copy.
//
//   - Do not reword an item to read better, sound more on-brand, or fit a layout.
//   - "Petrol at the pump" and "a filling station on a summer evening" are
//     DIFFERENT QUESTIONS about the same molecule. So are petrol and gasoline.
//   - Changing wording invalidates that item's comparison to all prior answers.
//   - If an item must change, give it a NEW id and retire the old one. Never
//     silently overwrite.

// --- Dimensions -------------------------------------------------------------
// 21 olfactory (D1..D21, plus D1b), and 2 non-olfactory modifiers that reorder
// results rather than selecting accords (D22 adventurousness, D23 trigeminal).

export const DIMENSIONS = {
  D1: 'Citrus, sweet',
  D1b: 'Citrus, bitter',
  D2: 'Green, crushed',
  D3: 'Aquatic, ozonic',
  D4: 'Clean musk',
  D5: 'Soapy aldehydic',
  D6: 'Floral, fresh',
  D7: 'Floral, white',
  D8: 'Powdery iris',
  D9: 'Fruity, sharp',
  D10: 'Fruity, creamy',
  D11: 'Gourmand, sweet',
  D12: 'Gourmand, roasted',
  D13: 'Woody, dry',
  D14: 'Woody, creamy',
  D15: 'Amber, resinous',
  D16: 'Smoke and incense',
  D17: 'Leather and skin',
  D18: 'Earthy and mossy',
  D19: 'Spice, warm',
  D20: 'Spice, sharp',
  D21: 'Herbal and camphor',
}

// Dimension to filter-accord rollup. The 11 filter accords are fixed product
// vocabulary and never change (see CLAUDE.md). D22/D23 deliberately absent:
// they modify ranking, they do not select accords.
const ACCORD_ROLLUP = {
  D1: ['Citrus'],
  D1b: ['Citrus'],
  D2: ['Green'],
  D3: ['Aquatic'],
  D4: ['Fresh'],
  D5: ['Fresh', 'Floral'],
  D6: ['Floral'],
  D7: ['Floral'],
  D8: ['Floral', 'Vanilla'],
  D9: ['Fruity'],
  D10: ['Fruity'],
  D11: ['Vanilla'],
  D12: ['Vanilla', 'Spicy'],
  D13: ['Woody'],
  D14: ['Woody'],
  D15: ['Amber'],
  D16: ['Amber', 'Woody'],
  D17: ['Amber', 'Woody'],
  D18: ['Green', 'Woody'],
  D19: ['Spicy'],
  D20: ['Spicy'],
  D21: ['Aromatic'],
}

// --- Valence items ----------------------------------------------------------
// One four-option control captures liking AND familiarity in a single tap.
// "Never smelled it" carries the familiarity variable, which explains ~37% of
// pleasantness variance (NOSE-TEST 2.7b), at zero extra cost.

export const VALENCE_CHOICES = [
  { id: 'love', label: 'Love it', score: 2 },
  { id: 'fine', label: "It's fine", score: 0 },
  { id: 'hate', label: 'Hate it', score: -2 },
  { id: 'never', label: 'Never smelled it', score: null },
]

// Items 1..3 are fixed openers (engagement). Items 4+ get shuffled per session
// to blunt order effects, with the seed logged. See NOSE-TEST 11.3.
export const SMELL_ITEMS = [
  { id: 'petrol', prompt: 'Petrol at the pump', icon: 'droplet', load: { D15: 1, D16: 1, D17: 1 }, fixed: true },
  { id: 'playdoh', prompt: 'Play-Doh', icon: 'cake', load: { D8: 2, D11: 1 }, fixed: true },
  { id: 'leather', prompt: 'A new leather jacket', icon: 'bookmark', load: { D17: 2 }, fixed: true },
  { id: 'grass', prompt: 'Freshly cut grass', icon: 'leaf', load: { D2: 2 } },
  { id: 'forest', prompt: 'Damp forest floor after rain', icon: 'pine', load: { D18: 2, D16: 1 } },
  { id: 'incense', prompt: 'Church incense, or a blown-out match', icon: 'candle', load: { D16: 2, D15: 1 } },
  { id: 'babypowder', prompt: 'Baby powder', icon: 'flower', load: { D8: 2, D11: 1 } },
  { id: 'licorice', prompt: 'Black licorice', icon: 'moon', load: { D19: 1, D12: 1 } },
  { id: 'lavender', prompt: 'Dried lavender', icon: 'sprig', load: { D21: 2 } },
  { id: 'chlorine', prompt: 'A swimming pool', icon: 'wave', load: { D3: 2, D4: 1 } },
  { id: 'coffee', prompt: 'Ground coffee beans', icon: 'sunrise', load: { D12: 2 }, kitchen: true },
  { id: 'sunscreen', prompt: 'Beach sunscreen', icon: 'sun', load: { D10: 2, D7: 1 } },
  { id: 'pencil', prompt: 'Sharpening a pencil', icon: 'sprout', load: { D13: 2 } },
]

// --- Special-format items ---------------------------------------------------
// These do not use the four-option valence control, so they are defined with
// their own options. Each option carries explicit dimension deltas.

export const SPECIAL_ITEMS = [
  {
    id: 'cilantro',
    prompt: 'Does cilantro taste like soap to you?',
    note: 'Cilantro and classic soapy aldehydes share the same molecules (C-10 and C-12).',
    icon: 'leaf',
    options: [
      { id: 'soap', label: 'Yes, like soap', delta: { D5: -2 } },
      { id: 'some', label: 'A little', delta: { D5: -1 } },
      { id: 'no', label: 'No, tastes fresh', delta: { D5: 2 } },
      { id: 'never', label: 'Never had it', delta: {} },
    ],
  },
  {
    id: 'grapefruit',
    prompt: 'Grapefruit: refreshing, or too bitter?',
    icon: 'citrus',
    options: [
      { id: 'refreshing', label: 'Refreshing', delta: { D1b: 2, D1: 1 } },
      { id: 'depends', label: 'Depends on my mood', delta: { D1b: 0 } },
      { id: 'bitter', label: 'Too bitter', delta: { D1b: -2, D1: 1 } },
      { id: 'never', label: 'Never had it', delta: {} },
    ],
  },
]

// --- Intensity probes -------------------------------------------------------
// The fragile half of the instrument (test-retest r = 0.63 vs 0.81 for valence,
// NOSE-TEST 9.5), so every prompt is anchored to a real repeated EVENT rather
// than asking anyone to rate their own sense of smell. Self-rated smell ability
// tracks mental imagery, not actual performance (NOSE-TEST 2.6).

export const INTENSITY_ITEMS = [
  {
    id: 'rain',
    prompt: 'Can you smell rain before it arrives?',
    icon: 'wind',
    dim: 'D3',
    options: [
      { id: 'always', label: 'Always', level: 2 },
      { id: 'sometimes', label: 'Sometimes', level: 1 },
      { id: 'never', label: "Never noticed this", level: 0 },
    ],
  },
  {
    id: 'laundry',
    prompt: 'When you take laundry out of the dryer, do you smell anything?',
    icon: 'droplet',
    dim: 'D4',
    blindSpot: 'clean musk',
    options: [
      { id: 'strong', label: 'Strongly', level: 2 },
      { id: 'faint', label: 'Faintly', level: 1 },
      { id: 'none', label: 'Not really', level: 0 },
    ],
  },
  {
    id: 'flowers',
    prompt: 'Have you ever been handed flowers and smelled almost nothing?',
    icon: 'rose',
    dim: 'D8',
    blindSpot: 'iris and violet',
    inverted: true,
    options: [
      { id: 'often', label: 'Yes, often', level: 0 },
      { id: 'once', label: 'Once or twice', level: 1 },
      { id: 'no', label: 'No', level: 2 },
    ],
  },
  {
    id: 'asparagus',
    prompt: 'Asparagus. Does your pee smell afterwards?',
    icon: 'sprig',
    dim: 'D17',
    blindSpot: 'sulfur notes like blackcurrant',
    options: [
      { id: 'strong', label: 'Yes, strongly', level: 2 },
      { id: 'faint', label: 'Faintly', level: 1 },
      { id: 'never', label: 'Never noticed', level: 0 },
    ],
  },
]

// --- Trigeminal pair --------------------------------------------------------
// Chilli heat is TRPV1, a pain channel, not olfaction. Onion tearing is an
// involuntary corneal reflex, so it reads sensitivity cleanly. Spice mixes
// sensitivity with appetite. Spice measured AGAINST onion separates the two.

export const TRIGEMINAL_ITEMS = [
  {
    id: 'onion',
    prompt: 'Do you cry cutting an onion?',
    icon: 'droplet',
    options: [
      { id: 'streaming', label: 'Streaming', sensitivity: 2 },
      { id: 'abit', label: 'A bit', sensitivity: 1 },
      { id: 'never', label: 'Never', sensitivity: 0 },
    ],
  },
  {
    id: 'spice',
    prompt: 'How hot do you like your food?',
    icon: 'chili',
    options: [
      { id: 'hot', label: 'The hotter the better', appetite: 2 },
      { id: 'some', label: 'Some heat', appetite: 1 },
      { id: 'mild', label: 'Mild please', appetite: 0 },
    ],
  },
]

export const TOTAL_QUESTIONS =
  SMELL_ITEMS.length + SPECIAL_ITEMS.length + INTENSITY_ITEMS.length + TRIGEMINAL_ITEMS.length

// --- Scoring ----------------------------------------------------------------

function emptyDimensions() {
  const d = {}
  for (const key of Object.keys(DIMENSIONS)) d[key] = 0
  return d
}

/**
 * Turn raw answers into a nose profile.
 *
 * @param {Record<string,string>} answers  itemId -> optionId
 * @returns {{
 *   dimensions: Record<string, number>,
 *   accords: string[],
 *   tier: string,
 *   vibe: string,
 *   blindSpots: string[],
 *   adventurousness: number,
 *   trigeminal: number,
 *   unfamiliarCount: number,
 *   prediction: { accord: string, dimension: string } | null,
 * }}
 */
export function scoreNoseProfile(answers = {}) {
  const dimensions = emptyDimensions()
  let unfamiliarCount = 0

  // Valence items
  for (const item of SMELL_ITEMS) {
    const choice = VALENCE_CHOICES.find((c) => c.id === answers[item.id])
    if (!choice) continue
    if (choice.score === null) {
      unfamiliarCount += 1
      continue
    }
    for (const [dim, weight] of Object.entries(item.load)) {
      dimensions[dim] += choice.score * weight
    }
  }

  // Special-format items
  for (const item of SPECIAL_ITEMS) {
    const opt = item.options.find((o) => o.id === answers[item.id])
    if (!opt) continue
    if (opt.id === 'never') { unfamiliarCount += 1; continue }
    for (const [dim, value] of Object.entries(opt.delta)) {
      dimensions[dim] += value
    }
  }

  // Intensity probes. These scale confidence in a dimension rather than
  // expressing liking, so a low reading damps that dimension toward zero and
  // raises a blind-spot flag. Never phrased to the user as a deficit.
  const blindSpots = []
  for (const item of INTENSITY_ITEMS) {
    const opt = item.options.find((o) => o.id === answers[item.id])
    if (!opt) continue
    if (opt.level === 0) {
      if (item.blindSpot) blindSpots.push(item.blindSpot)
      dimensions[item.dim] *= 0.5
    } else if (opt.level === 2) {
      dimensions[item.dim] *= 1.15
    }
  }

  // Trigeminal pair. Onion is the clean sensitivity read; spice relative to
  // onion is the cleaner adventurousness read than spice alone.
  const onion = TRIGEMINAL_ITEMS[0].options.find((o) => o.id === answers.onion)
  const spice = TRIGEMINAL_ITEMS[1].options.find((o) => o.id === answers.spice)
  const trigeminal = onion ? onion.sensitivity : 1
  const appetite = spice ? spice.appetite : 1
  // Feeling the burn AND seeking it anyway is the true sensation-seeker signal.
  const adventurousness = appetite + (trigeminal >= 2 && appetite >= 2 ? 1 : 0)

  // High trigeminal sensitivity means sharp spice materials read as harsh
  // rather than warm, so damp them.
  if (trigeminal >= 2) {
    dimensions.D20 *= 0.7
    dimensions.D19 *= 0.85
  }

  // Roll dimensions up into the 11 filter accords.
  const accordScores = {}
  for (const [dim, value] of Object.entries(dimensions)) {
    if (value <= 0) continue
    const targets = ACCORD_ROLLUP[dim] || []
    const share = value / targets.length
    for (const accord of targets) {
      accordScores[accord] = (accordScores[accord] || 0) + share
    }
  }

  const ranked = Object.entries(accordScores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])

  // Fall back to a broadly likeable trio if someone answered "never smelled it"
  // or "it's fine" to nearly everything. Better a sane result than an empty one.
  const accords = ranked.length > 0
    ? ranked.slice(0, 3).map(([name]) => name)
    : ['Fresh', 'Citrus', 'Woody']

  // Tier. Adventurousness is the only honest signal we have for how challenging
  // a composition someone will tolerate.
  let tier = 'quality'
  if (adventurousness >= 3) tier = 'niche'
  else if (adventurousness <= 0) tier = 'budget'

  // Vibe, derived from the dominant accord.
  const VIBE_BY_ACCORD = {
    Aquatic: 'sport',
    Fresh: 'daily',
    Citrus: 'daily',
    Green: 'chill',
    Aromatic: 'daily',
    Woody: 'formal',
    Amber: 'date_night',
    Spicy: 'date_night',
    Vanilla: 'date_night',
    Floral: 'daily',
    Fruity: 'chill',
  }
  const vibe = VIBE_BY_ACCORD[accords[0]] || 'daily'

  // The falsifiable prediction. Every result must contain at least one claim
  // the user can tell us is wrong (NOSE-TEST 7.3). This is the anti-Barnum
  // guarantee and doubles as live validation.
  const worst = Object.entries(dimensions)
    .filter(([, v]) => v < 0)
    .sort((a, b) => a[1] - b[1])[0]
  const prediction = worst
    ? { accord: (ACCORD_ROLLUP[worst[0]] || [])[0] || null, dimension: DIMENSIONS[worst[0]] }
    : null

  return {
    dimensions,
    accords,
    tier,
    vibe,
    blindSpots,
    adventurousness,
    trigeminal,
    unfamiliarCount,
    prediction,
  }
}
