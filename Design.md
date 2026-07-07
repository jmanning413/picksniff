# PickSniff — Design.md
# The reasoning and taste behind the tokens. Token values live in `app/globals.css` (`@theme`); THIS file holds the rules.
# Claude Code: follow every Do and Don't here. When Joseph corrects a design choice, ADD the correction to the Drift Loop Log at the bottom so it never happens again.

**The one-sentence identity:** PickSniff looks like a warm, friendly guide — clean cream backgrounds, one confident green accent, soft rounded shapes, generous breathing room. It should feel like the least intimidating fragrance site on the internet, because that is the entire point of the product.

**What we are reacting against:** the generic AI-generated look. No purple gradients. No everything-centered layouts. No heavy blurry drop shadows. No random font. If a choice looks like a default Claude reached for, it's wrong.

---

## Color rules

Tokens (defined in `app/globals.css`):
| Token | Value | Tailwind class |
|---|---|---|
| Cream | `#F8F6F2` | `bg-cream` |
| Pick Green | `#7FE040` | `bg-green-accent` |
| Green Deep | `#3D7A16` | `text-green-deep` |
| Green Wash | `#EEF9E6` | `bg-green-wash` |
| Warm border (Sand) | `#E8E4DC` | `border-sand` |
| Ink | `#1A1A1A` | `text-black` (body ink) |

### Do
- Use Cream (#F8F6F2) as the background of every page. It's warmer and calmer than white.
- Use Pick Green (#7FE040) as a rationed accent: primary buttons, selected quiz options, match-score bars, the "Sniff" in the logo, active states. Its power comes from scarcity.
- Use Green Deep (#3D7A16) whenever green appears as TEXT or a small icon on a light background — this keeps text readable and accessible.
- Put white cards on the cream canvas with a warm border (#E8E4DC) for gentle separation.
- Use Green Wash (#EEF9E6) to softly highlight a featured/selected card (like "Most Popular").

### Don't
- Never use pure white (#FFFFFF) as a page background. Cream only.
- Never use Pick Green as a large background or a full section fill — it's an accent, and green text on a green field is unreadable.
- Never use green as body text at the bright value — that's what Green Deep is for.
- Never introduce a new color. The palette is cream + green + ink/slate neutrals. No purple, no blue accents, no gradients as decoration.
- Never use a gradient background anywhere. Flat warm color only.

## Typography rules

### Do
- Use DM Sans for everything, at 400/500/700 weights.
- Build hierarchy with size and weight: bold 700 for headings and quiz titles, medium 500 for buttons/labels/nav, regular 400 for body.
- Keep headings tight (line-height 1.1-1.2) and body readable (1.5).
- Left-align body copy and multi-line text. It reads faster and feels less "landing-page generic."

### Don't
- Never add a second typeface.
- Never center-align paragraphs longer than one line. (Short hero subheadings and single-line CTAs may center; real sentences left-align.)
- Never use thin/light weights for small text — they disappear on cream.

## Shape & layout rules

### Do
- Use 12px radius (`rounded-xl`) on buttons/inputs, 16px (`rounded-2xl`) on cards. Rounded but composed.
- Use full pill radius (999px) only for small badges and status chips ("Most Popular", accord tags).
- Give sections room: 64-80px vertical gaps. Whitespace is a feature — it makes a beginner feel calm, not flooded.
- Keep content within the 1120px max-width, centered as a column — but align content INSIDE sections naturally (headings and text left, not everything stacked dead-center).
- Use custom inline SVG icons in the established line-style. Consistent stroke weight across all icons.

### Don't
- Never center-stack an entire page so every element sits in the middle of the screen — that's the #1 AI-generated tell. Use real left-aligned structure with intentional layout.
- Never use heavy or blurry drop shadows for elevation. Lift comes from the warm border plus at most one very subtle shadow.
- Never use EMOJIS as icons anywhere. Custom SVGs only. (This has been a repeated correction — emojis look cheap and off-brand.)
- Never make cards float in big empty boxes with heavy shadows. Border-defined, grounded, clean.
- Never use sharp 0px corners — PickSniff is soft and friendly, not brutalist.

## Component patterns

**Primary button:** Pick Green (#7FE040) background, Ink (#1A1A1A) text (dark text on green passes contrast and matches the friendly tone), 12px radius, medium weight, generous padding (12px 24px).

**Secondary button:** transparent/white background, warm border (#E8E4DC), Ink text, same radius and padding. Used next to the primary (like "Explore All Quizzes" beside "Find My Scent").

**Quiz option button:** white card, warm border; when SELECTED, border becomes Pick Green and background becomes Green Wash. Must be a real keyboard-accessible button with a visible focus ring.

**Card:** white, 16px radius, warm border, 24px padding, at most a whisper of shadow. Featured card gets a Green Wash background and a "Most Popular" pill.

**Icon tile:** rounded 12px square with a soft green fill (Green Wash), containing a single line-style SVG icon in a darker shade (Green Deep) for contrast.

**Match score bar:** Pick Green fill on a light track, showing the percentage from the algorithm.

---

## Drift Loop Log
# When Claude gets a design choice wrong and Joseph corrects it, the corrected rule gets appended here so it's permanent. Running record:

- Emojis are never icons — always custom SVG. (Corrected repeatedly during quiz-card work.)
- Green (#7FE040) as text fails contrast — RULE: green text always uses Green Deep #3D7A16.
- Buttons came back as full pills — RULE: buttons use 12px radius (`rounded-xl`); full pill radius is reserved for small badges/chips only.
- Pages shipped with pure white backgrounds — RULE: page canvas is always Cream #F8F6F2; white is for cards on top of cream.
- The logo files (`/logo.svg`, `/logo-icon.svg`) have a baked-in WHITE background that shows as a box on cream — RULE: every logo `<Image>` gets `className="mix-blend-multiply"` until a transparent asset replaces the file.
- The hero slogan was rewritten without being asked — RULE: brand copy is locked: "Find your signature scent in 4 questions. No jargon. No overwhelm. Just your scent." Never rewrite slogans/taglines without explicit instruction.
- Cream + white + wash alone read as flat and washed out ("not enough depth") — RULE: use full-bleed Ink (#1A1A1A) sections as depth anchors — the footer sitewide plus one band per long page. Pick Green pops on ink; use `text-green-accent` for accents on ink (dark bg = contrast is fine there).
- Homepage felt disorganized/center-stacked — RULE: hero is a two-column layout (message left, action card right); section headers are eyebrow + heading, left-aligned.
- Copy said "plain English" — RULE: the site is universal; never use language-specific phrasing in copy. Say "simple questions", "no jargon", "explained simply" instead.
- Header logo/wordmark were too small to read (fine-line logo illegible at 32px) — RULE: header logo renders at 48px minimum with a text-2xl wordmark; the logo's thin strokes need size to be legible.
