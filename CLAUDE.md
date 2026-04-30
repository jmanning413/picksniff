# PickSniff — AI Context File
# Read this entire file before doing anything. This is the full project context.
# Last updated: April 2026

---

## WHAT IS PICKSNIFF?
PickSniff is a fragrance matchmaking web app — "the dating app for fragrances."
It helps complete beginners find their perfect fragrance through a simple 4-step quiz.
It is independently owned (not affiliated with any retailer) and monetized through affiliate links + premium subscriptions.
The target user is someone who knows nothing about fragrance and wants help finding something they'll love.

---

## APP NAME
**PickSniff** (formerly called Scent Percent during planning — ignore that name going forward)

---

## CURRENT STATUS
- ✅ 750 fragrance database COMPLETE (all JSON files in /db folder)
- ✅ Master rules and accord system defined
- ✅ Business plan and monetization strategy defined
- ✅ UI/UX concept defined
- 🔲 App build starting NOW — Next.js + Supabase + Vercel

---

## TECH STACK
| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 14 (App Router) | React-based, deployed on Vercel |
| Database | Supabase (PostgreSQL) | Free tier to start |
| Hosting | Vercel | Free tier to start |
| Payments | Stripe | ~3% per transaction, no monthly fee |
| Images | Cloudinary | Free tier |
| Email | Resend or Postmark | Free tier |
| Analytics | Plausible or Google Analytics | |
| Domain | Namecheap or Google Domains | ~$12-15/yr |

---

## DATABASE STRUCTURE
**750 fragrances total across 15 JSON files in /db folder:**

| File | Count |
|------|-------|
| male_daily_final.json | 50 |
| male_date_night_final.json | 50 |
| male_sport_final.json | 50 |
| male_chill_final.json | 50 |
| male_formal_final.json | 50 |
| female_daily_final.json | 50 |
| female_date_night_final.json | 50 |
| female_sport_final.json | 50 |
| female_chill_final.json | 50 |
| female_formal_final.json | 50 |
| unisex_daily_final.json | 50 |
| unisex_date_night_final.json | 50 |
| unisex_sport_final.json | 50 |
| unisex_chill_final.json | 50 |
| unisex_formal_final.json | 50 |

### Each fragrance object looks like this:
```json
{
  "id": 1,
  "name": "Sauvage EDT",
  "brand": "Dior",
  "gender": "male",
  "tier": "budget",
  "vibe": "daily",
  "accords": ["fresh", "aromatic", "citrus"],
  "concentration": "EDT",
  "affiliate_type": "standard",
  "description": "Bergamot, ambroxan, and pepper...",
  "notes": {
    "top": ["Bergamot", "Pepper"],
    "middle": ["Lavender", "Pink pepper"],
    "base": ["Ambroxan", "Cedar"]
  }
}
```

### Tiers:
- **budget** = mainstream affordable (Dior, YSL, Versace, etc.)
- **quality** = premium designer (Prada, Tom Ford designer, etc.)
- **niche** = niche houses (Le Labo, Creed, Parfums de Marly, etc.)

### Affiliate types:
- **standard** = ALL fragrances including Chanel and Hermès — available on Sephora and Jomashop
- **brand_direct_only** = Louis Vuitton ONLY — no resellers exist anywhere, link to louisvuitton.com

**NOTE: brand_only no longer exists. Chanel and Hermès are sold on Sephora and Jomashop — use standard affiliate links for them.**

---

## QUIZ FLOW (4 STEPS)
1. **Gender** — Male / Female / Unisex (multi-select allowed)
2. **Price Tier** — Budget ($0-$100) / Quality ($100-$200) / Niche ($200+)
3. **Vibe** — Daily / Date Night / Sport / Chill / Formal
4. **Accords** — Pick up to 3 from the 11 available (optional)

### Result:
- Multiple fragrance matches ranked HIGHEST to LOWEST match %
- Every result has a unique score (no ties)
- Shows fragrance card with: name, brand, accords, notes, description, match % bar, BUY button

---

## 11 FILTER ACCORDS
Citrus, Floral, Woody, Vanilla, Amber, Spicy, Fresh, Aromatic, Fruity, Aquatic, Green

**NOT filter accords (exist in notes only):** Leather, Oud, Powdery (removed entirely)

---

## ACCORD ASSIGNMENTS BY GENDER + VIBE
### MALE
- Daily: ALL 11 accords
- Date Night: Amber, Spicy, Woody, Vanilla, Floral
- Sport: Citrus, Fresh, Aquatic, Aromatic, Green
- Chill: Woody, Aquatic, Fresh, Aromatic, Green
- Formal: Woody, Spicy, Amber, Aromatic

### FEMALE
- Daily: ALL 11 accords
- Date Night: Vanilla, Amber, Floral, Spicy
- Sport: Citrus, Fresh, Fruity, Aquatic
- Chill: Vanilla, Floral, Fruity, Amber
- Formal: Floral, Amber, Vanilla

### UNISEX
- Daily: ALL 11 accords
- Date Night: Amber, Vanilla, Spicy, Floral
- Sport: Citrus, Fresh, Aquatic, Aromatic, Green
- Chill: Vanilla, Amber, Floral, Woody, Green
- Formal: Woody, Amber, Floral, Aromatic

---

## UI DESIGN
- **Background:** White
- **Primary accent:** #7FE040 (Minecraft XP green)
- **Font:** DM Sans
- **Buy button:** matches accent green
- **Match bar:** XP-style green progress bar showing match %
- **Style:** Clean, minimal, beginner-friendly. NOT luxury. NOT overwhelming.
- **Fragrance cards show:** brand, name, concentration, accords (as pills), top 3 notes, description, match % bar, BUY button

---

## AFFILIATE SYSTEM
- Every fragrance has an affiliate_type field
- **standard** fragrances (everyone including Chanel and Hermès): Show Sephora + Jomashop buy buttons
- **brand_direct_only** fragrances (LV ONLY): Button says "Visit LV Boutique" → louisvuitton.com
- There are only TWO affiliate types — standard and brand_direct_only. No brand_only type.
- Chanel and Hermès are sold on Sephora and Jomashop — treat them as standard
- Affiliate IDs are configured once in environment variables and auto-applied to all links
- Goal: maximize affiliate click-through and conversion

### Affiliate Partners:
- Sephora (affiliate program)
- Jomashop (affiliate program)
- FragranceNet (affiliate program)
- FragranceX (affiliate program)

---

## MONETIZATION
### Free Version:
- Full quiz access
- Full 750-fragrance encyclopedia
- Basic filters
- Optional profile (no account required)
- Affiliate buy buttons

### Premium (~$4.99/mo via Stripe):
- Advanced quiz (concentration filter, top/middle/base note filters)
- Full encyclopedia filters
- Compare tool (side-by-side fragrances)
- Crown icon + custom profile border color
- View other users' quiz results
- Collection tab (owned vs wishlist)
- No sponsored placements

---

## COST STRUCTURE
| Stage | Users | Monthly Cost |
|-------|-------|-------------|
| Launch | 0-500 | $0-15/mo |
| Growing | 500-5k | $40-80/mo |
| Established | 5k-50k | $150-400/mo |
| Scaling | 50k+ | $500-1500/mo |

**Break even:** ~3 months
**First real profit:** ~6 months with consistent marketing

---

## REVENUE PROJECTIONS
- First 3 months: ~$150-200/mo
- 500 users: $1,700-2,000/mo potential
- 1,000 users: $500-1k/mo
- 2,000 users: $2-3k/mo
- Target: $5k-10k/mo in 1-2 years

---

## MARKETING STRATEGY
- Reddit fragrance communities (r/fragrance, r/cologne, r/femalefashionadvice)
- TikTok and Instagram short-form content
- Discord fragrance servers
- Organic first — no paid ads early
- Pitch to Jomashop as affiliate partner once traction established

---

## SECURITY REQUIREMENTS (implement across every phase)
1. **Environment Variables** — All API keys, Supabase credentials, Stripe keys, and affiliate IDs in `.env.local` only. Never hardcode secrets. Create `.env.example` with variable names but no values.
2. **Input Validation** — Use `zod` to validate every input on client and server. Validate quiz selections, search queries, profile fields, and all form inputs.
3. **Rate Limiting** — Use `@upstash/ratelimit`. Quiz: max 10/min per IP. Search: max 30/min per IP. Auth: max 5/min per IP.
4. **Caching** — Cache fragrance JSON at build time. Never re-read 750 files per request. Use Next.js `unstable_cache`.
5. **Deduplication** — 5-second cooldown between quiz submissions per user/IP. No duplicate wishlist saves.
6. **Atomic Operations** — All database writes use Supabase transactions. Either fully saves or fully fails.
7. **Security Headers** — Add to `next.config.js`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy.
8. **SQL Injection Prevention** — Use Supabase parameterized queries only. Never concatenate user input into queries.
9. **Error Handling** — Never expose internal errors to client. Log server-side, return generic messages to user.
10. **External Links** — All buy buttons and external links must use `rel="noopener noreferrer"`.

---

## BUILD ORDER (follow this sequence)
1. Initialize Next.js project
2. Set up Supabase database and import 750 fragrances
3. Deploy skeleton to Vercel
4. Build quiz UI (4 steps)
5. Build matching algorithm
6. Build fragrance card component
7. Build encyclopedia page
8. Wire up affiliate links
9. Add Stripe for premium
10. Mobile optimization
11. User profiles (optional)
12. Launch

---

## IMPORTANT DECISIONS ALREADY MADE
- Website first (not native app) — native apps later at 1,000 users
- No pricing stored in database — affiliate feeds pull live prices
- Unisex = fragrances worn by all genders regardless of marketing (not strictly "officially unisex")
- Female/Unisex vibes allow cross-vibe duplicates (male lists do not)
- Max 3 fragrances per brand per vibe per gender
- Max 1 LV fragrance per vibe
- Max 2 flankers from same DNA per vibe
- Byredo and Diptyque excluded from male and female lists (live in Unisex only)
- Le Labo = approved exception for all gender lists (brand only does unisex)
- Maison Margiela Replica and Jo Malone = approved for male-leaning and female-leaning lists

---

## DEVELOPER NOTES
- The developer (Joseph) is a complete beginner — explain everything step by step
- Never assume knowledge of terminal commands, file structure, or frameworks
- Always show full code, never partial snippets unless asked
- Confirm before overwriting any existing files
- The /db folder contains all 15 JSON files — treat these as the source of truth
- Do not modify the JSON files unless explicitly asked

---

## WHAT NOT TO DO
- Do not rename the app back to "Scent Percent" — it is now PickSniff
- Do not add Powdery as a filter accord — it was removed
- Do not add Leather or Oud as filter accords — notes only
- Do not add more than 1 LV fragrance per vibe
- Do not put Byredo or Diptyque in male or female lists
- Do not use pricing in the database — affiliate feeds handle live pricing
- Do not build a native app yet — website first
