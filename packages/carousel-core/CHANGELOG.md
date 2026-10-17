# Changelog

## Unreleased

- New template `editorial/tameng` (Filsafat Harian): Inter 800 headlines on asphalt, Gentium Book Plus quotes on a paper surface, steel for the limit card, one ember accent.
- Variant data (default-off, no change to existing templates): `headlineFace`, `quoteWeight`, `quoteSize`, `quoteSurface`, `deco.quoteMark`. The editorial font gate's weights follow `headlineFace`.

## 1.1.0 (2026-10-16)

- **Script support, hanzi half (SPEC-script M9b).** Hanzi in `[word]` (Noto Serif SC headword in 田字格 practice boxes, ruby pinyin centred per character, `pinyin` with tone marks or numbers, `hsk`, `measure`, `strokes`, `example` with kinsoku and per-character `*…*`, `example-pinyin`), `[table]` (hanzi cells at 0.92 ×, never cut) and `[compare]`. `tones: color` colours hanzi + pinyin pairs by tone. Pinyin normalisation, segmentation and a 410-syllable table (`core/pinyin.ts`). New variant `lexicon/hanzi`. Warnings `pinyin-mismatch`, `pinyin-invalid`. Noto Sans SC 500/700 and Noto Serif SC 700 bundled as unicode-range slices clamped to CJK blocks; `loadFonts(variant, text)` and `loadTextFonts(text)` load the slices a text needs; `renderDeck` does it automatically. Word slides gain `pinyinNormalized`.
- **Script support, Arabic half (SPEC-script M9a).** Per-value script detection; Arabic in `[word]` (right-aligned Amiri 700 headword, `translit`, `root`, `pattern`, `plural`, right-aligned example with whole-word `*…*` highlights), `[table]` (Arabic cells right-aligned at 1.1 ×, rows 2.3 ×, `[table dir=rtl]`) and `[compare]` (strike at 0.45 × the line box). Mixed-script values drawn per run. Header keys `script:` and `tones:`. New variant `lexicon/arab`. Warnings `script-glyph-missing`, `script-overflow` (both blocking, no override), `harakat-missing`, `highlight-splits-word`, `unknown-script`. Bundles Amiri 700 and Gentium Book Plus 700; the font stack is now `primary, Gentium Book Plus, Amiri, generic`, so Latin letters outside the latin subsets no longer fall back to a system font.
- New template `lexicon/lembar` (SKD Harian): an exam answer sheet, square-grid paper, teal ink, graphite covers with a pencil-yellow accent, Barlow.
- New template `dev/sheet` (Jago Kantoran): a spreadsheet, faint cell gridlines, office-green accent, white formula panel, no terminal path, `fx` glyph on cover and end.
- `excel` code highlighting (aliases `xlsx`, `sheets`, `formula`).
- New slide type `[sheet]` (PRD §4.10): a mini spreadsheet with a formula bar, colour-coded reference ranges, a result cell and `*marked*` cells; warnings `sheet-missing`, `sheet-line`. `Slide` gains `sheet: Sheet | null`.
- Variant data: `deco.grid` (`'cells' | 'squares'`) + `deco.gridColor`, and `headerRight` (`'path' | 'rule'`) to override the family's header.
- `editorial/stone`: blobs off (Filsafat Harian review). Visual change only; tokens unchanged.

## 1.0.0 (2026-10-13)

First release, extracted from Carousel Press.

- Deck grammar: PRD §4 (incl. the G1–G25 pre-extraction contract, `counter: on | off`), SPEC-lexicon (word/table/compare), SPEC-ayah (ayah/hadith), diagrams and verdicts.
- 18 built-in templates on five families: editorial, dev, lexicon, serene, sport.
- `registerVariant()` for host variants on those families, validated against the DESIGN §4.4 contrast rules.
- `renderDeck()` → one 1080×1920 PNG per slide; icons, photos, font gate and blocking warnings handled inside.
- Fonts ship as woff2 + `fonts/manifest.json`, loaded with the FontFace API; host faces (incl. variable weight) via `configureFonts()`.
- Builds: ESM (`index`, `parse`, `zip`) and a single-file `browser.js`.
