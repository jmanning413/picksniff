# The Nose Test — Reference-Smell to Perfumery Mapping

> Research artifact, v3. **Nothing here is built.** This exists so Joseph can judge
> whether the underlying science holds up BEFORE any code is written.
> v1 was reasoned from first principles. v2 added the peer-reviewed literature, which
> confirmed the premise, corrected one major design decision, and surfaced a second
> product that may be bigger than the first. v3 adds the variance decomposition that
> sizes the opportunity (§2.5), the most serious validity threat found so far and the
> phrasing rule that answers it (§2.6), adaptive delivery (§7.2), and the anti-Barnum
> rule (§7.3).
> Related: `docs/GAMEPLAN.md`, `docs/CATALOG.md` (notes enrichment — hard dependency),
> root `GAPS.md` #11. Created July 2026.

---

## 1. The premise, stated so it can be attacked

**Claim:** a person's responses to *household smells they already know* predict their
responses to *fragrances they have never smelled*, because the aroma materials
responsible for both are largely the same molecules.

This is not a metaphor. Pencil shavings are cedar. Earl Grey is flavored with actual
bergamot. Old-book smell is lignin degrading into vanillin. Play-Doh is, by Hasbro's own
trademark filing, "sweet, slightly musky, vanilla-like… with slight overtones of cherry
and the natural smell of a salted, wheat-based dough" — and perfumer Christopher Brosius
attributes the cherry facet to heliotrope, whose common name is literally the cherry pie
plant, and whose material (heliotropin) is the backbone of a hundred gourmands.

If the claim holds, PickSniff can profile a beginner's nose in 90 seconds without them
having smelled a single fragrance. That solves the cold-start problem every competitor
works around by asking personality questions instead.

---

## 2. What the literature actually says

### 2.1 The premise survives contact with the evidence

**Pleasantness is the primary axis of olfactory perception.** Not one dimension among
many — the first principal component. When a wide range of smells is rated, "do you like
it" is the single most salient thing a nose reports. Khan et al. (J. Neurosci. 2007)
showed the first principal component of *perceptual* space aligns with the first
principal component of *physicochemical* space, letting them predict the pleasantness of
novel molecules from structure alone at r = 0.55–0.59, replicated across American,
Muslim-Arab Israeli, and Jewish-Israeli groups at r = 0.49–0.57.

This matters more than it looks. Asking "do you like this smell?" is not a soft consumer
question. It is querying the dominant axis of the olfactory system, and that axis has
measurable physicochemical structure that generalizes across cultures.

**Honest caveat:** that model explains roughly 30% of variance. Real, replicated,
cross-cultural, and partial.

### 2.2 The direct precedent — six months old

**Sirvent et al., bioRxiv, January 2026:** a professional perfumer built three versions of
one commercial fragrance differing *only* in β-ionone concentration (0%, 10%, 50%). 168
participants, genotyped at rs6591536 (OR5A1).

Carriers of the G allele rated the 0% version significantly higher than the 10% and 50%
versions. AA homozygotes could not discriminate between the three at all.

**A single receptor variant predicted which version of a real perfume a person
preferred.** That is the closest thing to a direct test of this document's premise that
exists, and it came out positive.

### 2.3 The finding that forces a redesign

Look closely at that result. The people who are *most sensitive* to β-ionone **liked it
least**. Sensitivity produced aversion, not affinity.

v1 of this document asked a single love / neutral / hate question per smell. **That is
wrong.** It collapses two independent variables:

| Axis | What it measures | Stability |
|---|---|---|
| **Intensity** — "how strongly do you smell this?" | Receptor sensitivity | Largely genetic, stable for life |
| **Valence** — "do you like it?" | Learned hedonic response | Cultural, personal, drifts over time |

These are separable and they interact non-obviously. Someone who smells musk faintly and
loves it needs *more* musk. Someone who smells it overwhelmingly and hates it needs none.
Under v1's single question both answer "neutral" and get identical recommendations, which
is exactly backwards.

**Every question must be asked on both axes.** This makes the Nose Test a two-axis
perceptual instrument rather than a preference quiz, which is both better science and a
far harder thing for a competitor to copy from the outside.

### 2.4 What the evidence says will limit us

**Preference is mostly learned.** An international twin study on androstenone found
heritability of 28% for perceived intensity but only **21% for pleasantness.** Roughly
four fifths of *liking* is environment, culture, and personal history.

This is not fatal — it is a description of what the instrument measures. The profile
captures a person's *formed* preferences, which is what we want to predict. But it means
the profile can drift, and it must never be sold as reading your DNA.

**Perfume preference is partly a function of your body, not just your nose.** Lenochová
et al. (PLOS One 2012) found people choose perfumes that complement their own body odor.
Blends of a person's own skin with their self-chosen perfume were rated more pleasant
(p = 0.01) and attractive (p = 0.02) than blends with a randomly assigned perfume — while
the perfumes rated *in isolation* showed no pleasantness difference at all (p = 0.57).

So "skin chemistry" is real, it is individually specific, and **no quiz can measure it.**
This is a hard ceiling on the Nose Test's accuracy and an argument for the wear log as the
only instrument that can close the gap.

### 2.5 The result that makes "best in the world" a defensible ambition

Arshamian et al. (Current Biology, 2022) asked 225 people across **nine non-Western
cultures** — including three hunter-gatherer groups, the Seri of a coastal desert and the
Maniq and Semaq Beri of tropical rainforest — to rank monomolecular odorants by
pleasantness. They decomposed the variance:

| Source | Share of variance in odor pleasantness |
|---|---|
| **Individual personal taste** | **54%** |
| Molecular identity | 41% |
| **Culture** | **6%** |

Read that against how fragrance recommendation actually works today.

Every quiz in this market segments people by demographics, gender, region, lifestyle,
personality, or "vibe." **Those are proxies for culture and group membership — the 6%
band.** The catalog side (notes, accords, molecular composition) is the 41%, and it is
what Fragrantica and every database competitor already own.

**The 54% is personal, it is the single largest term, and nobody measures it.** That is
not a marketing claim; it is a variance decomposition published in Current Biology.

Two direct consequences:

1. **The opportunity is real and specifically sized.** A tool that measures individual
   perceptual preference is going after the largest term in the equation while everyone
   else optimizes the smallest one.
2. **"World" is scientifically supported, not aspirational.** Culture explaining only 6%,
   replicated from hunter-gatherers to urban dwellers, means the underlying instrument
   travels. Odor preference is not a Western construct.

**But one careful distinction.** Universality applies to the *underlying preferences*, not
to my *question set*. Play-Doh, Vicks VapoRub, Sharpie, and Ivory soap are culturally
specific stimuli. The preference structure they probe is universal; the objects are not.
That makes localization a **translation problem, not a validity problem** — every market
needs its own everyday-object list pointing at the same materials. Worth knowing early,
because it means the mapping (materials → dimensions) is the durable asset and the
question list is a localizable surface on top of it.

### 2.6 The most serious threat found so far, and how to design around it

I went looking for evidence that people can accurately report on remembered smells. What
I found is a genuine problem for the intensity axis introduced in §2.3.

**Olfactory imagery is weak and unevenly distributed.** Roughly 60% of people can generate
olfactory imagery at all. Those who can report it as far less vivid and harder to summon
than visual or auditory imagery. Olfactory imagery ability is also largely *independent*
of visual imagery ability, so it cannot be predicted from how visually imaginative someone
is.

**Worse: people cannot self-assess their own sense of smell.** In healthy participants,
self-rated olfactory ability did **not** significantly correlate with measured olfactory
performance (ρ = −0.221, p = 0.411). What self-ratings actually tracked was **mental
imagery vividness** (R² = 0.29 in healthy controls, 0.33 in hyposmics). People with vivid
odor imagination think they have a good sense of smell. That belief is close to unrelated
to whether they do.

Taken at face value this says: *asking someone how strongly they smell something measures
their imagination, not their nose.* That would undercut the intensity axis, the anosmia
probes, and therefore most of §3.

**The rescue — and it is a hypothesis, not a finding.** That study measured **global
self-concept**: "how good is your sense of smell?" An abstract question with no external
referent, answerable only by introspection, which is exactly the condition under which
imagery vividness fills the gap.

The anosmia probes in §3.5 are a different task. "Can you smell your laundry detergent on
clothes once they're dry?" is not introspection. It is **recall of a specific, repeated,
real-world event with an external referent** — closer to "have you ever noticed X" than to
"rate yourself." The respondent is reporting an experience, not estimating a faculty.

That distinction is plausible, it is consistent with the finding that familiar odors are
recognized far more reliably than unfamiliar ones, and it is **not yet tested.**

**Therefore, a binding design rule: never ask about a sensation. Always ask about an
experience.**

| Never (introspective — measures imagery) | Always (experience-anchored — measures events) |
|---|---|
| "How strongly do you smell musk?" | "When you take laundry out of the dryer, do you smell anything?" |
| "Rate your sensitivity to violets" | "Have you ever been handed flowers and smelled almost nothing?" |
| "Is your sense of smell good?" | "Has anyone pointed out a smell you couldn't detect at all?" |
| "How intense is this to you?" | "Do people say you wear too much, or not enough?" |

The last one is a favourite: it externalizes the judgement entirely onto other people, so
imagery vividness cannot contaminate it.

**The valence axis is much less exposed.** "Do you like the smell of gasoline?" queries a
stored evaluative attitude, not a reconstructed percept. Liking is retrievable without
vivid imagery, which is why hedonic rankings of familiar odors hold up cross-culturally
(§2.5). **Valence is the sturdier half of the instrument; intensity is the fragile half
and must carry the experience-anchored phrasing.**

### 2.7 Can we ever know someone likes a scent, with certainty?

Asked directly, and the honest answer is **no — certainty is unavailable in principle.**
Not because our instrument is weak, but because the thing being measured does not hold
still. Four findings, each independently sufficient to rule out certainty:

**1. The name changes the smell.** Herz & von Clef (2001) gave people a mixture of
isovaleric and butyric acid. Labeled **"parmesan cheese"** it was well liked. The
identical molecule labeled **"vomit"** was detested. The authors called these *olfactory
illusions*, and the effect is not subtle — it inverts the judgement.

This lands directly on our method, which presents **words**. "Do you like the smell of
gasoline?" is not a clean measurement of a molecule; it is a measurement of a molecule
fused to a word and everything the word carries. Kitchen Calibration (§7.4) helps because
the sensory input becomes real, but it does **not** eliminate this — we still say "go get
your coffee," and the label still frames the percept.

*Design consequence:* the wording of each question is part of the instrument, not
decoration. "Gasoline at the pump" and "a filling station on a summer evening" will not
get the same answers to the same molecule. Wordings must be fixed, deliberate, neutral,
and never changed casually once data collection starts.

**2. Preference moves as you use it.** Repeated exposure drives affective responses toward
neutral — roughly **40 exposures** flattens them. Pleasant odors become less pleasant;
unpleasant ones become less unpleasant. The mere exposure effect is modulated by initial
pleasantness, and there are sex differences: wanting declines with repetition in both men
and women, while liking declines significantly **only in men**.

So "does this person like this fragrance" has no permanent answer. Wear something forty
times and it flattens. **That is not a flaw to correct, it is a fact about noses**, and it
has a direct product implication: rotation is not a luxury, it is how you keep liking
things. The wear log and daily pick are the features that make rotation possible, which is
the third independent argument arriving at the same small table.

**3. Liking is not wanting.** These are distinct constructs in olfaction, not synonyms.
Someone can rate a smell highly and have no wish to be further exposed to it. This is the
"coffee is delicious and I don't want to smell like it" problem, and it means a hedonic
rating cannot be read as purchase intent.

**4. Saying is not doing.** The general consumer-research finding: stated preference
predicts actual behaviour at roughly **34% accuracy**, while behavioural methods reach as
high as **89%**. Around **38%** of people act differently from what they previously
stated. People answer as their aspirational self, not their actual one.

#### The useful reframe: a ladder, not a verdict

Certainty is off the table. But the four findings above describe a **hierarchy of evidence
quality**, and the whole game is climbing it:

| Level | Evidence | Rough quality | Who has it |
|---|---|---|---|
| 0 | Demographics, gender, "vibe", personality | ~6% of variance (§2.5) | Every competitor |
| 1 | Stated preference on named smells | ~34% ballpark, label-contaminated | The Nose Test v1 |
| 2 | **Stated preference with a real stimulus present** | Removes the imagery problem | Kitchen Calibration |
| 3 | Implicit measures (response latency, hesitation, forced-choice) | Bypasses self-report bias | Free to collect in a web quiz |
| 4 | **Revealed preference — what you actually reach for** | ~89% ballpark | The wear log |
| 5 | **Repurchase — you bought it again, or finished the bottle** | The strongest signal that exists | Nobody in fragrance tracks this |

Two observations that matter more than anything else in this document.

**First: every competitor is stuck at Level 0.** Retailer quizzes, personality quizzes, and
"AI fragrance finders" all segment on the 6% band. Simply reaching Level 1 with a real
perceptual instrument is a category jump.

**Second: PickSniff can reach Levels 4 and 5, for free, and nobody in this industry is
looking there.** "What did you actually wear today?" and "did you buy it again?" are the
two highest-quality preference signals available, they require no lab, no kit, no sensors,
and no permission. A wear log and a single "repurchased" flag would put PickSniff at the
top of this ladder while Fragrantica sits on aggregated Level 1 opinion.

#### Level 3 is free and we should take it

Two implicit measures cost nothing in a web quiz and reduce self-report bias directly:

- **Response latency.** Fast answers reflect strong, automatic, pre-reflective preference.
  Slow answers signal deliberation, ambivalence, or self-presentation. Timing every
  response is trivial and gives a confidence weight on every single answer for free.
- **Forced-choice pairs instead of rating scales.** "Which of these two?" beats "rate this
  1–5" for reliability — it removes scale-use bias (some people never say 5) and blunts
  social desirability, because there is no virtuous option to pick.

Physiological measurement (sniff magnitude, respiration, heart rate) reaches ~84% accuracy
in lab settings, but it requires a spirometer or a nasal cannula. **Out of scope, probably
forever, and the kit would not change that** — worth knowing so it is not chased.

#### What to actually promise users

Not "we know what you like." That claim is unsupportable, and per §7.3 it is also the
Barnum trap.

The honest and stronger promise is: **"We start with a good guess and get better every
time you tell us what you actually wore."** That is true, it is falsifiable, it describes
a tool rather than an oracle, and it is the only claim in this space that improves with
use rather than decaying.

### 2.7b What actually predicts liking (as opposed to intensity)

Joseph's objection, 2026-07-21: *"that's just intensity though — how else can we determine
if people like a smell?"* Correct, and it is the right question. Everything in §2.6 and
§6.1 measures how strongly something registers, not whether it is wanted. Four things
predict liking, in descending order of how much they explain.

**1. Familiarity — the single strongest predictor, and nobody uses it.**

**Familiarity explains as much as 37% of the variance in odour pleasantness ratings** —
more than odorant identity and population *combined* (33%). Familiar odours are mostly
rated pleasant (garlic being a notable exception); **unfamiliar odours are mostly rated
neutral.**

This is the largest single lever available and it is trivially askable: *"have you smelled
this before?"* Four consequences:

- **Ask familiarity alongside valence on every item.** A "neutral" from someone who has
  never encountered a smell means something completely different from a "neutral" from
  someone who knows it well. Currently the instrument cannot tell these apart.
- **Recommending something genuinely alien predicts a neutral response**, not delight.
  A recommender that optimises purely for novelty is optimising for indifference.
- **Liking can be built.** Mere exposure moves unfamiliar toward familiar and neutral
  toward pleasant, which is the strongest scientific argument for the sampling flow in
  `NOSE-DATA.md` §3.4 — samples are not just risk reduction, they are how preference forms.
- **A caution about our own instrument:** every reference smell in §6 was chosen for high
  familiarity, which is good for reliability but means we sample the pleasant end of the
  distribution by construction. Expect valence answers to skew positive and calibrate
  accordingly.

**2. Molecular structure.** Khan et al. (§2.1) predict pleasantness from physicochemical
properties alone at r ≈ 0.55–0.59, roughly 30% of variance, replicated cross-culturally.
Practically this means **structural similarity to things a person already likes is a real
signal** — which is what the note pyramids from `docs/CATALOG.md` unlock.

**3. Dose position — Joseph's oud hypothesis, corrected.**

The proposal was: someone sensitive to scent would not like a strong oud. **Half right, and
the correction is more useful than the original.**

*Where it holds.* Odour pleasantness follows an **inverted-U against intensity**: it rises
to an optimum, then falls even as intensity keeps climbing. For prototypically pleasant
odours the curve is inverted-U (rise, then plateau or decline); for unpleasant ones it is
roughly linear downward — more concentration, more dislike. And the one direct experiment
we have agrees: in the OR5A1 β-ionone study (§2.2), the people **most sensitive** to
β-ionone **liked it least**, preferring the 0% version.

*Where it fails.* A study specifically examining individual detection thresholds against
hedonic ratings concluded that **the relationship is odour-specific with no consistent
direction.** Sensitivity does not make people systematically like or dislike odours in
general. Correlations between hedonic rating and concentration were strong but ran opposite
ways by odour: apple ρ = −0.702, jasmine ρ = −0.718, durian ρ = +0.903, trimethylamine
ρ = +0.508. Individual threshold variation *partially explains* the large spread in hedonic
response at a given concentration — it does not set its sign.

*The precise version.* **Sensitivity determines where a given fragrance lands on your
dose–response curve. It does not determine whether that curve is rising or falling.** A
highly sensitive person can love oud — they just meet their optimum at a lower
concentration, so a full-strength powerhouse overshoots it.

*And this is immediately actionable, which is the payoff.* The catalog already carries a
**`concentration` field** (EDT / EDP / Cologne / Parfum). So a high-trigeminal,
high-olfactory-sensitivity profile should not be steered away from oud — it should be
steered toward **the EDT rather than the parfum**, toward skin scents over powerhouses, and
toward lighter application.

> *"Oud suits your profile, but you read scent strongly. Get the EDT, not the extrait."*

No retailer gives that advice, because it steers toward the cheaper bottle. It requires no
new data, it uses a field the catalog already has, and it is exactly the kind of
independent, slightly-against-interest recommendation that `docs/COMPETITORS.md` identifies
as the whole positioning.

**4. Revealed preference.** Level 4–5 of the §2.7 ladder. What someone actually reaches
for, and whether they bought it again. Still the strongest signal available, still gated on
the wear log.

### 2.7c The mechanism underneath all of it: emotional association

Herz's account, tested experimentally with novel odours paired against positive and
negative emotional contexts: **odour hedonic perception is a learned association between an
odour and the emotional context in which it was first encountered.** The emotion attaches
to the odour and gives it meaning; thereafter the odour can re-elicit that emotion.

This is not another predictor sitting alongside the others — **it is the generator of them.**
It explains why pleasantness is ~80% learned (§2.4), why familiarity predicts liking at 37%
(§2.7b), and why a verbal label can invert a hedonic judgement (§2.7). Familiarity predicts
liking *because* familiarity means you have accumulated associations.

**Which means the most informative question about someone's nose is biographical, not
chemical.**

*And the biography starts earlier than anyone would guess.* Mennella et al. (2001) had one
group of mothers drink carrot juice during the last three weeks of pregnancy and water while
breastfeeding, a second group the reverse, and a third water throughout. Infants exposed to
carrot **either in amniotic fluid or in breast milk** showed fewer negative facial
expressions when fed carrot-flavoured cereal than unexposed controls.

Flavours from the maternal diet cross into amniotic fluid and are swallowed by the fetus, so
**the flavour principles of a culture are experienced before the first solid meal.** Odour
preference formation begins before birth.

Two things follow. It explains why preferences feel innate while being learned — the
learning simply started before memory did, which is exactly why people insist "I've just
always hated that smell." And it makes **childhood-anchored questions legitimate probes**:
what a childhood kitchen smelled like is reaching toward the actual formative window in a
way that adult preference questions cannot. It also sharpens §2.5's localisation point —
culture reaches the nose through diet *in utero*, well before anyone chooses anything.

*How to capture it cheaply.* Free-text ("what does this remind you of?") is unscoreable at
scale. But we do not need the *content* of the association — only its **valence**. So the
familiarity toggle proposed in §2.7b should be three-state rather than binary:

| Answer | What it tells us |
|---|---|
| **Never smelled it** | Expect neutral. Low information, flag as such |
| **Know it, no particular association** | Clean-ish hedonic signal |
| **Know it, and it takes me somewhere** *(→ good / bad)* | **Strongest signal available in the quiz** |

Two taps, and it captures the actual mechanism of odour preference rather than its
symptoms. A "love" backed by a positive association is worth far more than a bare "love,"
and a "hate" backed by a bad association is nearly unshakeable by any amount of good
chemistry — which is exactly the sort of thing a recommender needs to know before
confidently suggesting something.

### 2.7d The most underused input: ask what they already love

Filed as an oversight on my part. §9.1 proposed asking users to name up to three fragrances
they already own and love — but only as a **validation** mechanism. It should be a
**primary input**, and probably the strongest one in the entire quiz.

If someone tells us they love Aventus, we can look it up in our own catalog and read off
its accords, its tier, its concentration, and (post-enrichment) its full note pyramid. That
is **Level 4 revealed-preference data available at quiz time, before any wear log exists.**
Twenty household-smell questions do not carry as much information as one honest answer to
"what do you already reach for?"

**And the negative version is stronger still, because nobody asks it:** *"what have you
owned and gotten rid of?"* Dislikes are sharper than likes, regret is memorable, and a
bottle someone abandoned is a high-confidence signal that cost them real money to generate.

Design notes:

- Optional and skippable. A true beginner owns nothing, which is the audience the Nose Test
  exists for — this input supplements the instrument, never gates it.
- It makes the quiz **self-improving in an unusually direct way**: every answer is both an
  input and a test of the household-smell mapping (§9.1 still works, it just runs on live
  data now).
- It is also the natural bridge to the wear log. Someone who has just typed three
  fragrances they own is one tap from a collection.

### 2.7e Two folk beliefs, checked

**"Skin chemistry" — the phenomenon is real, the popular mechanism is unsourced.**

Searching for evidence that skin pH or oiliness changes fragrance longevity returned
**fragrance retailer blogs exclusively** — no primary research. The claims ("oily skin holds
scent longer," "high pH intensifies musk," "acidic skin kills citrus") are repeated
everywhere in fragrance culture and I could not source any of them.

What *does* have peer-reviewed support is a different mechanism entirely: Lenochová et al.
(§2.4) showed perfume blends with a person's **own body odour** were rated more pleasant
(p = 0.01) and more attractive (p = 0.02) than the same perfumes blended with someone
else's, while the perfumes rated in isolation showed no difference (p = 0.57).

So: *"it smells different on you"* is **true and evidenced**. *"because your skin is oily
and your pH is 5.2"* is **folklore**. Do not print the mechanism.

*Practical consequence:* we cannot measure skin chemistry and should not pretend to.
**Measure the outcome instead.** "How long did it last on you?" in the wear log captures
the entire effect — pH, sebum, temperature, microbiome, body odour interaction — without
modelling any of it. This is the correct engineering response to an unmeasurable variable
with a measurable output.

**Weather — sound physics, blog-sourced specifics.**

Vapour pressure rises with temperature; that is basic physical chemistry and needs no
citation. Heat therefore accelerates evaporation: stronger initial projection, shorter
longevity, top and heart notes dominating. Cold slows it: quieter opening, longer life,
more gradual development. Humidity complicates it in both directions (more moisture on skin
slows evaporation, but saturated air disperses molecules less).

The direction of these effects is safe to act on. The *magnitudes* circulating online are
blog-sourced and should not be quoted. This is enough to power weather-aware daily
recommendations without making a single unsupportable claim.

### 2.7f Concrete questions for skin effects and emotion

Joseph, 2026-07-21: *"we need to figure out the questions we need to actually include to
figure out skin chemistry and emotion."* Correct, and it exposes an over-correction in
§2.7e. "Measure the outcome, not the mechanism" does **not** mean only the wear log can
measure outcomes. **The quiz can ask about outcomes the user has already observed on
themselves** — that is still an experience question (§2.6), not a physiological model.

Someone who has worn fragrance before is carrying years of self-observation. We should just
ask for it.

#### Block A — skin effects (4 questions, all experience-anchored)

| # | Question | What it captures | Why it works |
|---|---|---|---|
| A1 | *"When you wear a fragrance, does it usually fade in a couple of hours, or is it still there at the end of the day?"* | Net longevity prior on their skin | Sums sebum, pH, temperature, microbiome, and body-odour interaction into one observed number, without modelling any of them |
| A2 | *"Has a fragrance ever smelled great on the paper strip and then wrong on you?"* | **Skin-turn flag** | The single most diagnostic skin question available. People with "difficult skin" know it — they have hit it repeatedly and remember it |
| A3 | *(if A2 = yes)* *"Which way did it go — sour, too sweet, metallic, or just faint?"* | **Direction of the turn** | Actionable. Sour-turners avoid aldehyde- and citrus-forward; sweet-turners avoid gourmand-amber stacking; faint-turners are a longevity problem, not a chemistry one |
| A4 | *"Do people mention your fragrance without you bringing it up?"* | Projection outcome | Externalises the judgement onto other people entirely, so imagery vividness (§2.6) cannot contaminate it |

**Why this is legitimate where asking about pH is not.** A2 does not ask what the user's skin
*is*. It asks what has repeatedly *happened*. The answer already contains the effect of every
mechanism we cannot measure, and it required no health question, no special category data,
and no unsourceable claim about sebum. A1 and A4 are the same trick applied to longevity and
projection.

**Honesty constraint:** never explain the result by mechanism. Say *"fragrances tend to turn
sour on you, so we're steering away from aldehyde-heavy openings"* — never *"your skin pH is
acidic."* The first is a report of what they told us. The second is folklore (§2.7e).

#### Block B — emotion and association

Herz (§2.7c) says emotional association is the *generator* of odour preference, so this is
the highest-value block in the quiz. It is also where quizzes turn into horoscopes, so it
carries one hard rule:

> **Emotion questions must attach to a specific smell. Never to the person.**
> *"Does black pepper remind you of something?"* is scoreable and falsifiable.
> *"What feeling are you chasing?"* is a horoscope (§7.3).

| # | Question | What it captures |
|---|---|---|
| B1 | Per core item, replacing the binary familiarity toggle: **never smelled it / know it / know it and it takes me somewhere** | Familiarity (37% of pleasantness variance) **plus** presence of an association |
| B2 | *(if B1 = "takes me somewhere")* **good place / bad place** | **Association valence — the strongest single signal in the quiz** |
| B3 | One global item: *"Is there a smell that instantly takes you back somewhere?"* yes / no | Identifies **association-driven** users, whose valence answers should be weighted more heavily and whose chemistry-based predictions should be trusted less |

B3 is the cheapest and most interesting of the three. Herz's mechanism does not operate
equally in everyone — some people's preferences are dominated by biography, others' by
chemistry. **Knowing which kind of person we are talking to changes how much to trust the
rest of the instrument**, and it costs one tap.

#### What this does and does not buy

It genuinely raises accuracy: Block A captures the skin interaction that §2.4 identified as a
hard ceiling, and Block B captures the mechanism behind the 54% individual-variance term
(§2.5). Together they address the two largest unmodelled sources of variance in the whole
document.

**But state the ceiling honestly.** These are self-reports about past experience, which sit at
Level 1–2 of the §2.7 ladder, not Level 4. They are a large improvement over asking nothing
and they are not a substitute for the wear log. "Most accurate quiz on the internet" is a
reachable claim — *"we know what you'll like"* is still not, and §7.3 still applies.

### 2.7g A general rule for every physiological covariate

Smoking, allergic rhinitis, congestion, medication, pregnancy, and hormonal state all
genuinely affect olfaction. Allergic rhinitis causes measurable decrease, distortion, or
loss of smell, worsening with severity; smoking damages nasal epithelium and compounds it.

**We should ask about almost none of it.** Two reasons:

1. **It is health data.** Under GDPR these are special category; under CPRA, health
   information is sensitive personal information. Collecting it drags a free fragrance quiz
   into a compliance regime it has no business being in, and `NOSE-DATA.md` §1 forbids us
   from saying anything useful back.
2. **We do not need it.** The effect is fully captured downstream. Whatever a person's
   sinuses, sebum, hormones, or cigarettes are doing, it shows up in *how long things last
   on them* — which the wear log measures directly.

> **Rule: measure the outcome, never model the mechanism.**

This is the same conclusion reached for skin chemistry (§2.7e), and it generalises cleanly.
It keeps the quiz short, keeps us out of special category data entirely, and produces a
*better* estimate than any self-reported health variable would.

**The one exception, and it is not a health question: a validity check.** Someone taking the
Nose Test with a blocked nose produces garbage data, and we should know that.

> *"Stuffy right now? Your answers today won't reflect your usual nose — you can retake
> this any time."*

That asks about a **temporary state for a stated data-quality purpose**, not about a
condition. It protects the dataset, it is honest, and it is a kindness to a user who would
otherwise get a bad profile and blame the product. Flag the session, weight it down, invite
a retake. Never diagnose, never store it as a health attribute.

### 2.7h Asymmetric error cost — the ranking principle nobody applies

A design principle rather than a finding, but it follows directly from everything above.

**The two ways to be wrong are not equally bad:**

- **False positive** — we recommend something, they buy it, they hate it. Real money, an
  unreturnable opened bottle, and a memorable failure that costs us their trust.
- **False negative** — we fail to surface something they would have loved. They never know.
  Costs almost nothing.

Fragrance is expensive, effectively non-returnable once sprayed, and regret in this category
is vivid and long-lived (§3.1 of `NOSE-DATA.md` exists precisely because people carry a
bottle they hate around for years).

**Therefore ranking should be deliberately risk-averse**: prefer a high-confidence match
over a high-ceiling gamble, and let §7.3's falsifiable prediction carry the confidence
rather than the recommendation carrying it. The exception is exactly D22 — someone whose
adventurousness score is high is *telling us they want the gamble*, and for them the loss
function genuinely is different.

This is also why the anosmia warning (§3.4) is worth more than any positive recommendation
it might displace: **preventing one bad purchase beats surfacing one more good option**, and
almost no product in this market is built that way, because a retailer's loss function is
the opposite of the customer's.

### 2.7i Food preference as a second measurement of the same sense

Joseph, 2026-07-21: *"research how people liking certain foods guarantees them to like
certain scents."* Guarantee is too strong — §2.7j says exactly why — but the underlying link
is the strongest one in this entire document, because it is not a correlation between two
things. **It is largely the same sense, measured through a different opening.**

#### Why the link is so strong

**Flavour is mostly smell.** Retronasal olfaction — aroma travelling from the mouth up
behind the palate to the nasal mucosa — is the dominant contributor to what people call
taste. When someone says they love coffee, most of what they are reporting is an olfactory
judgement.

So food preference is not a proxy for odour preference. For the aroma component it is
**odour preference already collected**, by a person who has sampled it hundreds of times
under natural conditions across years. That is a far richer measurement than any single
quiz item could produce, and it is sitting there unused.

**And many food and perfume materials are literally identical:**

| Food | Material | Dimension |
|---|---|---|
| Vanilla | vanillin | D11 |
| Citrus peel | limonene | D1 |
| Coffee | pyrazines, furfuryl | D12 |
| Peach, apricot | γ-lactones | D10 |
| Coconut | γ-nonalactone | D10 |
| Almond, marzipan | benzaldehyde | D8, D11 |
| Cinnamon, clove | cinnamaldehyde, eugenol | D19 |
| Blackcurrant | cassis thiols | D9 |
| Grapefruit | thiols | D1 |
| Blue cheese, aged meat | sulfur, animalic volatiles | D17 |
| **Truffle, celery** | **androstenol / androstenone** | **D17** |

#### The three findings worth acting on

**1. Sweet-liking is a stable trait and it gates gourmand.**

Research identifies three reproducible phenotypes — **extreme sweet likers, moderate sweet
likers, and sweet dislikers** — classified by whether liking rises, peaks, or falls as sugar
concentration increases. The phenotype is **trait-like and stable across different
sweeteners**, not a passing mood.

And the direct bridge to odour: **odour pleasantness increased after pairing with sucrose
only for participants who like sweet taste.** Food preference gated whether an odour
preference could even be learned.

This matters enormously in fragrance because **gourmand is one of the largest and most
polarising categories** — vanilla, caramel, praline, sugar, Black Opium, La Vie Est Belle,
the entire Angel lineage. A sweet-disliker will reject those regardless of how well their
accords otherwise match. One question about dessert predicts a whole category.

**2. Food neophobia predicts both adventurousness and a response-style bias.**

The Food Neophobia Scale is a validated ten-item instrument. Neophobics **rated odours as
less pleasant *and* less intense, and sniffed them less vigorously.**

Two separate uses fall out:

- **A second route to D22.** Food neophobia reaches adventurousness without asking about
  chilli, which helps for anyone who simply does not eat spicy food for cultural reasons.
- **A response-style correction, which is the more interesting one.** Neophobia depresses
  *both* pleasantness and intensity ratings — that is a scale-use bias affecting **every
  answer in the quiz**, not just food items. One or two neophobia items give a global
  calibration term that makes all the other answers more comparable between people. This is
  the cheapest accuracy gain available anywhere in this document.

**3. Truffle and celery contain the androstenone family.**

Androstenol is present in black truffle at 40–60 ng/g, and androstenone occurs in boar
saliva, **celery**, and truffle. That is the same molecule behind the OR7D4 specific anosmia
in §3.2 — roughly 31% of people cannot smell it, and genotype explains 40% of intensity
variance.

*Honesty check.* The popular story that pigs hunt truffles because of the pheromone is
**contradicted** by experiment: pigs responded to truffle extract but **ignored purified
androstenol**, so other volatiles must drive detection. And truffle is a poor quiz item on
familiarity grounds — most people have never eaten it, and §2.7b says unfamiliar items
return uninformative neutrals.

**Celery is the usable version**: universally familiar, cheap, divisive, and it contains the
molecule. Flagged as **speculative** — celery aversion may be driven by phthalides rather
than androstenone, and I found no study testing celery liking against OR7D4 genotype. Worth
including precisely *because* it is testable: if celery answers correlate with the other
androstenone probes in live data, that is a novel finding worth publishing (`NOSE-DATA.md`
§6).

#### 2.7j Why it is a correlation and never a guarantee

Three specific reasons, each independently sufficient:

**Liking to eat is not wanting to wear.** Liking and wanting are distinct constructs in
olfaction (§2.7). Coffee is delicious and almost nobody wants to smell like a café. Food
preference predicts the *hedonic* response to a material; it does not predict willingness to
wear it on skin all day.

**Orthonasal and retronasal are different pathways.** This is the sharpest limit and it is
neurological rather than psychological: **retronasal odour perception requires taste cortex
while orthonasal perception does not.** The same molecule arriving through the mouth and
through the nostrils is processed differently. Transfer between them is real but lossy, and
that is a fact about brain architecture, not about our instrument.

**Concentration and context differ.** Food aroma at eating concentration and perfume on skin
at wearing concentration sit at different points on the inverted-U (§2.7b). Loving vanilla
in a custard says little about a vanilla extrait at full strength.

**So food items belong in the quiz as strong priors, weighted below direct odour items on
the wearing question and above them on the hedonic one.** Never phrase a result as *"you
like cinnamon, so you'll love this."*

### 2.7k Citrus — a genuine gap in v3, and what fixing it changed

Joseph, 2026-07-21: *"what about citruses, your research seems incomplete."* He was right, and
the error was a repeat of the one his rain question already caught.

**How it happened.** §6 cut "zesting a lemon" from the core set for having near-zero
**valence**-split — nearly everyone likes lemon. But §6's own refinement says there are *two*
kinds of divisiveness, and citrus was never checked for **intensity**-split. Meanwhile
**Citrus appears in 190 of 748 catalog entries**, making it the sixth most common accord we
carry. One weak Tier 2 item for a quarter of the catalog is indefensible.

#### Finding 1 — the dimension was wrong: split D1

Sweet citrus and bitter citrus are not one thing. Sweet orange and mandarin sit at one end;
bergamot, grapefruit, petitgrain, and bitter orange at the other — and the divide is
**genetically influenced**, which D1 as originally written could not express.

- **TAS2R38** bitter-receptor haplotypes: **PAV** (taster) versus **AVI** (non-taster).
- **PROP supertasters disliked bitter naringin solutions significantly more** than tasters
  or non-tasters, and PROP sensitivity was associated with **reduced acceptability of
  grapefruit juice.**
- Response to naringin in unsweetened grapefruit juice is a **fairly good predictor of PROP
  taster status**, and TAS2R38 plus TAS2R19 variation partly explains lower liking of
  higher-naringin grapefruit drinks.

So D1 splits into **D1 (citrus-sweet)** and **D1b (citrus-bitter)**. Bergamot alone justifies
this: it opens an enormous share of masculine fragrance, and it is a *bitter* citrus.

**Important caveat on mechanism.** TAS2R38 is a **taste** receptor, not an olfactory one. It
predicts grapefruit *juice* acceptance through bitterness on the tongue. Whether it predicts
grapefruit *fragrance* liking is **untested** — the orthonasal/retronasal gap in §2.7j
applies at full force.

There is a plausible indirect route worth flagging as a hypothesis: supertasters have denser
fungiform papillae and correspondingly more trigeminal innervation, so **PROP status may
predict D23 trigeminal sensitivity rather than D1b directly.** That is testable in live data
against the onion and spice items, and it would be a novel result either way.

#### Finding 2 — grapefruit thiol is extraordinary, but not a documented anosmia

1-p-Menthene-8-thiol, the compound that makes grapefruit smell like grapefruit, has an odour
threshold around **0.000034 ng/L in air** — among the lowest ever reported for a food
odorant, and enantioselective (the (R)-(+) form is roughly 4× more detectable than (S)-(−)).

**But I could not find documented individual variation in sensitivity to it.** Thiol
perception generally involves OR2T11 and copper-dependent amplification (§2.7 sources), and
sulfur-sensitivity polymorphisms exist — but nothing specific to grapefruit mercaptan.
**Do not mark grapefruit as an anosmia probe (★).** It is a preference item.

#### Finding 3 — the actionable one: citrus is where expectations, not fit, are the advice

Citrus materials are small and volatile. Limonene is 136 g/mol with high vapour pressure;
citrus oils typically fade within **15–30 minutes**, and top notes generally last 15–120.
Roughly, **every 10 °C rise doubles the evaporation rate** — the underlying physical
chemistry here is uncontroversial even though the specific figures circulating are
blog-sourced and should not be quoted as precise. Perfumers anchor citrus with resins like
benzoin and labdanum precisely because it will not stay on its own.

**This makes citrus the one accord where the honest advice is about expectations rather than
suitability:**

> *"You'll love this. It will also be mostly gone in an hour. That's the material, not your
> skin — citrus molecules are small and they leave fast. If you want it to last, look for
> one anchored with amber or woods."*

Two things follow for the engine:

1. **Do not let citrus lovers self-diagnose a skin problem.** A user reporting "nothing
   lasts on me" whose profile is citrus-heavy is describing **physics**, not their body.
   That distinction matters because the skin block (§script S1–S3) would otherwise mislabel
   them a "vanisher" and route them toward a concentration fix that will not help.
2. **Down-weight citrus recommendations in hot climates**, and pair the weather-aware daily
   pick (§2.7e) with this: citrus in summer heat is the worst-case longevity combination,
   even though summer is exactly when people reach for it.

#### The new questions

| Question | Options | Maps to |
|---|---|---|
| **Grapefruit — refreshing, or too bitter?** | Refreshing · Depends · Too bitter | **D1b**, plus a **TAS2R38 / supertaster** proxy and a candidate D23 predictor |
| Zesting a lemon or orange *(kitchen item)* | standard four-option | **D1** |

Grapefruit is the item citrus was missing: **genuinely divisive, genetically grounded,
universally familiar, instantly answerable, and shareable** — "are you a supertaster?" is a
concept people already enjoy. It belongs in Tier 1. Lemon stays a Tier 2 kitchen item, where
its near-universal liking costs us little.

### 2.7l Burnt food, and why "rare or well done?" is one of the best items in the set

Joseph, 2026-07-21, first as *"people who enjoy burnt food"* then sharpened to *"rare vs well
done steak."* The sharpening matters — the second version is a far better question — and the
chemistry underneath is as literal as pencil-shavings-are-cedar.

#### The mapping is not an analogy

Burning wood breaks **lignin** down into **guaiacol** and **syringol**. Guaiacol carries the
smoky flavour; syringol carries the smoky smell. On a grill these stick to the moist surface
of the meat, while the surface itself undergoes the **Maillard reaction**, throwing off
pyrazines and the savoury complexity of a crust.

Now the perfumery side:

- **Birch tar oil** is made by **pyrolysis of birch bark and wood** at 400–600 °C in sealed
  retorts.
- **Cade oil** is made by **destructive distillation of juniper heartwood**.
- Both are rich in **phenols, cresols, and guaiacol** — and both are the backbone of the
  classic leather accords: *Cuir de Russie*, *Bandit*, the whole Russian-leather family.

> **The leather note in perfumery is made by burning wood. It is the same chemistry as the
> char on a steak.**

Someone who reaches for a well-done crust is reporting a preference about **guaiacol** — the
identical molecule that makes birch tar read as leather. This item therefore lands on three
dimensions at once: **D16 (smoke-incense)**, **D17 (leather-animalic)**, and **D12
(gourmand-roasted, via Maillard pyrazines)**.

#### A possible receptor, flagged as unconfirmed

Reporting on peated whisky attributes guaiacol perception to the olfactory receptor
**OR10G4**, and notes that people are genetically more sensitive to guaiacol than to most
phenols — guaiacol appearing in whisky, wine, roasted coffee, bacon, and smoked fish.

**Source quality: whisky press, not primary literature.** I could not confirm OR10G4–guaiacol
from a peer-reviewed source in this session. It is plausible and consistent with the pattern
established for OR7D4, OR5A1, and OR4D6, but **do not mark this item ★ and do not state the
receptor anywhere user-facing** until it is confirmed. Treated as a preference item with a
promising hypothesis attached.

#### Why "rare or well done" beats "do you like burnt food"

1. **It is an identity, not an opinion.** People answer instantly and defend the answer.
   Almost nobody is undecided.
2. **It is a repeated real choice**, not a hypothetical — textbook §2.6 experience anchoring.
3. **It splits a room** on valence, hard.
4. **It is socially legible.** People already argue about this, which is exactly the property
   that made the gasoline and cilantro items work.

#### The honest caveats

- **It is not purely aromatic.** Rare-versus-well-done is also about texture, moisture, food
  safety anxiety, and family habit. Some of the signal is noise for our purposes. Weight it
  below the direct smoke items (incense, leather jacket) rather than above them.
- **A large minority does not eat beef**, for dietary, religious, or ethical reasons. The
  item needs a clean, unremarkable opt-out — *"I don't eat steak"* — that is not treated as a
  missing answer or a personality signal. Offer **toasted bread, dark or blond** as the
  substitute: same Maillard and pyrolysis axis, no meat.
- **Do not make health claims.** Charred meat and PAHs are a real toxicology topic (crude
  birch tar has to be vacuum-distilled from ~1000 ppm benzo[a]pyrene to under 10 ppm before
  perfumery use). None of that belongs anywhere near a fragrance quiz.

#### Where it goes

**Tier 2 food block**, not Tier 1 — D16 and D17 already have direct probes there via church
incense and the leather jacket. But it is **not redundant with them**, and the redundancy is
the point: if someone loves a charred crust and hates church incense, that divergence is
itself informative. It separates *liking a smell* from *wanting to wear it* (§2.7j) and flags
context-dependence that neither item alone would reveal.

Promote to Tier 1 only if live data shows it outperforming a weaker core item.

### 2.8 Covariates: age matters a lot, sex barely matters at all

Two demographic variables affect olfaction, and their relative sizes are the opposite of
what this industry assumes.

**Age is large and unavoidable.** About **half of US adults aged 65–80, and roughly three
quarters over 80, have measurable smell loss.** Decline accelerates with age and runs
faster in men (about 0.17 additional identification errors per 5 years relative to women).
Curiously, olfactory cortex neuronal loss begins *earlier* in women (fourth decade) while
men lose more later in life.

*Consequence:* age is a real covariate for the intensity axis and the blind-spot flags. An
older user reporting that musks read faint may be describing age-related decline rather
than a specific anosmia, and the two are not distinguishable by our instrument. **Never
tell an older user anything about their sense of smell** — `NOSE-DATA.md` §1's rules apply
with extra force here. Use age to weight the model internally, and say nothing.

**Sex is real but small.** A meta-analysis across **82 Sniffin' Sticks papers, 24 UPSIT
papers, and over 30,000 participants** found women outperform men on every olfactory
measure — and quantified it: Hedges *g* = 0.164 (threshold), 0.109 (discrimination), 0.078
(SST identification), 0.304 (UPSIT identification). The authors are explicit that **sex
accounts for less than 3% of variance** in most measures.

*Consequence, and it is a good one:* put that 3% next to the 54% of variance explained by
individual taste (§2.5) and the 6% explained by culture. **Sex is a rounding error in how
people actually smell.**

PickSniff splits its catalog into male / female / unisex. That split is a **social and
marketing convention, not a perceptual fact**, and the evidence now says so with numbers.
This is not an argument to remove the categories — people shop inside them and expect them
— but it is a strong argument that the nose profile should be built **entirely
independently of gender**, and that the gender filter should be applied afterwards, as a
browsing preference, never as an input to the perceptual model.

It is also genuinely good content: *"Your gender explains less than 3% of how you smell.
Your personal nose explains 54%."* That is a true, surprising, evidence-backed sentence
that no retailer will ever print.

### 2.9 The signature scent problem

The flagship quiz is the **Signature Scent Quiz**, and the science is awkward about the
premise. Presented honestly, because the name is fixed by product rule and the advice
underneath it does not have to be.

**What is solidly established:**

- **Liking flattens with repetition.** Roughly 40 exposures drives affective response
  toward neutral (§2.7). Wear one thing constantly and it stops delighting you.
- **Olfactory adaptation to your own fragrance is textbook.** You stop smelling it within
  10–30 minutes, and over half of receptor sensitivity returns after a couple of minutes
  in fresh air.

**What is real but weaker than the internet claims:** a 2022 study (Ryu et al., in
**Foods**, MDPI — commonly miscited as *Chemosensory Perception*, including by several
fragrance blogs) tested 19 untrained participants on Sniffin' Sticks TDI under no-fragrance,
just-about-right, and excessive personal fragrance conditions. Odor **threshold** and
**discrimination** were significantly impaired while wearing fragrance; **identification**
was not affected.

**Be careful with that one.** n = 19, and it measures the *acute* effect of currently
wearing fragrance during a test. It does **not** demonstrate that wearing a signature scent
daily causes lasting sensitivity loss, and the widely repeated claims about "cross-adaptation
to structurally similar molecules" and "rotate two or three scents weekly" are blog advice,
not findings I could source. Plausible, unverified, do not print as fact.

**The defensible conclusion:** repeated exposure flattens liking (well established), and
wearing fragrance impairs your own perception while you wear it (small study). Together
these argue that **a small rotation beats a single bottle** — not because one scent is
wrong, but because a signature scent slowly stops being perceptible to the one person
wearing it.

This is exactly the kind of true-but-inconvenient thing PickSniff should say, and it is
unsayable for anyone whose business is selling one more bottle of the same thing. It
reframes the product output from "here is your scent" to **"here is your scent, and here
are two more to rotate with so it keeps working"** — which is better advice, better
retention, and better for the user simultaneously.

It is also the fourth independent argument for the wear log.

---

## 3. The second product: specific anosmia

This came out of the research and I think it may be worth more than the quiz.

### 3.1 The most common complaint in fragrance has a mechanical explanation nobody uses

"It disappears on me." "I can't smell it after ten minutes." "Everyone raves about this
and I get nothing." The received wisdom is skin chemistry. A substantial part of it is
**specific anosmia** — a normal sense of smell with a targeted blind spot for particular
molecules, driven by ordinary genetic variation in a single olfactory receptor.

Amoore mapped six in chemical detail decades ago (sweaty, spermous, fishy, malty,
urinous, musky). Modern genetics has since pinned specific receptors to specific
molecules — and several of the affected molecules are load-bearing in modern perfumery.

### 3.2 Rates, with source quality marked honestly

**Peer-reviewed:**

| Molecule | Smells like | Receptor | Finding |
|---|---|---|---|
| Androstenone | Urinous, sweaty, musky | OR7D4 (RT/WM) | ~31% specific anosmia in a 335-person study; genotype explains **40%** of intensity variance |
| β-ionone | Violet, iris, powdery-floral | OR5A1 (D183N, rs6591536) | Functional carriers detect at **100× lower** concentration; allele frequency varies sharply by ancestry |
| Galaxolide | Clean laundry musk | OR4D6 (M263T, S151T) | First human receptor shown to drive specific anosmia to a musk |
| 3M2H | Human body odor | OR51B2 (L134F) | **"Almost 25% of the population has a specific anosmia to 3M2H"** |
| Macrocyclic musks (muscone, civetone, habanolide, ambrettolide) | Skin musk | OR5AN1 | Receptor responds to macrocyclic and nitro musks but **not** polycyclic (Galaxolide, Tonalide) — so musk anosmia is *class-specific*, not general |
| cis-3-hexen-1-ol | Freshly cut grass | OR2J3 | Nominal replication only |
| ω-pentadecalactone | Musky (Exaltolide) | — | One of Amoore's six classical specific anosmias |

**Commercially sourced, treat as unverified:** Iso E Super at 20–25%, Ambroxan at 20–50%
reduced sensitivity. These circulate widely in fragrance media and are plausible, but I
could not find peer-reviewed backing, and the sources conflict on which receptor is
responsible (one attributes Ambroxan to OR5A1, which looks like confusion with β-ionone).
**Do not put these numbers in user-facing copy.**

### 3.3 This is not theoretical for our catalog

Scanned the five entries in `data-enrichment/batch-01-sample.json` — the flagship
fragrances — against the materials above:

| Fragrance | Anosmia-risk material |
|---|---|
| Dior Sauvage | **Ambroxan** (base) |
| Creed Aventus | **Ambergris, Musk** (base) |
| D&G Light Blue | **Musk** (base) |
| Lancôme La Vie Est Belle | **Iris** (heart; ionone-adjacent) |
| YSL Black Opium | none flagged |

**Four of the five best-selling fragrances in the world carry at least one material a
meaningful fraction of people cannot fully smell.** The enrichment pipeline is already
capturing this data as a side effect of recording real notes. It needs one lookup table
to become a feature.

### 3.4 What the feature is

> *"Heads up: Sauvage is built on Ambroxan. Based on your answers you may be one of the
> people who barely registers it. If you've ever wondered why a fragrance everyone loves
> smells like almost nothing on you, this is likely why. Try before you buy."*

Nobody does this. Fragrantica can't — it aggregates opinions across people rather than
modeling one person. Retailers won't, because it talks customers *out of* purchases. It
is the most trust-building thing PickSniff could possibly say, it is mechanically true,
and it directly serves the independence positioning ("we don't stock anything, we can't
push anything").

It also reframes returns and regret: the goal stops being "recommend a bottle" and
becomes "prevent a bad purchase."

### 3.5 Anosmia proxy questions

We cannot present molecules over the internet. But several risk materials have everyday
carriers, which means indirect detection is possible:

| Suspected blind spot | Proxy question | Rationale | Conf. |
|---|---|---|---|
| Galaxolide / polycyclic musk | "Can you smell your laundry detergent on clothes once they're dry?" | Galaxolide is *the* laundry musk | Med-High |
| Androstenone (OR7D4) | "Does cooked pork ever smell sweaty or urinous to you?" | Boar taint; validated against genotype in cooked-meat sensory studies | Med-High |
| 3M2H / body odor (OR51B2) | "Can you smell your own sweat after a workout?" | 3M2H is a primary human body-odor volatile, ~25% anosmic | Med |
| β-ionone (OR5A1) | "Do violets and iris smell strongly floral, faint, or like almost nothing?" | Directly the molecule; 100× threshold spread | **High** |
| Macrocyclic musk (OR5AN1) | "Do 'clean skin' or 'my skin but better' fragrances smell like nothing to you?" | Class-specific musk anosmia | Med |
| Ambroxan / Iso E Super | "Have you tried a fragrance everyone raved about and smelled almost nothing?" | Generic catch-all; flags a blind spot without naming the molecule | Low-Med |

These are proxies, not assays. They are the first consumer-facing attempt at this that I
can find, they are falsifiable, and §7 says how to test them.

---

## 4. Why this targets notes, not accords

Measured from the live catalog: **11 distinct accord values, ~3 per fragrance.** That is
the entire expressive resolution available today, and it cannot distinguish a person who
loves dry cedar from one who loves creamy sandalwood — different noses, different bottles.

Worse for §3: **accords cannot express anosmia risk at all.** "Woody" does not tell you
whether the base is Ambroxan. Only notes do.

So the mapping resolves to **note names**, matching the vocabulary already in
`data-enrichment/batch-01-sample.json`. §6 gives a rollup to the 11 accords so matching
works against today's data. As enrichment batches merge, everything sharpens with no
changes to the mapping.

**The 11 user-facing filter accords do not change.** The dimensions in §5 are an internal
model. Powdery, Leather, and Smoke appear there and must never surface as filter accords.

---

## 5. Internal profile dimensions

Twenty-three axes. **D1–D21 are olfactory** and scored on both intensity and valence per
§2.3. **D22 and D23 are not olfactory and neither selects accords** — they reorder the
match list that D1–D21 produce:

- **D22 adventurousness** (dispositional) — how much challenge is wanted
- **D23 trigeminal sensitivity** (chemesthetic) — whether spicy/aromatic families read sharp or warm

See §6 for why these are deliberately kept out of the olfactory score.

| # | Dimension | Anchor materials | Rolls up to |
|---|---|---|---|
| D1 | **Citrus-sweet** | limonene, sweet orange, mandarin, lemon zest | Citrus |
| **D1b** | **Citrus-bitter** *(split from D1 — see §2.7k)* | bergamot, grapefruit, petitgrain, bitter orange, neroli's green facet | Citrus |
| D2 | Green-crushed | cis-3-hexenol, galbanum, violet leaf, fig leaf | Green |
| D3 | Aquatic-ozonic | calone, helional, sea salt, melon | Aquatic |
| D4 | Clean-musk | galaxolide, habanolide, cotton | Fresh |
| D5 | Soapy-aldehydic | C-11/C-12 aldehydes, classic soap | Fresh + Floral |
| D6 | Floral-fresh | rose, geranium, freesia, lily of the valley | Floral |
| D7 | Floral-white-indolic | tuberose, jasmine, orange blossom, ylang | Floral |
| D8 | Powdery-iris | orris, heliotrope, violet, talc, tonka | Floral / Vanilla |
| D9 | Fruity-ester | isoamyl acetate, apple, pear, blackcurrant | Fruity |
| D10 | Fruity-lactonic | peach, apricot, coconut, osmanthus | Fruity |
| D11 | Gourmand-sweet | vanillin, caramel, sugar, tonka | Vanilla |
| D12 | Gourmand-roasted | coffee, cocoa, hazelnut, bread, pyrazines | Vanilla / Spicy |
| D13 | Woody-dry | cedar, vetiver, papyrus, cypress | Woody |
| D14 | Woody-creamy | sandalwood, cashmeran, guaiac | Woody |
| D15 | Amber-resinous | labdanum, benzoin, ambroxan, olibanum | Amber |
| D16 | Smoke-incense | frankincense, birch tar, cade | Amber / Woody |
| D17 | Leather-animalic | isobutyl quinoline, suede, civet, skin musk | Amber / Woody |
| D18 | Earthy-mossy | oakmoss, patchouli, geosmin | Green / Woody |
| D19 | Spice-warm | cinnamon, clove, nutmeg, cardamom | Spicy |
| D20 | Spice-sharp | black pepper, pink pepper, ginger | Spicy |
| D21 | Herbal-camphor | lavender, eucalyptus, mint, sage, rosemary | Aromatic |
| **D22** | **Adventurousness / intensity appetite** *(dispositional, not olfactory — see §6)* | *not a material class; predicts tolerance for polarizing compositions, high projection, difficult niche* | *none — modifies ranking, not accords* |
| **D23** | **Trigeminal sensitivity** *(chemesthetic, not olfactory — see §6)* | TRPV1 / TRPA1 / TRPM8 agonists: pepper, ginger, cinnamon, clove, mint, camphor, and ethanol itself | *none — flags whether D19–D21 will read sharp or warm* |

---

## 6. The mapping

**Selection rule: information = accuracy × divisiveness.** A question that maps perfectly
and that everyone answers identically carries zero information about the individual.
"Do you like vanilla extract?" is flawless chemistry and a worthless question.

**Refinement (added after Joseph's rain question, 2026-07-21): there are two kinds of
divisiveness and they are not the same column.**

- **Valence-split** — do people disagree about whether they *like* it? (gasoline, licorice,
  baby powder)
- **Intensity-split** — do people disagree about whether they *notice* it at all?
  (petrichor, laundry musk, violets)

A question can be terrible on one and excellent on the other. Almost everyone *likes* the
smell of rain, so it is a weak valence question — but people differ enormously in whether
they detect it coming, which makes it a strong intensity question. Since intensity is the
fragile half of the instrument (§2.6), **intensity-split questions are disproportionately
valuable and were previously being filtered out by a rule that only measured valence-split.**
The Split column below should be read as valence-split; ★ items carry intensity-split.

**Confidence:** High = the household smell literally contains or is dominated by the
material. Med = strong shared facet. Low = correlational only.
**★** = the molecule has documented genetic perceptual variation (§3.2), so the question
does double duty as an anosmia probe.

### Core 20

| Reference smell | What it actually is | Loads | Conf. | Split |
|---|---|---|---|---|
| Pencil shavings | Literally cedarwood | D13 ++ | **High** | Med |
| Gasoline at the pump | Hydrocarbons; perfumery cousins are tarry-mineral | D16 +, D17 +, D15 + | Med | **High** |
| Baby powder | Talc, orris, heliotropin, musk | D8 ++, D11 + | **High** | **High** |
| Beach sunscreen | Benzyl salicylate, coconut lactone, ylang | D10 ++, D7 + | **High** | Med-High |
| Freshly cut grass ★ | cis-3-hexenol — **OR2J3 variation** | D2 ++ | **High** | Med-High |
| Damp forest floor after rain | Oakmoss, geosmin, patchouli | D18 ++, D16 + | **High** | **High** |
| Swimming pool / chlorine | Clean-aquatic axis; calone, helional | D3 ++, D4 + | Med-High | **High** |
| Clean laundry, line-dried ★ | Galaxolide — **OR4D6 specific anosmia** | D4 ++, D5 + | **High** | Low-Med |
| Play-Doh | Heliotropin + vanillin + wheat (Hasbro TM + Brosius) | D8 ++, D11 + | **High** | **High** |
| Old books | Lignin → vanillin, benzaldehyde, must | D11 +, D13 +, D18 + | **High** | Med |
| A new leather jacket | Quinoline, suede, birch tar | D17 ++ | **High** | **High** |
| Church incense / blown-out match | Frankincense, olibanum, guaiac | D16 ++, D15 + | **High** | **High** |
| Dried lavender | Linalool / linalyl acetate — the fougère spine | D21 ++ | **High** | **High** |
| Freshly ground black pepper | Piperine, rotundone | D20 ++ | **High** | Med |
| Ground coffee beans | Pyrazines, furfuryl compounds | D12 ++ | **High** | Med |
| Black licorice / anise | Anethole | D19 +, D12 + | **High** | **High** |
| Earl Grey tea | Flavored with actual bergamot | D1 ++, D2 + | **High** | Low-Med |
| A worn shirt of someone you love ★ | 3M2H, skin musk — **OR51B2, ~25% anosmic** | D17 ++, D4 − | Med-High | **High** |
| Violets or iris ★ | β-ionone — **OR5A1, 100× threshold spread** | D8 ++, D6 + | **High** | **High** |
| Vicks VapoRub | Camphor, eucalyptol | D21 ++ | **High** | **High** |
| **Can you smell rain *before* it arrives?** ★ | **Ozone**, carried to nose level by storm downdrafts. Sharp, sweet, faintly acidic | D3 ++, D4 + | **High** | Low *(valence)* / **High** *(intensity)* |
| **The smell after rain hits dry ground** | **Geosmin** (petrichor), from *Streptomyces* soil bacteria. Human threshold ~**5 ppt** | D18 ++, D13 + | **High** | Med |
| **Does cilantro taste like soap to you?** | **Decanal (C-10) and dodecanal (C-12)** plus (E)-2-decenal / (E)-2-dodecenal — *the same aldehydes as classic aldehydic perfumery* | D5 ++, D1 + | **High** | **High** |
| **How hot do you like your food?** † | **Capsaicin / TRPV1 — trigeminal, not olfactory.** Mixes sensitivity with appetite | **D22 ++**, **D23 +**, D20 +, D19 + | *see below* | **High** |
| **Do you cry cutting an onion?** † | **syn-Propanethial-S-oxide** → forms dilute sulfuric acid in the tear film → corneal **trigeminal** nerve endings. Involuntary | **D23 ++** | **High** | **High** |

Bar soap moved to reserve to make room for violets, which earns its place by being
simultaneously a good preference question and the single best-evidenced anosmia probe
available.

**The core set is now 22, not 20.** The two rain questions were added without removing
anything, because both earn their place and neither obvious cut is clearly right. Adaptive
delivery (§7.2) makes the exact count much less important — a larger item pool is an
*advantage* for CAT, since it has more to choose from. For the fixed-length v1, the open
question is whether to ship 22 or cut Earl Grey and one other. **Joseph's call; not
urgent.**

**Why the rain questions are worth this much space.** They are the model for what a good
item looks like under everything learned in v3:

1. **Experience-anchored, not introspective** (§2.6). "Can you smell rain before it comes?"
   asks about a repeated real-world event with an external referent — the rain either
   arrived or it didn't. It is close to self-verifying, and it does not route through
   imagery the way "rate your sensitivity" does.
2. **It probes the fragile intensity axis without feeling like a test.** People answer it
   instantly and confidently, and the answers genuinely differ.
3. **The two halves are different molecules and must be asked separately.** "Before it
   arrives" is **ozone** (downdrafts carry O₃ from altitude to nose level), which belongs
   to the ozonic-aquatic family — calone, helional, sea air, line-dried laundry. "After it
   hits the ground" is **geosmin**, the earthy-mossy family — patchouli, oakmoss, vetiver,
   beetroot. Collapsing them into one "rain" question, which is what the old reserve entry
   did, would have blurred two dimensions that sit at opposite ends of the profile.
4. **Geosmin is a genuinely remarkable stimulus.** Human detection threshold is around
   **5 parts per trillion** — roughly a drop in twenty Olympic pools, and by one comparison
   some 200,000× more sensitive than a shark is to blood. It is one of the most acute
   detections the human nose performs, which makes near-universal recognition a safe
   assumption and makes *failure* to notice it genuinely informative.

**The cilantro question (Joseph, 2026-07-21): great chemistry, bad genetics, and the
distinction matters.**

*The chemistry is as literal as pencil-shavings-are-cedar, possibly more so.* Cilantro's
soapy character comes from **decanal (C-10)** and **dodecanal (C-12)** together with
(E)-2-decenal and (E)-2-dodecenal. Those long-chain aliphatic aldehydes are **exactly the
materials that define aldehydic perfumery** — the "metallic-soapy-fatty-waxy" character
that entered fine fragrance in the twentieth century and still anchors the Chanel No. 5
family. Decanal and dodecanal are used as perfume ingredients in their own right. D5 in
§5 is literally defined as "C-11/C-12 aldehydes, classic soap."

So this is not an analogy. **A person telling us cilantro tastes soapy is telling us how
they perceive the exact molecules that make an aldehydic perfume smell the way it does.**
That is the tightest mapping in the entire document.

*The genetics is much weaker than the folklore.* The 23andMe GWAS (14,604 discovery +
11,851 replication) found SNP rs72921001 near the OR6A2 cluster at p = 6.4 × 10⁻⁹ with an
odds ratio of 0.81 per allele — statistically solid. But **common variants explain only
about half a percent** of the difference between people, and SNP heritability is roughly
**0.087**. Cilantro aversion is overwhelmingly learned and cultural. The popular "it's your
genes" story overstates the effect by about an order of magnitude.

*Why that does not matter here, and is arguably good news.* **We do not care about
genotype — we care about perception** (and per `NOSE-DATA.md` §2 we are forbidden from
storing genotype anyway). If someone perceives cilantro as soapy, that is a valid report
about how they experience C-10/C-12 aldehydes, and it is equally useful whether the cause
is a receptor variant or thirty years of eating habits. **The weak heritability only
damages the bad idea of using this as a genetic marker. It leaves the perceptual mapping
completely intact.**

Accordingly this item is **not marked ★** — it is not an anosmia probe, and it must never
be presented as revealing anything genetic.

*It also generates a novel, testable prediction.* Nobody appears to have asked whether
cilantro-soapiness predicts liking for aldehydic fragrances. It is a clean hypothesis, and
PickSniff would be positioned to answer it from its own data. If it holds, that is a real
finding and exactly the kind of thing `NOSE-DATA.md` §6 says to publish for free.

*Minor caveats.* It is a flavour question, but flavour is mostly retronasal olfaction, so
it is legitimately an olfactory item. Reported soapiness rates are also said to vary by
ancestry — I did not verify those figures and, given heritability of 0.087, any ancestry
signal is weak. `NOSE-DATA.md` §7 applies regardless: we do not model ancestry and do not
go looking.

**Verdict: promote to core. It is a better D5 probe than bar soap** (far more divisive,
identical target), it is experience-anchored, famous, instant to answer, and it splits a
room. Bar soap stays in reserve.

**† The spice question (Joseph, 2026-07-21): yes there is a correlation, but not the kind
the previous two had — and it earns its place for a different reason.**

*First, the disqualifying fact, stated up front.* **Chilli heat is not a smell.** Capsaicin
acts on **TRPV1**, a pain-and-heat ion channel in the trigeminal system, not on any
olfactory receptor. Spice tolerance measures a **different sensory system**. It does not
map to a material class the way pencil shavings map to cedar or cilantro maps to C-10
aldehydes, and it must not be presented as if it does.

*Second, why it is nevertheless relevant to fragrance.* A surprising share of "spicy" and
"aromatic" perfumery is **trigeminally active**, not merely odorous:

| Material | Receptor | Sensation |
|---|---|---|
| Black pepper (piperine) | TRPV1 | burn, prickle |
| Ginger (gingerol) | TRPV1 | burn |
| Cinnamon (cinnamaldehyde) | TRPA1 | burn, sting |
| Clove (eugenol) | TRPV1 / TRPA1 | burn, numbing |
| Mint (menthol) | TRPM8 | cold |
| Eucalyptus, camphor | TRPM8 | cold, sharp |

So D19, D20, and D21 all carry a trigeminal load. Two people can smell the same peppery
fragrance and have genuinely different experiences of it — *sharp and harsh* versus *warm
and rounded* — because their TRPV1 response differs, not because their olfaction does.
That is real, and no fragrance recommender accounts for it.

*Third, the caveat that keeps this honest.* One study found that frequent spicy-food
consumption is associated with **reduced capsaicin sensitivity but unchanged intranasal
trigeminal sensitivity.** Oral desensitisation may not transfer to the nose. **So "I eat
ghost peppers" is weaker evidence about nasal trigeminal response than it intuitively
seems**, and the D19/D20/D21 loadings above must stay small until tested. Marked `+`, not
`++`, deliberately.

*Fourth, and this is why the question is worth having.* Spice liking correlates robustly
with **sensation seeking** — Byrnes & Hayes (2013, 2016) found strong positive
correlations with Arnett's Inventory of Sensation Seeking, replicated for both liking and
intake, and it sits inside Rozin's **"benign masochism"** framework: the enjoyment of
biologically aversive stimuli, which also correlates with risk-seeking.

**Every one of D1–D21 answers "which smells do you like?" None of them answer "how much
challenge do you want?"** That is a real gap. A profile can nail someone's accords and
still hand a cautious beginner a bottle of something feral, or hand a thrill-seeker their
fourth safe blue fragrance.

D22 fills it. Sensation seeking should predict:

- tolerance for polarising materials — oud, castoreum, indolic florals, civet, birch tar
- appetite for high projection versus quiet skin scents
- artistic niche versus crowd-pleasing designer
- whether the right advice is *"this is a safe blind buy"* or *"this one is difficult, and
  that's the point"*

It is **orthogonal to every other dimension**, which is exactly what makes it worth a
question. It is also the single most actionable thing in the profile for ranking, because
it reorders the same match list rather than changing it.

*Guard against the obvious failure mode.* D22 is a **personality** measure sitting in an
instrument whose entire credibility rests on not being a personality quiz (§7.3). It is
admissible only because it is evidence-backed and makes falsifiable predictions. **Rules:**
never present it as a personality reading, never give it a cute label, never let it appear
in results copy as a description of the person. It modifies ranking silently. If it cannot
justify itself through §9.2's answer-distribution data, it gets cut first.

*Bonus finding, filed for completeness:* olfactory loss **reduces** trigeminal sensitivity
— anosmics show higher trigeminal thresholds, attributed to missing central amplification
in orbitofrontal cortex and rostral insula, with the reduction specific to chemosensory
fibres rather than general somatosensation. Interesting, coherent with §2.8, and of no
diagnostic use to us — `NOSE-DATA.md` §1 still forbids saying anything about it.

**† The onion question (Joseph, 2026-07-21) — and why pairing it with spice resolves a
confound I had left open.**

*The mechanism.* Cutting an onion releases **syn-propanethial-S-oxide**. It dissolves in
the tear film, forms a dilute solution of sulfuric acid on the surface of the eye, and
irritates free nerve endings in the cornea and conjunctiva — which are **trigeminal**.
Same nerve as capsaicin burn. Not olfaction.

*The confound it fixes.* The spice question alone is ambiguous, and I should have flagged
this last turn. High spice tolerance can mean two opposite things:

- **low trigeminal sensitivity** — the burn is genuinely faint, so hot food is easy; or
- **high sensation seeking** — the burn is felt fully and *enjoyed anyway* (Rozin's benign
  masochism).

One question cannot separate those, and they imply different fragrance advice.

*Onion separates them, because crying is involuntary.* You cannot sensation-seek your way
out of a lacrimal reflex. Tearing is close to a pure **sensitivity** measure, uncontaminated
by whether you enjoy the sensation. Spice is sensitivity **plus** appetite. So:

| | Cries easily at onions | Doesn't cry |
|---|---|---|
| **Loves hot food** | High sensitivity + high appetite → **true sensation seeker.** Send the difficult niche things | Low sensitivity, high appetite → wants intensity, needs **more** of it to register. Send high-projection |
| **Avoids hot food** | High sensitivity, low appetite → **easily overwhelmed.** Avoid pepper/ginger/camphor-forward, favour soft and rounded | Low sensitivity, low appetite → indifferent to the trigeminal axis. Ignore D23 in ranking |

**Spice measured relative to onion is a much cleaner adventurousness signal than spice
alone.** Two cheap questions producing a 2×2 that neither produces by itself. This was a
good pairing instinct and it is now the justification for keeping both.

*Phrasing note:* "Do you cry cutting an onion?" is textbook §2.6 — a repeated real-world
event with an external referent, answered instantly and confidently, routing through
episodic memory rather than olfactory imagery. Keep this wording.

### 6.1 Scoring decision: intensity is split into two scores

**Decided 2026-07-21.** Joseph proposed computing a single intensity score from age, rain,
onion, spice, and cilantro. Sorting those by what they actually measure showed they span
four different constructs, so they are scored separately rather than summed:

| Input | Feeds | Why not "olfactory intensity" |
|---|---|---|
| **Rain (before it arrives)** | **Olfactory intensity** | — it is the clean probe |
| Existing ★ items (laundry musk, violets, worn shirt) | **Olfactory intensity** | — |
| **Onion** | **D23 trigeminal sensitivity** | Corneal trigeminal reflex, not odour detection |
| **Spice** | **D22 adventurousness + D23** | TRPV1 burn, not odour detection |
| **Cilantro** | **D5 soapy-aldehydic** (quality) | Tells us *how* aldehydes read, not *how strongly* |
| **Age** | **Weak covariate only** | A population average, not a measurement |

**On age specifically.** Roughly half of adults 65–80 have measurable smell loss — which
means **half do not**. Assigning reduced intensity to a 70-year-old is a coin flip dressed
as a measurement, and it is precisely the Level 0 demographic inference (§2.7) that this
whole instrument exists to beat. Age is therefore a **weak prior that any actual answer
overrides**, never a driver, and per `NOSE-DATA.md` §1 it is never surfaced to the user in
any form.

Nothing was discarded. Every input Joseph chose is used; each is simply routed to the axis
it is capable of measuring. **Trivially reversible** if a single blended score is preferred
later — the inputs are all still collected.

### Reserve (rotate, or swap in when a core question underperforms)

| Reference smell | What it actually is | Loads | Conf. | Split |
|---|---|---|---|---|
| Bar soap (Ivory / Dove) | Soapy aldehydes, vintage-clean axis | D5 ++ | **High** | Med |
| Banana peel | Isoamyl acetate — the "cheap fruity" tell | D9 ++ | **High** | **High** |
| Peach skin | Gamma-undecalactone | D10 ++ | **High** | Low-Med |
| Pine / Christmas tree | Alpha-pinene, terpineol | D13 +, D21 + | **High** | Med |
| ~~Wet pavement after rain~~ | *Superseded — the two rain questions in the core set do this job better and separate the two compounds properly* | — | — | — |
| Cut green bell pepper | Pyrazines | D2 ++ | Med-High | **High** |
| Whiskey or dark rum | Oak lactone, boozy gourmand | D12 +, D11 + | Med-High | Med-High |
| A real rose in a garden | Citronellol, geraniol, phenylethyl alcohol | D6 ++ | **High** | Med-High |
| Unlit pipe tobacco | Tobacco absolute, hay, honey | D17 +, D12 + | **High** | Med-High |
| Crushed mint | Menthol, spearmint | D21 ++ | **High** | Low-Med |
| Cooked pork ★ | Androstenone probe — **OR7D4** | D17 + | Med-High | **High** |
| Hairspray / a 1980s salon | Aldehydes + powder | D5 +, D8 + | Med | Med-High |

### Deliberately excluded

| Smell | Why not |
|---|---|
| Zesting a lemon | Perfect chemistry, near-universal liking. Zero information. |
| Vanilla extract | Same. The best-mapped, worst-performing question available. |
| Cinnamon rolls baking | Same. |
| Sharpie marker | Wonderfully divisive, weak science. Correlational only. |
| Nail polish remover | Same. |

---

## 7. From answers to recommendation

### 7.1 The pipeline

1. Valence questions (love / neutral / hate) across the core set, **experience-anchored
   phrasing per §2.6**.
2. Intensity questions only on the ★ items, always phrased as events, never as sensations.
3. Valence loadings build the preference vector across the 21 dimensions.
4. Intensity answers build a separate **blind-spot flag set**.
5. Normalize into a nose profile.
6. **Today:** roll the preference vector up to the 11 accords (§5, column 4), take the top
   3, and run `lib/matchEngine.mjs` unchanged.
7. **After enrichment:** score against note pyramids directly, and surface §3.4 warnings
   when a recommended fragrance contains a flagged material.

Step 6 matters practically: **this ships without touching the match engine.** The engine
is pure and unit-tested; the Nose Test just produces better inputs to it.

### 7.2 Adaptive delivery — how it gets shorter AND more accurate

v2 left an unresolved problem: two axes across twenty smells is ~40 taps, which breaks the
90-second promise. Fixed-length questionnaires are the wrong tool here, and the field
solved this decades ago.

**Computerized adaptive testing (CAT)** picks each next item to be the most informative one
*given the answers so far*, re-estimates after every response, and stops when it hits a
target precision. Published applications reach **the same measurement precision using
16–52% of the items** of the equivalent fixed test.

Applied here: someone who loves incense, leather, and damp forest floor has already
revealed a great deal, and asking them about black pepper adds almost nothing — so ask
about baby powder instead, where they are genuinely unpredicted. A user whose first six
answers are internally contradictory gets more questions; a user with a clear signal gets
fewer.

Practical consequence: **roughly 10–14 adaptive questions can carry what 26 fixed ones
would**, with *better* precision for the people who need it. That is a real user benefit
(shorter) and a real quality benefit (sharper) from the same change, and it is exactly the
kind of engineering that separates a good instrument from a listicle with a score.

**Sequencing note:** CAT requires item parameters, which require response data. So v1
ships fixed-length, §9.2 harvests the answer distributions, and adaptive delivery becomes
the v2 upgrade that the data pays for. Do not try to build it first.

### 7.3 The Barnum problem, and the design rule that beats it

PickSniff already runs an astrology quiz, so this needs saying plainly: a quiz can feel
extremely accurate while measuring nothing. The Barnum effect is exactly that — vague,
flattering, universally-applicable statements ("you can be outgoing but also value your
own company") that people rate as uncannily personal. Horoscopes run on it. So do most
personality-adjacent product quizzes.

The Nose Test is at real risk here, because a result like *"you're drawn to warm, comforting
scents with a hint of mystery"* would score wonderfully in user testing and be completely
empty.

**The defense is falsifiability.** A Barnum statement cannot be wrong. A real measurement
makes claims that can fail.

So the results page should state at least one **specific, checkable, falsifiable
prediction**, and invite the user to check it:

> *"You should dislike iris-heavy fragrances. Lancôme La Vie Est Belle is one. Are we
> right?"*

If it is right, the user has just verified the instrument against their own experience,
which is worth more than any amount of flattering prose. If it is wrong, we learn
something and they can tell us so.

Two things fall out of this for free:

1. It is the **anti-Barnum guarantee** — the product cannot hide behind vagueness because
   it commits to a prediction up front.
2. It **is the validation mechanism from §9.1.** The honest design and the measurement
   design are the same design, which is a good sign that this is the right shape.

**Rule: every nose profile result must contain at least one claim the user could tell us
is wrong.**

### 7.4 Kitchen Calibration — APPROVED FOR V1

**Status: approved by Joseph, 2026-07-21.** Full reasoning in `docs/SMELL-KIT.md` §7,
where it was proposed as the alternative to manufacturing a physical smell kit.

The core problem (§2.6) is that we present words and measure memory. The core fix is to
present a **real odorant**. A manufactured kit does that and brings an FDA device
classification, a licensed patent, inventory, and a second company with it. Kitchen
Calibration does most of it for nothing:

> **Ask people to go get things they already own.**
> *"Grab your coffee and your black pepper. We'll wait."*

Ground coffee, vanilla extract, black pepper, a lemon, cinnamon, bar soap, rubbing
alcohol, dried lavender. Nearly every household has five of these within twenty feet of
the person taking the quiz. They smell it **now**, then answer.

**What it buys:**

- Moves those items from Level 1 to **Level 2** on the §2.7 ladder — live perception
  instead of recalled imagery.
- Makes intensity questions defensible on those items, because there is an actual stimulus
  to be intense.
- Free, instant, unlimited, global. No stock, no shipping, no customs, no regulation.
- It is a genuinely charming mechanic and nobody in this category does it.

**What it does not buy, stated honestly:**

- Kitchens contain no ambroxan, galaxolide, Iso E Super, or β-ionone. **Specific-anosmia
  detection still runs on the §3.5 proxy questions.** That gap is what a real kit would
  add, and it is the only thing it would add.
- The label effect (§2.7) survives. We still name the object.
- Compliance is voluntary.

**That last point is a gift, not a problem.** Some users will get up and some will answer
from memory, so the flow must offer an explicit **"answered from memory"** option — never
force a claim of compliance. That flag then splits the population into live-stimulus and
recalled-stimulus responses on identical questions, which is **the §9.4 experiment running
for free from day one**, on real users, at full scale, with no extra design work.

**Implementation notes for whoever builds it:**

- Opt-in, never a wall. "Got them? Great. Don't have them handy? Answer from memory,
  that's fine too." A quiz that demands errands before it starts will be abandoned.
- Keep the list short (3–5 items) and universal. Coffee, black pepper, and a lemon are the
  safest global three; vanilla extract and cinnamon are strong in most Western kitchens.
- Store the compliance flag per question, not per session — people will fetch two of five.
- This is the one place a progress bar genuinely matters, because the user has left their
  seat and needs to know it was worth it.

---

## 8. How this could be wrong

**Threat 1 — liking a smell ≠ wanting to wear it.** Coffee is delicious and few want to
smell like a café. Frame questions as liking the smell, treat the profile as a prior that
wear data corrects. The literature makes this sharper, not softer: preference for a
perfume is partly an interaction with your own body odor (§2.4), which no quiz can reach.

**Threat 2 — preference is ~80% learned** (androstenone twin study: 21% heritability for
pleasantness). The instrument measures formed preferences, not genetics. It must never be
marketed as a DNA read. Intensity answers are the more stable half.

**Threat 3 — socialized answers.** Many men are trained to say they dislike floral and
powdery. Noise for olfaction, arguably signal for what they will actually wear.

**Threat 4 — memory, not olfaction.** Play-Doh, baby powder, and old books all carry
nostalgia. That may be fine, since nostalgia genuinely drives fragrance buying, but the
model should not claim to measure the nose when it partly measures the childhood.

**Threat 5 — the Split column is still my estimate**, not measured data. Weakest column
in the document. §9 fixes this with live data.

**Threat 6 — anosmia proxies may not work.** The molecule-level science is solid; whether
"can you smell your detergent?" actually identifies Galaxolide anosmics is untested. This
is the highest-risk, highest-reward claim in the document and it must not ship as a
confident assertion before §9.3 clears it.

**Threat 7 — the intensity axis may measure imagination.** See §2.6, now the most serious
open question in the document. Self-rated smell ability tracks mental imagery vividness
(R² ≈ 0.29) rather than actual olfactory performance (ρ = −0.221, n.s.) in healthy people.
The experience-anchoring rule is a principled mitigation, not a proven one. **Valence is
sturdy; intensity is on probation until §9.4.**

---

## 9. Validation design

Existing `quiz_results` **cannot** validate any of this — it stores accord selections, not
smell responses. This needs new data. Three tests, cheapest first:

**9.1 Does the profile predict preference?**
Add three calibration questions: name up to three fragrances you already own and love.
Look them up in the catalog, compare their accords to the profile's predicted top 3.
With 11 accords and 3 picks, chance overlap is ~0.8 of 3. **Success bar: ≥1.6.** Miss it
and the premise is wrong, and the honest move is to say so and stop.

**9.2 Do the questions carry information?**
Log the answer distribution per question. Anything that lands >80% one way is dead weight
regardless of its chemistry — cut it and promote from reserve. This replaces my guessed
Split column with measured data, and it means **the quiz improves itself from live use.**

**9.3 Do the anosmia proxies detect anything real?**
Hardest and most valuable. Cross-reference blind-spot flags against wear-log complaints:
do users flagged as probable musk-anosmic report "no longevity" on musk-heavy fragrances
at a higher rate than unflagged users? If yes, §3 is real and defensible. If no, the
proxies are wrong even though the underlying science is right, and the feature waits.

**9.4 Is the intensity axis measuring imagination? (Threat 7)**
The one test that needs deliberate design rather than passive logging. Ask the same
blind-spot construct two ways, separated in the flow: once introspectively ("how strongly
do you smell musk?") and once experience-anchored ("can you smell laundry detergent on dry
clothes?"). Then check both against wear-log longevity complaints on musk-heavy
fragrances.

- If the experience-anchored version predicts complaints and the introspective one does
  not, §2.6's rescue holds and the phrasing rule is validated.
- If neither predicts, the intensity axis is measuring imagery and should be cut, taking
  §3 with it.
- If both predict equally, the phrasing rule is unnecessary and the quiz gets simpler.

All three outcomes are useful, which is what a good experiment looks like.

**9.5 Test–retest reliability — the number that decides whether "most accurate" is checkable**

An instrument that gives you a different answer next Tuesday measures nothing. The
literature already tells us what to expect, and it independently confirms a call made in
§2.6 from completely different evidence.

Across ten olfactory tests administered twice to 57 people aged 18–83:

| Measure | Test–retest r |
|---|---|
| **Pleasantness** | **0.81** ← highest of all measures |
| Intensity | 0.63 |
| Warmness | 0.60 |
| Coldness | 0.63 |

**Valence is the stable half. Intensity is the fragile half.** §2.6 reached that conclusion
from the mental-imagery literature — that self-reports of smell *strength* track imagination
rather than performance. This is an entirely independent line of evidence arriving at the
same place, and it puts a number on the gap: **0.81 versus 0.63.**

Three consequences:

1. **Weight valence answers above intensity answers**, roughly in proportion to their
   reliabilities. This is now an evidence-backed weighting rather than a hunch.
2. **We have a target.** Retest a sample of users after a few weeks. If our valence items
   reproduce near **r ≈ 0.8**, the instrument is performing at the level of published
   olfactory tests, and *"the most accurate fragrance quiz"* becomes a defensible claim with
   a number attached. If it comes in far below, we know before anyone else tells us.
3. **Retest is cheap for us and impossible for competitors.** No lab, no odorants — just
   email a subset and ask them to take it again. **No fragrance quiz on the internet has
   ever published a reliability coefficient.** Being the first would be a genuine and
   durable differentiator, and it costs one email.

**9.6 Careless responding — mandatory if this goes viral**

The Nose Test is designed to be shareable (§2.5), which means a meaningful share of
respondents will click through without reading. Careless responding poisons three things at
once: the individual's profile, the §9.2 item diagnostics, and the aggregate dataset that
`NOSE-DATA.md` §6 wants to publish.

The literature's finding is convenient: **completion time is the single most reliable
indicator of careless responding**, and it is free to collect. Straight-lining (long runs of
identical answers) is the other main pattern.

**Recommended controls, in order of value:**

| Control | How | Cost |
|---|---|---|
| **Per-item response latency** | Flag items answered under ~800 ms as likely unread | Free — and §2.7 already wants latency as a preference-strength signal, so this is **dual-use** |
| **Straight-line detection** | Flag sessions answering identically across all 14 core items | Free |
| **One repeated item** | Ask a single early item again near the end; disagreement flags the session **and** yields a per-session reliability estimate | One extra tap |
| **Total session time floor** | Flag implausibly fast completions | Free |

**Deliberately not recommended: traditional attention checks.** The standard technique
("if you are reading this, select option three") works, and it would wreck the tone. This
quiz's value depends on being charming enough to share; a bureaucratic trap question in the
middle of "do you like the smell of petrol" breaks the spell. **Use the passive methods —
they are free, invisible, and the evidence says timing is the better detector anyway.**

Flagged sessions should be **down-weighted in the aggregate, never blocked or accused.** A
user who rushed still gets their result; we simply trust it less internally.

**None of the six requires new infrastructure beyond the wear log.**

---

## 10. Open questions for Joseph

- **Length is now solved in principle, but not for v1.** Intensity only on the ★ items
  gives 20 valence + 6 intensity = 26 taps for the fixed launch version. Adaptive delivery
  (§7.2) cuts that to ~10–14 once there is response data to fit item parameters. The open
  question is whether 26 taps is acceptable for launch — I think yes, if the progress bar
  is honest and the questions are fun, which these are.
- **21 dimensions from 20 questions is close to underdetermined.** 12–14 may be more
  honest. Counter-arguments: wear-log data fills the gap over time, and adaptive delivery
  spends its questions where the profile is least determined.
- **Localization is a real product decision, not just translation** (§2.5). The mapping is
  universal; the objects are not. Does v1 ship US-only stimuli and localize later, or pick
  a globally-legible core from the start? Losing Play-Doh and Vicks would cost two of the
  best questions.
- **How hard do we lean on §3?** The anosmia feature is the most differentiated thing in
  this document and the least validated. It could launch as a soft "you may be less
  sensitive to this" or wait for 9.3.
- **Question phrasing is a voice decision, not a science one.** "A worn shirt of someone
  you love" is doing careful work to ask about animalic musk without being off-putting.
  That needs Joseph's ear.

---

## 11. Completeness audit (2026-07-21)

Joseph asked for a check that nothing was missing. This is the systematic pass. It found
**two new items worth adding, one decision that needs revisiting, three confirmations, and
four genuine coverage gaps.**

### 11.1 New items found

**Asparagus — the best intensity-split item found so far.** The ability to detect the
sulfurous odour in urine after eating asparagus is associated with **rs4481887 near OR2M7**,
inside a linkage block containing ten olfactory receptor genes on chromosome 1q44. Roughly
**40% report detecting it and 60% do not**; other work puts anosmia near 58% of men and 62%
of women.

Why it is excellent: famous, socially discussed, instantly answerable, experience-anchored,
and split almost 40/60 — close to the theoretical maximum information per tap. It probes
**sulfur/thiol sensitivity**, which matters in perfumery (cassis, blackcurrant, grapefruit
mercaptan) and is otherwise unprobed.

**The confound, which must be documented:** the trait has two components — *excreting* the
compounds and *perceiving* them. About **8% of people do not produce a detectable odour at
all**, so a "no" conflates non-excretion with anosmia. Real but modest contamination. Keep
the item, weight it slightly below the cleaner ★ probes.

**Green bell pepper — a direct galbanum probe.** Green pepper's characteristic aroma is
**3-isobutyl-2-methoxypyrazine (IBMP)**, detectable around 0.01 nM. Its close relative
**sBMP was identified in galbanum oil** — the defining material of D2 green-crushed. So
"green bell pepper" is not an analogy for galbanum; it is the same chemical family, and
specific anosmias to single odorants of this kind are documented. Promotes green pepper from
reserve into Tier 2 proper.

### 11.2 A decision that needs revisiting: Tier 1 may still be too long

Survey completion benchmarks by question count: **1–3 questions ≈ 83%, 4–8 ≈ 65%, 9–14 ≈
56%, 15+ ≈ 42%.** Drop-off rises sharply past roughly 7–8 minutes, and the mechanism is
*regret* — people start, see more questions than expected, and leave.

Tier 1 is ~18 questions / 22 taps. On these benchmarks that predicts **~42% completion**,
which is not "the best quiz on the internet."

**Caveat that stops this being decisive:** these are benchmarks for *surveys* — no payoff, no
entertainment. Entertainment quizzes with a desirable result routinely sustain 8–12 questions
at far higher completion. The Nose Test has a genuine payoff and inherently fun items.

**What it does justify, concretely:**
1. **An honest, visible progress indicator from question one.** The mechanism is regret at
   unexpected length; removing the surprise removes most of the effect.
2. **Front-load the divisive fun** (petrol, Play-Doh, cilantro) so the first 20 seconds earn
   the next 70.
3. **Tiering was the right call** and this is the strongest evidence for it.
4. **Instrument drop-off per question.** If a specific item bleeds users, cut it. This is a
   §9.2 diagnostic we get for free.

### 11.3 Confirmations

**The two-axis architecture is validated by the odor-space literature.** Work mapping the
semantic space of odour descriptors (Dravnieks's 146-descriptor atlas is the field's gold
standard) consistently finds **pleasantness as the dominant dimension and trigeminal
sensation as a second salient one.** That is exactly the split this document arrived at
independently: valence as the primary axis, D23 trigeminal as a separate top-level axis
rather than a sub-facet. Good sign.

**Order effects are real, and our ordering is a deliberate trade.** Earlier questions prime
and anchor later ones; the standard mitigation is randomising order where items are
independent. Our core smells *are* independent, but §Script deliberately orders them to hook
first. **Resolution: randomise within the core block after the first three.** Keep the
opening hooks fixed for engagement, randomise the remainder for validity, and log the seed so
order effects are measurable later.

**Hormonal state modulates olfaction, and confirms the no-health-questions rule.** Sensitivity
to musk and androstenone is elevated in the periovulatory phase; oral contraceptive users
differ from non-users; discrimination drops in the luteal phase; results overall remain
inconclusive. This is real within-person variance affecting exactly our ★ musk probes — which
means it is a **noise source in test–retest (§9.5), not a variable to collect.** §2.7g stands:
measure the outcome, never model the mechanism. It is also another argument for the wear log,
which averages over cycle phase automatically.

### 11.4 Genuine coverage gaps

Auditing all 22 olfactory dimensions against the items that probe them:

| Dimension | Probe status |
|---|---|
| **D14 woody-creamy** (sandalwood, cashmeran) | **No probe at all.** Searched for an everyday reference smell and found none that is both familiar and divisive in Western markets. Sandalwood soap would work in South Asia — a localisation item, not a global one. **Accept the gap**; recover D14 from note pyramids post-enrichment instead |
| **D7 floral-white-indolic** (tuberose, jasmine, orange blossom) | **Thin** — only sunscreen, and only via its ylang facet. A major fragrance family with almost no coverage |
| **D15 amber-resinous** | **Thin** — reached only obliquely via petrol and incense. Amber is conventionally **labdanum + benzoin + vanilla**, so it is partly inferable from D11 and D16, but not directly probed |
| **D19 spice-warm** (cinnamon, clove, nutmeg) | **Thin** — only licorice, which is really anise and loads D12 as much as D19 |

**These four are the honest remaining holes.** D14 appears unfixable by reference smell and
should be handled downstream. D7, D15, and D19 are fixable with reserve items and should be
addressed before launch rather than after.

### 11.5 Checked and deliberately skipped

- **Valence/arousal as a second emotional axis.** Odour affect is genuinely two-dimensional
  (pleasant–unpleasant × calming–activating), with a U-shaped relation between them, and
  arousal is *not* the same as intensity. Tempting, and skipped for v1: it is a property of
  the *fragrance's effect*, not of the *person's nose*, so it belongs in output copy and
  occasion matching rather than in the profile. Revisit after launch.
- **Sandalwood-specific perception differences.** Searched; found only retailer content, no
  primary individual-difference data. Nothing to build on.

---

## Sources

- [Khan et al., Predicting Odor Pleasantness from Odorant Structure, J. Neurosci. 2007](https://pmc.ncbi.nlm.nih.gov/articles/PMC6672642/)
- [Sirvent et al., Fragrance preference associated with one SNP in OR5A1, bioRxiv Jan 2026](https://www.biorxiv.org/content/10.64898/2026.01.14.699479v1)
- [Trimmer et al., From musk to body odor: decoding olfaction through genetic variation, PLOS Genetics](https://journals.plos.org/plosgenetics/article?id=10.1371%2Fjournal.pgen.1009564)
- [Genetic variation in OR5AN1 associates with the perception of musks, Chemical Senses](https://academic.oup.com/chemse/article/doi/10.1093/chemse/bjac037/6980822)
- [Genetic Variation of OR7D4 and Sensory Perception of Cooked Meat Containing Androstenone, PLOS One](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0035259)
- [Olfactory training in specific anosmia to androstenone and OR7D4, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12273440/)
- [Genetic and Environmental Contributions to Androstenone Perception: An International Twin Study](https://link.springer.com/article/10.1007/s12078-007-9005-x)
- [Lenochová et al., Psychology of Fragrance Use, PLOS One 2012](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0033810)
- [Amoore, Measurement of Specific Anosmia, 1968](https://journals.sagepub.com/doi/10.2466/pms.1968.26.1.143)
- [African Gene Flow Reduces Beta-Ionone Anosmia/Hyposmia Prevalence, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8615941/)
- [Arshamian et al., The perception of odor pleasantness is shared across cultures, Current Biology 2022](https://www.cell.com/current-biology/fulltext/S0960-9822(22)00332-3)
- [The inability to self-evaluate smell performance: imagery vividness outweighs awareness of olfactory performance, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4434946/)
- [Individual differences in odor imaging ability reflect differences in olfactory and emotional perception](https://pubmed.ncbi.nlm.nih.gov/17205971/)
- [Long-Term Memory for Odors: Influences of Familiarity and Identification, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4398052/)
- [Computerized Adaptive Testing, Item Response Theory (Wiley)](https://onlinelibrary.wiley.com/doi/10.1002/9781119716723.ch8)
- [CAT provides reliable and efficient depression measurement using the CES-D scale, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5628285/)
- [Barnum effect — The Decision Lab](https://thedecisionlab.com/biases/barnum-effect)
- [Herz & von Clef, The Influence of Verbal Labeling on the Perception of Odors: Evidence for Olfactory Illusions? Perception 2001](https://journals.sagepub.com/doi/10.1068/p3179)
- [Repeated exposure to odors induces affective habituation of perception and sniffing, Frontiers](https://www.frontiersin.org/journals/behavioral-neuroscience/articles/10.3389/fnbeh.2014.00119/full)
- [Liking and wanting pleasant odors: different effects of repetitive exposure in men and women, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4038972/)
- [The mere exposure effect depends on an odor's initial pleasantness, Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00920/full)
- [Influence of Odor Hedonics on Human Sniffing, Chemosensory Perception](https://link.springer.com/article/10.1007/s12078-010-9073-1)
- [Autonomic responses associated with olfactory preferences of fragrance consumers, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11397983/)
- [Sex Differences in Human Olfaction: A Meta-Analysis (82 SST + 24 UPSIT papers, >30,000 participants), PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6381007/)
- [The Rate of Age-Related Olfactory Decline Among Older U.S. Adults, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4715242/)
- [Ryu et al., Should Panelists Refrain from Wearing a Personal Fragrance Prior to Sensory Evaluation? *Foods* 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC8834429/)
- [Cross-Cultural Color-Odor Associations, PLOS One](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0101651)
- [Crossmodal correspondences between odors, musical notes, and geometrical shapes](https://link.springer.com/article/10.3758/s13423-013-0397-0)
- [Storm Scents: It's True, You Can Smell Oncoming Summer Rain, Scientific American](https://www.scientificamerican.com/article/storm-scents-smell-rain/)
- [Petrichor — The Smell of Rain (American Chemical Society)](https://www.acs.org/content/dam/acsorg/education/students/highschool/chemistryclubs/infographics/petrichor-the-smell-of-rain.pdf)
- [Eriksson et al., A genetic variant near olfactory receptor genes influences cilantro preference, *Flavour* 2012](https://flavourjournal.biomedcentral.com/articles/10.1186/2044-7248-1-22)
- [23andMe — the cilantro taste gene](https://blog.23andme.com/articles/cilantro-love-hate-genetic-trait)
- [Integrating TRPV1 Receptor Function with Capsaicin Psychophysics, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4738735/)
- [Frequent spicy food consumption: reduced capsaicin sensitivity but unchanged intranasal trigeminal sensitivity](https://www.sciencedirect.com/science/article/abs/pii/S0950329321002937)
- [Byrnes & Hayes, Personality factors predict spicy food liking and intake, Food Quality and Preference](https://www.sciencedirect.com/science/article/abs/pii/S0950329312001917)
- [Spicy Personality: personality traits and preference for spicy foods, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12896852/)
- [Decreased trigeminal sensitivity in anosmia, PubMed](https://pubmed.ncbi.nlm.nih.gov/11244364/)
- [Interactions between olfaction and the trigeminal system, Cerebral Cortex](https://academic.oup.com/cercor/article/17/10/2268/309112)
- [syn-Propanethial-S-oxide, the onion lachrymatory factor (University of Bristol, Molecule of the Month)](https://www.chm.bris.ac.uk/motm/pso/psov.htm)
- [Production and characterization of tearless and non-pungent onion, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4822150/)
- [Smelling Sulfur: copper regulates human OR2T11 response to low-molecular-weight thiols, JACS](https://pubs.acs.org/doi/10.1021/jacs.6b06983)
- [A study on the relationship between odor hedonic ratings and individual odor detection threshold, Scientific Reports 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9628383/)
- [Odor intensity and pleasantness for a diverse set of odorants, Perception & Psychophysics](https://link.springer.com/content/pdf/10.3758/BF03204218.pdf)
- [Perception of everyday odors: correlation between intensity, familiarity and strength of hedonic judgement, PubMed](https://pubmed.ncbi.nlm.nih.gov/10321820/)
- [Is the perception of odour pleasantness shared across cultures and ecological conditions? Biology Letters](https://royalsocietypublishing.org/rsbl/article/20/6/20240120/63605/Is-the-perception-of-odour-pleasantness-shared)
- [Herz, Odor-associative learning and emotion: effects on perception and behavior, Chemical Senses](https://academic.oup.com/chemse/article/30/suppl_1/i250/270391)
- [Herz, Changing odor hedonic perception through emotional associations in humans](https://escholarship.org/uc/item/6zd9h5mv)
- [Olfaction, Emotion and Associative Learning: Effects on Motivated Behavior, Motivation and Emotion](https://link.springer.com/article/10.1007/s11031-004-2389-x)
- [Olfactory Dysfunction in Allergic Rhinitis, Clinical Reviews in Allergy & Immunology](https://link.springer.com/article/10.1007/s12016-024-09016-z)
- [Retronasal odor perception requires taste cortex but orthonasal does not, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6604050/)
- [Quantifying Sweet Taste Liker Phenotypes, Nutrients](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6357166/)
- [Stability of individual differences in sucralose taste preference, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6516736/)
- [Odor–Taste Interactions in Food Perception, Chemical Senses](https://pmc.ncbi.nlm.nih.gov/articles/PMC8130510/)
- [Food neophobia, odor evaluation and exploratory sniffing behavior, Appetite](https://pubmed.ncbi.nlm.nih.gov/9792731/)
- [Food Neophobia, Odor and Taste Sensitivity, and Overall Flavor Perception in Food, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8702209/)
- [Development of a scale to measure the trait of food neophobia in humans, PubMed](https://pubmed.ncbi.nlm.nih.gov/1489209/)
- [The secret of truffles: a steroidal pheromone? Cellular and Molecular Life Sciences](https://link.springer.com/article/10.1007/BF01989905)
- [A study of the test–retest reliability of ten olfactory tests, Chemical Senses](https://academic.oup.com/chemse/article-abstract/20/6/645/380168)
- [Mennella et al., Prenatal and postnatal flavor learning by human infants, Pediatrics 2001](https://pubmed.ncbi.nlm.nih.gov/11389286/)
- [Influence of maternal diet on flavor transfer to amniotic fluid and breast milk: systematic review](https://pubmed.ncbi.nlm.nih.gov/30982867/)
- [Dealing with Careless Responding in Survey Data, Annual Review of Psychology](https://www.annualreviews.org/content/journals/10.1146/annurev-psych-040422-045007)
- [Too Fast, Too Straight, Too Weird: post hoc identification of meaningless data in internet surveys](https://www.researchgate.net/publication/258997762_Too_Fast_Too_Straight_Too_Weird_Post_Hoc_Identification_of_Meaningless_Data_in_Internet_Surveys)
- [Compound Interest, What Causes the Smell of New & Old Books?](https://www.compoundchem.com/2014/06/01/newoldbooksmell/)
- [Hasbro trademarks the Play-Doh scent (official description)](https://newsroom.hasbro.com/news-releases/news-release-details/hasbro-trademarks-favorite-smell-childhood-play-doh-scent)
