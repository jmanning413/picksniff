# Physical Smell Kit — Scoping

> **STATUS: IDEA RAISED 2026-07-21. NOT APPROVED. NOTHING BUILT.**
> Joseph asked whether PickSniff could make and sell a physical smell test kit.
> This document exists so the idea is thought through honestly rather than drifted
> into, in the same spirit as `docs/DATA-PRODUCT.md`.
> Companions: `docs/NOSE-TEST.md` (the instrument), `docs/NOSE-DATA.md` (what the data
> does for people).
>
> **Short version:** the instinct is right and it solves the single biggest scientific
> problem in the Nose Test. But a physical odorant kit walks straight into an FDA device
> classification, a licensed patent, a standing product rule, and an entire second
> business. There is a version that captures ~80% of the benefit for $0 and no
> regulatory exposure, and it should be built first. See §7.

---

## 1. Why the instinct is right

`NOSE-TEST.md` §2.6 identifies the most serious threat to the whole design: the quiz asks
people about **remembered** smells, and self-reports about smell track mental imagery
vividness (R² ≈ 0.29) rather than actual olfactory performance (ρ = −0.221, n.s.). Only
about 60% of people can generate odor imagery at all.

A physical kit demolishes that threat completely:

| Web quiz | Physical kit |
|---|---|
| Presents a **word** | Presents an **odorant** |
| Measures memory, attitude, imagery | Measures **actual perception** |
| Anosmia detected by proxy question | Anosmia detected **directly** |
| Household objects as stand-ins | The **actual perfumery materials** |

That last row is the one people miss. The household-smell mapping in NOSE-TEST.md §6 is a
*workaround* for not being able to present molecules. With a kit you skip the proxies
entirely and present ambroxan, galaxolide, β-ionone, and Iso E Super directly. The
instrument stops being clever and starts being a measurement.

This is exactly how the gold standard works: **UPSIT** is 40 microencapsulated
scratch-and-sniff odors in four booklets, scored against a 4,000-person normative
database, sold at **$29.50 per test** with a minimum order of 7. The form factor Joseph is
imagining is the form factor the field already settled on.

The manufacturing is also genuinely accessible. Microencapsulation puts fragrance in
20–30 micron gelatin or polymer spheres in a water-based slurry, flexo- or screen-printed
onto paper. It holds scent **for years**, ships flat, has no liquids, no flammability, no
leakage. Some vendors advertise no minimum order quantity. IFRA-compliant scratch-and-sniff
formulations have been in children's books for over 40 years.

So: right instinct, proven technology, existing price benchmark. Now the problems.

---

## 2. The regulatory wall

This is the finding that matters most, and it is specific.

**21 CFR 874.1600 — Olfactory test device — is a Class II medical device** with special
controls. The definition:

> *"An olfactory test device is used to determine whether an olfactory loss is present,
> and includes one or more odorants that are presented to the patient's nose to
> subjectively assess the patient's ability to perceive odors."*

And this is not theoretical for consumer products: the **HealthCheck™ Home Test for Loss
of the Sense of Smell** — an at-home consumer product — was classified Class II.

Read the definition against what a Nose Test kit does mechanically: presents odorants,
assesses ability to perceive them. **The mechanism is identical.**

### The escape, and how narrow it is

Device status turns on **intended use**, which the FDA reads from claims, labeling,
marketing, packaging, and how the company talks about the product publicly — not from what
the object physically is.

- "Find fragrances that suit you" → consumer product.
- "Test your sense of smell" → device.

That path is real. It is also **much narrower than it looks**, because the most valuable
feature of the kit sits right on the line. Detecting that someone cannot smell galaxolide
is, in plain language, determining that a specific olfactory loss is present. Perfumery
would call that normal variation; a regulator reading 874.1600 might not draw that
distinction as generously as we would.

**If the kit is ever built, these are non-negotiable:**

1. No score. No number. No "you got 32 of 40."
2. No normative database comparison. Never "below average for your age" — this is UPSIT's
   entire clinical function and the clearest device signal available.
3. No mention of smell loss, anosmia as a condition, screening, disease, or diagnosis
   anywhere on the product, box, insert, site, or social media.
4. Specific-anosmia results framed as preference-relevant perception only: *"musks read
   faint to you, so here's what to avoid"* — never *"you have a deficit."*
5. **A regulatory lawyer reviews every word before a single unit is printed.** This is not
   a judgment call for a beginner dev, and it is not a judgment call for me.

`NOSE-DATA.md` §1 already sets the software-side rules. A physical product raises the
stakes substantially, because a tangible object with a box and an insert is much easier to
read as a device than a web page is.

---

## 3. The patent consideration

**SCENTinel**, from the Monell Chemical Senses Center, is a rapid smell test using three
"Lift'n'Smell" labels — two blank, one odorized — measuring **odor detection, intensity,
identification, and pleasantness**. Validated across versions 1.0, 1.1, and 2.1.

It is **patented and licensed to Ahersla Health for commercial use.**

That is a card-based consumer smell test measuring detection, intensity, and pleasantness.
The overlap with a Nose Test kit is not incidental; it is close to a description of it.

I am not qualified to assess patent scope and neither is anyone else on this project. It
simply means **freedom-to-operate review is a prerequisite, not a nice-to-have**, and it
lands before manufacturing, not after.

---

## 4. The standing rule this collides with

From `CLAUDE.md`, a hard rule:

> **PickSniff is 100% free. NEVER add premium tiers, subscriptions, paid features, or
> paywalls. Stripe is for optional donations ONLY and donations never unlock features.
> Free account creation is the only gate that exists.**

A paid kit that produces a materially better nose profile **is a paid feature**, whatever
it is called. People who pay get better results. That is a two-tier product, and it is
precisely the boundary that rule exists to protect.

There is a real counter-argument: a physical good with genuine cost of goods is different
from a software paywall, the way selling a book is different from charging for a login.
The software would remain free and complete.

**This is Joseph's decision and nobody else's.** But it should be made deliberately, in
full view of the rule, and if the answer is yes then `CLAUDE.md` needs updating to say so
explicitly — because right now the rule as written forbids it, and a rule that gets
quietly bent once stops working.

Two framings that reduce the tension considerably:

- **Sell at cost, not for profit.** A physical accessory offered at cost is much harder to
  characterize as a premium tier.
- **Keep the free path complete.** If §7's kitchen version gives everyone a real
  perceptual profile and the kit only sharpens the molecule-specific parts, the free
  product is not crippled to sell the paid one.

---

## 5. The business nobody is counting

PickSniff today: solo beginner developer, no measured traffic (analytics still unset per
GAMEPLAN Phase 0.6), $0 revenue, no affiliate programs approved yet.

A physical product adds, all at once:

| New burden | Reality |
|---|---|
| Custom scent development | Library scents are cheap. **Specific aroma chemicals are not** — converting a custom fragrance to printable microencapsulated coating runs "several hundred dollars" per scent in lab work alone. Twelve to twenty specific perfumery materials is a serious pre-revenue outlay |
| Inventory | Cash tied up in stock that may not sell |
| Fulfillment | Picking, packing, postage, or a 3PL's minimums |
| Returns and customer service | A support channel that does not currently exist |
| Shelf life | Microencapsulation holds for years, but "years" is finite and stock ages |
| International | EU allergen declaration (the 26 regulated fragrance allergens), CLP where applicable, IFRA compliance, customs |
| Child-appeal risk | Scratch-and-sniff reads as a children's product; if it is ever classed as one, CPSIA testing attaches |
| Liability | Fragrance allergens and skin sensitization are real, and someone will scratch a card and then touch their eye |

None of these is fatal alone. Together they are **a second company**, run by one beginner,
before the first company has measured its first thousand visitors.

---

## 6. What the kit would genuinely be worth

To be fair to the idea, the upside is real and I do not want it lost in the caveats:

- It **converts the Nose Test from inference to measurement.** That is the difference
  between "the best fragrance quiz" and "the only fragrance instrument."
- It makes the anosmia feature **true rather than probabilistic**, which removes most of
  NOSE-DATA.md §2's phrasing tightrope.
- It is **physically shareable** in a way software is not. Passing a card to a friend and
  arguing about what it smells like is the most naturally viral object in this space.
- It creates a **defensible artifact.** Anyone can copy a quiz. A validated card set with
  real materials is a moat.

The verdict is not "bad idea." It is **"right idea, wrong order."**

---

## 7. The version to build first: Kitchen Calibration

Here is the part worth acting on.

The kit's core value is **presenting a real odorant instead of a word.** But there is a way
to present real odorants with no manufacturing, no inventory, no shipping, no regulatory
exposure, and no cost:

> **Ask people to go get things they already own.**

Ground coffee. Vanilla extract. Black pepper. A lemon. Dried lavender or a lavender
product. Rubbing alcohol. Cinnamon. Bar soap. Almost every household has five of these
within twenty feet of the person taking the quiz.

*"Go grab your coffee and your black pepper. We'll wait."* Then: smell it now, and answer.

**What this fixes:**

- Threat 7 largely evaporates for those items. The person is not imagining coffee, they
  are smelling coffee. It becomes live perception, not recalled imagery.
- Intensity questions become defensible on those items, because there is a present
  stimulus to be intense.
- It is **free, unlimited, instant, and global** — no shipping, no stock, no customs.
- It is charming. "Go get your spice rack" is a delightful quiz mechanic and nobody else
  does it.

**What it does not fix, honestly:**

- Kitchens do not contain ambroxan, galaxolide, Iso E Super, or β-ionone. **The
  specific-anosmia detection still has to run on proxy questions**, because the relevant
  molecules are not household items. That is the ~20% the kit would add.
- Compliance is voluntary; some users will not get up, and the data needs an "I answered
  from memory" flag so those responses can be weighted differently. That flag is also a
  free natural experiment: **memory answers versus live answers, same question, same
  person population** — which is very close to the §9.4 test NOSE-TEST.md already wants.

**This is the highest-value, lowest-cost idea in this document.** It should be in v1 of the
Nose Test regardless of whether a kit is ever made.

---

## 8. If the kit ever happens, the preconditions

In order. Do not skip forward.

1. Nose Test ships with Kitchen Calibration, and §9 validation in NOSE-TEST.md clears.
2. There is an actual audience — enough traffic that a kit would find buyers.
3. Freedom-to-operate review against the SCENTinel patent family.
4. Regulatory counsel signs off on intended-use framing against 21 CFR 874.1600.
5. `CLAUDE.md`'s 100%-free rule is explicitly amended, or the kit ships at cost.
6. A manufacturing partner quotes real numbers for the specific materials, not library
   scents.
7. Only then: a small pilot run. Not a launch.

Realistically that is a 2027 conversation, and it is a much better conversation to have
once there are users who want it.

---

## 9. Recommendation

**Do not build a kit now. Build Kitchen Calibration into the Nose Test instead.**

It captures most of the scientific benefit, costs nothing, ships with v1, carries zero
regulatory or inventory risk, and produces the exact dataset needed to know whether a kit
would ever be worth making. If live-smell answers turn out to predict real preferences
much better than memory answers, that is the evidence that justifies a kit — and if they
do not, the kit was never going to help and you will have saved a year and several
thousand dollars finding out.

---

## Sources

- [21 CFR 874.1600 — Olfactory test device](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-H/part-874/subpart-B/section-874.1600)
- [FDA classification of olfactory test device, Federal Register](https://www.federalregister.gov/documents/2006/06/07/E6-8791/medical-devices-ear-nose-and-throat-devices-classification-of-olfactory-test-device)
- [FDA — Home Health and Consumer Devices](https://www.fda.gov/medical-devices/products-and-medical-procedures/home-health-and-consumer-devices)
- [Sensonics — Smell Identification Test (UPSIT)](https://sensonics.com/product/smell-identification-test/)
- [UPSIT pricing and pack size, Smelltest.eu](https://smelltest.eu/en/product/smell-identification-test-2/)
- [SCENTinel 1.0: development of a rapid test to screen for smell loss, Chemical Senses](https://academic.oup.com/chemse/article/doi/10.1093/chemse/bjab012/6196017)
- [Monell — What is SCENTinel teaching us, four years on (licensing to Ahersla Health)](https://monell.org/what-is-scentinel-teaching-us-about-smell-disorders-four-years-on/)
- [How scratch and sniff is made — microencapsulation process](https://www.madehow.com/Volume-3/Scratch-and-Sniff.html)
- [IFRA Standards](https://ifrafragrance.org/initiatives-positions/safe-use-fragrance-science/ifra-standards)
- [IFRA — Allergens](https://ifrafragrance.org/initiatives-positions/environment-health/allergens)
- [EU list of 26 regulated fragrance allergens](https://www.scentspiracy.com/blog/list-of-the-26-fragrance-allergens)
- [MoCRA small business exemptions](https://www.registrarcorp.com/blog/cosmetics/mocra/mocra-exemptions/)
