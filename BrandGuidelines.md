# PickSniff — Brand Guidelines
# The locked design decisions: palette, type, spacing. Values live here; reasoning lives in Design.md.
# Claude Code: read this file AND Design.md before touching any UI. Use these tokens, never invent colors, sizes, or spacing outside this system.

**Brand personality:** Warm, clean, friendly, confident. The opposite of intimidating. PickSniff is for people who know nothing about fragrance — the design must feel approachable and calm, never clinical or overwhelming. Think "friendly expert," not "luxury gatekeeper."

**Theme:** light

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream | `#F8F6F2` | `--color-cream` | The page background everywhere. NEVER pure white. Warm, soft, easy on the eyes. |
| Pick Green | `#7FE040` | `--color-pick-green` | The signature accent. Button backgrounds, selected states, match bars, brand "Sniff". Accent ONLY — never a page background. |
| Green Deep | `#3D7A16` | `--color-green-deep` | Green for TEXT and small icons where #7FE040 would fail contrast. Use this whenever green text sits on cream or white. |
| Ink | `#1A1A1A` | `--color-ink` | All primary text, headings, body. Near-black, warm. |
| Slate | `#5C5C5C` | `--color-slate` | Secondary text, descriptions, captions, muted labels. |
| Card White | `#FFFFFF` | `--color-card-white` | Card and surface backgrounds sitting on the cream canvas. |
| Border Warm | `#E8E4DC` | `--color-border-warm` | Subtle warm borders on all cards, inputs, dividers. |
| Green Wash | `#EEF9E6` | `--color-green-wash` | Very soft green tint for selected-card backgrounds, highlighted states (e.g. the "Most Popular" card). |
| Pure White | `#FFFFFF` | `--color-on-green` | Reserved token. NOTE: per Design.md, text/icons sitting ON a Pick Green button use **Ink (#1A1A1A)** — white on #7FE040 fails contrast. Keep this token only for potential future dark-green surfaces. |

**Contrast rule (accessibility, non-negotiable):** #7FE040 is a background/accent color. For any green *text*, use Green Deep (#3D7A16). Body text is always Ink on cream/white. This keeps the site WCAG AA compliant.

---

## Tokens — Typography

**Font family:** DM Sans everywhere (Google Fonts). One typeface, no exceptions. Fallback: `ui-sans-serif, system-ui, -apple-system, sans-serif`. Token: `--font-dm-sans`.

DM Sans is the whole type identity. Weight and size create hierarchy — never a second font.

### Weights
- 400 (regular) — body copy, descriptions
- 500 (medium) — UI labels, buttons, nav
- 700 (bold) — headings, quiz titles, emphasis

### Type Scale
| Role | Size | Line Height | Weight | Token |
|------|------|-------------|--------|-------|
| caption | 13px | 1.5 | 400 | `--text-caption` |
| body-sm | 15px | 1.5 | 400 | `--text-body-sm` |
| body | 17px | 1.5 | 400 | `--text-body` |
| label | 15px | 1.3 | 500 | `--text-label` |
| heading-sm | 21px | 1.3 | 700 | `--text-heading-sm` |
| heading | 28px | 1.2 | 700 | `--text-heading` |
| heading-lg | 40px | 1.15 | 700 | `--text-heading-lg` |
| display | 56px | 1.1 | 700 | `--text-display` |

On mobile, display and heading-lg step down one level (display→40px, heading-lg→32px).

---

## Tokens — Spacing & Shape

**Base unit:** 4px. Every margin, padding, and gap is a multiple of 4.

### Spacing Scale
| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |

### Border Radius
| Element | Value | Token |
|---------|-------|-------|
| buttons | 12px | `--radius-button` |
| cards | 16px | `--radius-card` |
| inputs | 12px | `--radius-input` |
| pills/badges | 999px | `--radius-pill` |
| icon tiles | 12px | `--radius-tile` |

Rounded but not bubbly — 12-16px is the PickSniff radius. The "Most Popular" badge and small status chips use full pill radius.

### Layout
- Page max-width: 1120px, centered
- Section vertical gap: 64-80px
- Card padding: 24px
- Grid gap between cards: 20-24px

### Elevation
Soft, minimal shadows only — PickSniff cards may use ONE subtle shadow (`0 1px 3px rgba(26,26,26,0.06)`) for gentle lift, OR rely on the warm border. Never heavy, never the generic blurry "AI drop shadow." Prefer border + tiny shadow over big shadow.

---

## Quick Start — CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream: #F8F6F2;
  --color-pick-green: #7FE040;
  --color-green-deep: #3D7A16;
  --color-ink: #1A1A1A;
  --color-slate: #5C5C5C;
  --color-card-white: #FFFFFF;
  --color-border-warm: #E8E4DC;
  --color-green-wash: #EEF9E6;
  --color-on-green: #FFFFFF;

  /* Type */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --text-caption: 13px;
  --text-body-sm: 15px;
  --text-body: 17px;
  --text-label: 15px;
  --text-heading-sm: 21px;
  --text-heading: 28px;
  --text-heading-lg: 40px;
  --text-display: 56px;

  /* Spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;

  /* Radius */
  --radius-button: 12px;
  --radius-card: 16px;
  --radius-input: 12px;
  --radius-pill: 999px;
  --radius-tile: 12px;
}
```
