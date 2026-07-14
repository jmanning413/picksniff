# Note Pyramid Spec: Visual Notes That Sell

> Build spec for the fragrance-page note pyramid: a Top / Heart / Base visual
> with appetizing note images, in the spirit of Fragrantica's note tiles but
> built from 100% legally-owned assets. Blocked on catalog batch 1 (real
> top/middle/base note data, docs/CATALOG.md Stage A). Written June 2026.

---

## 1. What we're building

A pyramid-shaped section on `/fragrance/[id]` (verified entries only):

```
                    TOP NOTES
                 "what you smell first"
               [bergamot] [pink pepper]

                   HEART NOTES
              "the core of the fragrance"
          [lavender] [geranium] [apple]

                    BASE NOTES
              "what lingers for hours"
      [ambroxan] [cedar] [vanilla] [patchouli]
```

- Three tiers, widening downward (an actual pyramid silhouette), each tier a
  centered row of note tiles.
- **Note tile** = round 1:1 image (the yummy part) + note name caption below.
  Tile follows Design.md: image in a `rounded-xl` frame or circle on white
  card, caption `text-xs font-bold text-slate`, DM Sans.
- Each tier gets a plain-language subtitle (see above): this keeps the
  beginner promise while looking expert-grade.
- Mobile: tiles wrap; tiers stay stacked; image size ~64px, desktop ~80px.
- Fallback when a note has no image yet: `bg-green-wash` circle with a
  line-style generic icon (droplet from QuizIcons) — never a broken image,
  never an emoji.
- Accessibility: every image `alt="{Note name}"`; tier headings are real
  `h3`s under the section `h2` ("Notes").

## 2. Where the images come from (LEGAL — non-negotiable)

**Never** scrape or hotlink Fragrantica, Parfumo, Wikimedia-unverified, or
Google Images results (docs/LEGAL.md §6). Approved sources, in order of
preference:

1. **AI-generated, made by us (primary plan).** Generate every note image in
   ONE consistent style so the set looks designed, not scavenged:
   - Style guide prompt: *single subject (the raw ingredient), macro food
     photography, soft natural window light, warm cream background (#F8F6F2),
     shallow depth of field, appetizing, no text, no hands, square 1:1.*
   - Same lighting/backdrop across all ~150 images = the "designed set" look
     Fragrantica doesn't have.
   - Cost: effectively zero; regeneration is easy when a note gets added.
2. **CC0 / permissive stock as gap-filler:** Pexels, Pixabay, Unsplash
   (their standard licenses permit commercial use without attribution).
   Only for subjects AI renders poorly. Record every download in the manifest.
3. **Commissioned photography/illustration** if the set ever gets a budget.

**Provenance manifest (required):** `public/notes/MANIFEST.csv` with columns
`slug, source (ai|pexels|pixabay|unsplash|commissioned), source_url_or_prompt,
date_added`. If we can't say where an image came from, it doesn't ship.

## 3. Asset pipeline

- Files live at `public/notes/{slug}.webp`; 512px square masters resized to
  256px WebP for serving (Next/image handles the rest).
- **Slug rules:** lowercase, accents stripped, spaces to hyphens
  ("Pink Pepper" → `pink-pepper`, "Crème de Cassis" → `creme-de-cassis`).
- **Note registry:** `lib/notes.js` exports `NOTE_REGISTRY` mapping
  slug → `{ name, image: bool }`. The pyramid component looks notes up here;
  unknown notes render the fallback tile automatically, so missing images
  can never break a page.
- Build the master note list FROM batch data: after each catalog batch merges,
  run `scripts/note-inventory.mjs` (to be written) to list distinct notes and
  which ones lack images. Generate images in batches of ~30.
- Expected scale: the whole 750-fragrance catalog will use roughly 150–250
  distinct notes; the top 40 notes cover most entries — image those first.

## 4. Component spec

`app/_components/NotePyramid.js` (server component, no client JS needed):

```jsx
<NotePyramid top={f.top_notes} heart={f.middle_notes} base={f.base_notes} />
```

- Renders nothing unless at least one tier has real data AND the entry is not
  a legacy accord-mirror (same guard as today's Notes section).
- Tier order/labels: TOP ("what you smell first"), HEART ("the core"),
  BASE ("what lingers"). Skip a tier cleanly if its array is empty.
- Replaces the current text-only Notes block on `/fragrance/[id]`. Compare
  page keeps compact text notes (no pyramid in cards).
- Layout: `flex flex-col items-center gap-6`; each tier
  `flex flex-wrap justify-center gap-4`, with `max-w` stepping wider per tier
  to create the pyramid silhouette.

## 5. Build order (after batch 1 merges)

1. `lib/notes.js` registry + slug util (+ unit test for slugging).
2. `NotePyramid` component with fallback tiles only (ships useful immediately).
3. Generate the top-40 note images per the style guide; add manifest entries;
   flip `image: true` in the registry.
4. Wire into `/fragrance/[id]` behind the existing real-data guard.
5. Remaining notes imaged in batches alongside catalog batches 02+.
6. Results cards MAY later show the top 2–3 note names (text only, no images
   in cards — keep cards fast).

## 6. Definition of done

- [ ] Pyramid renders on every `verified` fragrance, silhouette intact on
      mobile and desktop
- [ ] Zero broken images possible (registry fallback verified)
- [ ] Every image traceable in MANIFEST.csv; zero scraped assets
- [ ] One consistent visual style across the whole set
- [ ] alt text on every tile; headings pass axe
- [ ] Page still passes CI + Design.md rules (no emojis, cream/white/green
      palette, 12/16px radii)
