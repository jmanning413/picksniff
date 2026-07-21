import { readFile } from 'fs/promises'
import path from 'path'
import { unstable_cache } from 'next/cache'

const DIR = path.join(process.cwd(), 'fragrances')
const GENDERS = ['male', 'female', 'unisex']
const VIBES = ['daily', 'date_night', 'sport', 'chill', 'formal']

async function loadFile(gender, vibe) {
  try {
    const raw = await readFile(path.join(DIR, `${gender}_${vibe}_final.json`), 'utf-8')
    const items = JSON.parse(raw)
    return items.map((f) => ({ ...f, gender, vibe }))
  } catch {
    return []
  }
}

async function _loadAllFragrances() {
  const pairs = GENDERS.flatMap((g) => VIBES.map((v) => [g, v]))
  const batches = await Promise.all(pairs.map(([g, v]) => loadFile(g, v)))
  return batches.flat()
}

// BUMP THIS whenever /fragrances/*.json changes (e.g. after a CATALOG.md
// Stage A merge). revalidate:false never expires and Vercel's Data Cache
// persists ACROSS deployments, so without a version in the cache key a catalog
// change deploys but production keeps serving the previous data. Verified
// locally: a stale cache survived a rebuild and hid merged notes entirely.
const DATA_VERSION = '2026-07-21-swap-01'

// Cached across all requests for the lifetime of the server process.
// revalidate: false = never expire (fragrances are static JSON files).
export const loadAllFragrances = unstable_cache(
  _loadAllFragrances,
  ['all-fragrances', DATA_VERSION],
  { revalidate: false, tags: ['fragrances'] },
)

export async function getFragranceById(id) {
  const all = await loadAllFragrances()
  return all.find((f) => f.id === id) ?? null
}
