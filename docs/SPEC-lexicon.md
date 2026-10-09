# Carousel Press: Lexicon addendum (word / table / compare slides)

> Addendum to PRD.md and DESIGN.md. Adds three slide types and one template family for the language-learning accounts (English Sehari, Kamus Kecil).
> Same rules as the main spec: the parser never throws, there is one render path, layouts use stack-fit, everything stays inside SAFE, and contrast is tested.
> Where this file and the main spec conflict on these features, this file wins.

---

## 1. Why

Word-learning posts carry structured data: a headword, pronunciation, part of speech, meaning, example, origin, verb forms, right vs wrong. Squeezing that into `card` headline+body makes it hard to read. These slides give each field its own place, so a viewer can scan a slide in two seconds.

## 2. New slide types (deck syntax)

All three use the normal tag line (`[word]`, `[table]`, `[compare]`) and accept the normal attributes (`photo`, `surface`, `number`, `cta`). `icon` is ignored on them.

### 2.1 `[word]`: dictionary entry

The lines after the tag are **field lines**: `key: value`. Field order in the text doesn't matter; the layout fixes the order.

| Key | Required | Meaning | Example |
|---|---|---|---|
| `word` | ✔ | Headword | `thought` |
| `ipa` | | Pronunciation in IPA (several allowed, separated by ` · `) | `/θɔːt/ (UK) · /θɑːt/ (US)` |
| `say` | | Friendly respelling / pronunciation tip | `"thot", ujung lidah di antara gigi` |
| `pos` | | Part of speech / label, drawn as a pill | `verb · V2/V3 of think` |
| `tag` | | Small badge top-right of the headword (e.g. `BAKU`, `V2`, `B2`) | `BAKU` |
| `meaning` | | Meaning / translation. `|` = line break | `berpikir; mengira` |
| `example` | | Example sentence; `*word*` highlights the target word | `I *thought* you were coming.` |
| `translation` | | Translation of the example (smaller, muted) | `Kukira kamu datang.` |
| `origin` | | Etymology / origin row | `Portugis *janela*` |
| `note` | | One extra line (tip, warning, source) | `Sumber: KBBI VI Daring` |

- Unknown key → warning `unknown-field`, and that line is ignored.
- A line without `key:` → warning `unknown-field`, ignored.
- Missing `word` → warning `missing-word`, and the slide renders as a card from the remaining text.
- Inline rules (`|`, `*accent*`, `` `code` ``) apply to every value except `ipa`, which is drawn verbatim.

### 2.2 `[table]`: small table

- Line 1 = **headline** (table title).
- Lines starting with `|` are **table rows**: `| cell | cell | cell |`. The first row is the header. Inside table rows, `|` is a cell separator (the line-break rule does not apply); `\|` is a literal pipe.
- Lines not starting with `|` after the table = **note** (small, muted).
- Limits: 2–4 columns, 1 header row + up to 8 body rows. Rows with fewer cells are padded with empty cells. More cells than the header → warning `table-shape`.
- `*accent*` works inside cells (e.g. highlight the irregular part: `th*ought*`).

### 2.3 `[compare]`: wrong vs right

| Key | Required | Meaning |
|---|---|---|
| `wrong` | ✔ | The wrong / non-standard form |
| `right` | ✔ | The correct / standard form |
| `why` | | One or two sentences explaining it |
| `wrong-label` | | Overrides the label (default from strings: `Salah` / `Wrong`) |
| `right-label` | | Overrides the label (default: `Benar` / `Right`) |
| `headline` | | Optional title above the boxes |

Missing `wrong` or `right` → warning `missing-field`, and the slide renders as a card.

### 2.4 New built-in strings (add to `strings.ts`)

| Key | `id` | `en` |
|---|---|---|
| `compareWrong` | `Salah` | `Wrong` |
| `compareRight` | `Benar` | `Right` |
| `labelMeaning` | `Arti` | `Meaning` |
| `labelExample` | `Contoh` | `Example` |
| `labelOrigin` | `Asal kata` | `Origin` |
| `labelSay` | `Cara baca` | `Say it` |

---

## 3. New template family: `lexicon`

A dictionary/notebook look: paper backgrounds, a big headword, labelled sections, no blobs.
The family must render **all** slide types (cover, card, code, quote, end, word, table, compare). Existing families must render word/table/compare too, with their own tokens and these layouts.

### 3.1 Fonts (bundle via @fontsource)

| Role | Face |
|---|---|
| headword, headlines | `Lora` 700 (already bundled) |
| body, labels | `DM Sans` 400/500/600 (already bundled) |
| **IPA** | **`Gentium Book Plus`** 400 (or another bundled face with full IPA Extensions U+0250–02AF and spacing modifiers U+02B0–02FF). Inter/DM Sans/Lora latin subsets do NOT cover IPA reliably |

Add a test that renders every character used in the sample decks' `ipa` fields and confirms the IPA face covers it (e.g. by comparing `measureText` against the fallback). If a glyph is missing → warning `ipa-glyph-missing`.

### 3.2 Variants

**`lexicon/kamus`**: Kamus Kecil. Cream dictionary paper with red accent.
rotation `['paper', 'paper-alt']` · swatches `#F6F1E7 #B3261E #1E1B18 #E8DFCC`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| paper | #F6F1E7 | #1E1B18 | #3A342D | #6E665C | #A3221B | #B3261E | #FFFFFF | #F6F1E7 | #B3261E | #EAE1CF |
| paper-alt | #EFE7D6 | #1E1B18 | #37312A | #675F55 | #9E211A | #B3261E | #FFFFFF | #EFE7D6 | #B3261E | #E3D8C2 |
| deep | #2A211C | #F6F1E7 | #E1D8C8 | #B3A894 | #F08A7E | #F08A7E | #2A211C | #2A211C | #F08A7E | #3A2F28 |

Extra tokens: `rule: #DCCFB8` (divider lines), `highlight: #F3D9A4` (marker behind `*word*` in examples), `okBg: #E3EEDB`, `okInk: #2E5A2A`, `badBg: #F6DCD8`, `badInk: #8E1F17`.
Deco: a thin double rule under the header (2 px + 1 px, `rule`), and a large faint `“` page-number-style glyph off the bottom-right at 4%.

**`lexicon/notebook`**: English Sehari. Lined school notebook with blue pen and yellow marker.
rotation `['page']` · swatches `#FBFBF7 #2F5BD3 #1B2430 #FFE58A`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| page | #FBFBF7 | #1B2430 | #364152 | #677184 | #2448B8 | #2F5BD3 | #FFFFFF | #FBFBF7 | #2F5BD3 | #EEF1F8 |
| deep | #1D2A44 | #F4F6FB | #D5DBE8 | #A3AEC4 | #9DB6FF | #FFE58A | #1D2A44 | #1D2A44 | #FFE58A | #2A3A5C |

Extra tokens: `rule: #DCE4F2` (horizontal notebook lines every 64 px, 2 px, from y=196 to 1500), `margin: #E7877D` (vertical margin line, 3 px, at x=72), `highlight: #FFE58A`, `okBg: #DFF1E2`, `okInk: #1F6B33`, `badBg: #FBE0DD`, `badInk: #A3261C`.

Contrast rules from DESIGN §4.4 apply, plus: `okInk` on `okBg` and `badInk` on `badBg` ≥ 4.5:1, and `ink` on `highlight` ≥ 4.5:1.

---

## 4. Layouts (all families; tokens from the active variant)

All layouts are content stacks (DESIGN §3.3) between y = 344 and 1400, x = 96–912, using stack-fit.
For families without the lexicon extra tokens, derive them: `rule` = muted at 30%, `highlight` = accent at 22%, ok/bad = fixed `#E3EEDB/#2E5A2A` and `#F6DCD8/#8E1F17` on light surfaces, or their dark counterparts `#1E3A24/#9BE3A6` and `#3E1E1C/#F5A39A` on dark surfaces.

### 4.1 `word`

Stack from y = 344:

1. **pos pill** (if `pos`): `sans` 600 26 px uppercase, tracking +2, `accent` text, 2 px `accent` border, radius 999, padding 12×22. → gap 28
2. **headword**: `serif` 700, 168 → 96 px (step 8), lh 1.0, max 2 lines, `ink`. If `tag`: a badge pill (`badgeBg`/`badgeInk`, `sans` 600 24 px, padding 8×16, radius 10) aligned to the headword's first-line cap height, 20 px to the right of the word (or on the next line if it doesn't fit). → gap 20
3. **ipa** (if any): IPA face 46 → 34 px, `body`. → gap 10
4. **say** (if any): small label `labelSay` (`sans` 600 22 px uppercase, `muted`) + 12 px gap + the text in `sans` 400 32 → 28 px, `muted`, on one line if it fits. → gap 40
5. **divider**: 2 px `rule`, full width. → gap 40
6. **meaning** (if any): label `labelMeaning` (22 px uppercase `muted`) → gap 12 → `sans` 500 46 → 34 px, lh 1.35, `ink`, max 4 lines. → gap 40
7. **example** (if any): label `labelExample` → gap 12 → a block with a 6 px `accent` left bar, padding-left 28: `serif` 600 42 → 32 px, lh 1.35, `ink`, max 4 lines; `*word*` drawn with a `highlight` marker rect behind it (rect = glyph box + 6 px horizontal padding, 0.62 × size tall, vertically centred slightly below the x-height, radius 6). **translation** under it: `sans` 400 32 → 28, `muted`, max 2 lines. → gap 40
8. **origin** (if any): label `labelOrigin` → gap 12 → `sans` 500 36 → 30, `body`; `*accent*` = the source word in `accent`. → gap 32
9. **note** (if any): `sans` 400 30, `muted`, max 2 lines.

Stack-fit priority when it overflows: note → translation → say → example → meaning → ipa → headword.

### 4.2 `table`

- Stack from y = 344: [number badge if numbering applies] → **headline** (`serif` 700, 76 → 56, max 3 lines) → gap 40 → **table** → gap 32 → **note**.
- Table box: x = 96, width 816, radius 20, 2 px `rule` border, clipped.
- Header row: fill `accent` at 12% over `bg`, text `sans` 600, 30 px uppercase, tracking +1, `accent`.
- Body rows: `sans` 500, 40 → 28 px (step 2, shared by all body cells), `ink`; zebra fill `rule` at 35% on even rows; 1 px `rule` between rows.
- Row height = size × 1.9. Cell padding 24 horizontal.
- Column widths: measure each column's widest cell at the current size, then distribute the remaining width proportionally. If the minimum widths exceed 816 at the min size → clip cells with an ellipsis and raise `table-too-wide`.
- Cells never wrap. Shrink, then ellipsis + warning (same philosophy as code).
- More than 8 body rows → warning `table-too-many-rows`; render the first 8.

### 4.3 `compare`

- Stack from y = 344: [**headline** if any, `serif` 700 72 → 56, max 2 lines → gap 40] → **wrong box** → gap 28 → **right box** → gap 48 → **why**.
- Box: width 816, radius 24, padding 32. Wrong: fill `badBg`; right: fill `okBg`.
- Inside a box: an icon (`x-circle` / `check-circle`, 44 px, `badInk` / `okInk`) + 16 px gap + the label (`sans` 600 26 px uppercase, tracking +2, same ink) on the first row; then the text (`serif` 600 52 → 36, lh 1.25, max 3 lines). Wrong text is `badInk` with a 3 px strike-through line through each line's middle; right text is `okInk`, and `*accent*` = `ink` on `highlight`.
- **why**: `sans` 400 38 → 30, lh 1.5, `body`, max 4 lines.
- Add the icon `x-circle` to the icon set (original path, same style rules as DESIGN §7).

---

## 5. Warnings added

| Code | Blocks export? |
|---|---|
| `missing-word`, `missing-field` | No (falls back to card) |
| `unknown-field` | No |
| `table-shape` | No |
| `table-too-many-rows` | **Yes** (confirm "Export anyway") |
| `table-too-wide` | **Yes** |
| `ipa-glyph-missing` | **Yes** |

## 6. Tests

- Parser: field lines for word/compare (order independence, unknown keys, missing required keys → fallback), table rows (pipes, escaped pipes, padding, too many cells/rows), and inline rules not applied to `ipa`.
- Layout: stack-fit priority for `word`; table column distribution, shared row size, ellipsis + `table-too-wide`; compare box heights.
- safezone.test: every block of the new types stays inside SAFE for all templates × the new samples.
- contrast.test: the extra tokens (§3.2).
- IPA glyph coverage test (§3.1).
- Visual review: add the two samples below to `npm run review` across **all** templates (new types must look right in editorial and dev too).

## 7. Sample decks (ship as `samples/lexicon-english-ought.txt` and `samples/lexicon-kamus-baku.txt`)

````text
handle: @englishsehari
template: lexicon/notebook
lang: id
title: verb pola ought
caption: Think jadi thought, buy jadi bought. Ini polanya 👇 #belajarbahasainggris #irregularverbs #englishsehari
---
[cover kicker="IRREGULAR VERBS"]
Think → Thought? | Ini Polanya
6 kata kerja yang V2-nya berakhiran -ought / -aught.
---
[table]
Pola *-ought*
| V1 | V2 / V3 | Arti |
| think | th*ought* | berpikir |
| bring | br*ought* | membawa |
| buy | b*ought* | membeli |
| fight | f*ought* | bertarung |
Bunyinya sama: "ot" panjang.
---
[table]
Pola *-aught*
| V1 | V2 / V3 | Arti |
| teach | t*aught* | mengajar |
| catch | c*aught* | menangkap |
---
[word]
pos: verb · V2/V3 of think
word: thought
ipa: /θɔːt/ (UK) · /θɑːt/ (US)
say: "thot", ujung lidah di antara gigi
meaning: berpikir; mengira
example: I *thought* you were coming.
translation: Kukira kamu mau datang.
---
[compare]
wrong: Yesterday I thinked about it.
right: Yesterday I *thought* about it.
why: Think tidak pakai -ed. Bentuk lampaunya thought.
---
[end]
Simpan dulu ✏️
Besok kita bahas pola yang lain.
````

````text
handle: @kamuskecil
template: lexicon/kamus
lang: id
title: baku atau tidak
caption: Sering salah, padahal dipakai tiap hari. Sumber: KBBI VI Daring #bahasaindonesia #katabaku #kbbi
---
[cover kicker="KATA BAKU"]
Kamu Masih Nulis | "Resiko"?
4 kata yang sering salah tulis.
---
[table]
Mana yang baku?
| Baku | Tidak baku |
| *risiko* | resiko |
| *apotek* | apotik |
| *praktik* | praktek |
| *nasihat* | nasehat |
Sumber: KBBI VI Daring
---
[compare]
wrong-label: Tidak baku
right-label: Baku
wrong: Apa resikonya?
right: Apa *risikonya*?
why: KBBI mencatat bentuk bakunya "risiko".
---
[word]
pos: nomina
tag: SERAPAN
word: jendela
meaning: [kutip definisi dari KBBI VI Daring]
example: Buka *jendela* biar udaranya segar.
origin: dari bahasa Portugis *janela*
note: Sumber: KBBI VI Daring
---
[end]
Kata apa yang sering bikin kamu ragu?
Tulis di komen, nanti kita bahas.
````

(The `meaning` placeholder in the second sample is intentional. The app ships it as-is, and real posts must quote the actual KBBI definition.)

## 8. Milestone

**M7: Lexicon.** Parser + layouts for word/table/compare in all families, the `lexicon` family with 2 variants, IPA font, warnings, tests, samples, and a visual review. Done when both samples render with zero warnings in `lexicon/*`, and with no overflow in every other template.
