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
- "Post text" (Title + Caption, each with Copy) shows at every width: in the inspector on desktop, the Export tab on phones, and as a one-line-per-field strip at the bottom of the toolbar on tablet (768–1199, iPad), where it used to be hidden. Title is the header `title:` or the cover headline, as the parser resolves it.
- Owner decks (3 couples + 3 dev) ship as extra entries in "Load sample". They omit `handle:` so the handle from Settings is used.
- Dev decks end with a one-line portfolio signature in the end-slide body (accent URL `andifathulms.github.io`, which redirects to /en/). It's plain deck text: no new slide type or attribute. The PRD git sample stays verbatim.
- Owner's headshots are not used on slides (too low-res for 1080×1920; a face beside a pitch reads as an ad) and are kept out of git.
- Deck library: search + "Your decks / Samples" tabs + Editorial/Dev chips. Loading a sample opens the deck already made from it (index entry `sampleId`; older untagged decks match by title + template); "New copy" forces a fresh one. Two chrome tokens added, `--fam-editorial` and `--fam-dev`, for family tags.
- Sample photos are bundled (`src/samples/photos/`, ~4.4 MB, fetched same-origin only when a sample needs them) and added to the tray when a sample or a deck made from one is opened. This is the app's own static asset, not a third-party request.
- Library groups samples by category (Relationships, Dev, History, Sports, Travel) instead of template family; a saved deck takes its sample's category, decks written from scratch show only under All.
- History and sports decks have a photo on every slide (4–6 distinct per deck). Very busy photos are toned down in the file itself (sport-kids-soccer, sport-tennis-scorecards) rather than raising the deck's darkness.
- `npm run review` fetches one template × sample per call: with photos on every slide even one template's PNGs exceed Playwright's message limit.
- Whistle Notes decks are Indonesian (owner decision, Oct 2026); rulebook names stay English in captions.
- `npm run review` writes each batch to disk as it arrives; holding ~2,000 photo-backed PNGs exhausted Node's heap.
- Posting status (To post / Posted / Skipped) lives in `cp:v1:status`, not in the deck text (no new header keys). A deck made from a sample shares the sample's mark (`s:<sampleId>`); decks written from scratch use `d:<deckId>`. It stays in this browser only, like the rest of the library.
- History, sports and language decks may run to 14 slides (owner wants more depth); the parser test allows only the `long-deck` hint for `sejarah-*`, `sports-*` and `lexicon-*` samples and caps them at 14.
- History decks follow a "real history" rule (docs/channels.md): uncomfortable events stay in when a source stronger than Wikipedia confirms them; disputed details are marked as disputed or left out.
- "Save to Photos" uses the Web Share API (`navigator.share` with files), shown only where `canShare` accepts PNGs (iPad/iPhone Safari, macOS Safari). It is not a network request: the OS share sheet takes the files on-device. Rendering outlasts Safari's user-gesture window, so a "ready" dialog asks for a second tap.
- M7 lexicon: word/table/compare are laid out by one shared module (templates/lexicon/) for every family, so editorial and dev decks can use them too; the `lexicon` family reuses the editorial layout for normal slides and adds paper deco. Shrink-to-fit steps round-robin through SPEC-lexicon's priority order, like DESIGN §3.3.
- IPA face: `@fontsource/gentium-book-plus/400.css` (latin + latin-ext + greek via unicode-range, not latin-only) because IPA needs ɔ ː ʃ and Greek θ. Every variant's font gate waits for it with an IPA sample. `ipa-glyph-missing` is checked against the bundled unicode ranges (pure), e.g. it rejects the combining U+032C in Cambridge's US /t̬/.
- Lexicon slides: `icon=` is ignored silently; a `[table]` shows a badge only with an explicit `number=N`; lexicon and dev decks default to no auto icons.
- Sample categories "English" (English Sehari) and "Bahasa Indonesia" (Kamus Kecil) for the lexicon decks. The SPEC sample covers keep "→" verbatim (owner's spec text) although slides normally avoid Unicode arrows.
- M8 ayah/hadith: one shared layout (templates/serene/arabicLayout.ts) for every family, drawn through the same element list as lexicon slides. The `serene` family adds the inset frame and star; cover/card/quote/end reuse the editorial layout with every stack item and line centred, and the star also sits above the end slide's stack.
- Ayah/hadith stacks are centred vertically between y 344 and 1400 (the spec gives the band, not the anchor); a short ayah would otherwise leave the lower half empty. An overflowing stack is top-anchored so the warning is visible.
- SPEC-ayah §3.1 "source → terjemah size": the source line is hidden first, then the translation shrinks, then the Arabic. If the stack still overflows, it's `arabic-too-long` when the Arabic alone (with the ref) doesn't fit at 48 px, otherwise a normal `overflow`.
- `missing-field` on ayah/hadith carries `hard: true` (no "Export anyway"); `arabic-too-long` and `arabic-font-missing` are hard codes. Compare's `missing-field` stays soft. The export dialog hides "Export anyway" when any hard warning is present.
- `arabic-font-missing` comes from an optional `TextMeasurer.hasFace` (document.fonts.check, in render/fontCheck.ts) so layout stays pure; every variant gates on Amiri Quran + Amiri, like Gentium for IPA. Serif 500 (Lora, Playfair) is now loaded for translations.
- The end-of-ayah mark is drawn as its own run, left of the last line in the accent colour, and is glued to the last word during wrapping. Portions use `mark: off` because the ornament marks the end of a whole ayah.
- The fake test measurer ignores combining marks (\p{Mn}): harakat and IPA diacritics have no advance width.
- The SPEC-ayah §6 placeholder sample is a test fixture (tests/fixtures/serene-ayah.txt), not a library sample: placeholders would render Latin text in an Arabic-only face. The library ships 10 real decks (category "Ayat & Hadis") whose Arabic, translations and hadith were copied by script from Tanzil, Kemenag and HadeethEnc (sources in deck-sources.md).
- Deferred: golden-image hashes for the serene samples (SPEC-ayah §2). Chromium text rasterisation differs across machines and versions, so hashes would be flaky; shaping was checked by eye in `npm run review` instead. Unit tests cover byte-identical `arab` and whole-word wrapping.
- Ayat Harian decks: Quran posts are up to 4 slides (ayah → Tafsir → Renungan → end), hadith posts up to 3; the parser test enforces that for `ayat-*` / `hadis-*` samples.
- Tafsir is an ordinary `[card]` headed "Tafsir" (no new slide type, per CLAUDE.md), quoting Tafsir Ringkas Kemenag RI verbatim; the closing `*Tafsir Ringkas Kemenag RI*` line names the source in the accent colour. The QS reference isn't repeated there (it's on the ayah slide), which keeps the card short enough for `dev/terminal`.
- Arabic honorifics inside Latin text: every Latin font stack now has "Amiri" (arabic subset only, via unicode-range) before the generic fallback, so ﷺ and written-out phrases render in the bundled face and measure correctly. Phrases are joined with U+00A0 so the wrapper (which splits on ASCII spaces) keeps them on one line. The Unicode 14 one-character honorifics (U+FD40–FD4F, U+FDFE) aren't in the bundled Amiri, so Swt./as./ra. are written out.
- `npm run review` takes optional prefix filters, e.g. `REVIEW_SAMPLES=ayat-,hadis- REVIEW_TEMPLATES=serene/`.
- Deck links use the URL fragment (base64url, UTF-8, no padding, 100 KB cap) so importing stays offline and nothing reaches a server; imports always create a new deck.
- Header key `counter: on | off` (default on), for decks posted with other images between the slides (NusaStats map cards), where i/total would be wrong. Off removes only the counter text and box; nothing reflows. `Deck.counter` is present only as `false`, so decks without the key parse to exactly the same JSON (golden snapshots unchanged).

## Grammar contract: pre-extraction fixes (Oct 2026)

Before `carousel-core` is extracted, the parser snapshots become the contract (docs/PORTING.md §3.4). Each row has a regression test in `tests/grammar.test.ts` under the same ID. Rule for G6–G25: fix the code when the old behaviour could silently lose or misplace content; otherwise update PRD §4 to match the code.

| ID | Difference (old behaviour) | Resolution | Reason |
|---|---|---|---|
| G1 | A ``` on any slide toggled fence mode, so an unclosed fence on a card swallowed every later slide with no warning | **Code** (owner decision): only a `[code]` slide's first fence protects `---`, and only if it closes. Elsewhere ``` is literal. An unclosed code fence ends at its block with `unclosed-fence` | Silent loss of whole slides |
| G2 | `[end cta="…"]` was dropped with `unknown-attr` | **Code** (owner decision): allowed. The text replaces the button label (end always shows the button) | An end slide's label couldn't be customised |
| G3 | Without a tray, `photo=2` became the photo ID `"2"` | **Code** (owner decision): an integer is always a 1-based tray index, resolved against the tray at render (`resolvePhotos`). A missing index → `unknown-photo`. New photo IDs are never all digits (`2024.jpg` → `photo-2024`) | An index silently became an ID that matches nothing |
| G4 | An invalid `lang:` fell back to `id` silently | **Code** (owner decision): warning `unknown-lang` (non-blocking), falls back to `id` | A typo silently changed every built-in string |
| G5 | A parser exception returned a blocking `overflow` | **Code** (owner decision): blocking `internal-error`, "Parser error — please report". The export gate now includes parse-time blockers | Distinct from "text too long". The empty deck must not export |
| G6 | A header needs only one known key; unknown keys in it warn (PRD: every key known) | PRD | Warned, nothing lost |
| G7 | The header ends at the first `---`; keys are lowercase only (`Template:` → no header) | PRD | The block becomes a visible slide, not a silent loss |
| G8 | `title` falls back to the first cover's headline, else slide 1; the slug falls back to `carousel` | PRD | Unspecified detail |
| G9 | The splitter toggled on any ``` (e.g. ```` ```js ```` inside code) while the code reader closed only on a bare ```, so they could disagree and push a following slide into the note | **Code** (covered by the G1 splitter: first fence opens, only a bare ``` closes) | Misplaced content |
| G10 | Text lines are fully trimmed (leading too); trailing blank code lines are dropped; tabs → 2 spaces | PRD | Whitespace only, never rendered |
| G11 | An unknown first bare token warns `unknown-slide-type`, renders as card, and the token is discarded | PRD | Warned |
| G12 | An unterminated quote (`kicker="A photo=x]`) silently turned the rest of the tag into the value | **Code**: warning `unknown-attr` ("never closes"); value unchanged | Later attributes vanished silently |
| G13 | A valued attribute written as a flag warns; `cta=""` equals the flag | PRD | Warned / harmless |
| G14 | `number=` must be `off`/digits; `icon=` is validated (pools, `auto`, `none`, six aliases, any case) | PRD | Warned |
| G15 | `surface=` is checked at layout time against the variant, not by the parser | PRD | Warned, per template |
| G16 | `missing-headline` when the first line is a fence | PRD (now `[code]` only; on other slides ``` is literal text, per G1) | Warned |
| G17 | The attribution was the first dash line **anywhere** after the quote, so a body list item could become the attribution | **Code**: only the first non-empty line after the quote text can be the attribution | Misplaced content |
| G18 | The code language is lowercased; unknown languages render plain with no warning | PRD | Rendered in full, nothing lost |
| G19 | Each body source line is a hard break; a blank line is a paragraph | PRD | Unspecified detail |
| G20 | Accent needs non-space inside both stars and can't cross `\|` or a backtick; unmatched stars are literal | PRD | Literal rendering, nothing lost |
| G21 | In inline code, `\|` doesn't break the line and `\\|` stays as typed; an empty pair is literal | PRD | Unspecified detail |
| G22 | `icon=auto` never on cover/end, hashed by slug, no back-to-back repeat | PRD | Unspecified detail |
| G23 | A trailing `→` in built-in strings is drawn as an icon | PRD | Unspecified detail |
| G24 | Extra renderer warning `long-word` (non-blocking) | PRD (§4.8 row) | Already logged above; now in the table |
| G25 | `photo-low-res` comes from the app's photo store, not the parser | PRD (wording only) | The PRD already said "photo store" |

- Unclosed-fence heuristic (G1): a ``` line further down still counts as the closing fence unless a `---` followed by a tag line (slide type or known attribute) comes first. So an unclosed code fence followed only by *untagged* slides that themselves contain a bare ``` line can still merge them. Typed tags are the reliable boundary.
- `unknown-photo` from `resolvePhotos` points at the slide's first line, not the tag line. That's the same anchor render warnings use.

## Layout for TikTok (owner, Oct 2026)

- Footer baseline 1472 → 1440 and stack limit 1400 → 1376, for more clearance above TikTok's caption, username and sound line. SAFE is unchanged. DESIGN.md §2/§3 updated to match.
- Fitting stacks are centred vertically in the content band (344–1376; covers from their own top) on the 8 px grid, in every family including word/table/compare and ayah/hadith. This replaces DESIGN's pure top anchor: short slides left the lower half empty and sat under TikTok's tabs. Exceptions: photo slides stay top-anchored, because the photo gradient is darkest at the top and lightest in the middle; overflowing stacks aren't moved. Headline positions now vary a little from slide to slide; the header, footer, margins and type scale stay fixed, which is what DESIGN principle 3 requires.
- The big quote mark keeps its DESIGN offset above the quote stack, wherever the stack ends up.
- Phone legibility floors: editorial body min 32 → 34, dev body min 30 → 32, lexicon label 22 → 24 and translation min 28 → 30, ayah/hadith translation min 32 → 34, source lines 24 → 28, grade pill 24 → 26.
- Not changed yet: the TikTok UI zones are still estimates. They should be calibrated from a phone screenshot of the exported test image.

## Filsafat Harian (Oct 2026)

- `editorial/stone` uses the brief's surface tokens verbatim. Its photo tint, photo accent and code panel (not in the brief) follow the stone palette. All pairs pass contrast.test.ts.
- Library category "Filsafat" (`philosophy`), accent #E39A7A (the stone accent).
- Direct quotes in Indonesian are free translations of a named public-domain English translation, attributed as "(terj. bebas dari <translator>)" or "(terj. bebas, <translator>)" when space is tight. That meets the brief's "named translation" rule without inventing an Indonesian edition.
- `[quote icon=none]` on quote slides: editorial's automatic icon pool otherwise put an unrelated icon (a gift) under a philosopher's words.


## Ruang Rasa rework (Oct 2026)

- Four tokens-only variants `editorial/ruang-{kunyit,bata,daun,malam}`, one per pillar, from the Oct 2026 account review. Each has a single surface (`deep` repeats it), so a whole deck is one colour. No blobs.
- New runtime deps `@fontsource/fraunces` and `@fontsource/instrument-sans` (latin, 500–700 / 400–600): a softer serif and a plain sans make the slides read like a note, not a magazine headline. Same @fontsource setup as the other faces.
- `Variant.headlineWeight` now applies to the editorial family too: it replaces the 700 serif headline weight (cover, card, end). Only the ruang variants set it (500). Quote weight (600) is unchanged.
- Kunyit's `blob` equals its `bg` (no blobs), so `ink/blob` is tested against the background.
- All Ruang Rasa sample decks were rewritten into the new formats (channels.md §1), plus a new `editorial-artinya-sayang-id`. `editorial-couples-id` is unchanged: it's PRD §8.1 verbatim and pinned by the golden parser snapshot.
- Pertanyaan Malam decks are 3 slides; `parser.test.ts` allows that for decks whose cover kicker starts with `PERTANYAAN MALAM`. The answer slide in `editorial-refleksi-diri-id` is a draft for the owner to replace with their own.
- A/B cards put a non-breaking space after `*A.*` / `*B.*` (wrap only splits on ASCII spaces), so a letter never ends a line.

## Whistle Notes rework (Oct 2026)

- New `sport` family (`sport/papan`, `sport/lapangan`, `sport/kapur`) on the dev layout: display face in the `serif` slot, capitals (`headlineUpper`), a larger headline scale (`SPORT_TYPE`), no terminal path in the header. `isDevLike()` covers the places that treated `dev` specially (icons off, footer style).
- New runtime deps `@fontsource/barlow` and `@fontsource/barlow-condensed` (latin): broadcast-style condensed capitals for headlines.
- `Variant.semantic` (ok/warn/bad) for verdict stamps and diagram marks; contrast.test.ts checks them at 3:1 on every surface.
- `[diagram]` slide (PRD §4.9) and `verdict=` / `tone=` attributes (PRD §4.3), owner-approved Oct 2026. Diagrams reuse the code-slide shape (headline, body, fence, note); the fence language names the field. This replaces the open `figure` item for courts and pitches: drawn by the app, so no image licence is needed.
- `[score]` from the Whistle Notes review was not built: a card headline like `15–14` in the display face does the job.
- Diagram fields use official half-field dimensions (IFAB, FIFA futsal, BWF, FIVB, FIBA, ITF). Basketball's three-point line uses the FIBA 6.75 m arc with 0.9 m corner lines.
- Verdict stamps use the card-headline face and weight, so they never need an extra font file.
- All 10 sports decks rewritten into the Whistle Notes formats (Kamu Wasitnya, Mitos vs Aturan, Pojok Bulu Tangkis, Satu Aturan Satu Diagram). Facts are a subset of what the previous decks stated and sourced; docs/deck-sources.md still applies.
- Sports decks are 6–10 slides (owner-approved Oct 2026 review); `parser.test.ts` enforces it.
- Sports decks have no photos (diagrams carry the visuals), so the 58 `sport-*` photos (~17 MB) were removed from `src/samples/photos`, `photos.ts` and photo-credits.md. They are in git history before this commit if a cover photo is wanted later.
- `kicker=` now applies to cards and quotes too (PRD §4.3): a small label above the headline/quote that replaces the badge. Ayat Harian uses it for "Tafsir" (a quote slide with the Kemenag attribution) and "Renungan" cards, so the label no longer outweighs the text. Ruang Rasa and Whistle Notes can use it as well.
- Ayat Harian samples restructured by script (cover with a search-phrase kicker, Tafsir as `[quote kicker="Tafsir"]`, Renungan as `[card kicker="Renungan"]`, a specific end line). Every Arabic, translation, ref, grade, source and tafsir line was checked byte for byte against the previous files. Shipped-deck limit: 5 slides for ayat, 4 for hadith.
- Kamus Kecil samples: specific end line per deck type, Kata Indah #2 kicker, search-word caption, and a recap `[table]` of the words with their KBBI word class (built by script from the deck's `[word]` slides, never shortened meanings).
- Lexicon design fixes (Oct 2026 review): headword keeps 0.12 × size of descender room (p/j/g touched the IPA line); compare sentences 52 → 64 px max; notebook ruled lines at 55% so they don't fight the text (an attempt to draw lines only below the content lost the notebook identity and was reverted); kamus corner `“` glyph removed.
- Kosakata Inggris samples: handle @kosakata_inggris, payoff-first slide order (ed, ought, phrasal, silent letters, make/do), an A/B quiz in salah kaprah, one-tap end lines, and a new 4-slide `lexicon-english-kata-hari-ini-1` (the pants word slide copied verbatim from the UK/US deck). `parser.test.ts` allows 4 slides for decks whose cover kicker starts with `KATA HARI INI`.
- Dev header path is now `~/{topic}` from the cover kicker (`~/git`), not the truncated slug; short code blocks (≤ 4 lines) run up to 56 px. From the Fathul Learn Coding review.
