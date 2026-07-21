# Nose Profile Data — What It Can Do For People

> Companion to `docs/NOSE-TEST.md` (the instrument). This document is about the
> **data the instrument produces**: what it can genuinely do for a user, what it
> must never claim, and the design rules that keep it on the right side of the line.
> Parallel to `docs/DATA-PRODUCT.md`, which covers *catalog* data. This covers *user*
> data, which is a different legal category with different rules.
> **STATUS: RESEARCH. NOTHING BUILT. NOTHING APPROVED.**
> Created 2026-07-21.

---

## 0. The framing decision

Nose profile data is **not a product to be sold.** It is user data collected to make a
free tool work better for the person who gave it. This document evaluates uses on one
criterion: *does this help the person?*

That is not only an ethics position, it is the correct strategic one. PickSniff's entire
competitive claim is independence — "we don't stock anything, we can't push anything."
A site that sold its users' perceptual data would forfeit that claim permanently, and it
is the only thing the site actually has that Fragrantica and the retailers do not.

See §6 for the one aggregate use that helps people without selling anything.

---

## 1. The single most important finding: what this data CANNOT do

**The Nose Test cannot detect smell loss, and must never be presented as able to.**

This matters because the temptation is real and the underlying science is genuine:
olfactory decline precedes Parkinson's and Alzheimer's diagnoses by years, and validated
30-second smell tests reach ~95% accuracy in diagnosed patients. It is one of the most
promising cheap screening tools in neurology.

**PickSniff cannot do any of it**, for a categorical reason:

> A real smell test **presents an odorant** and asks what you perceive.
> The Nose Test **presents a word** and asks what you remember.

Asking "do you like the smell of gasoline?" measures a memory and an attitude. It cannot
distinguish a person who smells gasoline normally and dislikes it from a person who can
no longer smell it at all, because both answer from the same stored concept. There is no
stimulus, so there is no measurement of current function.

The screening literature makes the same point from the other direction: the SCENTinel
validation work deliberately uses **multi-component odorant mixtures at high
concentration** precisely so that genetic variation *cannot* produce a false positive,
and the authors state screening should detect **acquired** smell loss rather than inherent
genetic differences. Our instrument is the exact inverse — it targets inherent differences
and has no way to see acquired loss.

**Therefore, hard rules:**

1. Never present the Nose Test as a health screen, smell test, or diagnostic.
2. Never mention Parkinson's, Alzheimer's, dementia, or any disease anywhere near it.
3. Never tell a user their smell "may be impaired."
4. If a user reports smell changes, the only correct response is: *see a doctor.*

The FDA finalized its General Wellness policy for low-risk devices in January 2026:
non-invasive low-risk wellness products are not regulated as devices, **but claims and
presentation are what move a product across the line**, regardless of consumer framing.
A fragrance recommender stays comfortably outside. A fragrance recommender that says
"your results suggest reduced olfactory function" does not.

This section exists so the idea is closed rather than quietly revisited later.

---

## 2. The legal design rule that keeps the good feature

The anosmia feature (NOSE-TEST.md §3) is the most useful thing in this whole line of work
and it has one genuine legal hazard: **inferring a genotype is inferring genetic data.**

- Under **CPRA**, genetic data is explicitly enumerated sensitive personal information,
  and inferences drawn to build a consumer profile are themselves personal information.
- Under **GDPR**, the threshold is specific and useful: if you can infer special category
  data **"with a reasonable degree of certainty"** you are caught by Article 9. If it is
  merely a **"possible inference"** or an **"educated guess"**, you are not.

That threshold is the whole game, and it maps onto a phrasing rule:

| Never say | Always say |
|---|---|
| "You carry the non-functional OR5A1 variant" | "Violet and iris notes may read faint to you" |
| "You are anosmic to Galaxolide" | "Some people barely register this musk. You may be one" |
| "Your genetics mean…" | "Based on your answers…" |
| "You have a genetic blind spot" | "This is a common difference in how people smell" |

The right-hand column is an educated guess about **perception** from self-reported
preference. The left-hand column is a claim about **the user's genome**, which we have not
sequenced, cannot verify, and would be regulated for asserting.

**Design rules:**

1. Store perceptual scores (`musk_intensity: low`). **Never store a genotype field, a
   gene name, or a variant ID against a user.** Gene names belong in the internal
   mapping table, never in the user's row.
2. All user-facing anosmia language is probabilistic. "May," "some people," "often."
3. Never make the blind-spot inference from a single answer. A one-question genotype
   guess is exactly the "reasonable degree of certainty" problem; a soft signal pooled
   across several questions is an educated guess.
4. Nose profile data is deletable and exportable with the account. (Account deletion is
   already a Phase 3 item and a standing truthfulness problem for the privacy policy.)
5. The privacy policy must describe this data plainly before a single profile is stored.

**None of this is legal advice.** If the anosmia feature ships, a lawyer should read §2
and the resulting copy.

---

## 3. What it does for one person

Ranked by how much it helps, not how impressive it sounds.

### 3.1 Explain a purchase they already regret

Everyone who has bought more than three fragrances owns one they hate and cannot explain.
The bottle sits there as a small, permanent, unexplained failure.

A nose profile can answer it: *"You marked baby powder and violets as strong dislikes.
This is built on iris and heliotrope. That's why."*

This is the cheapest and most emotionally satisfying thing in this document. It requires
no new data collection beyond the profile and one note pyramid, it works retroactively on
day one, and it converts a bad memory into self-knowledge. It also builds trust faster
than any recommendation can, because the user can immediately verify it against something
they already know is true.

### 3.2 Warn before a blind buy

NOSE-TEST.md §3.4. Four of the five best-selling fragrances in the world contain a
material a meaningful fraction of people cannot fully smell. Telling someone *before* they
spend money is the highest-value moment in the entire product.

### 3.3 Give them their own vocabulary

Beginners cannot describe what they want, which is why retailer quizzes ask about
personality instead. After the Nose Test a user can say "I'm high on green and dry woods,
low on powdery, and musks read faint to me" — and that sentence works **everywhere**, in
a shop, in a Reddit thread, talking to a sales associate. We hand them language for their
own experience and it works outside our site.

That is the most generous possible version of this product, and it is very hard for a
retailer to copy, because a retailer wants you dependent on their quiz.

### 3.4 Make sampling efficient

Sampling is the only real solution to blind-buy risk, and it is slow and expensive. A
profile turns "try everything" into "try these four, in this order, and skip the fifth
because you'll probably not smell the base."

---

## 4. What it does for people collectively — the biggest one

### 4.1 Fragrance reviews are broken, and this fixes them

The most common argument in fragrance is: *"This lasts ten hours!"* versus *"It vanished
on me in twenty minutes."* Both people are usually telling the truth. They have different
noses, and the review system averages them into a number that describes nobody.

Every review platform in this category — Fragrantica included — aggregates across
perceptually incompatible people and calls the mean an answer. **It is the central
unfixed defect in fragrance consumer knowledge**, and it exists because nobody has ever
had a model of the reader's nose to filter by.

With nose profiles you can say:

> **Longevity:** ~3 hours for people with your musk sensitivity. ~8 hours for others.

Not an average. A conditional answer, correct for the person reading it. Same mechanism
for projection, for sweetness ("reads much sweeter to people like you"), for the
"everyone raves and I smell nothing" phenomenon.

This makes PickSniff's reviews structurally better than Fragrantica's rather than a
smaller copy of them — which, per COMPETITORS.md, is the only viable way to relate to
them. It also requires the wear log, which is now load-bearing for a third independent
reason.

### 4.2 Nose-matched recommendation

"People whose noses match yours at 90% consistently reach for this." Standard
collaborative filtering, except the similarity metric is perceptual rather than
behavioral, which means it works before a user has any purchase history and does not
collapse into recommending bestsellers to everyone.

**Honest limit:** this needs scale. With a few hundred profiles it is noise. It is a
year-two feature that costs nothing to prepare for now by storing the right data.

### 4.3 Better gifting

The gift quiz exists and is guessing. A gift-giver who can answer six household-smell
questions *about the recipient* ("does she like the smell of a new leather jacket?")
produces a far better match than one guessing at "her vibe." Gifting is also the one
context where asking about someone else is natural rather than creepy.

---

## 5. The population nobody serves

Post-COVID olfactory disruption is large and durable:

- 50–75% of people experienced smell or taste loss during infection.
- 25–75% of those develop **parosmia** in recovery, where familiar things smell wrong,
  often disgusting. Coffee smelling like garbage is the canonical example.
- 18–49% report parosmia at ~2.5 months.
- **2.9–8.3% still have olfactory impairment two years later.**

That last figure is the important one. It is a permanent-for-now population in the tens of
millions globally, and the fragrance world offers them nothing. Every recommender, every
review, every note pyramid silently assumes a typical nose.

A profile that records "coffee and roasted notes are distorted for me" and routes around
them is straightforward to build once the instrument exists, and it is the kindest thing
on this list. It requires **no medical claim whatsoever** — the user tells us what is
distorted, we simply believe them and filter accordingly. §1's rules stay fully intact:
we are not diagnosing anything, we are accommodating what someone has already told us.

The same accommodation serves age-related olfactory decline, which is ordinary and
universal and equally unserved.

**This is also the most defensible thing on the list**, because serving it well requires
exactly the perceptual model the Nose Test produces, and no competitor is even looking.

---

## 6. The one aggregate use, and it is a gift not a sale

At scale, the aggregate data answers questions nobody has consumer-scale answers to:
what fraction of people can't smell the laundry musk, how green preference splits by
region, whether iris really is as polarizing as perfumers say.

**Publish it. Free, anonymous, aggregate, no personal data, no payment.**

- It is a genuine public good — the existing olfactory databases (Dravnieks, Leffingwell,
  Good Scents) come from trained expert panels and industry, not from the public.
  Laypeople-scale data is scarce and academically valuable.
- It is the best marketing PickSniff could ever do. "We asked 40,000 people if they like
  the smell of gasoline" is a press story, a Reddit front page, and a permanent citation
  magnet, which is precisely the durable SEO the gameplan says the site needs.
- It is credibility that cannot be bought, and it makes academic collaboration possible.

**Rules if this ever happens:** aggregate only, never individual rows, never anything
re-identifiable, opt-in disclosed at signup, and no payment ever changes hands. The moment
money is involved it becomes DATA-PRODUCT.md's problem, with all of that document's
verification and legal burden, plus the user-consent burden on top. Don't.

---

## 7. Explicitly out of bounds

| Not doing | Why |
|---|---|
| Health screening or any disease claim | §1. Instrument is incapable; claims cross the FDA line |
| Telling users their genotype | §2. Turns preference data into regulated genetic data |
| Selling or licensing nose profiles | §0. Forfeits the independence claim permanently |
| Sharing profiles with brands or retailers | Same |
| Gating any of it behind payment | Standing rule: PickSniff is 100% free, forever |
| Inferring ancestry from receptor variants | β-ionone allele frequency varies by ancestry. Technically possible, appalling, and squarely regulated |

That last row deserves a sentence. The literature notes the functional OR5A1 allele is the
minor allele in Asian populations and the most common in African ones. A system that
inferred receptor variants from a quiz could, in aggregate, correlate with ancestry. **We
do not model ancestry, we do not store variants (§2 rule 1), and we do not go looking.**
Writing it down is how it stays deliberate.

---

## 8. Recommended order

1. **§3.1 "why you hated that bottle"** — works retroactively, needs only a profile and
   one note pyramid, and builds trust immediately. Cheapest real magic available.
2. **§3.2 blind-buy warnings** — pending the NOSE-TEST.md §9.3 validation.
3. **§5 parosmia accommodation** — small build, large kindness, zero medical exposure,
   and no competitor is looking.
4. **§4.1 nose-matched reviews** — the structural advantage over Fragrantica. Needs the
   wear log and real review volume.
5. **§4.2 nose-matched recommendation** — year two, needs scale.
6. **§6 published aggregate findings** — when there is enough data to be honest about.

Note that 1, 2, 3, and 5 all depend on the wear log, which is now the single most
load-bearing unbuilt thing in the project.

---

## Sources

- [Point-of-care smell testing: clinical utility review, Frontiers in Allergy](https://www.frontiersin.org/journals/allergy/articles/10.3389/falgy.2026.1882615/full)
- [Odor identification testing in screening for early-stage Alzheimer's, Scientific Reports](https://www.nature.com/articles/s41598-023-32878-w)
- [Olfaction as an early marker of Parkinson's and Alzheimer's disease](https://pubmed.ncbi.nlm.nih.gov/34266602/)
- [Effects of genetics on odor perception: can a quick smell test screen everyone? Chemical Senses](https://academic.oup.com/chemse/article/doi/10.1093/chemse/bjae025/7693756)
- [Recovery rates and long-term olfactory dysfunction following COVID-19, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11156684/)
- [Increasing incidence of parosmia and phantosmia after COVID-19 smell loss, medRxiv](https://www.medrxiv.org/content/10.1101/2021.08.28.21262763.full.pdf)
- [FDA General Wellness: Policy for Low Risk Devices (2026 guidance)](https://fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices)
- [ICO — What is special category data? (inference threshold)](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/)
- [California AG — CCPA/CPRA sensitive personal information](https://www.oag.ca.gov/privacy/ccpa)
- [A dataset of laymen olfactory perception for 74 mono-molecular odors, Scientific Data](https://www.nature.com/articles/s41597-025-04644-2)
