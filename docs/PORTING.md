# Porting: `carousel-core`

**Status: implemented, v1.0.0.** The renderer lives in `packages/carousel-core` and is published as tag `core-v1.0.0` on the `core-dist` branch. Carousel Press compiles the same source, so there is no second copy.

```bash
npm i "github:andifathulms/carousel-press#core-v1.0.0"
```

Any app (first: NusaStats, a Django app with a JS frontend) gets the same 1080×1920 PNGs from the same deck text as Carousel Press, and can add its own templates. How the extraction was done and checked is in §5.

---

## 1. Layout

```
packages/carousel-core/
├─ package.json            name carousel-core, exports ./, ./parse, ./zip, ./browser.js, ./fonts/*
├─ src/
│  ├─ index.ts  parse.ts  zip.ts  browser.ts     entry points (§2.1)
│  ├─ api/      deck.ts (renderDeck, layoutWarnings, BlockingWarningsError), parse.ts, zip.ts
│  ├─ core/     parser, inline, numbering, lexicon, ayah, diagram, strings, slug, hash, color, deckLink, headerEdit, types   (pure)
│  ├─ layout/   wrap, stack, codeFit, measure                                                      (pure given a TextMeasurer)
│  ├─ render/   renderSlide (the one render path), text, parts, photo, blob, deco, codeBlock, diagram, lexDraw, icons, overlay, highlight/*
│  ├─ templates/ registry (registerVariant), validate (DESIGN §4.4), traits (per-family facts), common, stamps, 5 families
│  ├─ fonts/    fontSources (manifest + FontFace + configureFonts), loadFonts (the 8 s gate)
│  └─ export/   exportPng (one slide → PNG on a fresh canvas, test image, downloadBlob)
├─ fonts/                  42 woff2 files, manifest.json, LICENSES/ (OFL)   ← npm run fonts:sync
├─ scripts/                sync-fonts.ts, smoke.ts, release.sh
├─ vite.config.ts  vite.browser.config.ts  tsconfig.build.json
└─ README.md  CHANGELOG.md
```

The app keeps only app code: `src/ui/*` (editor, preview, library, `renderEngine` cache, `sharePhotos`), `src/store/*`, `src/samples/*` (decks, photos, `samplePhoto`), `src/review/`, `src/main.ts`, and `src/appFonts.ts`/`src/slideFonts.ts` (font URLs for Vite, plus Inter/JetBrains Mono CSS for the UI chrome). It imports the package as `carousel-core` (the public API) and `carousel-core/src/...` (internals the editor needs). Both are aliases to `packages/carousel-core/src` in `tsconfig.json` and `vite.config.ts`.

Nothing in the package imports app code. `core/` and `layout/` stay pure (no DOM, canvas or storage), and the tests run them in Node.

### 1.1 The couplings that blocked extraction, and how each was removed

| # | Was | Now |
|---|---|---|
| B1 | `TemplateId` was a closed union, and the parser only knew built-in ids | `TemplateId = string`; `BUILTIN_TEMPLATE_IDS` keeps the 18 built-ins. The parser asks `ParseOptions.templateFamily(id)` which ids exist and which family they use (default: built-ins only). `parseDeck` passes the registry |
| B2 | Static `VARIANTS` array | `registerVariant` / `getVariant` / `hasVariant` / `listVariants` on a runtime map. `VARIANTS` still lists the built-ins |
| B3 | 36 `@fontsource` CSS side-effect imports | `fonts/manifest.json` + woff2 files, registered with the FontFace API only for the faces a variant uses. `configureFonts({ baseUrl, resolveUrl, faces })` |
| B4 | `family === 'dev'` and similar branches in shared code (icons, font weights, header, display face, cover swipe icon) | `templates/traits.ts`: one data table per family (`headerRight`, `coverSwipeIcon`, `icons`, `displayFace`, `weights`) |
| B5 | Hard-coded serif set in the fallback stack | Unchanged. Cosmetic only, since nothing renders before the font gate passes |
| B6 | The caller had to pick icons | `renderDeck` picks icons (and photos) itself. `renderSlide` + `deckIcons` stay available for previews |
| B7 | Tests read app samples | The tests stay in the repo root and import through the alias. The package is only built from this repo, so it needs no fixtures of its own (decision log) |
| B8 | The test image hard-coded font loads | It goes through `loadFace()`, which uses the same manifest |

---

## 2. Public API

### 2.1 Entry points

| Import | Runs in | Contents |
|---|---|---|
| `carousel-core` | Browser | Everything below |
| `carousel-core/parse` | Node, browser, worker | `parseDeck`, registry (`registerVariant`, `listVariants`, `validateVariant`…), `isBlocking`, `setHeaderKey`, `encodeDeckLink`/`decodeDeckLink`, `slugify`, types |
| `carousel-core/zip` | Browser | `exportZip`, `slideFileNames`, `downloadBlob`. Only this entry loads JSZip |
| `carousel-core/browser.js` | Browser, no bundler | All of the above in one ES module (JSZip bundled, 298 KB, 80 KB gzipped) |
| `carousel-core/fonts/*` | (static files) | 42 woff2 files and `manifest.json` |

### 2.2 Signatures

```ts
parseDeck(text: string, opts?: { defaultTemplate?, defaultHandle?, photoIds? }): ParseResult   // never throws

registerVariant(v: Variant, opts?: { replace?: boolean }): Variant   // throws VariantError (lists every issue)
validateVariant(v: Variant): string[]                                  // [] when registerVariant would accept it
getVariant(id: string): Variant      hasVariant(id: string): boolean      listVariants(): readonly Variant[]

configureFonts(config: {
  baseUrl?: string | URL;                    // where fonts/ is served; relative ('/app/fonts/') or absolute
  resolveUrl?: (file: string) => string;     // per-file URL (bundlers that hash names); wins over baseUrl
  faces?: { family: string; weight: number | [min: number, max: number]; style?: 'normal' | 'italic'; url: string; unicodeRange?: string }[];
}): void
loadFonts(variant: string | Variant): Promise<void>   // rejects on a failed face, or after 8 s naming the faces still pending

renderDeck(input: string | Deck, opts?: {
  template?: string;              // override the deck's template
  darkness?: number;              // photo darkness 0–100, default 50
  photos?: Record<string, PhotoInput> | ((id: string) => PhotoInput | null | Promise<PhotoInput | null>);
  photoIds?: string[];            // tray order for photo=N (default: the record's key order)
  defaultTemplate?: string; defaultHandle?: string;
  onBlocking?: 'throw' | 'render';               // default 'throw': BlockingWarningsError before drawing
  onProgress?: (done: number, total: number) => void;
  onWarnings?: (warnings: Warning[], deck: Deck) => void;
}): Promise<Blob[]>               // one 1080×1920 PNG per slide, in order

exportZip(blobs: readonly Blob[], name: string): Promise<Blob>   // {slugify(name)}_01.png… STORE-compressed
downloadBlob(blob: Blob, fileName: string): void

// Lower level (previews): renderSlide(ctx, slide, deck, variant, { photo, darkness, icon, preview? }),
// layoutSlide(...), deckIcons(deck, variant), layoutWarnings(deck, variant, hasPhoto?), CANVAS, SAFE
```

`exportZip` returns a Promise, because JSZip encodes asynchronously. `renderDeck` returns plain Blobs; name them with `slideFileNames(count, name)` from `carousel-core/zip`.

**Determinism:** the same tag, deck text, variant, photos and darkness give the same pixels in the same browser engine. This was checked: `npm run core:smoke` renders `dev-git-id` through `browser.js` and gets PNGs byte-identical to the app's review render.

### 2.3 Host variants

A variant is data on an existing family: `editorial`, `dev`, `lexicon`, `serene` or `sport`. The fields are the `Variant` interface (`templates/types.ts`). `registerVariant` checks:
- the id format (`host/name`: lowercase, digits, `-`);
- that the family exists;
- the required fields (`fonts.sans`, `fonts.mono`, `surfaces.deep`, `onPhoto`, `code`, `rotation` naming real surfaces);
- every colour's format;
- the DESIGN §4.4 contrast rules on every surface and the code theme.

Built-in ids can't be replaced. Registering the same host id again needs `{ replace: true }`.

New families (`registerFamily`), host strings and icons, and other canvas sizes are later, additive work. B4 already put the per-family facts into `traits.ts`.

### 2.4 The deck grammar

The grammar is PRD §4 plus `docs/SPEC-lexicon.md` (word/table/compare), `docs/SPEC-ayah.md` (ayah/hadith), diagrams and verdicts (PRD §4.3). Before extraction, the pre-extraction pass reconciled the code with PRD §4: rows G1–G25 in `docs/decisions.md`, each with a test in `tests/grammar.test.ts`.

The behaviour changes hosts should know about:

| ID | Rule |
|---|---|
| G1, G9 | Only a `[code]` slide's **first** fence protects `---`, and only if it closes on a bare ```` ``` ````. Elsewhere ```` ``` ```` is literal text. An unclosed code fence ends at its block (`unclosed-fence`) |
| G2 | `[end cta="…"]` sets the end button's label |
| G3 | `photo=<integer>` is always a 1-based tray index (`photoIds`, or a `photos` record's key order) and is never an id |
| G4 | An invalid `lang:` → `unknown-lang`, falls back to `id` |
| G5 | A parser exception → blocking `internal-error` with an empty deck |
| G12 | An unterminated quoted value warns `unknown-attr` |
| G17 | Only the first non-empty line after the quote text can be the attribution |
| — | `counter: off` hides `i/total` on every slide (for posts that mix in other images) |

**Known gaps in v1.0.0** (candidates for minor releases):

- **G1 heuristic:** a later bare ```` ``` ```` can still close an unclosed code fence, unless a `---` followed by a tag line comes first.
- **CTA on lexicon and ayah slides:** `[word]`, `[table]`, `[compare]`, `[ayah]` and `[hadith]` accept `cta` and drop the swipe hint, but never draw the button (`ctaLabel: null` in `lexDispatch.ts` / `arabicLayout.ts`). Fixing it changes pixels, so it's a minor release with a **Visual** changelog entry.
- **SPEC-lexicon and SPEC-ayah** haven't had a code-vs-spec audit like G1–G25.

---

## 3. Packaging

### 3.1 How the package is built

```bash
npm run fonts:sync    # @fontsource → packages/carousel-core/fonts (+ manifest.json, LICENSES/)
npm run fonts:check   # fonts/ matches what fonts:sync would write (also a unit test)
npm run core:build    # dist/{index,parse,zip}.js (ESM, JSZip external) + dist/browser.js + dist/types/**.d.ts
npm run core:smoke    # browser.js + fonts/ served as static files under a sub-path; see §5
```

All built files sit directly in `dist/`, with no chunk folder. So the default font base, `new URL('../fonts/', import.meta.url)`, is the package's own `fonts/` folder. That default works when the package is served as is (Django static, a CDN folder). When a bundler moves the code, it doesn't. Bundled hosts call `configureFonts({ baseUrl })` (§4.3), and the error message says so if they forget.

`@fontsource/*` packages are only needed to regenerate `fonts/`. Hosts get the woff2 files from the package.

### 3.2 Distribution: the `core-dist` branch and `core-v` tags

npm can't install a subfolder of a git repo, so each release is built and committed to the orphan branch `core-dist`. That branch holds only `package.json`, `README.md`, `CHANGELOG.md`, `dist/` and `fonts/`, and the tag is `core-vX.Y.Z`:

```bash
npm i "github:andifathulms/carousel-press#core-v1.0.0"
```

The repo is public, so this needs no token. To release a new version:
1. Bump `packages/carousel-core/package.json` and `CHANGELOG.md`, and commit.
2. Run the **Release carousel-core** workflow (Actions → run). It runs typecheck, tests, `fonts:check`, `core:build` and `core:smoke`, then `scripts/release.sh`.

`release.sh` can also run locally from a clean tree. It refuses a tag that already exists, and `PUSH=0` skips the push.

### 3.3 Fonts

- **What ships:** the same 36 `@fontsource` stylesheets the app used before, as 42 woff2 files (1.1 MB). They're latin subsets, plus every Gentium Book Plus subset for IPA, plus the Arabic subsets of Amiri and Amiri Quran. Each face's `unicode-range` is kept in the manifest. OFL licences are in `fonts/LICENSES/`.
- **How they load:** `loadFonts(variant)` registers only that variant's faces, through `new FontFace(...)` and `document.fonts.add`. It then waits for `document.fonts.load` and `check` on every face. Nothing is fetched before a template is used, and nothing comes from a CDN.
- **Errors:**
  - a face that fails rejects at once, e.g. `carousel-core: font 600 "Inter" failed to load from /static/…/inter-latin-600-normal.woff2: NetworkError`;
  - a face that never arrives rejects after 8 s, naming every pending face;
  - a face with no file at all says to add it with `configureFonts({ faces })`.
- **Host faces:** `configureFonts({ faces: [{ family: 'Space Grotesk', weight: [300, 700], url: '…/SpaceGrotesk-Variable.woff2' }] })`. One variable-weight file covers every weight in its range. Host faces are matched before bundled ones.

### 3.4 Versioning: the deck grammar is the contract

Semver on `core-vX.Y.Z`. The contract is:
- the `ParseResult` for a given text (deck shape and warning codes, pinned by `tests/__snapshots__/parser.test.ts.snap`);
- the grammar in §2.4;
- the `Variant` schema;
- the exported TypeScript API.

| Change | Bump |
|---|---|
| A deck that was valid parses differently or gets a new **blocking** warning. Removing or renaming a slide type, attribute, header key, warning code or export. A `Variant` field becomes required | **major** |
| Additive grammar, new non-blocking warning codes, new API. Visual changes to built-in templates (listed under **Visual** in the CHANGELOG) | **minor** |
| Fixes that change neither the golden snapshots nor any review hash | **patch** |

Hosts treat unknown warning codes as non-blocking and use `isBlocking()`. A golden-snapshot diff must come with the matching bump. This is checked in review, not yet by CI.

---

## 4. Host integration

All examples render this deck:

```text
template: dev/github-dark
counter: off
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

### 4.1 Vanilla JS, no bundler (Django template)

Copy `node_modules/carousel-core/dist/` and `node_modules/carousel-core/fonts/` side by side into `static/carousel-core/`. `browser.js` then finds `../fonts/` by itself.

```html
{% load static %}
<button id="dl">Download carousel</button>
<script type="module">
  import { renderDeck, exportZip, downloadBlob, BlockingWarningsError } from "{% static 'carousel-core/dist/browser.js' %}";
  const text = document.getElementById('deck-text').textContent;
  document.getElementById('dl').addEventListener('click', async () => {
    try {
      const blobs = await renderDeck(text);
      downloadBlob(await exportZip(blobs, 'rata-rata-gol'), 'rata-rata-gol.zip');
    } catch (e) {
      alert(e instanceof BlockingWarningsError ? e.warnings.map((w) => w.message).join('\n') : e.message);
    }
  });
</script>
```

`npm run core:smoke` runs exactly this setup: `/static/carousel-core/{dist,fonts}` with the page at `/app/`.

### 4.2 React (Vite)

```tsx
import { configureFonts, renderDeck } from 'carousel-core';
import { exportZip, downloadBlob } from 'carousel-core/zip';

configureFonts({ baseUrl: `${import.meta.env.BASE_URL}carousel-core/fonts/` }); // after the copy step in §4.3

export function CarouselButton({ text, name }: { text: string; name: string }) {
  return <button onClick={async () => downloadBlob(await exportZip(await renderDeck(text), name), `${name}.zip`)}>ZIP</button>;
}
```

### 4.3 Next.js under a basePath (static export)

Bundlers move the package's JavaScript, so its fonts have to be served from your `public/` folder. Next.js doesn't prefix `basePath` onto runtime URLs, so the font base includes it.

**1. Font copy step.** Add `scripts/copy-carousel-fonts.mjs`:

```js
// Copy carousel-core's fonts into public/ so they're served at <basePath>/carousel-core/fonts/.
import { cpSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const pkg = dirname(createRequire(import.meta.url).resolve('carousel-core/package.json'));
rmSync('public/carousel-core/fonts', { recursive: true, force: true });
cpSync(join(pkg, 'fonts'), 'public/carousel-core/fonts', { recursive: true });
```

Then run it before dev and build in `package.json`:

```json
"scripts": {
  "predev": "node scripts/copy-carousel-fonts.mjs",
  "prebuild": "node scripts/copy-carousel-fonts.mjs",
  "dev": "next dev",
  "build": "next build"
}
```

Add `public/carousel-core/` to `.gitignore`, since it's regenerated on every install.

**2. `next.config.mjs`:**

```js
const basePath = '/nusastats';
export default { output: 'export', basePath, env: { NEXT_PUBLIC_BASE_PATH: basePath } };
```

**3. A client component.** The package is loaded on click, so server rendering never evaluates it:

```tsx
'use client';
export function CarouselDownload({ text, name }: { text: string; name: string }) {
  async function run() {
    const { configureFonts, renderDeck } = await import('carousel-core');
    const { exportZip, downloadBlob } = await import('carousel-core/zip');
    configureFonts({ baseUrl: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/carousel-core/fonts/` });
    downloadBlob(await exportZip(await renderDeck(text), name), `${name}.zip`);
  }
  return <button onClick={run}>Download carousel</button>;
}
```

`next build` writes `out/`. Serve it under `/nusastats/`, and the fonts load from `/nusastats/carousel-core/fonts/`.

### 4.4 Registering a host variant (and its fonts)

```ts
import { configureFonts, getVariant, registerVariant, VariantError } from 'carousel-core';

configureFonts({ faces: [{ family: 'Space Grotesk', weight: [300, 700], url: '/static/fonts/SpaceGrotesk-Variable.woff2' }] });

const base = getVariant('dev/github-dark');
try {
  registerVariant({
    ...base,
    id: 'nusastats/pitch',
    name: 'NusaStats Pitch',
    fonts: { sans: 'Space Grotesk', mono: 'JetBrains Mono' },
    surfaces: { ...base.surfaces, pitch: { ...base.surfaces.deep, bg: '#0E3B2E', blob: '#0E3B2E' } },
    rotation: ['pitch', 'deep'],
  });
} catch (e) {
  if (e instanceof VariantError) console.error(e.issues); // e.g. "surfaces.pitch: muted/bg 2.41 < 3"
  throw e;
}
// Decks now use `template: nusastats/pitch`.
```

Register before `parseDeck`/`renderDeck`. An unregistered id falls back to the default template with an `unknown-template` warning, the same as a typo.

---

## 5. Extraction record

Every refactor step had to keep `npm run typecheck`, `npm run test` and the parser golden snapshots green. It also had to keep every review image identical.

For the image check, `REVIEW_HASH=<file> npm run review` renders every sample × every built-in template (16,380 slides) and records each PNG's SHA-1. It was run on each step's commit, in its own worktree, and compared with a baseline from `849455e`, before any change.

| Step | Commit | What | Review hashes vs baseline |
|---|---|---|---|
| 0 | `849455e` | Hash-only review mode; baseline recorded | baseline: 16,380 |
| 1 | `6e9320c` | Open template ids (B1) | 16,380 / 16,380 identical |
| 2 | `cc187e3` | Runtime registry + `registerVariant` / `validateVariant` (B2) | 16,380 / 16,380 identical |
| 3 | `7355dc4` | Family traits replace family branches (B4) | 16,380 / 16,380 identical |
| 4 | `8a8f3bb` | Fonts: manifest + FontFace, no CSS (B3, B8) | 16,380 / 16,380 identical |
| 5 | `58f3545` | Public facade; the app exports through `renderDeck`/`exportZip` (B6) | 16,380 / 16,380 identical |
| 6 | `80ef3b4` | Move to `packages/carousel-core`; app imports via alias | 16,380 / 16,380 identical |
| 7 | `91dd20c`, `f1807b9` | Library builds, entry points, smoke test; default font base without `new URL(rel, import.meta.url)` (Turbopack) | 16,380 / 16,380 identical (measured at `f1807b9`) |
| 8 | `c6077c8` | Release script + workflow; `core-v1.0.0` published to `core-dist` | — |

Beyond the per-step hashes:
- **Package vs app:** `npm run core:smoke` (`browser.js`, fonts served as static files under a sub-path) renders `dev-git-id` × `dev/github-dark` byte-identical to the baseline review render. It also checks a 3-slide host-variant deck, the ZIP (`{slug}_NN.png`, 1080×1920), and the contrast and missing-font errors.
- **App export:** the built app, served from `/carousel-press/`, downloads a ZIP of three 1080×1920 PNGs through the same `renderDeck`/`exportZip`.
- **Install:** `npm i "github:andifathulms/carousel-press#core-v1.0.0"` works in an empty project (`carousel-core/parse` runs in Node). A Next.js 16 app with `basePath: '/nusastats'` and `output: 'export'`, set up exactly as in §4.3, builds with the package's types. Served from `/nusastats/`, it loads the fonts from `/nusastats/carousel-core/fonts/` and downloads a ZIP of three 1080×1920 PNGs.
