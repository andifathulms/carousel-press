# carousel-core

Plain-text decks → 1080×1920 carousel PNGs, rendered in the browser with Canvas 2D. This is the engine behind [Carousel Press](https://andifathulms.github.io/carousel-press/). The deck grammar is PRD §4 in the Carousel Press repo.

```bash
npm i "github:andifathulms/carousel-press#core-v1.0.0"
```

```js
import { configureFonts, renderDeck } from 'carousel-core';
import { exportZip, downloadBlob } from 'carousel-core/zip';

configureFonts({ baseUrl: '/static/carousel-core/fonts/' }); // where you serve node_modules/carousel-core/fonts
const blobs = await renderDeck('template: dev/github-dark\n---\n[cover]\nHalo | dunia\n---\nKartu\n---\n[end]\nSimpan');
downloadBlob(await exportZip(blobs, 'halo-dunia'), 'halo-dunia.zip');
```

| Import | What |
|---|---|
| `carousel-core` | `parseDeck`, `renderDeck`, `loadFonts`, `configureFonts`, `registerVariant`, `listVariants`, `validateVariant`, `renderSlide`… (browser) |
| `carousel-core/parse` | `parseDeck`, the registry and helpers. Runs in Node too |
| `carousel-core/zip` | `exportZip(blobs, name)`, `downloadBlob`. Loads JSZip |
| `carousel-core/browser.js` | Everything in one ES module, JSZip included, for pages without a bundler |
| `carousel-core/fonts/*` | 42 woff2 files + `manifest.json` (OFL licences in `fonts/LICENSES/`) |

**Fonts.** Rendering waits until every face the template draws with has loaded, and rejects after 8 s, naming the missing faces. It never renders with fallback fonts. By default the files are read from `../fonts/` next to the module, which works when the package is served as is. With a bundler, copy `fonts/` into your public folder and call `configureFonts({ baseUrl })` before rendering. Host variants can add faces: `configureFonts({ faces: [{ family, weight: 400 | [100, 900], style?, url }] })`.

**Templates.** `registerVariant({ ...getVariant('dev/github-dark'), id: 'myapp/pitch', name: 'Pitch', … })` adds a variant on an existing family (`editorial`, `dev`, `lexicon`, `serene`, `sport`). It throws a `VariantError` that lists every contrast (DESIGN §4.4) or structure problem.

Full guide: `docs/PORTING.md` in the Carousel Press repo. Versioning: semver, and the deck grammar is the contract (PORTING §3.4).
