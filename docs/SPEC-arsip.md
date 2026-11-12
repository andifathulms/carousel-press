# Carousel Press: Arsip addendum (Sejarah Nusantara design system)

> Addendum to DESIGN.md. Defines the `arsip` template family for Sejarah Nusantara (@sejarah.nusantara.id). It replaces `editorial/sage` and `editorial/midnight` for history decks and closes the open `editorial/archive` item in docs/channels.md.
> Status: **shipped** (11 Nov 2026). Code: `packages/carousel-core/src/templates/arsip/`. Renders: `docs/arsip-bubat.png` (Bubat, `arsip/bata`) from `npm run review`. All 43 `sejarah-*` samples use it.
> Same rules as the main spec: one render path, text inside SAFE, numbers live in `const TYPE` and the variant tokens, contrast is tested.

---

## 1. Why

**What we do now.** Every slide is the same: a full-bleed photo, a dark tint, and white text on top. Text competes with the picture (on Bubat slide 2 the "GEDUNG SATE" letters sit under the body), the tint flattens the photo, and slide 9 looks like slide 2. Nothing tells the viewer which slide is the turn of the story.

**What the reference does (Neo Historia, "Kutukan Pengetahuan", 9 slides, studied Nov 2026).** We study the principles. We don't copy the look (see §9).

1. **Text never sits on a photo.** In 8 of 9 slides the text is on a flat surface and the photo is a hard-edged print beside it. The cover title is on a white card.
2. **Photo and text interlock.** A title card bites into a portrait's corner, a text box sits across a photo's edge, a caption overlaps an engraving. That collage overlap is what makes it look designed and not just stacked.
3. **Colour marks a slide's role, not a rotation.** Paper grey carries the story. Crimson marks the turns (the definition slide, "no student came"). Black appears only on the cover.
4. **Two text columns.** Titles hang at the margin, body text is indented about 20%, and paragraphs step left and right.
5. **Very little chrome.** A logo top-left, a thin arrow bottom-right, and a small serif photo credit bottom-left like a museum label. No counter, icons or blobs.
6. **The images are period sources** (paintings, engravings, old photographs), shown as they are with no tint.

Their format is 3:4. Ours is 9:16 with TikTok's UI over the top 170 px, the right-hand buttons and the bottom 400 px. So we add one rule they don't need: **images take the zones TikTok covers, text stays in SAFE.**

---

## 2. Principles

1. **Text on paper, photos as prints.** No tint, gradient or text shadow on a photo, ever. If text must cross a photo, it sits on a solid plate.
2. **Every photo touches text or an edge.** A photo either bleeds off the canvas (into a UI zone) or is bitten by a text plate. A photo floating in the middle with even margins is a mistake.
3. **Surface = narrative role** (§6). The viewer should feel the hook and the turn before reading them.
4. **The margin rule.** Body text always starts at x = 288, with a 3 px rule at x = 252 beside it, like a note in the margin of an archive file. Headlines always start at x = 96. That two-column step is the family's signature.
5. **Credit every image on the slide.** A museum-style caption, giving the subject first and then the author and licence. It also meets CC BY-SA attribution on the image itself.
6. **Quiet chrome.** Mark + handle, credit, folio. No icons, badges, blobs or swipe text.

---

## 3. Tokens

### 3.1 Surfaces (variant `arsip/bata`)

| Surface | bg | ink (headline) | body | muted / credit | accent | Use |
|---|---|---|---|---|---|---|
| `kertas` (paper) | #F2ECE1 | #1D1A16 | #38322A | #6B6256 | #9A3A1E (bata) | default story slide |
| `bata` (brick) | #8A3118 | #FBF4EA | #F6E9DC | #D9C3B3 | #EBC97E (lontar) | hook card + the turn |
| `nila` (indigo) | #16213A | #FBF4EA | #DCD5C8 | #D9C3B3 | #EBC97E | cover band, quote, end |
| `lembar` (card) | #FBF8F1 | #1D1A16 | #38322A | #6B6256 | #9A3A1E | cover card, A/B option cards |
| `naskah` (manuscript) | #E6D7B8 | #1D1A16 | #38322A | #574F44 | #9A3A1E | quote sheet |

Contrast (WCAG, all ≥ 4.5): kertas 14.7 / 10.8 / 5.1 / 6.0 · bata 7.6 / 7.0 / 4.9 / 5.2 · nila 14.6 / 11.0 / 9.5 / 10.0 · lembar 16.3 / 11.9 / 6.6 · naskah 12.2 / ≥ 4.9 (muted darkened from #6B6256, which only reached 4.2 there).

Why these colours: brick is the red of Majapahit's Trowulan temples, indigo (nila) is the oldest Nusantara dye, and lontar is palm-leaf manuscript yellow. They are rooted in the subject, and clearly not Neo Historia's crimson, grey and black.

Optional second variant `arsip/nila` for wars and night events (replaces `editorial/midnight`): the default surface is `nila`, and `bata` stays the turn colour.

### 3.2 Fonts (all already bundled, no new dependency)

| Token | Face | Used for |
|---|---|---|
| `serif` | Lora 700, Lora 600 italic | headlines, quote text, A/B option labels |
| `sans` | DM Sans 400 / 600 | body and handle; `*accent*` in body = accent colour (inline markup has no bold) |
| `label` | Barlow Condensed 700, uppercase, tracked | kicker tab, folio, quote tag, attribution, CTA |
| `caption` | Gentium Book Plus 400 | photo credit |

As built: quotes are Lora 600 upright and credits are regular Gentium, because the font gate loads no italic faces. Only already-bundled font files are used.

Lora and DM Sans are what the account posts in today (`editorial/sage`), so followers' recognition carries over.

### 3.3 Type scale

| Role | Face | Size max → min (step) | lh | Max lines |
|---|---|---|---|---|
| cover headline | serif 700 | 88 → 68 (4) | 1.06 | 4 |
| cover subtitle | sans 400 | 38 → 32 (2) | 1.45 | 4 |
| kicker tab | label 600 | 30 fixed, +4 tracking | — | 1 |
| card headline | serif 700 | 70 → 56 (2); bata/teks plates 84 → 64 | 1.10 | 3 |
| body | sans 400 | 38 → 34 (2) | 1.45 | 12 |
| quote text | serif 600 italic | 58 → 44 (2) | 1.20 | 6 |
| attribution / tag | label 600 | 26–28 fixed | — | 1 |
| end headline | serif 700 | 76 → 60 (4) | 1.08 | 3 |
| handle | sans 600 | 28 fixed | — | 1 |
| folio | label 500 | 30 fixed, +2 tracking | — | 1 |
| credit | caption italic | 24 fixed | 1.3 | 2 |

The body column is 624 px wide (x 288 → 912), about 33 characters per line at 38 px. A 35–45-word body (the channel rule since 12 Nov 2026) takes 8–10 lines; the photo plates shrink their photo to make room (§5).

---

## 4. Grid and chrome

```
x:  0    72 96        252 288                       912 930    1080
    │     │  │ headline│   │ body column (624)       │   │ buttons
    │     │  │ start   │rule                          │   │ zone
```

- **Mark + handle:** an original split-gate glyph (candi bentar: two stepped halves, 2 subpaths, 40 px) + `sejarah.nusantara.id`, at x 96, top 204. Colour is bata on paper and kertas on dark surfaces. Over a photo it goes on a nila chip.
- **Folio** (replaces the counter + swipe hint): `03/10` + a 76 px drawn arrow, right edge at x 912, baseline 1440. No arrow on the last slide. The cover says `GESER` instead of the number.
- **Credit:** bottom-left at x 96, baseline 1440, max 600 px wide, 2 lines. Format: `<subject>, <place/date> · <author>, <licence>`. Over a photo, credit and folio sit on chips (kertas on paper-led slides, nila on dark ones).
- **Margin rule:** 3 px, x = 252, from body top +12 to body bottom −12. bata on paper, lontar on bata/nila.
- **Plate:** a solid rectangle that holds text over or against a photo. Same colour as the slide surface (it reads as a notch cut from the photo), padding 24 / 40 / 20 / 24.
- **Print:** a photo with a 14 px kertas border, used only on dark surfaces. At most one per slide may be rotated (±1.5°, sign from the seeded PRNG).

---

## 5. Plates (layouts)

Seven layouts. All coordinates are canvas px. "Bleeds" means the photo runs off the canvas edge into a UI zone.

| # | Plate | Surface | Photo | Text |
|---|---|---|---|---|
| P1 | **Sampul** (cover) | nila band 0–760 | full-bleed 0→1080 × 760→1920 | `lembar` card x 72–936, top 428, shadow 0 18 40 / 28%; bata **kicker tab** sits on its top-left edge (region · year); headline + subtitle inside, inset 48 |
| P2 | **Babak** (hook / turn) | bata | landscape print x 96 → 1080 from 72 px under the body, bleeding right and bottom (dropped when less than 300 px would show above the caption zone); or a portrait print 336×380 top-right, rotated | headline 84 at y 330 (beside the print if portrait), body column below |
| P3 | **Potret atas** (top bleed) | kertas | portrait: x 396→1080; landscape: full width with the handle on a chip; y 0→520–840 (shrinks as the text grows), bleeds top | headline on a plate biting the photo's bottom-left corner (plate top = photo bottom − 140); body column 80 px under the headline |
| P4 | **Potret bawah** (portrait, bottom) | kertas | x 396→1080, y 1040→1920, bleeds right + bottom | headline at y 330, body column below; credit + folio on kertas chips over the photo |
| P5 | **Bentang** (landscape) | kertas | full width, y (body end + 80, ≥ 960) → 1920, bleeds 3 sides | headline at y 330, body column; chips for the footer |
| P6 | **Naskah** (quote) | nila | photo band 0→720, bleeds top + sides | `naskah` sheet x 84–924, top 600, rotated −1.2°, shadow; `NASKAH · <source>` tag, quote, attribution; the extra body line in the column below |
| P7 | **Akhir** (end) | nila | the cover photo as a print, 440×420 at (96, 310), rotated | end headline at y 800 (A/B options stay in the headline's accents); body below; the CTA in label caps on a `lembar` plate |
| — | **Teks** (no photo) | kertas | none | headline 80 at y 420, body column at y 700 |

Stack-fit still applies inside each plate (body steps down first, then the headline). When text still overflows at min size, the photo gives up height before anything clips: P3 to a minimum of 520 tall; P4/P5 need the photo to start by y 1180, else the card falls back to P3.

---

## 6. Choosing a plate and pacing a deck

The renderer picks the plate. Deck text stays as it is (no new syntax needed for the default case):

| Slide | Plate |
|---|---|
| `cover` | P1 |
| the first card (the hook moment, per the channel's story recipe) | P2 Babak |
| card, photo with h/w ≥ 1.1 | P3 on odd content index, P4 on even |
| card, photo with h/w < 1.1 | P3 (full width) on odd content index, P5 on even |
| P4/P5 whose text leaves the photo less than 380 px above y 1520 | falls back to P3 |
| card, no photo | Teks |
| `quote` | P6 |
| `end` | P7 |
| card with `surface=bata` | P2, photo as a print (the "turn") |

**Pacing rules** (writing rules in docs/channels.md; not enforced by warnings yet):
- At most 2 `bata` slides per deck, never two in a row. The second one is the writer's choice (`surface=bata`), for the turn of the story.
- The top/bottom alternation keeps the same plate from running three slides in a row.
- A photo appears on at most 2 cards, and never on adjacent ones.

---

## 7. Image direction

- Prefer period sources: KITLV/Tropenmuseum photographs, old maps, engravings, prasasti, lontar. Then present-day photos of the actual site.
- No tint, no duotone, no darkening. Black-and-white sources stay black-and-white. They sit well on kertas.
- Portrait plates (P3/P4) need a subject that survives a 684 × 800 crop. Each photo needs a focal point (DESIGN §3.6).
- Avoid photos with large signage or lettering in the crop (the Gedung Sate sign fights the type), or crop it out with the focal point.
- No AI images presented as historical (channel rule). An illustration gets `ilustrasi` in its credit.

---

## 8. Deck format additions (owner-approved Nov 2026, PRD §4.3)

1. **`credit="…"` on cover, card, quote and end** (already an open item). If it's missing, build the credit from `docs/photo-credits.md` data at sample registration (author + licence) and warn `missing-credit` for CC BY/BY-SA photos.
2. **`layout=` override** on card: `potret-atas | potret-bawah | bentang | babak | teks`, for when the automatic pick is wrong. Same warning behaviour as `surface=`.
3. **Photo aspect available at layout time.** The photo store already knows each photo's dimensions. Pass `{w, h}` with the photo asset so layout stays pure.
4. Template `arsip/bata` (+ optional `arsip/nila`) in the registry. Header `template: arsip/bata` for Sejarah decks.

As built: `templates/arsip/` = `variants.ts` (tokens), `type.ts` (scale, plate geometry), `plan.ts` (display list, text fit, mark/handle/credit/folio), `cards.ts` and `layout.ts` (plates), `draw.ts` (replays the list; photos cover-cropped into frames, no tint). `PhotoInput.credit` and `PhotoSize` carry the credit and orientation; `layoutSlide`'s photo argument takes a size. Tests: `tests/arsip.test.ts`, plus the existing safe-zone, contrast and counter suites over both variants.

---

## 9. Deliberately not taken from Neo Historia

- Their palette (crimson #86161A-ish, cool grey paper, black), wheat logo, wordmark placement, and Plus Jakarta-style sans titles.
- Their dog-ear paper sheet and the exact notch-portrait composition. We use the kicker-tab catalogue card, the margin rule, the manuscript sheet and prints instead.
- Their 60–90-word essay bodies. Our channel rule stays at ≤ 30 words per card. Depth goes in the pinned comment.
