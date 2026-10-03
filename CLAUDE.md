# CLAUDE.md: Carousel Press

You are building **Carousel Press**, a static web app that turns a plain-text deck into 1080×1920 TikTok photo-carousel PNGs.

**Read first, in this order:** `PRD.md` (behaviour, deck format, features, milestones) → `DESIGN.md` (every visual number and token) → this file (how to build).
**Writing deck content** (new decks, posts, samples): read `docs/channels.md` first. It defines the two accounts (Ruang Rasa, Fathul Learn Coding), their tone, pillars, templates and deck recipes.
If they conflict: DESIGN.md wins on visuals, PRD.md on behaviour, and this file on code structure and tooling. If something isn't specified, choose the simplest option consistent with the three files and write the decision in `docs/decisions.md` (one line each).

---

## 1. Stack (fixed)

| Concern | Choice | Notes |
|---|---|---|
| Build | **Vite 5+** | `base` from the `BASE_PATH` env var, default `./` (works on GitHub Pages sub-paths) |
| Language | **TypeScript, `strict: true`** | `noUncheckedIndexedAccess: true` |
| UI | **Vanilla TS + DOM** | No React/Vue/Svelte. The UI is small; the canvas renderer is the product |
| Styling | Plain CSS with the custom properties from DESIGN.md §8.1 | One `app.css` + small per-component files if needed. No Tailwind |
| Rendering | **Canvas 2D** | No html2canvas, no SVG-to-PNG, no DOM screenshots |
| Fonts | `@fontsource/*` packages (latin subset) | See DESIGN.md §4.3. No Google Fonts CDN |
| ZIP | `jszip` | STORE compression |
| Storage | `localStorage` + `idb-keyval` (IndexedDB) | All access wrapped in try/catch |
| Tests | `vitest` (+ `jsdom` only where DOM is needed) | Core tests run without DOM |
| Visual review | `playwright` (Chromium) | Use the preinstalled browser if present (`PLAYWRIGHT_BROWSERS_PATH`), never download one if it's available |
| Package manager | npm | Commit `package-lock.json` |

**Don't add other runtime dependencies** without writing the reason in `docs/decisions.md`. In particular: no highlight.js/prism (write the tokenizers), no icon packs (author original icons), no UI kit.

## 2. Commands

```bash
npm run dev         # vite dev server
npm run build       # typecheck + vite build → dist/
npm run preview     # serve dist/
npm run test        # vitest run
npm run typecheck   # tsc --noEmit
npm run review      # build, then render all samples × templates to review/ (see §7)
```

`npm run build` must fail on type errors.

## 3. Project structure

```
carousel-press/
├─ index.html
├─ review.html                 # dev-only page used by the review script (not linked in UI)
├─ vite.config.ts              # multi-page: index + review (review excluded from prod build)
├─ src/
│  ├─ main.ts                  # boot: load fonts, restore state, mount UI
│  ├─ core/                    # PURE: no DOM, no canvas, no storage
│  │  ├─ types.ts              # Deck, Slide, Rich, Warning, Settings…
│  │  ├─ parser.ts             # text → Deck (PRD §4)
│  │  ├─ inline.ts             # | breaks, *accent*, `code` → Rich runs
│  │  ├─ numbering.ts          # badge numbers, counters, swipe/cta flags
│  │  ├─ strings.ts            # id/en built-in strings (PRD §4.7)
│  │  ├─ slug.ts               # slugify for titles + photo IDs
│  │  ├─ hash.ts               # string hash + mulberry32 PRNG
│  │  └─ headerEdit.ts         # rewrite/insert `template:` etc. in the text
│  ├─ layout/                  # PURE given a TextMeasurer
│  │  ├─ measure.ts            # TextMeasurer interface + canvas impl
│  │  ├─ wrap.ts               # greedy wrap, char-break, widow fix, rich runs
│  │  ├─ stack.ts              # stack-fit algorithm (DESIGN §3.3)
│  │  └─ codeFit.ts            # code width fit + bash prompt insertion
│  ├─ render/
│  │  ├─ safezone.ts           # CANVAS, UI_ZONES, SAFE (DESIGN §2): only place for these
│  │  ├─ renderSlide.ts        # (ctx, slide, deck, variant, assets) → RenderResult
│  │  ├─ text.ts               # draw Rich lines, tracked text, shadows
│  │  ├─ photo.ts              # focal cover-crop + tint + gradient
│  │  ├─ blob.ts               # seeded organic blobs
│  │  ├─ deco.ts               # dot grid, scanlines, glow, big glyph
│  │  ├─ codeBlock.ts          # panel, dots, highlighted lines
│  │  ├─ highlight/            # bash.ts (P0), js.ts, py.ts, sql.ts (P1) → Token[]
│  │  ├─ icons.ts              # original 24×24 path strings + drawIcon()
│  │  ├─ overlay.ts            # safe-zone overlay + test image (preview/export only)
│  │  └─ samplePhoto.ts        # generates sample-dusk (DESIGN §5.7)
│  ├─ templates/
│  │  ├─ registry.ts           # id → Variant, family → FamilyLayout
│  │  ├─ editorial/layout.ts   # builds Block stacks + draws editorial parts
│  │  ├─ editorial/variants.ts # rose-dusk, sage, midnight (DESIGN §5.1 tokens verbatim)
│  │  ├─ dev/layout.ts
│  │  └─ dev/variants.ts       # github-dark, terminal, paper-light (DESIGN §6.1)
│  ├─ fonts/
│  │  └─ loadFonts.ts          # imports @fontsource CSS, awaits faces per variant
│  ├─ store/
│  │  ├─ deckStore.ts          # localStorage decks + settings
│  │  ├─ photoStore.ts         # IndexedDB photos, IDs, focal points, downscale
│  │  └─ deckFile.ts           # .carousel.json import/export (P1)
│  ├─ export/
│  │  ├─ exportPng.ts          # fresh offscreen canvas → Blob
│  │  └─ exportZip.ts
│  ├─ ui/                      # DOM components as plain functions: mount(el, state) → unmount
│  │  ├─ state.ts              # tiny observable store (subscribe/set), no library
│  │  ├─ editor.ts  preview.ts  filmstrip.ts  inspector.ts  photos.ts
│  │  ├─ templatePicker.ts  dialogs.ts  cheatsheet.ts  library.ts (P1)  gallery.ts (P1)
│  │  └─ app.css
│  └─ samples/
│     ├─ editorial-couples-id.txt   # PRD §8.1 verbatim
│     ├─ dev-git-id.txt             # PRD §8.2 verbatim
│     └─ editorial-places-en.txt    # write it: cover + 3 cards + end, midnight, photo=sample-dusk
├─ scripts/
│  └─ review.ts                # Playwright: open review.html, save PNGs + contact sheet
├─ tests/                      # mirrors src/ (parser.test.ts, wrap.test.ts, …)
├─ review/                     # git-ignored output of npm run review
├─ docs/decisions.md
└─ .github/workflows/deploy.yml
```

Keep files under ~300 lines. Use named exports only. No default exports, no classes unless state needs them (stores may use small classes).

## 4. Architecture rules (non-negotiable)

1. **One render path.** `renderSlide(ctx, …)` draws a slide onto *any* 1080×1920 context. The preview calls it on an offscreen canvas and then draws that bitmap scaled into the visible canvas. Export calls it on a fresh offscreen canvas. **Never export by reading back the scaled preview.**
2. **Core is pure.** `core/` and `layout/` never touch `document`, `window`, canvas or storage. Layout receives a `TextMeasurer`:
   ```ts
   export interface TextMeasurer {
     width(text: string, font: FontSpec): number;   // FontSpec = { family, weight, size }
   }
   ```
   Tests use a fake measurer: `width = text.length × size × 0.52` (mono: `× 0.6`).
3. **The text is the source of truth.** UI controls that affect the deck (template, handle, lang) rewrite the header lines in the text via `headerEdit.ts`, then re-parse. Settings that aren't part of the deck (photo darkness, overlay toggles) live in deck settings storage.
4. **The parser never throws.** It returns `{ deck, warnings }` for any input, including the empty string and binary garbage. Add a fuzz-style test with random strings.
5. **No magic numbers in renderers.** Coordinates, sizes, gaps and colours come from `safezone.ts`, the type-scale tables (put them in each family's `layout.ts` as `const TYPE = {...}`), or variant tokens.
6. **Determinism.** No `Math.random()` or `Date.now()` in `render/` or `layout/`. Seeded PRNG = `mulberry32(hash(slug) + slideIndex)`.
7. **Fonts gate rendering.** `loadFonts(variant)` resolves only after `document.fonts.load()` has succeeded for every face/weight the variant uses at the sizes it uses. Export functions `await` it first. If loading fails after 8 s, show an error and keep export disabled. Never export with fallback fonts.
8. **Render caching.** Cache each slide's bitmap keyed by `hash(JSON(slide) + variant.id + photoId + focal + darkness + handle + lang + total)`. Re-render only changed slides. Debounce parsing by 150 ms.
9. **Storage is optional.** Every `localStorage` / IndexedDB call is wrapped. On failure, set `state.storageAvailable = false` and show the banner (DESIGN §8.5).
   - Keys: `cp:v1:settings`, `cp:v1:decks` (index), `cp:v1:deck:{id}`. IndexedDB DB `carousel-press`, store `photos`.

## 5. Implementation notes and gotchas

- **Canvas text:** set `ctx.font` with the full fallback stack. `ctx.textBaseline = 'alphabetic'` everywhere. Use `ctx.roundRect` (fine in all target browsers).
- **Tracking:** implement `drawTracked(ctx, text, x, y, trackingPx)` by drawing glyph by glyph. Don't use `ctx.letterSpacing`.
- **Tabular counter:** draw `i/total` in the variant's `mono` face, or pad with figure spaces, so it doesn't jitter.
- **Arrows and bookmark:** draw them as icons, never as Unicode glyphs (font coverage differs).
- **Emoji in slide text:** allowed; they render with the system emoji font. Don't try to bundle an emoji font.
- **Photo import:** use `createImageBitmap(file)` and downscale on an OffscreenCanvas (fall back to a regular canvas) to long side ≤ 2400, then store as a JPEG Blob at quality 0.92 (PNG if the source has alpha). HEIC: try to decode; on failure show "This browser can't read HEIC. Export it as JPG first."
- **Focal crop math:** see DESIGN §3.6. Unit test it with a 4000×3000 image and focal (0.2, 0.5).
- **Bash prompt + continuation:** see DESIGN §6.4. Unit test `git commit -m "fix" \` followed by `  --no-verify`.
- **ZIP:** `JSZip.generateAsync({ type: 'blob', compression: 'STORE' })`, then a single `<a download>` click, then revoke the object URL after 1 s.
- **File names:** `{slug}_{NN}.png`, slug ≤ 40 characters, lowercase a–z0–9 and `-` only (transliterate Indonesian/accents via NFKD + strip marks).
- **Header rewrite:** keep the user's other header lines and ordering. If there's no header, insert one with only the changed key, followed by `---`.
- **Editor ↔ preview sync:** map each slide to its `[startLine, endLine]` from the parser. Use `selectionStart` → line number → slide.
- **Icons:** write original paths. Don't copy from Lucide, Feather, Heroicons or similar sets, even "inspired by". Keep each icon to 1–4 simple subpaths.

## 6. Tests that must exist (vitest)

| File | Covers |
|---|---|
| `parser.test.ts` | header detection (valid, invalid → no header), separators inside code fences, tag/attr parsing incl. quoted values + escapes, default types, every field mapping in PRD §4.4, all warning codes in PRD §4.8, CRLF, empty input, random fuzz (1,000 strings, no throws). **Golden:** parse both sample decks → snapshot JSON |
| `inline.test.ts` | pipe line breaks, backslash-escaped pipes, `*accent*`, inline code spans, unmatched markers render literally |
| `numbering.test.ts` | auto numbers, `number=off`, `number=N`, counter totals, swipe/cta flags |
| `wrap.test.ts` | greedy wrap, char-break for long words, widow fix, rich runs measured correctly |
| `stack.test.ts` | fits at max; icon dropped first; step-down priority order; overflow at min; max-lines cap |
| `codeFit.test.ts` | width fit picks the largest size; `code-line-too-long`; bash prompt rules |
| `contrast.test.ts` | every variant passes DESIGN §4.4 (WCAG relative luminance) |
| `safezone.test.ts` | for every template × slide type × sample, every laid-out block box lies inside SAFE |
| `focal.test.ts` | cover crop keeps the focal point in frame and the image always covers the canvas |
| `slug.test.ts` | Indonesian titles, emoji, length cap, photo ID collisions |
| `headerEdit.test.ts` | rewrite an existing key, insert a missing key, insert a header when absent |

The layout functions must return block boxes (`{ x, y, w, h, kind }[]`) alongside drawing, so `safezone.test.ts` can check them without pixels.

## 7. Visual review loop (do this, don't skip it)

`npm run review`:
1. Builds with `review.html` included.
2. Playwright (Chromium) opens `review.html`, which loads fonts, seeds `sample-dusk`, renders **every sample × every template**, and exposes `window.__review(): Promise<{ template, sample, index, dataUrl, warnings }[]>`.
3. The script writes `review/{template}/{sample}_{NN}.png`, plus `review/index.html` (a contact sheet grid with the SAFE outline drawn on a copy) and `review/warnings.json`.

After each milestone, **look at the PNGs yourself** (open a representative set: every slide type in every template, plus every slide that has a warning). Go through DESIGN.md §10 and fix what you see before moving on. Record anything you deliberately left as-is in `docs/decisions.md`.

## 8. Work order

Follow PRD §9 milestones M1 → M6. For each milestone:
1. Implement.
2. `npm run typecheck && npm run test` is green.
3. `npm run review` and the visual check (§7).
4. Commit with a message like `M2: dev/github-dark + code blocks`.

Don't start M(n+1) with failing tests or known overflow in the sample renders.

## 9. Deployment (GitHub Pages)

`.github/workflows/deploy.yml`: on push to `main`, set up Node 20, `npm ci`, `npm run test`, `BASE_PATH=/carousel-press/ npm run build`, upload `dist/` with `actions/upload-pages-artifact`, deploy with `actions/deploy-pages`. Permissions: `pages: write`, `id-token: write`. Production build excludes `review.html`.

Check that the built app works when served from a sub-path (`npx vite preview --base /carousel-press/`).

## 10. Don'ts

- Don't add a backend, analytics, telemetry or any runtime network request.
- Don't load fonts from a CDN.
- Don't use `Math.random()` in rendering, `ctx.letterSpacing`, html2canvas, or Unicode arrows on slides.
- Don't wrap code lines. Shrink, then clip and warn.
- Don't place meaningful content outside `SAFE`.
- Don't invent new slide types, attributes or header keys beyond PRD §4. Propose them in `docs/decisions.md` instead.
- Don't copy text from any real TikTok account into samples. Use the PRD samples verbatim.
- Don't change token hex values except to pass `contrast.test.ts`, and note any change in a comment.
