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
- Deck library (F10) lives in the top-bar deck switcher popover (DESIGN §8.2 "Deck: … ▾") rather than a permanent sidebar, to keep the 3-column layout.
- "Load sample" always opens the sample as a new deck in the library, so nothing is overwritten and no confirm is needed (PRD F15 "in practice").
- Saving a deck file rewrites `photo=N` tray indexes to photo IDs, because tray order differs between browsers.
- Photos are always re-encoded on import (JPEG 0.92, PNG when the source has alpha), so HEIC/WebP sources become portable blobs.
- Preview draws the overflow outline as an overlay on the visible canvas, so cached preview bitmaps stay identical to exports.
- Blocking warnings for the export dialog come from a fresh layout pass with real fonts, so the dialog is correct even before every slide has rendered.
- Tablet (768–1199): the caption panel is hidden in the toolbar row; it's in the Export tab on phones and the inspector on desktop.
- Owner decks (3 couples + 3 dev) ship as extra entries in "Load sample". They omit `handle:` so the handle from Settings is used.
- Dev decks end with a one-line portfolio signature in the end-slide body (accent URL `andifathulms.github.io`, which redirects to /en/). It's plain deck text: no new slide type or attribute. The PRD git sample stays verbatim.
- Owner's headshots are not used on slides (too low-res for 1080×1920; a face beside a pitch reads as an ad) and are kept out of git.
- Deck library: search + "Your decks / Samples" tabs + Editorial/Dev chips. Loading a sample opens the deck already made from it (index entry `sampleId`; older untagged decks match by title + template); "New copy" forces a fresh one. Two chrome tokens added, `--fam-editorial` and `--fam-dev`, for family tags.
