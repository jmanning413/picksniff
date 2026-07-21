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
| **1** | The Nose Test | ~21 | ~90 s | A real, usable nose profile |
| **2** | Make it sharper | ~17 | ~60 s | Association valence, skin effects, full accord coverage |
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
| 14 | Sharpening a pencil | D13 |

† Kitchen Calibration item.

**Dynamic swap (approved).** If the user tapped *"I've got them"* on Screen 1, promote
**black pepper** and **lemon** from Tier 2 into slots 13 and 14, displacing **sunscreen** and
**pencil shavings** down to Tier 2. Rationale: a live stimulus at Level 2 of the evidence
ladder beats a remembered one at Level 1 (NOSE-TEST §2.7), and sunscreen and pencil shavings
are the weakest two items in this set by information value. Tier 1 stays at 14 smells either
way, so the tap count does not move.

### Screens 16–18 — Intensity probes

Experience-anchored, never introspective (NOSE-TEST §2.6). These are the fragile half of the
instrument and the phrasing is doing real work.

| # | Question | Options | Maps to |
|---|---|---|---|
| 15 | **Can you smell rain before it arrives?** | Always · Sometimes · Never noticed this | D3 intensity ★ |
| 16 | **When you take laundry out of the dryer, do you smell anything?** | Strongly · Faintly · Not really | D4 intensity ★ *(Galaxolide probe)* |
| 17 | **Have you ever been handed flowers and smelled almost nothing?** | Yes, often · Once or twice · No | D8 intensity ★ *(β-ionone probe)* |

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

† Kitchen Calibration items.

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

**Must never contain:** a score, a normative comparison, any mention of smell loss or
disease, any personality description, or any claim about the user's genetics.

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