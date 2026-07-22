# The Nose Test — Question Script

> The buildable spec. `docs/NOSE-TEST.md` is the research and the reasoning; this is the
> flow a developer would implement. Every item here traces back to a section there.
> **STATUS: DRAFT FOR JOSEPH'S REVIEW. NOT BUILT.**
> Created 2026-07-21.

---

## 0. The problem this document had to solve

Assembling every item the research recommends produced **roughly 70 interactions**. Valence
plus three-state familiarity plus conditional association valence is ~2.3 taps per smell,
and 23 smells alone is over 50 taps before intensity, trigeminal, skin, emotion, and
ownership blocks are added.

That breaks the 90-second promise badly, and a quiz nobody finishes measures nothing.

**Two fixes, both of which improve the instrument rather than just shortening it:**

**Fix 1 — one control that captures two signals.** Instead of asking liking and familiarity
separately, one four-option row does both:

> **Love it · It's fine · Hate it · Never smelled it**

"Never smelled it" captures the familiarity variable that explains 37% of pleasantness
variance (NOSE-TEST §2.7b) at **zero extra taps**. Association valence, the finer signal,
moves to Tier 2.

**Fix 2 — tiers, not one long quiz.** A fast core that delivers a real result, plus optional
depth that measurably sharpens it. The user is told honestly how complete their profile is,
which is an engagement mechanic that happens to be true.

| Tier | Name | Taps | Time | Delivers |
|---|---|---|---|---|
| **1** | The Nose Test | ~22 | ~90 s | A real, usable nose profile |
| **2** | Make it sharper | ~21 | ~75 s | Association valence, food priors, skin effects, full accord coverage |
| **3** | What you already own | 2 fields | ~45 s | Level 4 revealed-preference data (NOSE-TEST §2.7d) |

**Tier 1 alone must be a good product.** Tiers 2 and 3 are invitations, never gates.

---

## TIER 1 — The Nose Test (~90 seconds)

### Screen 0 — Validity check

> **Quick one first: is your nose clear today?**
> *Clear · A bit stuffy · Properly blocked*

If not clear: *"No problem, carry on. Just know your answers today won't quite reflect your
usual nose, and you can retake this any time."*

Flags the session, weights it down, never blocks. **Not a health question** — a temporary
state asked for a stated data-quality reason (NOSE-TEST §2.7g).

### Screen 1 — Kitchen Calibration invite

> **Want the sharper version? Grab three things from your kitchen.**
> Coffee · Black pepper · A lemon
> *[I've got them] · [Just answer from memory]*

Opt-in, never a wall. Approved for v1 in NOSE-TEST §7.4. Store the compliance flag
**per question**, not per session — people fetch two of three. The memory-versus-live split
is the §9.4 experiment running free from day one.

### Screens 2–15 — The core fourteen

**One control on every item:** `Love it · It's fine · Hate it · Never smelled it`

Ordered to hook first: the openers are the ones people argue about.

| # | Question | Maps to |
|---|---|---|
| 1 | Petrol at the pump | D15, D16, D17 |
| 2 | Play-Doh | D8, D11 |
| 3 | A new leather jacket | D17 |
| 4 | Freshly cut grass | D2 |
| 5 | Damp forest floor after rain | D18, D16 |
| 6 | Church incense, or a blown-out match | D16, D15 |
| 7 | Baby powder | D8, D11 |
| 8 | Black licorice | D19, D12 |
| 9 | **Does cilantro taste like soap to you?** | D5, D1 |
| 10 | Dried lavender | D21 |
| 11 | A swimming pool | D3, D4 |
| 12 | Ground coffee beans † | D12 |
| 13 | Beach sunscreen | D10, D7 |
| 14 | **Grapefruit — refreshing, or too bitter?** *(Refreshing · Depends · Too bitter)* | **D1b** + TAS2R38 supertaster proxy |
| 15 | Sharpening a pencil | D13 |

† Kitchen Calibration item.

**Dynamic swap (approved).** If the user tapped *"I've got them"* on Screen 1, promote
**black pepper** and **lemon** from Tier 2 into the slots held by **sunscreen** and **pencil
shavings**, displacing those two to Tier 2. Rationale: a live stimulus at Level 2 of the
evidence ladder beats a remembered one at Level 1 (NOSE-TEST §2.7), and those are the
weakest two items in this set by information value. The item count does not move either way.

**Citrus correction (added 2026-07-21, NOSE-TEST §2.7k).** Grapefruit was added to Tier 1
after Joseph flagged that citrus — **190 of 748 catalog entries, the sixth most common
accord** — had only one weak Tier 2 item. It is the divisive citrus question the set was
missing: TAS2R38-grounded, universally familiar, and it splits a room. Core is now 15 smells
and Tier 1 sits at ~22 taps. **Grapefruit and lemon are not interchangeable** — grapefruit
probes D1b (bitter), lemon probes D1 (sweet), and the split is the whole point.

### Screens 16–18 — Intensity probes

Experience-anchored, never introspective (NOSE-TEST §2.6). These are the fragile half of the
instrument and the phrasing is doing real work.

| # | Question | Options | Maps to |
|---|---|---|---|
| 16 | **Can you smell rain before it arrives?** | Always · Sometimes · Never noticed this | D3 intensity ★ |
| 17 | **When you take laundry out of the dryer, do you smell anything?** | Strongly · Faintly · Not really | D4 intensity ★ *(Galaxolide probe)* |
| 18 | **Have you ever been handed flowers and smelled almost nothing?** | Yes, often · Once or twice · No | D8 intensity ★ *(β-ionone probe)* |
| 19 | **Asparagus — does your pee smell afterwards?** | Yes, strongly · Faintly · Never noticed | Sulfur / thiol intensity ★ *(OR2M7)* |

**Asparagus is the highest-information item in the set** (NOSE-TEST §11.1). Detection is
associated with **rs4481887 near OR2M7**, and the population splits close to **40% detect /
60% do not** — near the theoretical maximum information per tap. It is famous, instantly
answerable, and probes sulfur/thiol sensitivity, which nothing else in the quiz reaches and
which matters for cassis, blackcurrant, and grapefruit materials.

**Its one flaw, documented:** the trait has two parts, *excreting* the compounds and
*perceiving* them, and roughly **8% of people do not produce a detectable odour at all**. So a
"never noticed" conflates non-excretion with anosmia. Modest contamination — keep the item,
weight it marginally below the three cleaner ★ probes above.

### Screens 19–20 — Trigeminal pair

Joseph's pairing. Onion is involuntary so it reads sensitivity cleanly; spice mixes
sensitivity with appetite. **Spice measured against onion separates the two** (NOSE-TEST §6).

| # | Question | Options | Maps to |
|---|---|---|---|
| 18 | **Do you cry cutting an onion?** | Streaming · A bit · Never | D23 |
| 19 | **How hot do you like your food?** | The hotter the better · Some heat · Mild please | D22 + D23 |

### Screen 21 — Age

Last, always. Asking age first reads as bureaucracy; asking it last reads as a footnote.

> **Last one — roughly how old are you?**
> *Under 25 · 25–34 · 35–44 · 45–54 · 55–64 · 65+ · Rather not say*

**Weak covariate only.** Half of adults 65–80 have measurable smell loss, which means half
do not — so age is a prior any real answer overrides, never a driver, and never surfaced to
the user (NOSE-TEST §6.1, `NOSE-DATA.md` §1).

### → Result

Tier 1 ends on a complete, usable profile. See §Results below.

---

## TIER 2 — Make it sharper (~60 seconds, optional)

Offered on the results page: *"Your profile is good. Six more questions makes it sharper."*

### The remaining nine smells

Same four-option control. Fills the accord gaps Tier 1 leaves: D1, D6, D9, D14, D20.

| # | Question | Maps to |
|---|---|---|
| 20 | Earl Grey tea | D1, D2 |
| 21 | Freshly ground black pepper † | D20 |
| 22 | Zesting a lemon † | D1 |
| 23 | A real rose in a garden | D6 |
| 24 | Old books | D11, D13, D18 |
| 25 | Vicks VapoRub | D21 |
| 26 | Banana peel | D9 |
| 27 | Unlit pipe tobacco | D17, D12 |
| 28 | A worn shirt of someone you love | D17 ★, D4 |
| 29 | **Cut green bell pepper** | **D2** — IBMP, the same pyrazine family as galbanum |
| 30 | **A jasmine or gardenia bush in bloom** | **D7** — closes the white-floral gap |
| 31 | **Mulled wine, or a clove-studded orange** | **D19** — closes the warm-spice gap |
| 32 | **Sticky pine or fir resin on your hands** | **D15** — closes the resinous gap |

† Kitchen Calibration items.

**Items 29–32 close the coverage gaps found in the §11.4 audit.** Green pepper is not an
analogy for galbanum — **sBMP was identified in galbanum oil** and IBMP is its close
relative, so this is the same chemical family (NOSE-TEST §11.1). White florals (D7), warm
spice (D19), and resins (D15) were each reachable only obliquely before this; amber is
conventionally **labdanum + benzoin + vanilla**, so pine resin plus the existing vanilla and
incense items now triangulate it.

**D14 (creamy sandalwood) remains uncovered and is accepted as a gap.** No everyday reference
smell exists that is both globally familiar and divisive; sandalwood soap would serve in South
Asia but not in Western markets. Recover D14 from note pyramids after enrichment instead.

### Association valence

Shown only on items the user marked **Love it** or **Hate it** — roughly four to six of them.

> **You said you love the smell of [X]. Does it take you somewhere?**
> *A good memory · A bad memory · No, I just like it*

This is the strongest single signal in the quiz (NOSE-TEST §2.7c). Herz's mechanism is that
odour preference *is* learned emotional association — so a "love" backed by a memory is worth
far more than a bare one, and a "hate" backed by a bad memory is close to unshakeable.

### One global emotion item

> **Is there a smell that instantly takes you back somewhere?**
> *Yes, several · One or two · Not really*

Identifies **association-driven versus chemistry-driven** users. Herz's mechanism does not
run equally in everyone, and knowing which kind of person this is **changes how much to
trust the rest of the instrument.** One tap.

### Food block

Flavour is dominated by retronasal olfaction, so these are **not personality questions —
they are odour-preference questions asked through the mouth**, about stimuli the user has
sampled hundreds of times over years (NOSE-TEST §2.7i).

| # | Question | Options | Maps to |
|---|---|---|---|
| F1 | **How sweet do you like things?** | Can't be too sweet · Middle of the road · Most desserts are too sweet for me | **D11, D12 — gates the entire gourmand category** |
| F2 | **Something unfamiliar on the menu — do you order it?** | Usually · Sometimes · I stick to what I know | **D22** + global response-style correction |
| F3 | **Strong blue cheese?** | Love it · Tolerate it · Absolutely not | D17 animalic / sulfur tolerance |
| F4 | **Does celery taste strong or bitter to you?** | Very · A bit · Not really | D17 — **speculative** androstenone probe |
| F5 | **Steak — rare or well done?** | Rare · Medium · Well done, give me the char · **I don't eat steak** | **D16, D17, D12** — guaiacol / syringol / Maillard |
| F5b | *(if "I don't eat steak")* **Toast — barely golden or properly dark?** | Barely golden · Golden · Dark and crunchy | Same axis, no meat |

**F1 is the highest-value single question in Tier 2.** Sweet-liking is a stable trait, and
gourmand — vanilla, caramel, praline, the whole Angel and Black Opium lineage — is one of
the largest and most polarising categories in fragrance. A sweet-disliker rejects all of it
regardless of how well their accords otherwise match.

**F2 earns its place twice.** It reaches adventurousness without asking about chilli (useful
for anyone who does not eat spicy food for cultural rather than perceptual reasons), and
neophobia depresses *both* pleasantness and intensity ratings, which makes it a **global
calibration term for every other answer in the quiz.** Cheapest accuracy gain in the spec.

**F5 has the most literal mapping in the food block.** Burning wood breaks lignin down into
**guaiacol** and **syringol** — and **birch tar and cade oil, the backbone of every classic
leather accord**, are made by pyrolysing birch bark and juniper heartwood into those same
phenols. The leather note in perfumery is made by burning wood. Someone choosing a charred
crust is stating a preference about guaiacol (NOSE-TEST §2.7l).

Two constraints on F5. **The opt-out must be unremarkable** — a large minority does not eat
beef for dietary, religious, or ethical reasons, and F5b covers the identical axis without
meat, so nobody is dropped. And **weight it below the direct smoke items** (church incense,
leather jacket): rare-versus-well-done is partly about texture, moisture, and family habit,
not only aroma.

**Never attach health framing to F5.** Charred meat and PAHs are a real toxicology topic and
have no place in a fragrance quiz.

**F4 is flagged speculative and should be treated as an experiment, not a signal.** Celery
contains androstenone, but celery aversion may be driven by phthalides instead, and no study
has tested celery liking against OR7D4 genotype. Include it *because* it is testable: if F4
correlates with the other androstenone-adjacent items in live data, that is a novel finding
worth publishing (`NOSE-DATA.md` §6). If it correlates with nothing, cut it at the first
§9.2 review.

**Scoring caution (NOSE-TEST §2.7j).** Food items are **strong priors, not verdicts.**
Weight them *above* direct odour items on the hedonic question and *below* them on the
wearing question — liking to eat something is not wanting to wear it, and orthonasal and
retronasal perception run through different neural pathways. Never phrase a result as
*"you like cinnamon, so you'll love this."*

### Skin block

| # | Question | Options |
|---|---|---|
| S1 | **When you wear fragrance, does it fade in a couple of hours or last all day?** | Gone by lunch · Half a day · Still there at bedtime · I don't wear fragrance |
| S2 | **Has a fragrance ever smelled great on the paper strip and then wrong on you?** | Yes, often · Once or twice · Never |
| S3 | *(if S2 ≠ Never)* **Which way did it go?** | Sour or sharp · Too sweet · Metallic · Just vanished |
| S4 | **Do people mention your fragrance without you bringing it up?** | Often · Sometimes · Never |

Captures the skin interaction that NOSE-TEST §2.4 identified as a hard ceiling — **as observed
outcomes, not as biology.** S3 is the actionable one: sour-turners steer off aldehydic and
citrus-forward openings, sweet-turners off stacked gourmand-amber, vanishers get a
concentration fix rather than a chemistry one.

**Never explain results by mechanism.** *"Fragrances tend to turn sour on you"* — yes.
*"Your skin pH is acidic"* — never. That mechanism is unsourced folklore (NOSE-TEST §2.7e).

---

## TIER 3 — What you already own (optional, highest value per tap)

**Placement: after the results page** (approved). Asking before would produce better first
recommendations, but adding a search-and-type step ahead of the payoff is where quizzes lose
people. Offered as an upgrade — *"Own anything already? Tell us and we'll sharpen this."*

> **Know any fragrances you already love? That tells us more than everything above.**
> *[search / type up to three]*
>
> **And any you bought and got rid of?**
> *[search / type up to three]*

Look them up in the catalog, read off accords, tier, concentration, and post-enrichment the
full note pyramid. **This is Level 4 revealed-preference data available at quiz time**
(NOSE-TEST §2.7d).

The abandoned list is the stronger of the two and nobody asks it — a bottle someone got rid
of is a high-confidence signal that cost them real money to generate.

Optional and skippable: a true beginner owns nothing, and beginners are who this exists for.
It is also the natural bridge into the wear log — someone who just typed three fragrances is
one tap from a collection.

---

## Results page

Governed by the anti-Barnum rule (NOSE-TEST §7.3) and the asymmetric loss rule (§2.7h).

**Must contain:**

1. **A falsifiable prediction, up front.**
   > *"You should dislike iris-heavy fragrances. La Vie Est Belle is one. Are we right?"*
   > *[Yes] [No]*

   A Barnum statement cannot be wrong; a measurement can. This is also the §9.1 validation
   running live, so the honest design and the measurement design are the same design.

2. **Ranked matches, risk-averse.** Prefer a high-confidence match to a high-ceiling gamble
   — unless D22 is high, in which case the user has explicitly asked for the gamble.

3. **A concentration recommendation, not just a bottle.** The catalog already carries the
   `concentration` field.
   > *"Oud suits your profile, but you read scent strongly. Get the EDT, not the extrait."*

4. **Blind-spot warnings where flagged**, in the probabilistic phrasing `NOSE-DATA.md` §2
   requires. *"Some people barely register this musk — you may be one."* Never a genotype,
   never a deficit, never a gene name.

5. **Rotation, not a single signature.** Repeated exposure flattens liking (~40 exposures),
   so the output is *"here's your scent, and two more to rotate with so it keeps working"*
   (NOSE-TEST §2.9).

6. **Citrus expectation-setting, whenever a citrus-forward match is shown.** Citrus molecules
   are small and volatile — citrus oils typically fade in 15–30 minutes, and heat roughly
   doubles the rate every 10 °C.

   > *"You'll love this. It'll also be mostly gone in an hour. That's the material, not your
   > skin — citrus molecules are small and they leave fast. If you want it to last, look for
   > one anchored with amber or woods."*

   **And never let a citrus lover self-diagnose a skin problem.** A user whose profile is
   citrus-heavy and who reports "nothing lasts on me" is describing **physics, not their
   body** — the skin block (S1–S3) would otherwise mislabel them a vanisher and route them
   to a concentration fix that cannot help. Check the profile before interpreting S1.

**Must never contain:** a score, a normative comparison, any mention of smell loss or
disease, any personality description, or any claim about the user's genetics.

---

## Ordering and length — two rules from the §11 audit

**1. Randomise the core block after the first three items.** Question order primes and
anchors later answers; the standard mitigation is randomising order among independent items,
and our smells *are* independent. But the opening items are doing engagement work. **Keep
items 1–3 fixed (petrol, Play-Doh, leather), randomise 4–15, and log the seed** so order
effects stay measurable.

**2. Show an honest progress indicator from the first screen.** Survey completion falls
steeply with length — roughly **83% at 1–3 questions, 65% at 4–8, 56% at 9–14, and 42% at
15+** — and the mechanism is *regret*: people start, discover it is longer than expected, and
leave. Tier 1 is ~18 questions.

Those benchmarks come from surveys with no payoff, and entertainment quizzes with a desirable
result sustain far more, so this is not a reason to cut Tier 1. It **is** a reason to remove
the surprise entirely: show the length up front, show progress throughout, and front-load the
divisive fun so the first twenty seconds earn the next seventy. Also **log drop-off per
question** — if one item bleeds users, cut it (a free §9.2 diagnostic).

---

## Instrumentation — collect these silently on every session

None of this is visible to the user. All of it is free, and it is what makes the dataset
worth anything (NOSE-TEST §9.6).

| Capture | Why |
|---|---|
| **Per-item response latency** | Dual-use: fast answers signal strong automatic preference, and sub-800 ms answers flag as unread |
| **Straight-line flag** | Identical answers across all 14 core items = likely careless |
| **Total session duration** | The single most reliable careless-responding detector in the literature |
| **Kitchen Calibration compliance, per item** | Splits live-stimulus from memory answers — the §9.4 experiment, free, from day one |
| **Congestion flag** | From Screen 0. Down-weight, never discard |
| **One repeated item** | Ask a Tier 1 item again at the end of Tier 2. Disagreement flags the session *and* yields a per-session reliability estimate |

**Flagged sessions are down-weighted in aggregate, never blocked and never accused.** The
user still gets their result; we simply trust it less internally.

**No traditional attention checks.** "If you are reading this, select option three" works and
would wreck the tone. This quiz's reach depends on being charming enough to share, and the
passive methods detect better anyway.

**Reliability target.** Email a sample of users a few weeks out and ask them to retake it.
Published olfactory tests reproduce pleasantness ratings at **r ≈ 0.81** and intensity at
**r ≈ 0.63**. If our valence items land near 0.8, *"the most accurate fragrance quiz"* is a
defensible claim with a number behind it — and **no fragrance quiz has ever published a
reliability coefficient.** Cost: one email.

---

## Decisions — approved by Joseph, 2026-07-21

All four confirmed. No open questions remain in this spec.

1. **Tier 1 is 21 taps.** Not cut to 12 smells. The 90-second promise holds at this length.
2. **Dynamic swap approved.** When a user fetches the Kitchen Calibration items, black
   pepper and lemon are promoted into Tier 1 in place of sunscreen and pencil shavings
   (items 13 and 14, the weakest two). Those two drop to Tier 2.
3. **Tier 3 comes after the result**, offered as an upgrade rather than a gate. Slightly
   worse first recommendations, materially lower abandonment.
4. **Question wording is frozen once data collection begins.** See the warning below.

---

## ⚠️ Wording freeze — read before editing any string in this file

The label effect (NOSE-TEST §2.7) is not a rounding error. Herz & von Clef showed the
identical molecule rated **pleasant when labelled "parmesan cheese" and disgusting when
labelled "vomit."** A verbal label does not nudge a hedonic judgement, it can invert it.

Therefore **the exact wording of every question is part of the instrument, not copy.**
"Petrol at the pump" and "a filling station on a summer evening" will not get the same
answers about the same molecule.

**Once live data collection starts:**

- Do not reword an item to make it read better, sound more on-brand, or fit a layout.
- Do not "fix" British vs American spellings mid-collection (petrol/gasoline is a *different
  question*, not a localisation).
- Any wording change resets that item's response history and invalidates its comparison to
  prior sessions.
- If an item must change, **version it** — new item ID, old data retained under the old ID,
  never silently overwritten.

Put this warning in a comment above the question array in the code, not only in this
document. Whoever edits it next will be reading the code, not `docs/`.