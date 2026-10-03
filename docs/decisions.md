# Decisions

One line each. Things the specs left open, or deliberate deviations.

- Tooling: Vite 7, Vitest 3, TypeScript 5.9 (TS 7 native preview skipped for stability); `tsx` dev-only to run `scripts/review.ts`.
- Header detection: a pre-`---` block is a header when every non-empty line matches `key: value` and at least one key is known; unknown keys in it warn (`unknown-header-key`).
- Each source line in a body/subtitle is a hard line break; blank lines start paragraphs.
- `icon=` accepts short aliases (`shield`→`shield-heart`, `pin`, `branch`, `bulb`, `check`, `spark`) because sample 8.1 uses `icon=shield`.
- `icon=auto` never adds an icon to `end` slides (the CTA is their closing element); explicit icons still work.
- Out-of-scope attributes (e.g. `number=` on a cover) are ignored with `unknown-attr`.
- Added a non-blocking `long-word` warning for words broken by characters (F4 asks for a warning; no code was listed).
- Strings keep the PRD text (`Geser →`); renderers strip the trailing arrow and draw the `arrow-right` icon.
- Terminal variant: the `> ` accent prefix also applies to code-slide headlines (they are cards with code), for consistency.
- Editorial code slides: gap body→code = 72 (the card's icon gap), as the icon is replaced by the code block.
- JetBrains Mono 500 is bundled in addition to DESIGN §4.3 weights: the path tag, language label and dev attribution use mono 500.
- Counter is drawn in the variant's mono face (500, 28 px) for tabular figures.
- Safe-zone test image centre label is split over two lines; at 30 px it doesn't fit in 816 px on one line.
- Review contact sheet draws the SAFE outline as a CSS overlay on each image copy.
- Visual review M1–M2: big glyph `$_` bleeds so only `$` is visible on github-dark; kept, since the spec places it at right 1140 deliberately.
