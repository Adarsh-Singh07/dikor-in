# DIKOR DESIGN SYSTEM & ATELIER IDENTITY
**Dikor.in | Handcrafted Custom 3D Miniatures & Pet Figurines**

---

## 1. Brand Soul & Purpose
DIKOR is a bespoke 3D miniature studio based in Jalandhar, Punjab. We transform pet portraits, family moments, and cherished memories into tangible, heirloom-grade physical figurines. Every miniature is precision 3D-sculpted from real photographs and hand-painted by studio artists.

### Visual & Emotional Tone
- **Editorial Artisan Warmth**: Tactile porcelain, warm ivory paper stock, cast-stone physical presence.
- **Craftsman Precision**: Clear architectural lines, deliberate proportions, zero synthetic tech hype.
- **Emotional Reverence**: Respect for pets and families, capturing the exact posture, markings, and gaze of every subject.

---

## 2. Liveliness Dials
- **ENERGY: 2 / 5** (Quiet luxury, gallery restraint, intentional breathing room, zero neon clutter)
- **RHYTHM: 2 / 5** (Measured narrative pacing: heroic showcase, tactile proof, interactive studio customizer, authentic Instagram gallery)
- **MOTION: 2 / 5** (Natural physical momentum, responsive Three.js turntable studio viewer, zero nauseating auto-rotations or flashing effects)

---

## 3. Color Palette & WCAG AA Contrast Tokens

### Foundations
| Token | Hex | Role & Contrast |
|---|---|---|
| `bg-primary` | `#FAF7F2` | Warm Porcelain White (canvas background) |
| `bg-surface` | `#FFFFFF` | Pure Gallery Surface (cards, panels, modals) |
| `bg-atelier` | `#F4EFEA` | Soft Buff Ivory (secondary background, table headers) |
| `border-subtle` | `#E7E2DA` | Warm Stone Border (1px crisp structural division) |
| `border-focus` | `#B76E79` | Terracotta Accent Ring (accessible 3:1 focus indicator) |

### Typography & Ink
| Token | Hex | Role & Contrast |
|---|---|---|
| `text-primary` | `#1C1917` | Deep Charcoal Ink (14.2:1 against `#FAF7F2` - WCAG AAA) |
| `text-secondary` | `#57534E` | Warm Slate Charcoal (5.8:1 against `#FAF7F2` - WCAG AA) |
| `text-tertiary` | `#78716C` | Muted Studio Stone (4.6:1 against `#FAF7F2` - WCAG AA) |
| `text-inverse` | `#FFFFFF` | Crisp White on dark buttons/badges (14.2:1 against `#1C1917`) |

### Atelier Accent Accents
| Token | Hex | Role |
|---|---|---|
| `terracotta-base` | `#B76E79` | Signature Dikor Terracotta Rose (buttons, active pills) |
| `terracotta-hover` | `#A45864` | Deep Antique Rose (interactive hover state) |
| `brass-gold` | `#9E7B34` | Brushed Atelier Brass (insignia accents, verified badges) |
| `brass-light` | `#F7F3EB` | Champagne Tint (subtle highlight backdrops) |

### Feedback & Status Tokens
| State | Foreground | Background | Usage |
|---|---|---|---|
| **Deposit Paid / Confirmed** | `#166534` | `#DCFCE7` | Advance received (75%) |
| **Model Ready / Approval** | `#9A3412` | `#FFEDD5` | 360-degree video preview awaiting client review |
| **Balance Cleared** | `#075985` | `#E0F2FE` | 25% balance payment received |
| **Delivered** | `#1E40AF` | `#DBEAFE` | Shipped to doorstep via courier |
| **Revision Requested** | `#991B1B` | `#FEE2E2` | Client notes for sculptor adjustments |

---

## 4. Typography Scale & Hierarchy
- **Display Font**: Playfair Display (editorial serif for hero headlines, artisan statements, and quote lead-ins)
- **Body & UI Font**: Inter / system geometric sans-serif (crisp legibility, clean figures, tabular numbers for pricing)

### Hierarchy
- `H1` (Hero Headline): `clamp(2.5rem, 5vw, 4rem)`, tracking tight, serif, deep charcoal.
- `H2` (Section Title): `clamp(1.75rem, 3.5vw, 2.5rem)`, tracking tight, serif.
- `H3` (Component / Card Title): `1.25rem` to `1.5rem`, semi-bold sans / medium serif.
- `Body Large`: `1.125rem` (18px), line-height 1.6, for introductory prose.
- `Body Regular`: `0.9375rem` (15px) or `1rem` (16px), line-height 1.5.
- `Caption / Eyebrow`: `0.75rem` to `0.8125rem` (12px-13px), uppercase tracking wider (0.05em), bold stone/terracotta.

---

## 5. Anti-Slop Architectural Rules

### Rule R-02: Zero Em Dashes
- Absolutely no em dashes (`—`) in UI copy, labels, tooltips, toasts, alt text, or documentation.
- Permitted punctuation: commas, colons, semicolons, parentheses, or clear sentence breaks.

### Rule R-03: Zero Layout Breakdown & 44px Minimum Tap Targets
- Every interactive button, selector chip, dropdown trigger, and link must have an explicit minimum bounding box of 44px by 44px on touch viewports.
- No horizontal scrollbars or clipping on viewports down to 320px width.

### Rules R-17 & R-18: Verbatim Authentic Proof Only
- DIKOR displays strictly verified customer reviews sourced from the `@dikor_in` Instagram highlight ("Reviews ✨").
- No fabricated customer avatars, stock photos disguised as buyers, or synthetic star counts.
- Real pet names featured: Babu, Dido, Anna, Chivas, Gappu, Bruno, and others documented in the official studio archive.

### Rule R-24: Zero Dead Links
- Every link in the navigation header, footer, callout banners, and hero actions leads to a functioning route or active in-page anchor (`/order`, `/gallery`, `/how-it-works`, `/dashboard`, `/admin`, `/auth`).
- Direct WhatsApp chat button uses encoded query string targeting the studio line (`+91 98780 00000` / verified studio number).

### Rule R-25 & R-32: Accessibility & Keyboard Control
- Clear, high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-2`).
- Full keyboard support for accordion drawers, custom size/model selectors, modal dialogs (Escape key dismissal, Tab trapping).

### Purpose Gate: Elimination of Cliché Synthetic Artifacts
- NO floating pastel gradient blobs (`blur-3xl bg-purple-400/20`).
- NO decorative sparkle icons (`✦` or `<Sparkle />`) parked as random status icons or badges.
- NO pill badges stacked with glowing dots above H1 headers.
- NO excessive glassmorphism (`backdrop-blur-xl` layered over translucent gray).
- Clean, physical cards with 1px stone borders, subtle natural shadow (`shadow-[0_2px_12px_rgba(28,25,23,0.04)]`), and tactile hover elevations.
