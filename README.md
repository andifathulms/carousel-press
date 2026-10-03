# Carousel Press

Type a deck as plain text and get TikTok-ready **1080×1920** photo-carousel PNGs.
Static, frontend-only, works offline after the first load. Photos never leave your device.

```
write deck text  →  live preview  →  Download all (ZIP of PNGs)  →  upload to TikTok
```

## Deck format (short)

```text
handle: @namaakun
template: editorial/rose-dusk
lang: id
title: 5 pertanyaan kecil
---
[cover photo=1]
5 Pertanyaan Kecil | yang Bikin Kalian Makin Dekat
Nggak harus serius. Cukup jujur.
---
[icon=heart]
Apa hal kecil dariku yang diam-diam kamu suka?
Bukan yang besar-besar.
---
[end]
Simpan dulu.
```

Slide types: `cover`, `card`, `code`, `quote`, `end`. Templates: `editorial/{rose-dusk,sage,midnight}` and
`dev/{github-dark,terminal,paper-light}`. The full spec is in [PRD.md](PRD.md) §4; the app has an inline cheat sheet.

## Development

```bash
npm install
npm run dev         # vite dev server
npm run test        # vitest
npm run typecheck
npm run build       # typecheck + build → dist/
npm run review      # render every sample × template to review/ (Playwright)
```

Specs: [PRD.md](PRD.md) (behaviour), [DESIGN.md](DESIGN.md) (visuals), [CLAUDE.md](CLAUDE.md) (build rules),
[docs/decisions.md](docs/decisions.md) (choices made along the way).

Deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml`.
