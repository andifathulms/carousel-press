# Carousel Press: Script addendum (Arabic RTL + Chinese hanzi)

> Addendum to PRD.md / DESIGN.md, building on **SPEC-lexicon.md** (`[word]`, `[table]`, `[compare]`) and **SPEC-ayah.md** (Amiri fonts, RTL rules).
> Supports the **Kosakata Arab** and **Kosakata Mandarin** accounts. Adds right-to-left Arabic and CJK hanzi inside lexicon slides, pinyin with tone marks, and two variants: `lexicon/arab` and `lexicon/hanzi`.
> Same rules as the main spec: the parser never throws, there is one render path, stack-fit, everything inside SAFE, and contrast is tested.
> **Extra rule: script text is drawn exactly as typed.** Never strip harakat, never reshape, never convert traditional ↔ simplified, never auto-correct tones. If it doesn't fit, shrink to the minimum, then block the export. Never clip.

## Implementation notes (Oct 2026)

Where the build differs from the text below, and why (also in `docs/decisions.md`):

- **Bundled weights.** Only Amiri 400 and Gentium Book Plus 400 were bundled. M9a adds **Amiri 700** (Arabic subset) for the headword. The transliteration face stays at Gentium 400.
- **Transliteration face rule (§6.1).** The bundled Lora / DM Sans files are the **latin** subset only (no Latin Extended-A), so `ā ī ū` would fall back to a system font. A Latin value switches to the transliteration face when it has any character outside the variant faces' **latin subset** (not "outside Latin-1 + Latin Extended-A").
- **Paragraphs keep the template face (§6.1).** The whole-value switch to the transliteration face applies to short values (`translit`, `pinyin`, `meaning`, `example`, `say`, table cells, compare boxes). Paragraphs (`why`, `note`, `translation`, `origin`, headlines) keep the template face; letters the latin subset lacks fall through to Gentium in the font stack (`primary, Gentium Book Plus, Amiri, generic`), so they never reach a system font either.
- **Base direction for paragraphs.** Paragraph fields are always left-to-right (they're Indonesian explanations that may quote an Arabic word, e.g. `why: سَيَّارَة (mobil) itu muannats…`). The first-strong-character rule (§2) decides the base direction of short values and table cells.
- **Sample (§12).** `هَذَا` is written `هٰذَا` (dagger alif), the form in Wiktionary's entry; every other Arabic word in the sample matched Wiktionary's vowelled headword byte for byte. Almaany and Hans Wehr are still the channel's final check.

---

## 1. Why

`[word]`/`[table]`/`[compare]` assume Latin text set in Lora/DM Sans. Arabic in those fonts falls back to a system face (broken harakat, wrong direction). Hanzi has no bundled glyphs at all, so output differs per machine. This addendum makes both scripts first-class, without new slide types: the **same** three lexicon types gain script-aware fields and rendering.

Launch order: **Arabic first** (it reuses the Amiri faces and RTL code from M8), then hanzi.

## 2. Script detection

Script is decided **per field value**, not per deck:

| Detected script | Rule (first strong character of the value) | Render path |
|---|---|---|
| `arab` | U+0600–06FF, U+0750–077F, U+08A0–08FF, U+FB50–FDFF, U+FE70–FEFF | RTL, Amiri (§4) |
| `han` | U+4E00–9FFF, U+3400–4DBF, U+3000–303F, U+FF00–FFEF | CJK (§5) |
| `latin` | anything else | existing lexicon rules |

- Optional deck header `script: arab | hanzi`. It doesn't change detection. It only picks the default labels (§3.3) and turns on the script-specific warnings (§8).
- Mixed values (e.g. `kitāb (كِتَاب)`) are allowed. The value is drawn as one `fillText` run with the canvas bidi algorithm, using the **base direction of the first strong character**. Each script run is drawn in its own face (§6.2).

## 3. Field additions

### 3.1 `[word]`: new keys (all optional)

| Key | Script | Meaning | Example |
|---|---|---|---|
| `translit` | arab | Latin transliteration, drawn in the transliteration face (§6.1) | `kitāb` |
| `root` | arab | Root letters, separated by spaces or `-`. Drawn as separate letters joined by ` - ` in the `root` colour | `ك ت ب` |
| `pattern` | arab | Morphological pattern (wazan), Arabic, small | `فِعَال` |
| `plural` | arab | Plural form, Arabic (+ optional translit after ` · `) | `كُتُب · kutub` |
| `pinyin` | han | Pinyin with tone marks **or** tone numbers (§5.3). One syllable per hanzi, separated by spaces | `xiè xie` or `xie4 xie5` |
| `hsk` | han | HSK level, drawn as a badge next to `tag` (`HSK 1`) | `1` |
| `measure` | han | Measure word (classifier), hanzi + pinyin | `本 běn` |
| `strokes` | han | Stroke count, small meta line | `12` |
| `example-pinyin` | han | Pinyin line under a hanzi `example` | `Xièxie nǐ!` |

The existing keys keep working. When `word` is Arabic or hanzi:
- `ipa` and `say` are still allowed (e.g. `say` for an Indonesian-friendly tip). If both `translit` and `ipa` exist, translit comes first.
- `meaning`, `translation`, `origin` and `note` are normally Indonesian (Latin path).
- `example` may be Arabic or hanzi. `translation` stays Indonesian.

### 3.2 `[table]` and `[compare]`

- Cells and `wrong`/`right` values are script-detected per cell (§2). No new syntax is needed.
- `[table dir=rtl]`: mirrors the **column order** visually, so the first column is drawn at the right. Use it when the table is mostly Arabic (e.g. a conjugation table). Default `dir=ltr`, because the audience reads Indonesian first.
- A pinyin cell under a hanzi cell is just another column. Tone colouring (§5.4) applies to both if enabled.

### 3.3 Strings (add to `strings.ts`, `id` shown)

| Key | `id` |
|---|---|
| `labelTranslit` | `Cara baca` |
| `labelRoot` | `Akar kata` |
| `labelPattern` | `Wazan` |
| `labelPlural` | `Jamak` |
| `labelPinyin` | `Pinyin` |
| `labelMeasure` | `Kata bantu bilangan` |
| `labelStrokes` | `Goresan` |

## 4. Arabic in lexicon slides

- **Face:** `Amiri` 400/700 (already bundled for M8). Don't use `Amiri Quran` here; that face is for `[ayah]` only. **If a vocab card quotes the Qur'an, it must use `[ayah]`**, not `[word]` (content rule; mention it in the channel brief).
- `ctx.direction = 'rtl'`. Arabic blocks in a word slide are **right-aligned** at x = 912. The Latin blocks (translit, meaning, …) stay left-aligned at x = 96. This mixed alignment is intended: Arabic reads from the right edge.
- **Wrapping:** break only at spaces (same as SPEC-ayah §2). Measure whole words with their marks. Never break between a letter and its harakat.
- **Line height:** 1.9 for Arabic blocks at any size (harakat above and below need room). For table rows containing Arabic, the row height becomes `size × 2.3`.
- **Highlight in examples:** `*…*` markers in an Arabic `example` must wrap **whole space-separated words**. The whole line is still drawn as one run, so shaping never breaks. The highlight rect is computed by measuring the line prefix in logical order and mirroring it for RTL. If a marker sits inside a word → warning `highlight-splits-word`, and the line is drawn without the highlight. Never split the run.
- **Harakat:** for this audience (beginners), vocabulary should be fully vocalised. If `word` contains Arabic letters but no harakat (U+064B–0652, U+0670) → warning `harakat-missing` (non-blocking; it's a content reminder, not a render fault).
- **Digits:** draw digits as typed. Don't convert Western ↔ Arabic-Indic digits.

## 5. Chinese (hanzi) in lexicon slides

### 5.1 Fonts

| Role | Face | License |
|---|---|---|
| headword hanzi | `Noto Serif SC` 700 | OFL |
| hanzi in body, examples, tables, compare | `Noto Sans SC` 500/700 | OFL |
| pinyin | transliteration face (§6.1) | OFL |

**Loading:** full CJK faces are several MB each, so don't bundle a single file. Use the `@fontsource/noto-sans-sc` and `@fontsource/noto-serif-sc` packages, which ship the font as many `unicode-range` slices. Before rendering a slide, call `document.fonts.load('<weight> 100px "<family>"', <all hanzi text on the slide>)`. The browser fetches only the slices that text needs. Then confirm with `document.fonts.check(...)`. If the check fails → `script-glyph-missing` (blocks export). Never draw a hanzi with a fallback face.

Simplified only: the channel uses 简体. The app doesn't convert or validate the variant. That's a content rule.

### 5.2 Line breaking (kinsoku)

- Hanzi can break **between any two characters**. Latin runs inside a hanzi line (e.g. `HSK`) break only at spaces.
- **No line may start with:** `。，、；：？！）」』》〉】〕…—·%` or their fullwidth forms.
- **No line may end with:** `（「『《〈【〔`.
- If a break would violate these rules, pull the previous character down to the next line (push-in, not hanging punctuation).
- Hanzi blocks use line height 1.45. Use fullwidth punctuation as typed; don't add spaces between hanzi and Latin.

### 5.3 Pinyin

- **Input:** tone marks (`xiè xie`) or tone numbers (`xie4 xie5`, with `5` or no digit = neutral). `v` or `u:` = `ü`.
- **Normalisation:** numbers become marks when drawing, using the standard placement rule: the mark goes on `a` or `e` if present; on the `o` of `ou`; otherwise on the last vowel (including `ü`). Parser output keeps the original string; the normalised form is a derived field. Write unit tests for every vowel combination (`lüè`, `guǒ`, `huì`, `xiǔ`, `nǚ`, `ér`).
- **Tone sandhi:** draw what's written. Don't auto-apply sandhi (不 → bú, 一 → yí/yì, 3-3 → 2-3). The content shows the spoken form when it wants to (e.g. `bú kèqi`). That is a content rule, and the `say` or `note` field explains it.
- **Ruby over the headword:** if the number of pinyin syllables **equals** the number of hanzi in `word` (punctuation excluded), draw each syllable centred above its character (§7.1). Otherwise → warning `pinyin-mismatch` (non-blocking), and draw pinyin as one line under the headword instead.
- **Glyph coverage:** `ǎ ǐ ǒ ǔ ǖ ǘ ǚ ǜ` (U+01CE–01DC) are often missing in Latin subsets. They must come from the transliteration face. This is covered by the glyph test (§9).

### 5.4 Tone colours (optional)

The header `tones: color` turns on tone colouring for hanzi + pinyin pairs (headword ruby, pinyin cells next to hanzi cells, `example` + `example-pinyin` when syllable counts match). Each syllable/character takes the colour of its tone. With `tones: off` (the default), everything uses the normal tokens.

Tone tokens per variant: `tone1 … tone5` (5 = neutral). Colours are not the only signal: the tone mark stays on the pinyin, so it is readable for colour-blind viewers.

## 6. Shared typography

### 6.1 Transliteration face

`Gentium Book Plus` 400/700 (already bundled for IPA in M7) is used for `translit`, `pinyin`, `example-pinyin`, and any Latin cell containing characters outside the Lora/DM Sans subsets (`ā ī ū ḥ ṣ ḍ ṭ ẓ ʿ ʾ ǎ ǚ …`). Detection: if a Latin value contains any character outside Latin-1 + Latin Extended-A, use the transliteration face for that value.

### 6.2 Per-run fonts

A value can mix scripts. Split it into script runs (§2 ranges, with neutral characters attached to the previous run), set the font per run, measure the runs, and lay them out with the bidi order of the base direction. Keep this in one helper (`drawMixed()`) used by every layout. Don't fork the layout code per script.

## 7. Layout changes (all families)

### 7.1 `word` with Arabic headword

1. pos pill (unchanged; the pill is Latin, on the left) → gap 28
2. **headword**: Amiri 700, **180 → 104 px** (step 8), lh 1.9, max 2 lines, `ink`, **right-aligned**. The `tag` badge goes to the **left** of the word, on its first line. → gap 16
3. **translit**: transliteration face 46 → 34 px, `body`, left-aligned → gap 10
4. **root · pattern · plural** meta row: label + value pairs on one line if they fit, otherwise one per line. Labels in `sans` 600 22 px uppercase `muted`, values in Amiri 40 → 32 px (`root` letters in the `root` token). → gap 40
5. divider → meaning → **example** (Arabic, right-aligned, 6 px accent bar on the **right**, padding-right 28, Amiri 48 → 36 px, lh 1.9) → translation (left-aligned) → origin → note.

Stack-fit priority: note → translation → pattern/plural → example → meaning → translit → headword. **Arabic sizes step down last** and never below their minimum.

### 7.2 `word` with hanzi headword

1. pos pill → gap 28
2. **ruby pinyin row** (if counts match): transliteration face at `0.28 × headword size`, `body` (or tone colours), each syllable centred over its character → gap 8
3. **headword**: Noto Serif SC 700, **220 → 140 px** (step 10), one line (hanzi headwords are short), left-aligned. Each character sits in a `grid` box (§10 deco). `tag` and `hsk` badges go to the right. → gap 20
4. **pinyin line** (only if ruby wasn't possible) → **measure · strokes** meta row (`sans` 22 label + Noto Sans SC/transliteration values 36 → 30) → gap 40
5. divider → meaning → **example** (Noto Sans SC 500, 52 → 38 px, lh 1.45, kinsoku §5.2; `*…*` highlight works per character) → **example-pinyin** (transliteration face 34 → 28, `muted`, or tone colours) → translation → origin → note.

Stack-fit priority: note → translation → example-pinyin → meta row → example → meaning → headword.

### 7.3 `table`

- Each cell picks its face by script. Arabic cells are right-aligned inside the cell. Hanzi cells are left-aligned.
- Body size stays shared by all cells (SPEC-lexicon §4.2). Hanzi glyphs look larger, so hanzi cells are drawn at **0.92 ×** the shared size; Arabic cells at **1.1 ×**. Column measurement uses the drawn size.
- `dir=rtl` mirrors the column order. The header row follows.
- Cells still never wrap: shrink, then ellipsis + `table-too-wide`. **Exception: Arabic and hanzi cells are never ellipsised.** If they can't fit at the minimum size → `script-overflow` (blocks export).

### 7.4 `compare`

- Box text follows its script: Arabic is right-aligned (icon + label stay on the left of the first row), hanzi uses Noto Sans SC with kinsoku.
- The wrong-side strike-through still runs across each line's full drawn width. For Arabic, draw it at **0.45 × line box** from the top (not the middle), so it doesn't hide the lower harakat.

## 8. Warnings added

| Code | When | Blocks export? |
|---|---|---|
| `script-glyph-missing` | A character has no glyph in its assigned face after loading (Amiri, Noto SC, or the transliteration face) | **Yes**, no override |
| `script-overflow` | Arabic or hanzi text doesn't fit at its minimum size (any block or cell) | **Yes**, no override. Message: "Teks Arab/Mandarin terlalu panjang. Pendekkan atau pecah ke slide lain." |
| `pinyin-mismatch` | Syllable count ≠ hanzi count | No (pinyin drawn as a line) |
| `pinyin-invalid` | A syllable isn't valid pinyin (not in the syllable table) or has two tone marks | No |
| `harakat-missing` | Arabic `word` without harakat, only when `script: arab` | No |
| `highlight-splits-word` | An Arabic `*…*` marker inside a word | No (no highlight drawn) |

Ship the syllable table (~410 base syllables) as a small JSON in core. It's data, not a dictionary: the app still doesn't check meanings.

## 9. Tests

- **Byte preservation:** the parser keeps Arabic and hanzi fields byte-identical (harakat, shadda, tatweel, U+0670, ZWNJ/ZWJ, fullwidth punctuation). Tone-number pinyin is stored as typed; normalisation is a separate pure function.
- **Pinyin:** number → mark placement (all vowel cases in §5.3), `v`/`u:` → `ü`, invalid syllables, syllable counting with punctuation (`你好！` = 2).
- **Script detection and run splitting:** pure Latin, pure Arabic, pure hanzi, `kitāb (كِتَاب)`, `一本书 yì běn shū`, neutrals at boundaries.
- **Wrapping:** Arabic never breaks inside a word. Hanzi obeys kinsoku (a line never starts with `，` or ends with `「`), using a fixture with punctuation at every position.
- **Glyph coverage:** every character in the sample decks renders in its assigned face (compare `measureText` against the fallback, plus `document.fonts.check`). Run this in the Playwright review, because CJK slices load over the network.
- **Layout:** RTL alignment (Arabic blocks end at x = 912), ruby centring, stack-fit order, `script-overflow` instead of ellipsis.
- **safezone.test and contrast.test** for the new variants, including `root`, `grid` and `tone1–5` against every surface (≥ 4.5:1; `grid` is decorative and is exempt).
- **Golden images:** the two samples across **all** families in Chromium (`npm run review`). Shaping can't be unit-tested, so the review is the check for joins and harakat placement.

## 10. Variants

Both variants belong to the `lexicon` family and must render every slide type (cover, card, code, quote, end, word, table, compare). Fonts: serif `Lora`, sans `DM Sans`, plus the script faces above. All values below were contrast-checked (WCAG ratio vs the surface `bg`).

### 10.1 `lexicon/arab`: Kosakata Arab

Ivory exercise-book paper, lapis blue ink, terracotta root letters.
rotation `['paper', 'paper-alt']` · swatches `#F7F3EA #1F4E8C #A3402A #1C2230`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| paper | #F7F3EA | #1C2230 | #364052 | #646A7A | #1F4E8C | #1F4E8C | #FFFFFF | #F7F3EA | #1F4E8C | #ECE5D6 |
| paper-alt | #EFE8DA | #1C2230 | #343E50 | #5E6474 | #1D4A85 | #1F4E8C | #FFFFFF | #EFE8DA | #1F4E8C | #E4DCCB |
| deep | #142338 | #F7F3EA | #D6DCE6 | #A2ACBC | #E9B872 | #E9B872 | #142338 | #142338 | #E9B872 | #1F3150 |

Extra tokens: `rule: #DDD3C0`, `highlight: #F2D59B`, `root: #A3402A` (paper) / `#9C3D28` (paper-alt) / `#F2A285` (deep), ok/bad as `lexicon/kamus`.
Measured: muted 4.88 / 4.85 / 6.90 · accent 7.51 / 7.27 / 8.71 · root 5.70 / 5.54 / 7.75 · ink on highlight 11.2.
Deco: a notebook **margin line on the right** (3 px, `root` at 45%, at x = 1008), echoing RTL writing, plus thin horizontal rules every 72 px (2 px, `rule`), from y = 196 to 1500.

### 10.2 `lexicon/hanzi`: Kosakata Mandarin

Rice paper, black ink, vermilion seal red, practice grids.
rotation `['paper', 'paper-alt']` · swatches `#FAF6EE #B03020 #1A1A1A #F6D7A7`

| Surface | bg | ink | body | muted | accent | badgeBg | badgeInk | blob | icon | inlineCodeBg |
|---|---|---|---|---|---|---|---|---|---|---|
| paper | #FAF6EE | #1A1A1A | #333333 | #6B6B6B | #B03020 | #B8321F | #FFFFFF | #FAF6EE | #B03020 | #EFE8DA |
| paper-alt | #F3EDE1 | #1A1A1A | #313131 | #666462 | #AA2E1E | #B8321F | #FFFFFF | #F3EDE1 | #AA2E1E | #E8E0D0 |
| deep | #1E1A17 | #FAF6EE | #DDD6CC | #ADA59A | #F07A63 | #F07A63 | #1E1A17 | #1E1A17 | #F07A63 | #2C2622 |

Tone tokens:

| Surface | tone1 | tone2 | tone3 | tone4 | tone5 |
|---|---|---|---|---|---|
| paper | #C62828 | #2E7D32 | #1565C0 | #7B1FA2 | #616161 |
| paper-alt | #C02626 | #2B762F | #1460B8 | #761D9C | #5C5C5C |
| deep | #FF8A80 | #81C784 | #64B5F6 | #CE93D8 | #BDBDBD |

Extra tokens: `rule: #E2D9C8`, `highlight: #F6D7A7`, `grid: #E6C3BA` (deep: `#4A3A33`), ok/bad as `lexicon/kamus`.
Measured: muted 4.94 / 5.05 / 7.10 · accent 5.92 / 5.78 / 6.31 · badge 5.98 / 6.31 · tones all ≥ 4.76 · ink on highlight 12.6.
Deco: each headword character sits in a **田字格 practice box** (square = 1.15 × glyph size, 2 px `grid` border, dashed 1 px centre cross). It's a generic school-exercise grid. Plus a small rounded vermilion square (48 px, `accent`, rotated −4°) top-right as a "seal". **Draw no characters inside the seal**, so it never imitates a real seal or chop.

## 11. carousel-core

- This change is **additive**, so release it as **`core-v1.1.0`** (minor): new fields, two variants, new warnings, and the `unicodeRange?` property on `configureFonts` faces (needed for the CJK slices).
- `renderDeck` already gates on fonts. Extend the gate to call `document.fonts.load(font, text)` per script run, so host apps get CJK slices loaded automatically.
- `parseDeck` output gains `pinyinNormalized` on fields that have pinyin. Existing fields are unchanged, so v1.0 consumers keep working.
- Known gap, still open: `cta` on word/table/compare draws no button.

## 12. Samples

Ship as `samples/lexicon-arab-kitab.txt` and `samples/lexicon-hanzi-xiexie.txt`. The words below are common textbook vocabulary. **Still verify every item against the channel's sources** (Almaany / Hans Wehr for Arabic, CC-CEDICT / MDBG for Mandarin) before posting a real deck.

````text
handle: @kosakata.arab
template: lexicon/arab
script: arab
lang: id
title: akar kata ك-ت-ب
caption: Satu akar, banyak kata. Simpan buat hafalan! #bahasaarab #belajarbahasaarab
---
[cover]
Satu akar,|*lima kata*
Kenalan dengan akar ك-ت-ب: "menulis"
---
[word]
word: كِتَاب
translit: kitāb
pos: isim · kata benda
tag: A1
root: ك ت ب
pattern: فِعَال
plural: كُتُب · kutub
meaning: buku
example: هٰذَا *كِتَابٌ*
translation: Ini (adalah) buku.
---
[table]
Satu akar, banyak kata
| Arab | Baca | Arti |
| كَتَبَ | kataba | menulis |
| كِتَاب | kitāb | buku |
| كَاتِب | kātib | penulis |
| مَكْتَب | maktab | kantor; meja tulis |
| مَكْتَبَة | maktabah | perpustakaan |
---
[compare]
headline: Kata sifat ikut jenis bendanya
wrong: سَيَّارَةٌ جَمِيلٌ
right: سَيَّارَةٌ جَمِيلَةٌ
why: سَيَّارَة (mobil) itu muannats (feminin), jadi kata sifatnya juga pakai ة: jamīlah.
---
[end]
Akar kata apa yang mau dibahas besok?
Tulis di komentar
````

````text
handle: @kosakata.mandarin
template: lexicon/hanzi
script: hanzi
tones: color
lang: id
title: terima kasih & sama-sama
caption: Dua kata pertama yang wajib kamu bisa. #belajarmandarin #bahasamandarin
---
[cover]
Bilang *terima kasih*|dalam Mandarin
Plus cara jawabnya
---
[word]
word: 谢谢
pinyin: xie4 xie5
pos: kata kerja
hsk: 1
meaning: terima kasih
example: *谢谢*你！
example-pinyin: Xièxie nǐ!
translation: Terima kasih (ya)!
---
[word]
word: 不客气
pinyin: bú kèqi
pos: ungkapan
hsk: 1
meaning: sama-sama; jangan sungkan
note: 不 dibaca bú (nada 2) karena diikuti nada 4.
---
[table]
Satu bunyi, empat nada
| Hanzi | Pinyin | Arti |
| 妈 | mā | ibu |
| 麻 | má | rami |
| 马 | mǎ | kuda |
| 骂 | mà | memarahi |
---
[compare]
headline: Buku pakai kata bantu 本
wrong: 一个书
right: 一本书
why: Benda berjilid seperti buku pakai 本 (běn), bukan 个. Dibaca yì běn shū.
---
[end]
Kata apa yang mau kamu pelajari besok?
Tulis di komentar
````

## 13. Milestone

**M9: Script support.** Split into two shippable halves:

- **M9a (Arabic):** detection + `drawMixed()`, Arabic in word/table/compare, `translit`/`root`/`pattern`/`plural`, the transliteration face rule, `lexicon/arab`, warnings, tests, the Arabic sample. Done when the sample renders in all families with correct joins and harakat, zero warnings in `lexicon/arab`, and nothing clipped.
- **M9b (hanzi):** Noto SC slice loading, kinsoku, pinyin normalisation + ruby, tone colours, `lexicon/hanzi` with the grid deco, warnings, tests, the hanzi sample. Done when the sample renders in all families with every glyph from Noto SC (no fallback), correct ruby alignment, and zero warnings in `lexicon/hanzi`.

Then cut `core-v1.1.0` (§11).
