# Changelog

## 1.0.0 (2026-10-13)

First release, extracted from Carousel Press.

- Deck grammar: PRD §4 (incl. the G1–G25 pre-extraction contract, `counter: on | off`), SPEC-lexicon (word/table/compare), SPEC-ayah (ayah/hadith), diagrams and verdicts.
- 18 built-in templates on five families: editorial, dev, lexicon, serene, sport.
- `registerVariant()` for host variants on those families, validated against the DESIGN §4.4 contrast rules.
- `renderDeck()` → one 1080×1920 PNG per slide; icons, photos, font gate and blocking warnings handled inside.
- Fonts ship as woff2 + `fonts/manifest.json`, loaded with the FontFace API; host faces (incl. variable weight) via `configureFonts()`.
- Builds: ESM (`index`, `parse`, `zip`) and a single-file `browser.js`.
