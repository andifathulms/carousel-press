# Porting: extracting `carousel-core`

**Goal:** other apps (first: NusaStats, a Django app with a JS frontend) produce the same 1080×1920 carousel PNGs from the same deck text as Carousel Press, using their own templates. The parser, layout engine, renderer, font gate and export move into a package called `carousel-core`. Carousel Press becomes its first consumer.

Status: plan only. Nothing here is implemented yet. Line references are to `main` at `c17bf8d`.

---

## 1. Module map

### 1.1 Classification

| Bucket | Files | Notes |
|---|---|---|
| **Pure: no DOM, no canvas, runs in Node** | `core/types.ts`, `parser.ts`, `inline.ts`, `numbering.ts`, `strings.ts`, `slug.ts`, `hash.ts`, `color.ts`, `iconNames.ts`, `headerEdit.ts` | `tests/*` already run these under `environment: 'node'` |
| | `layout/wrap.ts`, `stack.ts`, `codeFit.ts`, `measure.ts` | Pure given a `TextMeasurer`. `measure.ts` also exports the canvas-backed measurer, which only needs a `{ font, measureText }` object |
| | `render/highlight/*` (bash, js, py, sql, clike) | Pure tokenizers. They sit under `render/` but only import `layout/codeFit` |
| | `render/safezone.ts` | Constants plus `insideSafe()` |
| | `templates/*/variants.ts`, `templates/types.ts` | Data and types |
| | `templates/common.ts`, `templates/*/layout.ts` | Pure layout. `safezone.test.ts` runs them with `fakeMeasurer` |
| **Needs Canvas 2D (no DOM at import time)** | `render/renderSlide.ts`, `text.ts`, `parts.ts`, `photo.ts`, `blob.ts`, `deco.ts`, `codeBlock.ts`, `icons.ts`, `overlay.ts`, `templates/*/draw.ts`, `templates/registry.ts` | `registry.ts` imports the draw modules, but none of them run anything at import time. `photo.ts` also has the pure `coverCrop()` and `photoOverlay()` |
| | `render/ctx.ts` | `makeCanvas()` prefers `OffscreenCanvas` and falls back to `document.createElement('canvas')` |
| **Needs DOM / browser APIs** | `fonts/loadFonts.ts` | `document.fonts`, plus **19 side-effect CSS imports** from `@fontsource` (see blocker B3) |
| | `export/exportPng.ts` | `exportSlidePng`, `canvasToPng` (canvas only). `downloadBlob` and `exportTestImage` use `document` |
| | `export/exportZip.ts` | `jszip`, and canvas through `exportSlidePng` |
| | `export/sharePhotos.ts` | Web Share API (`navigator` can be injected) |
| | `render/samplePhoto.ts` | Generates `sample-dusk`. Only used by the app and the review page |
| **App-only (stays in Carousel Press)** | `ui/*` (editor, preview, filmstrip, inspector, library, gallery, controller, `renderEngine.ts`, `state.ts`, `app.css`), `main.ts` | `renderEngine.ts` (bitmap cache + priority order) is reusable, but it's a preview concern. Keep it in the app for v1 |
| | `store/deckStore.ts`, `photoStore.ts`, `deckFile.ts` | localStorage, IndexedDB, `.carousel.json` |
| | `samples/*` (≈50 decks, 39 MB of photos via `import.meta.glob`), `review/reviewPage.ts`, `scripts/review.ts` | Content and tooling |

The dependency direction is already correct: `ui/` and `store/` import from core/layout/render/templates, and never the reverse. Nothing in the candidate package imports from `ui/`, `store/` or `samples/`.

### 1.2 Coupling that blocks extraction

These must be fixed **before** a host can register its own template. They're ordered by how much they block.

| # | Coupling | Where | Why it blocks | Fix |
|---|---|---|---|---|
| B1 | **Closed template ID union.** `TemplateId` is derived from the literal array `TEMPLATE_IDS`. `isTemplateId()` checks against it | `core/types.ts:11-24`; used by `parser.ts:156-158`, `Variant.id`, `registry.ts:28` | A host variant `nusastats/pitch` can't type-check, and the parser rejects it with `unknown-template` | `TemplateId = string` (format `family/name`). The parser takes the list of known IDs as an option (`ParseOptions.knownTemplates`), so core stays independent of the registry. Keep `BUILTIN_TEMPLATE_IDS` |
| B2 | **Static registry.** `VARIANTS` is a `readonly` array built from imports. `getVariant` throws on unknown IDs | `templates/registry.ts:22-32` | Nothing can be registered at runtime | A `Map` behind `registerVariant()`, `getVariant()` and `listVariants()`, with built-ins registered at module load |
| B3 | **Fonts come from CSS side-effect imports.** `loadFonts.ts:2-20` imports 19 `@fontsource/*.css` files | `fonts/loadFonts.ts` | Consumers need a bundler that handles CSS `url()` assets. A Django template with a plain `<script type="module">` has none. Every host also pulls all six families | Ship the 21 woff2 files (≈384 KB, latin, the weights used) in `fonts/`, plus a manifest, and register them with the `FontFace` API using a configurable base URL. The gate logic (`document.fonts.load` + `check` + 8 s timeout) stays the same |
| B4 | **Family-specific branches in shared code.** `FamilyId` is `'editorial' \| 'dev'` | `iconNames.ts:47,62` (icon pool and default `auto`/`none`), `loadFonts.ts:40-48` (weights per family), `templates/common.ts:95` (dev path tag vs. editorial rule) | A new family would need edits in three unrelated modules | Move these into `FamilyLayout`: `faces(variant)`, `iconPool`, `defaultIcon`, `headerRight`. **v1 scope: hosts add variants to the existing two families.** New families come later (see §2.4) |
| B5 | **Hard-coded serif set in the fallback stack** | `layout/measure.ts:11` (`'Playfair Display', 'Lora'`) | A host serif face gets a sans fallback. This is cosmetic only, because export waits for real fonts, but the fallback is visible in the preview while fonts load | Derive the fallback from the face's role in the variant (`fonts.serif` / `sans` / `mono`) |
| B6 | **Icons are resolved outside `renderSlide`.** The caller has to run `deckIcons(deck, variant)` and pass `assets.icon` | `renderSlide.ts:39-41`, `RenderAssets.icon` | Hosts calling `renderSlide` directly will forget this and get slides without icons. The output then differs from Carousel Press | Hide it behind `renderDeck()`. Keep the low-level form documented |
| B7 | **Tests depend on app content.** `safezone.test.ts` and `parser.test.ts` read `src/samples/*.txt`. Three tests import `src/samples/photos` (`import.meta.glob`, Vite-only) | `tests/` | Package tests can't depend on app samples | Copy a small fixture set into the package (the two PRD §8 decks, `editorial-places-en`, and the `KITCHEN_SINK` deck). The app keeps a test that runs every app sample through the package |
| B8 | **`exportTestImage` hard-codes `Inter` and `JetBrains Mono`** | `exportPng.ts:30-31` | Minor. It's a safe-zone calibration tool | Keep it in the package as `renderTestImage()`, and make its fonts go through the same manifest |

**Non-blocking limits, documented for v1:**

- `CANVAS` and `SAFE` are module constants set for TikTok 9:16 (`render/safezone.ts`). Other aspect ratios, such as Instagram 4:5, aren't supported. That would be a major change.
- `Lang` is `'id' | 'en'`, and `STRINGS` can't be overridden by a host.
- `IconName` is a closed union. Hosts can't add icons in v1.
- `jszip` is only needed by `exportZip`. Keep it in its own subpath (`carousel-core/zip`) so hosts that only need parsing or rendering don't load it.

---

## 2. Public API

### 2.1 Entry points

| Import | Environment | Contents |
|---|---|---|
| `carousel-core/parse` | Any (Node, browser, worker) | `parseDeck`, types, `isBlocking`, `BLOCKING_CODES`, `setHeaderKey`, `getHeaderKey`, `slugify`, `slideFileName`, `HEADER_KEYS`, `SLIDE_TYPES` |
| `carousel-core/layout` | Any | `layoutDeck`, `fakeMeasurer`, `TextMeasurer`, `CANVAS`, `SAFE`, `insideSafe`. Use it for server-side or CI lint ("does this deck overflow?"). Real fonts aren't available in Node, so the results are approximate |
| `carousel-core` | Browser (canvas + `document.fonts`) | Everything above, plus the variant registry, fonts, rendering and PNG export |
| `carousel-core/zip` | Browser | `exportZip`, `downloadBlob` |
| `carousel-core/browser.js` | Browser, no bundler | A single ESM file with everything above and `jszip` bundled in. For Django `{% static %}` |

### 2.2 Signatures

```ts
// ---- parse ----------------------------------------------------------------
export interface ParseOptions {
  /** Used when the header has no `template:` (or an unknown one). Default 'editorial/rose-dusk'. */
  defaultTemplate?: TemplateId;
  /** Used when the header has no `handle:`. */
  defaultHandle?: string;
  /** Photo IDs in tray order. When given, `photo=N` resolves and unknown IDs warn. */
  photoIds?: readonly string[];
  /** Template IDs the host accepts. The `carousel-core` entry fills this from the registry. */
  knownTemplates?: readonly string[];
}
export function parseDeck(text: string, opts?: ParseOptions): ParseResult; // never throws

// ---- variants ---------------------------------------------------------------
export function registerVariant(v: Variant, opts?: { replace?: boolean }): void; // throws on invalid (see validateVariant)
export function validateVariant(v: Variant): VariantIssue[];   // DESIGN §4.4 contrast, required surfaces, rotation names, family exists
export function getVariant(id: TemplateId): Variant;           // throws on unknown id
export function listVariants(): readonly Variant[];

// ---- fonts ----------------------------------------------------------------
export function configureFonts(opts: {
  /** Where the package's fonts/ directory is served. Default: new URL('../fonts/', import.meta.url). */
  baseUrl?: string | URL;
  /** Extra faces a host variant uses: registered with FontFace and gated like the built-ins. */
  faces?: { family: string; weight: number; url: string }[];
}): void;
export function loadFonts(v: Variant, timeoutMs?: number): Promise<void>; // rejects after 8 s; never resolves with fallbacks

// ---- render (one render path) ----------------------------------------------
export interface PhotoInput { image: ImageBitmap | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas; width: number; height: number; focalX: number; focalY: number }
export function renderSlide(ctx: Ctx, slide: Slide, deck: Deck, variant: Variant, assets: RenderAssets): RenderResult;
export function deckIcons(deck: Deck, variant: Variant): (PoolIcon | null)[];

export interface RenderDeckOptions extends ParseOptions {
  /** Overrides the deck's resolved template. */
  template?: TemplateId;
  /** 0–100, default 50 (DEFAULT_DECK_SETTINGS.darkness). */
  darkness?: number;
  /** Photo lookup by id. A plain record works too. */
  photos?: Record<string, PhotoInput> | ((id: string) => Promise<PhotoInput | null>);
  onProgress?: (done: number, total: number) => void;
  /** 'throw' (default): run a layout pass first and throw BlockingWarningsError
   *  before encoding anything when there's an overflow or a code line that's too long.
   *  'render': render anyway (the app's "Export anyway"). */
  onBlocking?: 'throw' | 'render';
}
export interface SlideFile { name: string; blob: Blob }      // name = {slug}_{NN}.png
export function renderDeck(textOrDeck: string | Deck, opts?: RenderDeckOptions):
  Promise<{ deck: Deck; files: SlideFile[]; warnings: Warning[] }>;
export class BlockingWarningsError extends Error { warnings: Warning[] }

// ---- zip (carousel-core/zip) ------------------------------------------------
export function exportZip(files: SlideFile[]): Promise<Blob>;   // JSZip, STORE compression
export function downloadBlob(blob: Blob, fileName: string): void; // one <a download>, revoke after 1 s
```

`renderDeck` is what `exportAll` / `renderAllPngs` do today (`export/exportZip.ts:26-49`). It also takes care of parsing, icon resolution, the font gate and the blocking pre-pass that the app's export dialog runs. Hosts that only call `renderDeck` + `exportZip` get the same files Carousel Press produces.

**Determinism:** the same tag, deck text, variant, photos and darkness give the same layout, and the same pixels in the same browser engine. Antialiasing differs slightly between Chromium, WebKit and Gecko. That's expected, not a bug.

### 2.3 How a host registers a variant

In v1 a variant is **data on an existing family**. `editorial` gives serif headlines, blobs and on-photo text. `dev` gives a sans headline, a path tag, mono and code panels. The fields are the current `Variant` interface (`templates/types.ts:46-60`): `fonts`, `surfaces` (must include `deep`), `rotation` (names of surfaces), `onPhoto` (+ `tint`), `code` theme, `deco`, `swatches`, and optionally `headlineWeight` / `headlinePrefix`.

`registerVariant` runs `validateVariant`. That's the check `contrast.test.ts` does today, moved into the package so that host tokens get the same DESIGN §4.4 contrast floor at runtime. A host variant can't ship text that fails WCAG contrast.

### 2.4 Later (not v1)

`registerFamily(id, FamilyLayout)` for a different layout, `registerStrings(lang, table)`, `registerIcon(name, path)`, and canvas profiles other than 9:16. Each is additive (a minor version) once B4 has moved the family-specific logic into `FamilyLayout`.

### 2.5 The deck grammar as implemented

**Status:** PRD §4 now matches the code. The pre-extraction pass ("grammar: pre-extraction fixes") reconciled every difference this section used to list. Each difference is a row G1–G25 in the "Grammar contract" table in `docs/decisions.md`, with a regression test under the same ID in `tests/grammar.test.ts`. The grammar `carousel-core` ships is PRD §4 plus `docs/SPEC-lexicon.md` (word/table/compare). The golden snapshots (`tests/__snapshots__/parser.test.ts.snap`) didn't change in that pass.

What changed in behaviour, which hosts should know about:

| ID | Rule now |
|---|---|
| G1, G9 | Only a `[code]` slide's **first** fence protects `---`, and only if it closes on a bare ```` ``` ````. On other slide types ```` ``` ```` is literal text. An unclosed code fence ends at its block with `unclosed-fence` and never swallows the following slides |
| G2 | `[end cta="…"]` sets the end button's label |
| G3 | `photo=<integer>` is always a 1-based tray index. Without a tray it stays unresolved (`photoId: null`). `resolvePhotos(slides, trayIds)` resolves it against the tray the deck renders with (`parse(…, { photoIds })` calls it). A missing index → `unknown-photo`. Photo IDs are never all digits |
| G4 | An invalid `lang:` → `unknown-lang` (non-blocking), falls back to `id` |
| G5 | A parser exception → blocking `internal-error` ("Parser error — please report") with an empty deck. It never uses `overflow` |
| G12 | An unterminated quoted value warns `unknown-attr` instead of silently absorbing the rest of the tag |
| G17 | Only the first non-empty line after the quote text can be the attribution |

The other rows (G6–G8, G10, G11, G13–G16, G18–G25) were documentation-only. The code was kept, and PRD §4 now states it.

**Known gaps left in the contract** (candidates for minor releases after v1):

- **G1 heuristic:** a later bare ```` ``` ```` still closes an unclosed code fence, unless a `---` followed by a tag line comes first. Untagged slides that contain a literal ```` ``` ```` line can therefore still merge into an unclosed code slide. Typed tags are the reliable boundary.
- **Lexicon CTA:** `[word]`/`[table]`/`[compare]` accept `cta` (SPEC-lexicon §2) and drop the swipe hint for it. The lexicon layout never draws the button, though (`templates/lexicon/lexDispatch.ts`, `ctaLabel: null`). Fix this before v1, or document it.
- **SPEC-lexicon not audited:** the lexicon grammar hasn't been through the same code-vs-spec pass yet.

---

## 3. Packaging

### 3.1 Layout

Use npm workspaces in this repo. This doesn't add a new runtime dependency.

```
carousel-press/
├─ package.json                  # "workspaces": ["packages/*"]; the app depends on "carousel-core": "*"
├─ packages/carousel-core/
│  ├─ package.json               # name, version, "type": "module", "exports", "files": ["dist", "fonts", "LICENSES"]
│  ├─ vite.config.ts             # build.lib: entries index, parse, layout, zip; formats ['es']; jszip external
│  ├─ vite.browser.config.ts     # single-file browser.js, jszip bundled
│  ├─ src/{core,layout,render,templates,fonts,export}/
│  ├─ fonts/                     # 21 woff2 files + manifest.json (generated from @fontsource at build time)
│  ├─ LICENSES/                  # OFL-1.1 texts for the six families
│  ├─ tests/ + tests/fixtures/
│  └─ CHANGELOG.md
└─ src/                          # the app: ui/, store/, samples/, review/
```

Build: `vite build` in library mode (Vite is already a dev dependency) plus `tsc --emitDeclarationOnly` for `.d.ts`. The `exports` map:

```json
{
  ".":            { "types": "./dist/index.d.ts",  "import": "./dist/index.js" },
  "./parse":      { "types": "./dist/parse.d.ts",  "import": "./dist/parse.js" },
  "./layout":     { "types": "./dist/layout.d.ts", "import": "./dist/layout.js" },
  "./zip":        { "types": "./dist/zip.d.ts",    "import": "./dist/zip.js" },
  "./browser.js": "./dist/browser.js",
  "./fonts/*":    "./fonts/*"
}
```

`dependencies`: `jszip` only. The `@fontsource/*` packages become **dev**-dependencies of the package, used only by the script that copies the woff2 files into `fonts/`.

### 3.2 Distribution via git tag

npm can't install a **subdirectory** of a git repo. A `github:` dependency installs the repo root, which here is the private app. So releases are built artefacts on an orphan branch:

1. A `release-core` workflow (manual `workflow_dispatch` with a `version` input) runs the package tests, builds, and commits only `packages/carousel-core/{package.json,dist,fonts,LICENSES,README.md,CHANGELOG.md}` to the orphan branch `core-dist`. It tags that commit `core-vX.Y.Z`. The commit message records the source commit SHA.
2. Hosts pin the exact tag:
   ```json
   "dependencies": { "carousel-core": "github:andifathulms/carousel-press#core-v1.0.0" }
   ```
   If the repo is private, the host's CI needs a read-only deploy key or a fine-grained token.
3. **No bundler (Django templates):** run `npm ci`, then copy `node_modules/carousel-core/dist/browser.js` and `node_modules/carousel-core/fonts/` into the Django app's `static/carousel-core/` (or vendor them from the tag's release assets). `collectstatic` serves them. The package finds its fonts at `new URL('../fonts/', import.meta.url)`, so keep `dist/` and `fonts/` siblings, or call `configureFonts({ baseUrl })`.

Inside this repo, the app uses the workspace copy directly (a symlink), so day-to-day development needs no release.

### 3.3 Fonts and assets

- **What ships:** latin woff2 files only, for the weights the built-in variants use: Playfair Display 600/700, Lora 600/700, Poppins 400/500/600, DM Sans 400/500/600, Inter 400–800, JetBrains Mono 400–700. That's 21 files, ≈384 KB, plus the OFL licence texts.
- **How they load:** `loadFonts(variant)` registers only that variant's faces with `new FontFace(family, url(...), { weight })` and adds them to `document.fonts`. It then runs the existing gate. Nothing is fetched until a variant is used. The requests are same-origin static files from the host, never a CDN.
- **Host fonts:** `configureFonts({ faces: [...] })` registers extra faces that a host variant names in `fonts.*`. They go through the same gate and the same "never export with fallbacks" rule.
- **No photos or samples ship.** `sample-dusk` (`render/samplePhoto.ts`) stays in the app. Hosts pass their own `PhotoInput`, and focal crop + darkness behave the same.

### 3.4 Versioning: the deck grammar is the contract

Semver on `core-vX.Y.Z`. "The contract" means: the `ParseResult` for a given text (deck shape and warning codes, as pinned by the golden snapshots in `tests/__snapshots__/parser.test.ts.snap`), the grammar in §2.5, the `Variant` schema, and the exported TypeScript API.

| Change | Bump |
|---|---|
| A deck that was valid parses to a different `Deck`, or gets a new **blocking** warning. Removing or renaming a slide type, attribute, header key, warning code or export. A `Variant` field becomes required | **major** |
| Additive grammar (a new attribute, slide type, header key, language, icon). New non-blocking warning codes (e.g. the unclosed-fence warning in §2.5 #5). New API. Visual changes to built-in templates (type scale, spacing, tokens), listed under **Visual** in the CHANGELOG | **minor** |
| Bug fixes that don't change the golden snapshots or the parse/layout of any fixture | **patch** |

Rules that follow from this:

- A golden-snapshot diff in a PR must come with the right bump. CI fails if the snapshot changed and the version didn't go up at least a minor.
- Hosts must treat **unknown warning codes as non-blocking**, and use `isBlocking()` rather than their own list.
- New grammar is proposed in `docs/decisions.md` first, as CLAUDE.md §10 already requires, and lands in the package before any app uses it.
- Carousel Press itself follows these rules. The app may never depend on unreleased grammar that a pinned host doesn't have.

---

## 4. Host integration examples

Both examples render this 3-slide deck and download one ZIP:

```text
handle: @nusastats
template: dev/github-dark
lang: id
title: Gol per laga
---
[cover kicker="NUSASTATS • LIGA 1"]
Rata-rata gol | per laga musim ini
Data 2025/26, 306 laga.
---
2,71 gol per laga
Naik dari *2,48* musim lalu.
---
[end]
Ikuti untuk data berikutnya.
```

### 4.1 Vanilla JS (Django template, no bundler)

```html
{% load static %}
<button id="dl" disabled>Download carousel</button>
<script type="module">
  import { renderDeck, exportZip, downloadBlob, isBlocking, BlockingWarningsError }
    from "{% static 'carousel-core/dist/browser.js' %}";

  const text = document.getElementById('deck-text').textContent; // or fetch() from a Django view
  const btn = document.getElementById('dl');
  btn.disabled = false;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      const { deck, files } = await renderDeck(text, {
        onProgress: (d, t) => (btn.textContent = `Rendering ${d}/${t}…`),
      });
      downloadBlob(await exportZip(files), `${deck.slug}.zip`);
    } catch (e) {
      if (e instanceof BlockingWarningsError) alert(e.warnings.map((w) => w.message).join('\n'));
      else alert(e.message); // includes the 8 s font-gate timeout
    } finally {
      btn.disabled = false;
      btn.textContent = 'Download carousel';
    }
  });
</script>
```

The fonts load from `{% static 'carousel-core/fonts/' %}` because `fonts/` sits next to `dist/`.

### 4.2 React (Vite or similar bundler)

```tsx
import { useState } from 'react';
import { renderDeck, BlockingWarningsError, type Warning } from 'carousel-core';
import { exportZip, downloadBlob } from 'carousel-core/zip';

export function CarouselDownload({ text }: { text: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [blocking, setBlocking] = useState<Warning[]>([]);

  async function run(onBlocking: 'throw' | 'render') {
    setBusy('Rendering…');
    try {
      const { deck, files } = await renderDeck(text, {
        onBlocking,
        onProgress: (d, t) => setBusy(`Rendering ${d}/${t}…`),
      });
      setBlocking([]);
      downloadBlob(await exportZip(files), `${deck.slug}.zip`);
    } catch (e) {
      if (e instanceof BlockingWarningsError) setBlocking(e.warnings);
      else throw e;
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <button disabled={!!busy} onClick={() => run('throw')}>{busy ?? 'Download ZIP'}</button>
      {blocking.length > 0 && (
        <p>
          {blocking.map((w) => w.message).join(' · ')}{' '}
          <button onClick={() => run('render')}>Export anyway</button>
        </p>
      )}
    </>
  );
}
```

With a bundler, the font URLs resolve through `import.meta.url` automatically. Vite copies `fonts/*.woff2` as assets.

### 4.3 Registering a host variant

```ts
import { registerVariant, getVariant, configureFonts, type Variant } from 'carousel-core';

// Optional: a host face. Same gate, same rule: no export with fallbacks.
configureFonts({ faces: [
  { family: 'Space Grotesk', weight: 500, url: '/static/fonts/space-grotesk-500.woff2' },
  { family: 'Space Grotesk', weight: 700, url: '/static/fonts/space-grotesk-700.woff2' },
] });

const base = getVariant('dev/github-dark');
const pitch: Variant = {
  ...base,                                  // keep the code theme, deco and onPhoto
  id: 'nusastats/pitch',                    // any "family/name" id
  name: 'NusaStats Pitch',
  family: 'dev',                            // v1: an existing family's layout
  fonts: { sans: 'Space Grotesk', mono: 'JetBrains Mono' },
  headlineWeight: 700,
  surfaces: {
    ...base.surfaces,
    pitch: { ...base.surfaces.deep, bg: '#0E3B2E', accent: '#F5C542', badgeBg: '#F5C542', badgeInk: '#0E3B2E' },
  },
  rotation: ['pitch', 'deep'],
  swatches: ['#0E3B2E', '#F5C542', '#FFFFFF', '#0D1117'],
};

registerVariant(pitch); // throws with the failing pairs if contrast is under DESIGN §4.4
```

Decks then select it with `template: nusastats/pitch`. The `carousel-core` entry passes every registered ID to the parser as `knownTemplates`, so the deck doesn't get `unknown-template`.

A host must call `registerVariant` before `parseDeck` / `renderDeck`. Otherwise its decks fall back to the default template and get an `unknown-template` warning. That's the same behaviour as a typo, and it's by design.

---

## 5. Extraction plan

Each step is one commit (or a short PR). After each step, Carousel Press builds, deploys and behaves the same.

**Gate after every step:**
- `npm run typecheck && npm run test` is green.
- `npm run review`, then compare a SHA-256 of every `review/**/*.png` against the baseline from step 0. For steps 1–6, which are pure refactors, **every hash must be identical**. Any pixel difference is a regression, not a "visual tweak".
- The golden parser snapshots are unchanged (`tests/__snapshots__/parser.test.ts.snap`).
- Steps 6 and later also check that `npx vite preview --base /carousel-press/` still works.

| Step | Change | Tests that must be green (beyond the full suite) |
|---|---|---|
| **0. Baseline** | Add `scripts/review-hash.ts`, which writes `review/hashes.json`. Record the baseline from `main`. Add a parser test for the unclosed-fence-on-a-card behaviour (§2.5 #5), so it's pinned before anything moves | `parser.test.ts` (new case) |
| **1. Open template IDs (B1)** | `TemplateId = string`, `BUILTIN_TEMPLATE_IDS`, `ParseOptions.knownTemplates` (default: built-ins). `isTemplateId` takes the list. Parsing a deck with built-in templates gives the same result | `parser.test.ts` + snapshots, `headerEdit.test.ts`, `deckFile.test.ts` |
| **2. Runtime registry (B2)** | `registerVariant` / `getVariant` / `listVariants` backed by a `Map`, with built-ins registered on import. Move the contrast check from `contrast.test.ts` into `templates/validate.ts` as `validateVariant`. The test now asserts that every built-in returns `[]`, plus one bad variant that must fail. The app's controller passes `listVariants()` IDs as `knownTemplates` | `contrast.test.ts`, `safezone.test.ts`, new `registry.test.ts` (register, duplicate, invalid, a host ID parses without a warning) |
| **3. Family hooks (B4, B5)** | Add `faces()`, `iconPool`, `defaultIcon` and `headerRight` to `FamilyLayout`. Remove the `family ===` branches from `iconNames.ts`, `loadFonts.ts` and `common.ts`. Derive `fallbackStack` from the variant's font roles | `safezone.test.ts`, `stack.test.ts`, icon resolution in `numbering.test.ts`/`parser.test.ts`, hash parity |
| **4. Fonts without CSS (B3)** | `scripts/copy-fonts.ts` copies the 21 woff2 files and writes `fonts/manifest.json`. `loadFonts` registers `FontFace`s from the manifest and drops the 19 CSS imports. Add `configureFonts`. The app keeps working because Vite serves `new URL(..., import.meta.url)` | `export.test.ts`, new `fonts.test.ts` (jsdom with a stubbed `FontFace`: the right faces per variant, timeout rejects, a failure clears the cache), hash parity (proves the same faces render) |
| **5. Facade (B6, B8)** | Add `src/lib/` with `parseDeck`, `renderDeck`, `BlockingWarningsError`, `exportZip` and `renderTestImage`. Switch the app's export and Save to Photos paths to `renderDeck` + `exportZip`, so the app is the first consumer. Delete `exportAll` / `renderAllPngs` | `export.test.ts`, `sharePhotos.test.ts`, new `renderDeck.test.ts` (blocking pre-pass throws before encoding; `onBlocking: 'render'` proceeds; file names `{slug}_{NN}.png`) |
| **6. Physical move (B7)** | Add npm workspaces. `git mv` `src/{core,layout,render,templates,fonts,export}` and `src/lib` into `packages/carousel-core/src/`. App imports become `carousel-core` (workspace link). Split the tests: package tests use `tests/fixtures/` (the two PRD §8 decks, `editorial-places-en`, `KITCHEN_SINK`) and their own snapshot. The app keeps `deckFile`, `deckStore`, `libraryData`, `sharePhotos`, and a new `samples.test.ts` that runs **every** app sample through the package's `safezone` and blocking checks | Both suites. The app's root `npm run test` runs both. The package snapshot equals the matching entries of the old snapshot |
| **7. Library build** | Package `vite.config.ts` (lib mode), `vite.browser.config.ts`, `tsc --emitDeclarationOnly`, the `exports` map, `LICENSES/`, `README.md`, `CHANGELOG.md`. Add a Playwright smoke test, `packages/carousel-core/examples/vanilla.html`, which imports `dist/browser.js` from a **sub-path static server** (simulating Django `static/`) and renders the §4 deck. It asserts a ZIP with 3 entries and PNGs of 1080×1920 | Smoke test, `npm pack --dry-run` lists only `dist`, `fonts`, `LICENSES`, the README and the CHANGELOG |
| **8. Release** | `.github/workflows/release-core.yml` (§3.2) and a snapshot/version guard in CI. Tag `core-v1.0.0` | Release workflow runs the package suite and the smoke test before it tags |
| **9. First host** | NusaStats adds the git-tag dependency, registers its variant(s) and renders through `renderDeck`. Its CI keeps a copy of the §4 deck and asserts no blocking warnings on the pinned tag | NusaStats-side test |

**After the move:** `npm run review`, the contact sheet and the DESIGN §10 visual pass stay in Carousel Press. They now also cover host variants registered on the review page, so a NusaStats variant gets the same visual check as the built-ins. The `deploy.yml` workflow doesn't change, except that `npm run test` now covers both suites.

### Decisions to log when this starts

Add these to `docs/decisions.md` at step 0:
- Hosts get variants on existing families only in v1, and new families wait for `registerFamily`.
- The parser's internal-error fallback keeps the blocking `overflow` code until a major version.
- The core is distributed through the orphan `core-dist` branch, because npm can't install a git subdirectory.
