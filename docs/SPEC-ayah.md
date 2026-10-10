# Carousel Press: Ayah & Hadith addendum

> Addendum to PRD.md / DESIGN.md (and SPEC-lexicon.md). Adds Arabic-text slides for the **Ayat Harian** account: `[ayah]` and `[hadith]`, plus a calm template family `serene`.
> Same rules as the main spec: the parser never throws, there is one render path, layouts use stack-fit, everything stays inside SAFE, and contrast is tested.
> **Extra rule for this addendum: Arabic text is sacred content and is rendered verbatim. Never reshape, trim, auto-correct, shrink below the minimum, or clip it.** If it doesn't fit, block the export.

---

## 1. Slide syntax

Both types use field lines (`key: value`), like `[word]` in SPEC-lexicon.md.

### 1.1 `[ayah]`

| Key | Required | Meaning |
|---|---|---|
| `arab` | ✔ | Arabic text of the ayah (or a clearly marked portion), copied from the verified source. Drawn verbatim: no inline rules, no `|` processing |
| `terjemah` | ✔ | Indonesian translation, copied verbatim from the cited translation. Inline rules allowed only for `|` line breaks |
| `ref` | ✔ | Citation, e.g. `QS. Ar-Ra'd [13]: 28` |
| `source` | | Translation source shown small under the translation, e.g. `Terjemahan Kemenag RI` |
| `mark` | | Ayah number for the end-of-ayah ornament (`﴿٢٨﴾`). Default: the last number in `ref`. `mark=off` hides it |
| `portion` | | `true` if `arab` is only part of the ayah. Adds `(penggalan)` after the ref |

### 1.2 `[hadith]`

| Key | Required | Meaning |
|---|---|---|
| `arab` | | Arabic matn (optional), verbatim |
| `text` | ✔ | Indonesian translation, verbatim from the cited source |
| `ref` | ✔ | Takhrij, e.g. `HR. Bukhari no. 6018` |
| `grade` | ✔ | Grading with its authority, e.g. `Sahih` or `Hasan (menurut at-Tirmidzi)` |
| `source` | | Where the translation came from, e.g. `HadeethEnc` |

A missing required key gives warning `missing-field`, and **export is blocked** (unlike other missing-field fallbacks). The slide is not rendered as a card.

### 1.3 Strings

| Key | `id` |
|---|---|
| `portion` | `(penggalan)` |
| `gradeLabel` | `Derajat` |

## 2. Arabic rendering

- **Fonts (bundle):** `Amiri Quran` (OFL) for `[ayah] arab`, and `Amiri` (OFL) for `[hadith] arab`. Use only these faces for Arabic. Don't fall back to system fonts, because diacritics break.
- Canvas: `ctx.direction = 'rtl'`, `textAlign = 'center'` for ayah, `'right'` for hadith Arabic.
- **Wrapping:** break only at spaces. Never inside a word. Never drop or move diacritics (harakat, waqf marks). Measure whole words with their marks.
- **Size:** ayah `arab` 76 → 48 px (step 4), line-height **2.1** (diacritics need room). Hadith `arab` 56 → 40 px, lh 2.0.
- **Overflow** at the minimum size → warning `arabic-too-long` (**blocks export**, with no "Export anyway" option). Message: "Ayat terlalu panjang untuk satu slide. Gunakan penggalan atau pecah di tanda waqaf." Arabic is never clipped.
- **End-of-ayah ornament:** append ` ﴿` + Arabic-Indic digits of `mark` + `﴾` (U+FD3F/U+FD3E with ٠–٩) to the last line, in the same face, in `accent` colour.
- **Tests:** shaping can't be unit-tested reliably, so add golden-image hashes for the sample slides in Chromium (`npm run review`), plus unit tests that the parser keeps `arab` byte-identical (including combining marks, tatweel and U+06DD) and that wrapping never splits a word.

## 3. Layouts (all families; `serene` is the intended look)

Content stack between y = 344 and 1376 (DESIGN §2, Oct 2026), x = 96–912, **centred horizontally**.

### 3.1 `ayah`

1. Small ornament (§4 deco) → gap 48
2. **arab**: centred, `ink`, sizes from §2 → gap 56
3. A thin divider: a 120 px line in `accent` at 60%, centred → gap 48
4. **terjemah**: `serif` 500, 42 → 32 px (step 2), lh 1.5, centred, `body`, max 7 lines → gap 32
5. **ref**: `sans` 600 30 px, `accent`, centred (plus `(penggalan)` if `portion`) → gap 10
6. **source**: `sans` 400 24 px, `muted`, centred

Stack-fit priority when it overflows: source → terjemah size. **Arabic size steps down last**, and never below its minimum.

### 3.2 `hadith`

1. Label pill `HADIS` (`sans` 600 24 px, tracking +3, `accent` border) → gap 40
2. **arab** (if any): right-aligned → gap 40
3. **text**: `serif` 500, 44 → 32, lh 1.5, left-aligned, `ink`, max 8 lines → gap 32
4. **ref** (`sans` 600 30, `accent`) · **grade**: a pill (`badgeBg`/`badgeInk`, `sans` 600 24) with `Derajat: <grade>` → gap 10
5. **source**: `sans` 400 24, `muted`

### 3.3 Other types in `serene`
- **cover/card/quote/end** use the editorial layouts but **centred**, with no blobs and no numbered badges by default (`number=off` implied). `card` is meant for "Renungan" (reflection) slides.
- No auto icons. Icons are allowed only if explicitly set (`moon`, `star`, `leaf`, `sun`, `book`).
- Photos: allowed but discouraged. If used, the overlay darkness is at least 70, and the photo must have no people or animals (content rule; the app can't check it).

## 4. Template family `serene`

Calm, lots of whitespace, a fine inset frame, one small geometric ornament. No blobs, no dot grid, no scanlines.

Fonts: serif `Lora` (500/600/700), sans `DM Sans`, Arabic per §2.

**`serene/fajr`**: dawn. Warm paper with deep green and muted gold.
rotation `['paper']` · swatches `#F5F1E8 #2F5D4A #B08D57 #1F2B24`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| paper | #F5F1E8 | #1F2B24 | #34423A | #66706A | #2F5D4A | #2F5D4A | #F5F1E8 | #F5F1E8 | #2F5D4A | #EAE4D6 |
| deep | #1F3A30 | #F5F1E8 | #DCD8CC | #A9B0A8 | #D8BC86 | #D8BC86 | #1F3A30 | #1F3A30 | #D8BC86 | #2A4A3E |

**`serene/isya`**: night. Deep navy with soft gold.
rotation `['night']` · swatches `#12202B #D9B76E #F3EEE2 #1C2E3C`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| night | #12202B | #F3EEE2 | #D2CBBB | #9AA3A8 | #D9B76E | #D9B76E | #12202B | #12202B | #D9B76E | #1C2E3C |
| deep | #0C161E | #F3EEE2 | #D2CBBB | #9AA3A8 | #D9B76E | #D9B76E | #0C161E | #0C161E | #D9B76E | #16242F |

**Deco (both):**
- **Frame:** a 2 px rectangle inset 40 px from the canvas edges, `accent` at 35%, with radius 24.
- **Ornament:** an original 8-point star (two overlapping squares rotated 45°), 56 px, stroke 2 px, `accent` at 70%, centred at the top of the content stack. Author the geometry yourself; don't copy any traced mosque or calligraphy artwork.

Contrast: the DESIGN §4.4 rules apply.

## 5. Warnings added

| Code | Blocks export? |
|---|---|
| `missing-field` (on ayah/hadith) | **Yes**, no override |
| `arabic-too-long` | **Yes**, no override |
| `arabic-font-missing` (Amiri faces not loaded) | **Yes**, no override |

## 6. Samples (ship as `samples/serene-ayah.txt`)

The sample deliberately uses placeholders so the app never ships Arabic text or translations that weren't copied from a verified source.

````text
template: serene/fajr
lang: id
title: hati yang tenang
caption: Semoga jadi pengingat untuk kita semua. Teks: Tanzil · Terjemahan: Kemenag RI
---
[ayah]
arab: [SALIN TEKS ARAB DARI SUMBER TERVERIFIKASI]
terjemah: [SALIN TERJEMAHAN KEMENAG RI]
ref: QS. Ar-Ra'd [13]: 28
source: Terjemahan Kemenag RI
---
[card]
Renungan
Saat pikiran penuh, mungkin yang kita butuhkan bukan jawaban, tapi berhenti sejenak dan mengingat-Nya.
---
[end]
Semoga hari ini lebih tenang.
Simpan, dan bagikan ke yang sedang butuh.
````

## 7. Milestone

**M8: Ayah & Hadith.** Parser, layouts in all families, the `serene` family, Amiri faces, blocking warnings, tests, the sample and a visual review. Done when the sample renders (with real Arabic test strings from Tanzil pasted into the local review fixture only) with correct shaping, no clipping, and zero warnings in `serene/*`.
