# Accord Imagery Spec: One Owned Visual Per Accord

> Build spec for PickSniff's owned card imagery: one AI-generated image per
> accord, in a single consistent house style, used to give every fragrance card
> a rich relevant visual WITHOUT bottle photos. 100% owned, legally clean, and
> impossible to revoke (no affiliate/retailer dependency). Shares its house
> style with `docs/NOTE-PYRAMID.md` so accords + note-ingredient images read as
> one designed set. Written 2026-07-20.

---

## 1. Why accords, not bottles (read this first)

We deliberately do **NOT** generate images of real fragrance bottles. Two hard
reasons, settled during planning:

1. **Trademark.** Real bottles (Sauvage, Bleu de Chanel, etc.) are trademarked
   trade dress with copyrighted label art. AI-reproducing them is reproducing
   branded design; it is no more legal than lifting a photo, and most image
   tools forbid branded content outright. "Make it AI" launders the look, not
   the rights.
2. **Accuracy.** AI cannot render a *specific real* bottle correctly. You get
   subtly-wrong fakes (invented logos, wrong caps/colors). On an independent,
   honest recommendation site, showing a fake version of the bottle someone is
   about to buy is worse than showing no bottle.

**The accords solve both.** PickSniff's matching engine is built on 11 accords.
An image per accord is:
- **Owned forever** — we generate it; no retailer can revoke it.
- **Legally clean** — natural materials/textures, zero trademark anywhere.
- **Relevant** — a card's image reflects the scent family it actually matched on.
- **Efficient** — ~11 images cover all 750 fragrances (vs. 750 bottle fakes).
- **On-brand** — the "designed set" look Fragrantica's scavenged photos can't match
  (see `COMPETITORS.md`: "lean into the clean identity, don't pirate bottle photos").

**Feel, not ingredient claim.** Each image represents the accord *family/feeling*,
consistent with the feel-based copy in `lib/constants.js` `ACCORD_DESCRIPTIONS`.
A citrus image beside a Citrus-accord fragrance illustrates the family; it is not
a claim that any specific note is in that fragrance (honors the Design.md drift
rule: "describe the FEEL, never claim ingredients").

**Palette note.** Design.md bans new *UI* colors, but that governs interface
chrome (backgrounds, buttons, text). Content imagery carrying natural subject
color on a constant cream backdrop is the same exception already accepted for the
note-ingredient images. The UI *around* each image stays cream + green + ink.

---

## 2. The house style (shared with note images)

Every accord image uses the SAME lighting and backdrop so the set looks designed,
not scavenged. This is the single most important rule — consistency is the whole
effect.

> **Style DNA:** macro photography of a single natural subject, soft natural
> window light from the left, warm cream background (#F8F6F2), shallow depth of
> field, appetizing and premium, clean and minimal. **No text, no logos, no
> hands, no bottles, no packaging, no branding.** Square 1:1, subtle soft shadow.

### Reusable prompt template

Fill `{SUBJECT}` from the mapping in Section 3; keep everything else identical
across all 11 so the backdrop and light never drift:

```
Macro photograph of {SUBJECT}, single clear subject centered, soft natural
window light from the upper left, warm cream background (#F8F6F2, light warm
off-white), shallow depth of field with gentle bokeh, appetizing and premium,
clean minimal composition, subtle soft shadow, true-to-life natural color,
square 1:1.
No text, no words, no logos, no branding, no perfume bottle, no packaging,
no hands, no people.
```

(The negative line is not optional — it is what keeps every image trademark-free
and on-message.)

---

## 3. Accord to subject mapping (all 11)

Each subject is a representative natural material for the family — legible at a
glance, universally understood, never a branded product. Feel-language column is
the existing copy from `lib/constants.js`, kept aligned so image and words agree.

| Accord | `{SUBJECT}` to generate | Feel (existing copy) |
|---|---|---|
| Citrus | fresh-cut citrus slices (lemon, orange, grapefruit), juicy and bright | bright citrus lift |
| Floral | a soft cluster of fresh-cut unbranded flower petals | soft floral polish |
| Woody | cedar and sandalwood shavings with visible wood grain | smooth woods |
| Vanilla | split vanilla pods beside a soft pour of cream | creamy sweetness |
| Amber | translucent golden amber resin with a warm inner glow | warm amber depth |
| Spicy | warm whole spices (cinnamon bark, peppercorns, cardamom) | a confident spicy edge |
| Fresh | clean water droplets on a crisp white cotton surface | clean freshness |
| Aromatic | fresh herb sprigs (rosemary, sage, thyme), crisp and green | aromatic texture |
| Fruity | juicy sliced stone fruit and berries (peach, raspberry) | juicy fruit energy |
| Aquatic | a calm clear water surface with cool ripples and droplets | cool aquatic air |
| Green | crushed green leaves and snapped stems, fresh and leafy | crisp green character |

---

## 4. The one test image (do this before generating the set)

Generate **Citrus only** first, judge the look, and iterate the prompt until the
cream backdrop + soft light feel right. Then generate the other 10 in the same
tool/session so the whole set matches.

**Ready-to-paste test prompt (Citrus):**

```
Macro photograph of fresh-cut citrus slices (lemon, orange, grapefruit), juicy
and bright, single clear subject centered, soft natural window light from the
upper left, warm cream background (#F8F6F2, light warm off-white), shallow depth
of field with gentle bokeh, appetizing and premium, clean minimal composition,
subtle soft shadow, true-to-life natural color, square 1:1.
No text, no words, no logos, no branding, no perfume bottle, no packaging,
no hands, no people.
```

Judge it on: cream background (not white/gray), warm soft light, appetizing,
no text/logos, would look right shrunk to a small card thumbnail. If yes, that
backdrop + light is now locked for all 11.

---

## 5. Technical specs & files

- **Generate** at 1024x1024 master; **serve** a 512px square **WebP** (Next/image
  handles responsive downscaling for small cards). Keep masters in the repo or a
  backup folder; ship only the WebP.
- **Path:** `public/accords/{slug}.webp`
- **Slug:** lowercase accord name — `citrus`, `floral`, `woody`, `vanilla`,
  `amber`, `spicy`, `fresh`, `aromatic`, `fruity`, `aquatic`, `green`.
- **Provenance manifest (required):** `public/accords/MANIFEST.csv` with columns
  `slug, source (ai|stock|commissioned), prompt_or_url, date_added`. Same rule as
  the note images: if we can't say where an image came from, it doesn't ship.

---

## 6. How a card picks its image

- Use the fragrance's **dominant accord = `accords[0]`** (the first/dominant
  accord; the engine already treats index 0 as dominant). Map it straight to
  `/accords/{slug}.webp`.
- **Fallback that can never break:** if the accord has no image yet, render the
  current green-wash brand-initial tile. A missing file degrades gracefully to
  today's look — never a broken image.
- Mirror the registry-with-fallback pattern from `docs/NOTE-PYRAMID.md`
  (`lib/accordImages.js` exporting slug -> `image: bool`), so unknown/missing
  accords fall back automatically.

Surfaces that would adopt it (all currently show the letter avatar): results
cards (`ResultsClient.js`), homepage FOTD/trending, `/fragrance/[id]` hero,
`/encyclopedia`, compare + wardrobe modals. Wire results cards first (highest
traffic), roll out from there.

---

## 7. Build order

1. **Generate the Citrus test image** with the Section 4 prompt; review the look.
   (Owner + review step — nothing ships yet.)
2. On approval, **generate the other 10** in the same style/session; export all as
   512px WebP into `public/accords/`; fill `MANIFEST.csv`.
3. **Build `AccordImage`** (server component) with the registry + green-wash
   fallback; unit-safe (missing file never breaks a card).
4. **Wire into results cards first**, verify with `npx next build`, then extend to
   the other surfaces.
5. **Optional phase 2:** a handful of accord-*pair* images (e.g. Amber+Vanilla,
   Woody+Spicy, Citrus+Aquatic) for extra variety on the large top-match card.

## 8. Definition of done

- [ ] 11 accord images, one consistent house style, cream backdrop intact
- [ ] Every image trademark-free (no bottle, logo, text) and traceable in MANIFEST.csv
- [ ] Zero broken images possible (fallback to brand-initial tile verified)
- [ ] Cards show the dominant-accord image; UI chrome stays cream/green/ink
- [ ] Passes CI + Design.md rules (no emojis, palette, 12/16px radii)
