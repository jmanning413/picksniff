# PickSniff Legal Compliance Review — June 2026

> ⚠️ **This is not legal advice.** It's a practical, code-verified inventory of legal
> exposure written by an engineer, mapped to the specific files that create it. For
> anything involving real money or real risk (LLC formation, ToS/privacy final text,
> EU expansion), spend the few hundred dollars on an actual lawyer review. Everything
> below is prioritized so that review is cheap when you get it.

Jurisdiction assumption: US-based sole operator, US-majority audience, but the site is
globally accessible (so GDPR/UK-GDPR exposure exists even if small).

---

## 1. FTC affiliate disclosure — your #1 practical risk once money flows

**Law:** FTC Endorsement Guides + §5 (deceptive practices). Material connections between
you and retailers must be disclosed **clearly and conspicuously, close to the claim/link**
— not just in Terms of Service.

**Current state:** Disclosure exists only inside `/terms` and `/about`. Buy buttons
(`ResultsClient.js`, `fragrance/[id]`, `WardrobeButton`, compare, brand pages) carry no
adjacent disclosure. Once you join affiliate programs (GAMEPLAN Phase 1), this becomes an
active violation; program ToS (Rakuten, CJ, Amazon) also *require* disclosure — being
kicked from a program is the more immediate consequence.

**Actions:**
- [ ] Add a one-liner near buy buttons, e.g. under the results header and on fragrance
  pages: *"PickSniff may earn a commission when you buy through these links."* Small,
  visible, above the fold where the buttons are. One shared component.
- [ ] Amazon (if used) has exact required wording: "As an Amazon Associate I earn from
  qualifying purchases" — must appear on pages with Amazon links.
- [ ] Keep the ToS/About language too — belt and suspenders.

## 2. False statements in your own legal pages — fix this week

These are written promises you currently break; they're also the easiest fixes.

| Statement | File | Reality | Fix |
|---|---|---|---|
| "You can delete your account at any time from your profile page" | `app/privacy/page.js` | No deletion feature exists anywhere | Either build self-serve deletion (AUDIT P8) or reword to "email us at hello@picksniff.com to delete your account" — and actually honor it (Supabase dashboard: delete auth user; cascades handle the rest) |
| "Premium is billed monthly at $4.99/month… cancel at any time… no refunds for partial months" | `app/terms/page.js` | Premium doesn't exist; `/premium` redirects to a tip jar | Replace the section with tip-jar terms: one-time voluntary payment, non-refundable, no goods/services owed |
| "We use cookies only for authentication… no tracking cookies" | `app/privacy/page.js` | True today; becomes false the moment `NEXT_PUBLIC_GA_ID` is set (GAMEPLAN Phase 0.6) | When enabling GA, update the cookies section same-day; GA4 with IP anonymization + no ads features keeps this mild |
| No mention that usernames/bios/collections are publicly visible | `app/privacy/page.js` | RLS makes them world-readable (SECURITY F-4) | Add a "Public information" section |

## 3. Privacy regimes (GDPR / CCPA / COPPA)

**Realistic posture:** you are far below CCPA business thresholds ($25M revenue / 100k
consumers), and GDPR enforcement against a US micro-site is a remote risk — but GDPR has
no size floor, EU users *will* take the quiz, and affiliate networks ask about compliance.
Cheap conformance now beats retrofitting.

- [ ] **Identify the controller**: privacy policy should name who operates the site (you /
  your future LLC) and a contact address. Currently it names nobody.
- [ ] **Data deletion honored** (§2 above) satisfies the core GDPR/CCPA right cheaply.
- [ ] **Data export**: on request, a JSON of profile + quiz results + collections is easy
  to produce manually; note it in the policy.
- [ ] **Consent for marketing email**: see §4 — this is the real GDPR gap.
- [ ] **COPPA**: fragrance content is general-audience; you don't knowingly target
  under-13s. Add a "PickSniff is not directed to children under 13" line to the ToS and
  don't add birthday fields. That's sufficient posture.
- [ ] If/when GA is on: mention analytics + retention, and prefer GA4 settings with ads
  signals off to stay out of "sale/share" territory under CCPA.

## 4. Email law (CAN-SPAM, and consent generally)

**Current state, verified in code:**
- ✅ Working unsubscribe (token link, immediate deletion) in welcome + broadcast footers.
- ❌ **No physical postal address in any email** — CAN-SPAM requires a valid postal
  address in every commercial email ($50k+ per-email statutory exposure is theoretical,
  but compliance is a PO box away).
- ❌ **Signup silently enrolls users in marketing email** (`app/auth/actions.js`
  auto-inserts into `subscribers`). Under CAN-SPAM this is survivable (opt-out regime);
  under GDPR it's plainly non-compliant for EU users; under program/network vetting it
  looks bad.
- ⚠️ Broadcast tool can send anything with no review trail.

**Actions:**
- [ ] Get a PO box or use a registered-agent address; add it to `lib/emails/welcome.js`
  and the broadcast footer in `app/api/broadcast/route.js`.
- [ ] Add visible text at signup: "By creating an account you'll receive our weekly
  fragrance email — unsubscribe anytime." (Minimum viable.) Better: an actual checkbox.
- [ ] Subject lines must not be deceptive; "From: PickSniff" is fine.
- [ ] Keep unsubscribe working within 10 business days (yours is instant — good).

## 5. Trademarks — using Dior/Chanel/etc. names

**Position:** listing, describing, and linking to genuine branded products is classic
**nominative fair use** — Fragrantica, Basenotes, and every review site operate this way.
You're fine *if* you don't imply endorsement or affiliation.

- ✅ `/about` already states "independently owned and not affiliated with any retailer."
- [ ] Extend to brands: add a footer line — *"All trademarks, brand names, and product
  names are the property of their respective owners. PickSniff is not affiliated with or
  endorsed by any fragrance brand."*
- [ ] Never use brand logos or official product photography without license. Current
  letter-avatar design (brand initial in a circle) is smart precisely because of this —
  **keep it**; if you ever add bottle images, that's a licensing project, not a quick win.
- [ ] "PickSniff" itself: run a free USPTO TESS search for conflicts; a trademark
  registration (~$250–350/class, self-filed) is worth it once revenue starts.
- ⚠️ The Louis Vuitton hardcoded link points at LV's site — linking is fine; just don't
  frame it as a partnership ("Visit LV Boutique" copy is acceptable).

## 6. Data provenance — where your 750-fragrance catalog came from

The catalog was compiled into PDFs and extracted by your own scripts. Factual data
(name, brand, concentration, note lists) is generally **not copyrightable** in the US
(facts; *Feist* doctrine) — but:

- [ ] **Do not scrape or bulk-copy Fragrantica/Parfumo/Basenotes** — their *presentation,
  descriptions, and curated data* are protected by their ToS and potentially database/
  compilation claims. Your accord assignments and descriptions must stay original. When
  Phase 3 adds real notes data, source from brand/retailer product pages and your own
  knowledge, written in your own words.
- [ ] Your synthesized descriptions are original — good. Human-written ones must be too.

## 7. Payments, taxes, business structure

- ✅ Stripe hosted checkout; you never touch card data (PCI burden ≈ zero, SAQ-A scope).
- [ ] **Tips are taxable income.** Track them; Stripe issues 1099-K over thresholds, but
  report regardless.
- [ ] **Affiliate income is taxable**; networks will require a W-9.
- [ ] **Form an LLC before meaningful revenue or meaningful traffic** — it's the single
  biggest liability shield available for a few hundred dollars. Update ToS/privacy to
  name the LLC when done.
- [ ] Tip jar wording: current "Support PickSniff — a one-time tip" is honest and creates
  no obligation. Keep it donation-flavored; never promise perks you don't deliver.

## 8. Content honesty (FTC deceptive practices, mild but real)

- ⚠️ `/trending` labels random picks "Most Viewed / Most Saved / Most Reviewed" — those
  are fabricated metrics presented as measurements. Low enforcement risk, but it's the
  same legal theory as fake reviews, and Reddit *will* notice, which is the bigger harm.
  → Relabel ("This week's rotation") until real data exists (AUDIT P4).
- ✅ No fake testimonials, no fabricated review counts, match percentages are presented
  as your own scoring (subjective methodology = fine).
- [ ] The results disclaimer in ToS ("fragrance is subjective… sample before buying") is
  good — consider surfacing a light version on the results page itself.

## 9. Accessibility (legal angle)

ADA website suits target US commercial sites of every size (serial plaintiffs exist).
You're low-profile, but the contrast fix and modal keyboard fixes in AUDIT §5 are cheap
and shrink the surface. WCAG 2.1 AA is the standard courts reference.

---

## Priority checklist (everything above, ordered)

**Before any marketing push (with GAMEPLAN Phase 0):**
1. Fix privacy policy (deletion claim, public-profile disclosure, controller identity)
2. Fix ToS (premium → tip jar terms; children's clause; trademark footer)
3. Affiliate disclosure component next to buy buttons
4. Postal address in email footers + signup consent line
5. Relabel /trending

**Before/with affiliate money (Phase 1):** Amazon-specific wording if used; W-9s; track income.
**At first real revenue:** LLC + lawyer pass over ToS/privacy ($300–800 well spent) + USPTO search.
**Ongoing:** update "Last updated" dates when policies change (both currently say April 2026 — stale the moment you edit).
