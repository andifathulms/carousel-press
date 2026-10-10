# Carousel Press: Design System

This file defines **how slides look** (sections 1–7) and **how the app UI looks** (section 8).
All slide coordinates are in canvas pixels on a **1080×1920** canvas, origin top-left.
Numbers here are the spec. Implement them as named constants, never as magic numbers scattered through the code.

---

## 1. Principles

1. **Readable on a phone at arm's length.** Body text is never smaller than 30 px on the canvas. Headlines are 56 px or larger.
2. **One idea per slide.** The layout gives the headline room and doesn't crowd it with decoration.
3. **Consistency beats novelty.** Every slide in a deck shares the header, footer, margins and type scale. Variety comes from surface rotation and icons, not from layout changes.
4. **Content never sits under TikTok's UI.** Decoration may; text, badges, code and CTAs may not.
5. **Deterministic.** Same input → same pixels. Decoration uses a seeded PRNG (mulberry32, seed = hash(slug) + slideIndex).

## 2. Canvas, safe zones and grid

```ts
// src/render/safezone.ts — the ONLY place these numbers live
export const CANVAS = { w: 1080, h: 1920 };

// Regions TikTok's photo-mode UI covers (estimates; verified by the owner with the test image)
export const UI_ZONES = {
  tabs:    { x: 0,   y: 0,    w: 1080, h: 170 },  // status bar + Following/For You
  buttons: { x: 930, y: 760,  w: 150,  h: 920 },  // avatar, like, comment, save, share
  caption: { x: 0,   y: 1520, w: 1080, h: 400 },  // username, caption, sound, nav bar
};

// Everything that carries meaning must stay inside this box
export const SAFE = { left: 96, right: 912, top: 196, bottom: 1500 }; // content width 816
```

- **Header row:** baseline y = 236 (inside SAFE).
- **Content stack:** starts at y = 344 (card) / y = 300 (cover) and must end at or before y = **1376**. A stack that fits is centred vertically in that band (snapped to the 8 px grid); photo slides and overflowing stacks stay top-anchored.
- **Footer row:** baseline y = **1440**.
- *Owner change, Oct 2026:* the footer and the stack limit moved up 32 px (were 1472 / 1400) to keep more distance from TikTok's caption, and stacks are centred instead of top-anchored so short slides don't leave the lower half empty. See docs/decisions.md.
- **Base grid:** 8 px. Every vertical gap is a multiple of 8.
- Decoration (blobs, glows, big faint glyphs) may extend anywhere, including off-canvas and into UI zones.

### 2.1 Safe-zone overlay (preview only)
Fill each `UI_ZONES` rect with `rgba(255, 64, 64, 0.22)` and label it in 28 px sans, white at 85%, top-left inside the rect, padded 16 px. Outline `SAFE` with a 3 px dashed line (`#FF4040`, dash 16/12).

### 2.2 Safe-zone test image (exported PNG)
Background `#FFFFFF`. A 40 px grid in `#E5E5E5`, every 200 px line in `#B0B0B0` labelled with its coordinate. UI zones and SAFE drawn as in 2.1. The centre label reads "Carousel Press safe-zone test · post privately and check on your phone".

---

## 3. Shared slide anatomy

Every family uses the same skeleton. Only the drawing of each part differs.

```
┌──────────────────────────────────────┐ 0
│  (tabs zone: decoration only)        │
│ @handle                    ──── / tag │ 236  header
│                                      │
│ [badge]                              │ 344  content stack starts
│ Headline headline                    │
│ headline                             │
│                                      │
│ Body text body text body text        │
│ body text                            │
│                                      │
│ (icon) / (code block) / (CTA)        │ ≤1376 content stack ends
│                                      │
│ Geser →                        3/6   │ 1440 footer
│  (caption zone: decoration only)     │
└──────────────────────────────────────┘ 1920
```

### 3.1 Header
- Handle at x = 96, baseline 236.
- Right element ends at x = 912: editorial = a 2 px horizontal rule from x 832 to 912 at y 226; dev = a mono path tag `~/{slug}`, right-aligned.

### 3.2 Footer
- Swipe hint, left-aligned at x = 96, baseline 1440. The arrow is a drawn icon (`arrow-right`, 28 px), not the "→" glyph, so it renders the same in every font.
- Counter `i/total`, right-aligned at x = 912, baseline 1440, using tabular figures (draw with the mono or a tabular-capable face).
- No swipe hint on `end` slides or on slides with `cta`. The counter is always shown, unless the deck sets `counter: off`.

### 3.3 Content stack (the layout engine)
Every slide body is a **vertical stack of blocks** placed from a top anchor with fixed gaps, then centred in the band when it fits (§2):

```ts
type Block =
  | { kind: 'badge' }                               // fixed height
  | { kind: 'text', role: TextRole, text: Rich }    // auto-fit
  | { kind: 'code', code: string, lang: string }    // auto-fit
  | { kind: 'icon', name: string }                  // optional, dropped if no room
  | { kind: 'cta', label: string }                  // fixed height
  | { kind: 'kicker', text: string };               // fixed height
```

**Stack-fit algorithm** (shared by both families):
1. Lay out every block at its **max** size. If the stack bottom ≤ 1376, done.
2. If it doesn't fit, first drop the `icon` block, if any.
3. Then step down text/code sizes one step at a time in **priority order**: `body` → `note` → `code` → `subtitle` → `headline`, round-robin, each down to its min.
4. If everything is at min and the stack still overflows, clip at 1376 and report `overflow` (or `code-line-too-long` if the cause is code width).
5. Each text block also has a **max lines** cap. Exceeding it at min size counts as overflow.

### 3.4 Type scale

All sizes are px on the canvas. "lh" = line-height multiplier.

**Editorial family**

| Role | Face (variant token) | Weight | Max → Min (step) | lh | Max lines |
|---|---|---|---|---|---|
| cover headline | `serif` | 700 | 120 → 84 (4) | 1.06 | 5 |
| cover subtitle | `sans` | 400 | 40 → 32 (2) | 1.45 | 3 |
| kicker | `sans` | 600 | 26 fixed, tracking +3 px, uppercase | — | 1 |
| card headline | `serif` | 700 | 92 → 64 (4) | 1.12 | 6 |
| body | `sans` | 400 | 42 → 32 (2) | 1.50 | 8 |
| note | `sans` | 400 | 32 → 30 (2) | 1.45 | 3 |
| quote text | `serif` | 600 | 76 → 52 (4) | 1.18 | 7 |
| attribution | `sans` | 500 | 32 fixed | 1.3 | 1 |
| end headline | `serif` | 700 | 108 → 76 (4) | 1.08 | 4 |
| badge digit | `sans` | 600 | 54 fixed | — | — |
| handle / footer | `sans` | 500 | 30 fixed | — | 1 |
| CTA label | `sans` | 600 | 34 fixed | — | 1 |
| code | `mono` | 400 | 40 → 28 (2) | 1.55 | 12 |

**Dev family**

| Role | Face | Weight | Max → Min (step) | lh | Max lines |
|---|---|---|---|---|---|
| cover headline | `sans` (Inter) or `mono` (terminal) | 800 / 700 | 116 → 80 (4) | 1.05 | 5 |
| cover subtitle | `sans` | 400 | 40 → 32 (2) | 1.45 | 3 |
| kicker | `mono` | 600 | 26 fixed, uppercase, tracking +2 | — | 1 |
| number ("01") | `mono` | 600 | 44 fixed | — | — |
| card headline | `sans` | 700 | 84 → 60 (4) | 1.12 | 5 |
| code-slide headline | `sans` | 700 | 72 → 56 (4) | 1.12 | 3 |
| body | `sans` | 400 | 40 → 30 (2) | 1.50 | 6 |
| note | `sans` | 400 | 32 → 30 (2) | 1.45 | 3 |
| code | `mono` | 400 | 44 → 28 (2) | 1.55 | 14 |
| quote text | `sans` | 600 | 68 → 48 (4) | 1.2 | 7 |
| end headline | `sans` | 800 | 108 → 76 (4) | 1.06 | 4 |
| handle / footer / path tag | `sans` / `mono` | 500 | 30 / 26 fixed | — | 1 |
| CTA label | `sans` | 600 | 34 fixed | — | 1 |

### 3.5 Text rendering rules
- `ctx.textBaseline = 'alphabetic'`. Compute the line box as `size × lh`, and place the first baseline at `top + size × 0.92` (cap-height approximation; adjust per face if the visual review shows drift).
- Paragraph break in body = an extra `0.6 × size` gap.
- `*accent*` runs: same face and weight, coloured with the surface's `accent`.
- `` `inline code` `` runs: the `mono` face at 0.9× the surrounding size, with a pill behind (radius 8, padding 6×10, fill `inlineCodeBg`). The pill width is included in wrapping measurements.
- Tracking (letter spacing) is done with a manual per-glyph draw helper, not `ctx.letterSpacing` (inconsistent support). Use it only for kicker text.
- Text on photos gets a soft shadow: `shadowColor rgba(0,0,0,0.35)`, `shadowBlur 24`, offset 0/2. No shadow on flat surfaces.

### 3.6 Photo treatment
1. **Cover crop with focal point:** scale = max(W/iw, H/ih). Offset so the focal point lands at the canvas centre, clamped so the image always covers the canvas.
2. **Tint wash:** fill the whole canvas with `photoTint` at alpha `0.10 + 0.35·d`, where d = darkness/100 (default 0.5).
3. **Gradient:** a vertical linear gradient of `photoTint` with stops: `0.00 → 0.30 + 0.35·d`, `0.38 → 0.06`, `0.62 → 0.10`, `1.00 → 0.48 + 0.35·d`.
4. All text, badges and icons use the variant's `onPhoto` tokens.
5. No blobs, dot grid, scanlines or big glyph on photo slides. The photo is the decoration.

### 3.7 Blobs (editorial only)
- **Shape:** a closed smooth curve through 7 points around a centre, at angles evenly spaced plus seeded jitter of ±10°, with radius × (1 ± 0.18 seeded). Smooth it with Catmull-Rom → cubic Bézier (tension 0.5).
- **Placement per content slide:**
  - **A (always):** centre (1040 ± 30, 1840 ± 30), radius 300–380. Mostly off-canvas, bottom-right.
  - **B (on slides where seeded rand < 0.5):** centre (1070, 260–420), radius 200–260. Top-right, behind the header and the start of the stack.
- Fill = surface `blob` colour, opaque. Blobs are drawn **before** any text.
- Cover and end slides without a photo: one large blob A at radius 420–480 plus blob B always.

### 3.8 CTA button
A pill, height 96, radius 48, horizontal padding 40. Content: a `bookmark` icon (36 px, stroke = label colour) + an 16 px gap + the label. Fill = surface `badgeBg`, label = `badgeInk`. Left-aligned at x = 96. In the stack it sits 64 px below the previous block.

---

## 4. Template tokens

### 4.1 Schema

```ts
interface Surface {
  bg: string; ink: string; body: string; muted: string;
  accent: string; badgeBg: string; badgeInk: string;
  blob: string; icon: string; inlineCodeBg: string;
}

interface CodeTheme {            // used by code blocks in every family
  panel: string; border: string; text: string; prompt: string;
  command: string; subcommand: string; flag: string; string: string;
  comment: string; number: string; keyword: string; fn: string; punct: string;
  dots: [string, string, string] | null;   // window dots; null = none
}

interface Variant {
  id: `${'editorial'|'dev'}/${string}`;
  name: string;
  family: 'editorial' | 'dev';
  fonts: { serif?: string; sans: string; mono: string };   // CSS family names
  surfaces: Record<string, Surface>;   // must include 'deep'
  rotation: string[];                  // surface names cycled across content slides
  onPhoto: Surface & { tint: string };
  code: CodeTheme;
  deco: { blobs: boolean; dotGrid: boolean; scanlines: boolean; glow: boolean; bigGlyph: string | null };
  swatches: [string, string, string, string];   // for the template picker
}
```

### 4.2 Surface assignment
- **Content slides** (card, code, quote) take `rotation[k % rotation.length]`, where k counts content slides only (0-based).
- **Cover / end** use the photo if one is set; otherwise the `deep` surface.
- `surface=` overrides. `surface=auto` = default behaviour.

### 4.3 Fonts to bundle (via @fontsource, latin subset only)

| Family | Weights |
|---|---|
| Playfair Display | 600, 700 |
| Lora | 600, 700 |
| Poppins | 400, 500, 600 |
| DM Sans | 400, 500, 600 |
| Inter | 400, 500, 600, 700, 800 |
| JetBrains Mono | 400, 600, 700 |

Canvas font strings always include a fallback, e.g. `700 92px "Playfair Display", Georgia, serif`. However, export is blocked until the real faces have loaded (PRD F7).

### 4.4 Contrast rules (enforced by a unit test over every variant)
- `ink` on `bg` ≥ **4.5:1**, and also on `blob` ≥ 4.5:1 (text may overlap blob B).
- `body` on `bg` and on `blob` ≥ **4.5:1**.
- `badgeInk` on `badgeBg` ≥ **3:1** (large bold digits and labels).
- `muted` on `bg` ≥ **3:1** (only used for 30 px+ text).
- Code tokens on `panel` ≥ **4.5:1**, except `comment` ≥ 3:1.
- If a hex below fails the test, adjust its lightness minimally and note the change in a comment. The test is the authority.

---

## 5. Editorial family

### 5.1 Variants

**`editorial/rose-dusk`**: the reference look (cream, blush and forest green with terracotta badges).
fonts: serif `Playfair Display`, sans `Poppins`, mono `JetBrains Mono` · rotation `['cream', 'blush', 'forest']` · swatches `#C9786B #F4ECE1 #2F4036 #262C3D`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| cream | #F4ECE1 | #1F2A2E | #3B4246 | #6B6F70 | #A8564C | #C9786B | #FFFFFF | #EBCFC4 | #C0695C | #E9DFD1 |
| blush | #E9C4BA | #1F2A2E | #33393C | #5E5555 | #7E3E35 | #2F4036 | #F4ECE1 | #E0B3A6 | #2F4036 | #DDB3A8 |
| forest | #2F4036 | #F4ECE1 | #DCD5CA | #AEB3A9 | #F0C2B5 | #E9C4BA | #1F2A2E | #3A4E42 | #E9C4BA | #3D5145 |
| deep | #262C3D | #F7EFE6 | #D9D2CB | #A9A6AE | #F0CFC4 | #F0CFC4 | #1F2A2E | #323A50 | #F0CFC4 | #343B50 |

onPhoto: ink `#FFFFFF`, body `rgba(255,255,255,0.90)`, muted `rgba(255,255,255,0.75)`, accent `#F6D3C8`, badgeBg `#F0CFC4`, badgeInk `#1F2A2E`, icon `#FFFFFF`, tint `#140E16`.
code: panel `#1F2A2E`, border `#1F2A2E`, text `#F4ECE1`, prompt `#E9A497`, command `#FFFFFF`, subcommand `#F0C2B5`, flag `#E9C98F`, string `#C9E2BE`, comment `#9AA3A0`, number `#E9C98F`, keyword `#F0A595`, fn `#D9C3F0`, punct `#D5CEC4`, dots `null`.
deco: blobs ✔, others ✘.

**`editorial/sage`**: calm linen, moss and olive with sand badges.
fonts: serif `Lora`, sans `DM Sans`, mono `JetBrains Mono` · rotation `['linen', 'moss', 'olive']` · swatches `#6F8466 #F1EEE4 #3E4A3A #D9B48F`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| linen | #F1EEE4 | #22291F | #3E463A | #6A7064 | #4F6447 | #5F7457 | #FFFFFF | #E1E5D5 | #5F7457 | #E4E1D4 |
| moss | #CFD8C3 | #1E241B | #32392E | #545C4E | #3B4C34 | #3E4A3A | #F1EEE4 | #C0CCB2 | #3E4A3A | #C0CAB3 |
| olive | #3E4A3A | #F1EEE4 | #DADCCF | #AEB2A3 | #E6C59F | #D9B48F | #22291F | #4A5845 | #D9B48F | #4C5947 |
| deep | #2A3127 | #F1EEE4 | #D3D6C8 | #A3A897 | #D9B48F | #D9B48F | #22291F | #353E31 | #D9B48F | #384134 |

onPhoto: as rose-dusk but accent `#E8D2B0`, badgeBg `#D9B48F`, tint `#12160F`.
code: panel `#2A3127`, text `#F1EEE4`, prompt `#D9B48F`, subcommand `#C7D6B5`, flag `#E6C59F`, string `#BFD9AE`, others as rose-dusk.
deco: blobs ✔.

**`editorial/midnight`**: navy, plum and slate with amber badges. Good for night/places/reflective decks.
fonts: serif `Playfair Display`, sans `DM Sans`, mono `JetBrains Mono` · rotation `['navy', 'plum', 'slate']` · swatches `#E0A060 #1B2333 #2B2236 #F3E9D7`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| navy | #1B2333 | #F3E9D7 | #D2C9B8 | #9C9787 | #E8B378 | #E0A060 | #1B2333 | #232D42 | #E0A060 | #283248 |
| plum | #2B2236 | #F3E9D7 | #D6CACB | #A2969E | #EBB884 | #E0A060 | #1B2333 | #352A43 | #E0A060 | #3A2F48 |
| slate | #22303A | #F3E9D7 | #CBD1D0 | #96A0A2 | #E8B378 | #F3E9D7 | #1B2333 | #2B3C48 | #F3E9D7 | #2F404C |
| deep | #141A26 | #F3E9D7 | #CFC6B5 | #948F80 | #E8B378 | #E0A060 | #141A26 | #1E2636 | #E0A060 | #222B3C |

onPhoto: accent `#F2C58F`, badgeBg `#E0A060`, badgeInk `#141A26`, tint `#0B0F18`.
code: panel `#0F1520`, border `#2A3448`, text `#F3E9D7`, prompt `#E0A060`, subcommand `#9CC3E6`, flag `#E8B378`, string `#B8D8A8`, comment `#7F8A99`, dots `null`.
deco: blobs ✔.

### 5.2 Cover (editorial)
- Background: the photo (3.6) or the `deep` surface + blobs.
- Stack from y = 300: [kicker (if any) → gap 32] → **cover headline** → gap 40 → **subtitle**.
- Footer: a `circle-arrow` icon (32 px) + 14 px gap + `coverSwipe` string, and the counter.
- Headline colour: `ink` (or onPhoto.ink). Subtitle: `body`.

### 5.3 Card (editorial)
- Background: rotation surface + blobs.
- Stack from y = 344: **badge** (circle Ø120 at x = 96, digit centred with a −2 px optical y-offset) → gap 48 → **card headline** → gap 48 → **body** → gap 72 → **icon** (120 px box, x = 96) → [gap 64 → **CTA** if `cta`].
- `number=off`: no badge, and the stack starts at y = 380 with the headline.

### 5.4 Code (editorial)
- Same as card, but the icon is replaced by a **code block**: x = 96, width 816, radius 28, fill `code.panel`, padding 36 all round, no title bar. Bash lines get the prompt treatment (6.4). The note (if any) comes after a 32 px gap, in `muted`.

### 5.5 Quote (editorial)
- A large opening quote mark "“" in `serif` 700 at 240 px, colour `accent` at 45% alpha, top-left at (84, 300).
- Stack from y = 520: **quote text** → gap 40 → **attribution** ("— " + text, `muted`) → [body, gap 32] → [icon].

### 5.6 End (editorial)
- Background: the photo or `deep` + blobs.
- Stack from y = 560: **end headline** → gap 40 → **body** → gap 72 → **CTA** (label from the `cta` string or the deck default).
- No swipe hint. Counter shown.

### 5.7 Sample photo `sample-dusk` (generated, no third-party assets)
A 1440×2560 canvas, PNG:
- Sky gradient top→bottom: `#262A48` 0%, `#5B4566` 35%, `#B86E6E` 58%, `#EE9E6E` 70%, `#F6C68E` 76%.
- Sun: circle at (0.60w, 0.74h), r = 80, `#FFE6B8`, with a radial glow (r 420, `#FFD49A` → transparent, alpha 0.55).
- Three hill silhouettes from y ≈ 0.72h down, each a seeded 1-D value-noise ridge: `#4A3550`, `#2E2236`, `#18121E` (back to front).
- Subtle grain: seeded noise at 3% alpha.

---

## 6. Dev family

### 6.1 Variants

**`dev/github-dark`**: familiar developer dark.
fonts: sans `Inter`, mono `JetBrains Mono` · rotation `['main']` · swatches `#0D1117 #161B22 #3FB950 #F0F6FC`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| main | #0D1117 | #F0F6FC | #C9D1D9 | #8B949E | #3FB950 | #3FB950 | #0D1117 | #0D1117 | #3FB950 | #1F2630 |
| deep | #0A0D12 | #F0F6FC | #C9D1D9 | #8B949E | #3FB950 | #3FB950 | #0A0D12 | #0A0D12 | #3FB950 | #1F2630 |

code: panel `#161B22`, border `#30363D`, text `#C9D1D9`, prompt `#3FB950`, command `#F0F6FC`, subcommand `#79C0FF`, flag `#FFA657`, string `#A5D6FF`, comment `#8B949E`, number `#79C0FF`, keyword `#FF7B72`, fn `#D2A8FF`, punct `#C9D1D9`, dots `['#FF7B72', '#E3B341', '#3FB950']`.
onPhoto: ink `#FFFFFF`, body `rgba(255,255,255,0.88)`, accent `#56D364`, badgeBg `#3FB950`, badgeInk `#0D1117`, tint `#05070A`.
deco: dotGrid ✔ (spacing 48, dot r 2, `#FFFFFF` at 5%), glow ✔ (radial at (980, 260), r 520, accent at 8% → 0), bigGlyph `"$_"` on cover/end.

**`dev/terminal`**: all-mono retro terminal.
fonts: sans `JetBrains Mono` (everything is mono), mono `JetBrains Mono` · rotation `['main']` · swatches `#0B0F0C #101712 #39D353 #D7FBD9`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| main | #0B0F0C | #D7FBD9 | #A9C9AB | #6B8A6E | #39D353 | #39D353 | #0B0F0C | #0B0F0C | #39D353 | #16201A |
| deep | #070A08 | #D7FBD9 | #A9C9AB | #6B8A6E | #39D353 | #39D353 | #070A08 | #070A08 | #39D353 | #16201A |

code: panel `#101712`, border `#1E2C21`, text `#B9E5BC`, prompt `#39D353`, command `#D7FBD9`, subcommand `#7EE787`, flag `#E3B341`, string `#9BE9A8`, comment `#6B8A6E`, number `#E3B341`, keyword `#39D353`, fn `#A5F3B0`, punct `#A9C9AB`, dots `null`.
Headline weight 700 (mono). Card and cover headlines are prefixed with `> ` drawn in `accent`.
deco: scanlines ✔ (horizontal 2 px lines every 6 px, `#000000` at 18%), glow ✔ (accent at 6%), bigGlyph `">_"`.

**`dev/paper-light`**: light background for people who find dark slides hard to read.
fonts: sans `Inter`, mono `JetBrains Mono` · rotation `['main']` · swatches `#F7F5F0 #FFFFFF #2563EB #16181D`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| main | #F7F5F0 | #16181D | #3A3F47 | #6B7079 | #1D4ED8 | #2563EB | #FFFFFF | #F7F5F0 | #2563EB | #ECE8DE |
| deep | #EFECE4 | #16181D | #3A3F47 | #6B7079 | #1D4ED8 | #2563EB | #FFFFFF | #EFECE4 | #2563EB | #E4DFD3 |

code: panel `#FFFFFF`, border `#E3DFD5`, text `#24292F`, prompt `#1D4ED8`, command `#16181D`, subcommand `#0550AE`, flag `#B35900`, string `#0A7A3D`, comment `#6E7781`, number `#0550AE`, keyword `#C0283B`, fn `#6F42C1`, punct `#3A3F47`, dots `['#E5E1D8', '#E5E1D8', '#E5E1D8']`.
onPhoto: as github-dark.
deco: dotGrid ✔ (`#000000` at 6%), bigGlyph `"{ }"`.

### 6.2 Header and number (dev)
- Handle: `sans` 500 30 px, `body` colour.
- Right: path tag `~/{slug}` in `mono` 500 26 px, `muted`, right-aligned at 912. Truncate the slug with "…" to a 300 px width.
- Number: `"01"`, `"02"` (zero-padded) in `mono` 600 44 px, `accent`, followed by a 48×4 px accent bar 20 px to the right, vertically centred. This replaces the editorial circle badge.

### 6.3 Layouts (dev)
- **Cover:** bigGlyph in `mono` 700 at 560 px, `ink` at 5% alpha, right-aligned so it bleeds off the bottom-right (baseline ≈ 1980, right ≈ 1140). Stack from y = 360: **kicker pill** (mono 600 26 px uppercase, `accent` text, 2 px `accent` border, radius 12, padding 14×22) → gap 40 → **cover headline** → gap 40 → **subtitle** (`muted`).
- **Card:** stack from y = 344: **number** → gap 40 → **card headline** → gap 40 → **body** → [icon gap 64, 112 px box] → [CTA].
- **Code:** stack from y = 344: **number** → gap 32 → **code-slide headline** → gap 28 → **body** (`muted`) → gap 48 → **code block** → gap 32 → **note** → [CTA].
- **Quote:** a large `"` in `mono` 700 200 px, `accent`, at (90, 330). Stack from y = 520: **quote text** → gap 40 → attribution `— name` in `mono` 500 30 px, `muted`.
- **End:** bigGlyph as on the cover. Stack from y = 580: **end headline** → gap 40 → **body** (`muted`) → gap 72 → **CTA**.

### 6.4 Code block (both families; dev variant shown)
- Box: x = 96, width 816, radius 24, fill `panel`, 2 px `border` stroke.
- Title bar (only if `dots` ≠ null): height 64. Three circles r = 9 at x + 36, x + 64, x + 92, centred vertically. Language label (`bash`, `js`…) in `mono` 500 24 px, `comment` colour, right-aligned at box right − 28. A 2 px divider in `border` under the bar.
- Code area: padding 36 left/right, 32 top/bottom. Line height = size × 1.55.
- **Width fit:** choose the largest size (max → min) at which the widest line ≤ 816 − 72 = 744 px. Never wrap code. If it doesn't fit at min, clip with a 48 px right-edge fade to `panel` and raise `code-line-too-long`.
- **Bash prompt:** for `bash`/`sh`, each non-empty line that doesn't start with `#` and isn't a continuation (the previous line didn't end with `\`) gets a `$ ` prefix in `prompt`. Lines that already start with `$ ` don't get a second one. The prefix is included in width measurement.
- **Highlighting** (hand-written tokenizers; no highlight.js in V1):
  - **bash:** the first word = `command` (600 weight); for `git|docker|npm|pnpm|yarn|kubectl|apt|brew|pip`, the second word = `subcommand`; `-x` / `--long` / `--long=value` = `flag`; `'…'` / `"…"` = `string`; `#…` to end of line = `comment`; `$VAR` / `${VAR}` = `flag`; `| && || ; > >>` = `punct`.
  - **js/ts (P1):** keywords (`const let var function return if else for while import from export class new await async try catch throw`) = `keyword`; strings including template literals = `string`; numbers = `number`; `// …` and `/* … */` = `comment`; an identifier followed by `(` = `fn`.
  - **py (P1):** keywords (`def class return if elif else for while import from as with try except raise lambda None True False and or not in is pass`) = `keyword`; `#` comments; strings, including triple-quoted ones; `fn` as in js.
  - **sql (P1):** case-insensitive keywords (`SELECT FROM WHERE JOIN LEFT RIGHT INNER ON GROUP BY ORDER HAVING LIMIT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE INDEX AS AND OR NOT NULL IS IN LIKE DISTINCT COUNT SUM AVG`) = `keyword`; `'…'` = `string`; `-- …` = `comment`; numbers.

---

## 7. Icons

- Author **original** line icons on a 24×24 grid as SVG path strings, and render them with `new Path2D(d)` scaled into the target box.
- Style: stroke width 1.5 (on the 24 grid), round caps and joins, no fills except tiny dots. They should feel hand-drawn but tidy: slightly asymmetric curves are welcome, no photoreal detail.
- "Spark" variants add 3–5 short radiating tick strokes around the main shape (like a doodle highlight).
- Colour = surface `icon` (or onPhoto.icon).

**Editorial set (auto pool, in this order):** `heart-spark`, `mountain`, `shield-heart`, `smile`, `leaf`, `home`, `chat`, `coffee`, `sun`, `moon`, `star`, `book`, `plane`, `gift`, `map-pin`, `music`, `flower`, `umbrella`, `key`, `heart`.
**Dev set (auto pool):** `terminal`, `code`, `git-branch`, `bug`, `rocket`, `check-circle`, `alert`, `folder`, `database`, `cpu`, `lightbulb`, `clock`.
**UI-on-slide icons (not in pools):** `arrow-right`, `circle-arrow`, `bookmark`.

**`icon=auto`:** pick from the family pool with index = hash(slug + ':' + slideIndex) mod poolLength. If the result equals the previous slide's icon, take the next one in the pool.
An unknown icon name → warning `unknown-attr` (message names the icon) and no icon is drawn.

---

## 8. App UI (the editor around the slides)

**Concept: a small print shop.** "Press" in the name points at printing. Use a warm, ink-dark workspace so the slides are the brightest thing on screen, plus a few print-production details (crop marks, a registration mark). Keep it subtle, not a costume.

> If the owner later provides a shared "house layer" (rhythm, motion timing, quality floor shared across his apps), it overrides the chrome tokens below. It never changes slide templates.

### 8.1 Chrome tokens

```css
:root {
  --ink-0: #12110F;   /* app background */
  --ink-1: #1A1916;   /* panels */
  --ink-2: #23211D;   /* inputs, cards */
  --line:  #2F2C27;   /* borders */
  --paper: #EEE9DF;   /* primary text */
  --muted: #9C948A;   /* secondary text */
  --press: #E4573D;   /* accent: primary buttons, focus, registration mark */
  --press-ink: #1A0F0C;
  --ok:    #6FBF73;
  --warn:  #E7B54A;
  --error: #F06A5A;
  --radius: 10px;
  --font-ui: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

Spacing: 4/8/12/16/24/32. Base UI text: 14 px Inter, labels 11 px uppercase with +0.08em tracking, `--muted`. Motion: 140 ms ease-out on hover/focus only. Nothing in the UI animates continuously.

### 8.2 Layout (desktop ≥ 1200 px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⊕ CAROUSEL PRESS   [Deck: 7 perintah git ▾]        saved · 2s ago  [?] │  56px top bar
├──────────────────────┬──────────────────────────────┬───────────────────┤
│ WRITE | PHOTOS       │                              │ TEMPLATE          │
│ ┌──────────────────┐ │        ┌──────────┐          │ [dev/github-dark▾]│
│ │ handle: @…       │ │        │          │          │ ■■■■ swatches     │
│ │ ---              │ │        │ preview  │          │ HANDLE  [@…]      │
│ │ [cover]          │ │        │  9:16    │          │ LANGUAGE [id|en]  │
│ │ …                │ │        │          │          │ PHOTO DARKNESS ── │
│ └──────────────────┘ │        └──────────┘          │ ☐ Safe zone ☐ Grid│
│ ⚠ 1 warning          │   ‹   3 / 9   ›              │ CAPTION [Copy]    │
│ ▸ Syntax cheat sheet │ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐      │ [Download slide]  │
│                      │ └──┘└──┘└──┘└──┘└──┘└──┘ strip│ [Download all ZIP]│
└──────────────────────┴──────────────────────────────┴───────────────────┘
   440px                  flexible                       300px
```

- **Top bar:** the wordmark is "CAROUSEL PRESS" in `--font-mono` 600, 13 px, tracking +0.14em, preceded by a 16 px registration mark (a circle + crosshair) in `--press`. Then the deck switcher (P1 library), a save status, and a help button (opens the syntax cheat sheet).
- **Left column:** tabs **Write** / **Photos**.
  - Write: a full-height textarea in `--font-mono` 14 px / 1.6, `--ink-2` background, with a gutter for warning markers, a warnings list under it, and a collapsible cheat sheet.
  - Photos: a drop zone (dashed `--line`, "Drop photos here"), a 3-column grid of thumbnails with the ID under each plus a copy button, click to enlarge, click on the enlarged image to set the focal point (a 24 px ring with a crosshair).
- **Centre:** the preview canvas is scaled to fit its height (max 80 vh), sits on `--ink-0`, with **crop marks** (four L-shaped 1 px `--muted` marks, 12 px long, 8 px off each corner) instead of a drop shadow. Under it, prev/next and the counter. Then the **filmstrip**: thumbnails 96×171 px, 12 px gaps, active = 2 px `--press` outline, a warning dot (`--warn`, or `--error` for blocking) top-right, the slide number under each.
- **Right column (inspector):** grouped controls with uppercase labels. Primary button **Download all (ZIP)** = `--press` fill with `--press-ink` text. Secondary buttons = `--ink-2` with a `--line` border. Buttons are disabled with the hint "Loading fonts…" until fonts are ready.

### 8.3 Template picker
A dropdown grouped by family ("Editorial", "Dev"). Each option shows the 4 swatches (12 px squares, 2 px gap) + the variant name. P1 gallery button: "Compare templates" opens the gallery modal (PRD F12) as a 3×2 grid of cover+card pairs.

### 8.4 Dialogs
The export-warning dialog: title "Some slides need attention", a list of `Slide 4 — text doesn't fit` items (click → jump), and the buttons **Fix** (primary) and **Export anyway** (secondary). Escape closes it, and focus is trapped while it's open.

### 8.5 Empty and edge states
- First run: load sample `editorial-couples-id` into a new deck, and show a dismissible tip bar: "Edit the text on the left. Slides update live."
- Fonts loading: the preview shows a `--ink-2` 9:16 rectangle with "Loading fonts…" in `--muted`.
- Storage unavailable: a slim `--warn` banner: "Autosave is off in this browser. Use Save deck file to keep your work."

---

## 9. Responsive app layout

- **768–1199 px:** two columns (editor 380 px | preview). The inspector becomes a top toolbar row: template picker, darkness, toggles, and the export buttons.
- **< 768 px:** a bottom tab bar **Write · Photos · Preview · Export**, one panel at a time. The preview fills the width. The filmstrip scrolls horizontally under it. Export lives in its own tab with large buttons.
- Slides themselves never change with screen size; only the chrome does.

## 10. Visual review checklist (run before each milestone sign-off)

Render every sample deck in every template into `review/` (see CLAUDE.md) and check each PNG:

- [ ] No text, badge, code or CTA outside SAFE (overlay a SAFE outline in review renders only).
- [ ] No clipped glyphs and no overflow flags.
- [ ] Headline is the dominant element; body is clearly secondary.
- [ ] Badge digits are optically centred.
- [ ] Surface rotation visible across content slides (editorial).
- [ ] Blobs never cover text in a way that reduces readability (contrast test passes; also eyeball it).
- [ ] Code is not wrapped, the prompt is correct, highlight colours are distinct.
- [ ] Photo slides: text is readable over both the brightest and darkest parts of `sample-dusk`.
- [ ] Footer and header align on the same x positions across all slides.
- [ ] Counter digits don't jitter between slides (tabular).
