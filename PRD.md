# Carousel Press: Product Requirements

> Type a deck as plain text and get TikTok-ready 1080×1920 photo-carousel slides.
> Frontend only. Static site. Deploys to GitHub Pages.

Read alongside **DESIGN.md** (visual system, exact tokens and layouts) and **CLAUDE.md** (how to build it).
If the three files conflict: DESIGN.md wins on anything visual, this file wins on behaviour, and CLAUDE.md wins on code structure and tooling.

---

## 1. Why this exists

The owner is testing faceless TikTok photo-mode carousels: one idea per slide, a strong cover, and a save/share prompt at the end. Candidate niches are **dev cheat sheets** (Git, Linux, SQL, VS Code) and **editorial question/lesson decks** (relationship questions, book lessons, places). The plan is roughly 3–5 posts per week, measured over 8+ weeks.

Designing each slide by hand in Canva takes too long to keep that pace. Carousel Press turns **writing into the only work**:

```
write deck text  →  live preview  →  Download all (ZIP of PNGs)  →  upload to TikTok
```

**Target:** a 6-slide post goes from finished text to exported PNGs in **under 3 minutes**.

## 2. Users

- **Primary:** the owner, a developer who writes decks in Indonesian (sometimes English) and runs 1–2 accounts with different templates.
- **Secondary (later):** other creators who find the GitHub Pages URL. The app must be usable without reading any docs: sample decks and an inline syntax cheat sheet cover that.

## 3. Scope summary

| In scope (V1) | Out of scope (V1) |
|---|---|
| Plain-text deck format → slides | Drag-and-drop / free positioning |
| 2 template families × 3 variants = 6 templates | Per-slide font or colour pickers |
| Photos with focal point + darkening | Backend, accounts, cloud sync |
| Auto numbering, counter, handle, swipe hint, CTA | AI text generation inside the app |
| Text auto-fit + overflow warnings | Direct posting to TikTok |
| Safe-zone overlay + safe-zone test image | Video / animated export |
| PNG per slide, ZIP of all | Analytics |
| Autosave, deck library, deck file import/export | Multi-user collaboration |

No backend is needed for anything in V1. Everything runs in the browser, and all data stays on the device.

---

## 4. The deck text format (core contract)

This is the most important interface in the app. Implement it exactly. Keep the parser **pure** (no DOM) and **never throwing**: bad input produces warnings, not crashes.

### 4.1 Overall structure

````text
handle: @ceritakita.id
template: editorial/rose-dusk
lang: id
title: 5 pertanyaan kecil
caption: Simpan buat nanti malam ✨ #pertanyaanpasangan
---
[cover photo=senja]
5 Pertanyaan Kecil | yang Bikin Kalian Makin Dekat
Nggak harus serius. Cukup jujur.
---
Apa hal kecil yang bikin kamu senyum minggu ini?
Kadang yang paling berarti justru hal yang paling sederhana.
---
[end]
Simpan dulu.
Siapa tahu jadi bahan obrolan kalian nanti.
````

- **Slide separator:** a line whose trimmed content is exactly `---`. Only the code fence of a `[code]` slide (see 4.4) protects separators, and only if it closes: its first fence line opens it, and the next line that is exactly ```` ``` ```` closes it. A fence counts as unclosed when the text ends, or a `---` followed by a tag line (starting with a slide type or a known attribute) comes, before that closing line. An unclosed fence protects nothing, so it never swallows the following slides. On every other slide type ```` ``` ```` is literal text.
- **Header (optional):** everything before the first `---` in the text is the header **only if** every non-empty line in it matches `^\s*([a-z]+)\s*:\s*(.*)$` (keys are lowercase) **and at least one key is known**. Unknown keys in a header warn (4.2). Otherwise there is no header, and that first block is slide 1 (so `Template: x` becomes a visible slide).
- Line endings: accept `\n` and `\r\n`. Trim leading and trailing whitespace on each text line. Code inside fences keeps its whitespace (4.4).
- Empty blocks (only whitespace) are skipped silently.

### 4.2 Header keys

| Key | Values | Default | Effect |
|---|---|---|---|
| `handle` | any text, e.g. `@namaakun` | value in Settings | Drawn top-left on every slide |
| `template` | `<family>/<variant>` ID, see DESIGN.md §4 | last used, else `editorial/rose-dusk` | Template for this deck |
| `lang` | `id` \| `en` | `id` | Language of built-in strings (4.7). Any other value → warning `unknown-lang`, falls back to `id` |
| `title` | text | headline of the first `cover` slide (else slide 1), `\|` read as a space | Used for file names (slugified; `carousel` when the slug is empty) and the deck library |
| `caption` | text, one line | empty | Shown in the caption panel with a Copy button. Never drawn on slides |
| `counter` | `on` \| `off` | `on` | `off` hides the `i/total` counter (4.6) on every slide, e.g. when another app inserts its own images between the slides. Nothing else moves. Any other value → warning `unknown-counter`, falls back to `on` |

Unknown key → warning `unknown-header-key`, ignored.
A `template` value that doesn't exist → warning `unknown-template`, falls back to the default.

### 4.3 Slide tag line

The first non-empty line of a block may be a tag:

```
[type attr=value attr="value with spaces" flag]
```

- `type` ∈ `cover | card | code | quote | end` (plus the lexicon types in `docs/SPEC-lexicon.md`), and it's **optional**. The first token is the type only if it is a bare word (no `=`) matching a known type. Otherwise every token is an attribute or flag, and the type is the default. So `[icon=heart]` and `[cta icon=leaf]` are valid card tags.
- A line counts as a tag line only if the whole trimmed line matches `^\[[^\]]*\]$`.
- If there is no tag, or the tag has no type: block 1 → `cover`, any other block → `card`.
- A first bare token that is neither a known type nor a known flag (`cta`) → warning `unknown-slide-type`, rendered as `card`. The token itself is ignored; the remaining tokens still apply.
- Attribute values are either bare (`[^\s\]]+`) or double-quoted (with `\"` as the only escape). A quote that never closes → warning `unknown-attr`, and the value runs to the end of the tag. A bare word with no `=` is a flag (`true`). A later unknown bare word → `unknown-attr`.
- A valued attribute written as a flag (e.g. `[photo]`) → `unknown-attr`, ignored. `cta=""` is the same as the bare `cta` flag.
- An attribute on a slide type outside its "Applies to" column → `unknown-attr`, removed.

| Attribute | Applies to | Values | Meaning |
|---|---|---|---|
| `photo` | all | photo ID, or an integer = 1-based tray index | Background photo (see §5.5). An integer is **always** a tray index, never an ID, and it's resolved against the tray the deck renders with. No such index or ID in the tray → `unknown-photo` (photo IDs are never all digits) |
| `icon` | card, code, quote, end | icon name \| `auto` \| `none` | Line icon below the body (DESIGN.md §7). Names are case-insensitive. Aliases: `shield`, `spark`, `pin`, `branch`, `bulb`, `check`. An unknown name → `unknown-attr`. Default: `none` for the dev family, `auto` for editorial. `auto` picks from the family pool by `hash(slug:index)`, never repeats the previous slide's icon, and never adds one to an `end` slide |
| `surface` | all | surface name from the variant \| `auto` | Overrides the background rotation for this slide. Checked against the variant at layout time, so an unknown name warns `unknown-attr` under that template only |
| `cta` | card, code, quote, end | flag, or `"custom text"` | Adds the CTA button below the body/icon, so the last question can double as the end slide. Custom text replaces the button label. On `end` (which always has the button) it only sets the label |
| `number` | card, code | `off` \| integer (digits) | `off` hides the badge. An integer forces this badge's number without changing the running count. Anything else → `unknown-attr` |
| `kicker` | cover | text | Small label above the cover title, e.g. `"GIT • CHEAT SHEET"` |

Unknown attribute → warning `unknown-attr`, ignored.

### 4.4 Field mapping per slide type

After the tag line is removed, the remaining lines map to fields:

| Type | Line 1 | Following lines |
|---|---|---|
| `cover` | **headline** (big title) | **subtitle** |
| `card` | **headline** | **body** |
| `code` | **headline** (if the first line is already the fence → `missing-headline`) | **body** lines until the first code fence; the fenced **code**; any lines after the closing fence become the **note** (small, muted) |
| `quote` | **quote text** | if the first non-empty line after it starts with `— `, `-- ` or `- `, it becomes the **attribution** (marker stripped); every other line, dashes included, is **body** |
| `end` | **headline** | **body**; the CTA button is always drawn |

**Code fences** use triple backticks with an optional language: ` ```bash `, ` ```js `, ` ```py `, ` ```sql `, or plain ` ``` `. Content between the fences is kept verbatim: no trimming, no `|` processing, tabs expanded to 2 spaces. A fence that is never closed → warning `unclosed-fence`, and the code runs to the end of the block. The closing fence is a line that is exactly ```` ``` ````. Trailing blank code lines are dropped. The language is lowercased: `bash`/`sh`/`shell`/`zsh` get the prompt and highlighting; `js`/`ts`/`javascript`/`typescript`/`jsx`/`tsx`, `py`/`python` and `sql` are highlighted; any other language renders as plain code with no warning.

A `code` slide with no fence → warning `code-missing-fence`, rendered as a card.

### 4.5 Inline text rules (headline, subtitle, body, note, quote)

- `|` = manual line break. `\|` = a literal pipe.
- Each source line of a subtitle, body or note is its own line (a hard break). A blank line = paragraph break (rendered as extra spacing; see DESIGN.md).
- `*text*` = accent colour (no italics). The opening `*` must be followed by a non-space and the closing `*` preceded by one. An accent can't cross `|` or a backtick. Unmatched stars render literally.
- `` `text` `` = inline code: monospace font with a subtle pill background. Inside it, `|` doesn't break the line and `\|` stays as typed. An empty pair (``` `` ```) renders literally.
- No other markdown. `**`, `_` and `#` render literally.

### 4.6 Numbering and counters

- **Badge number:** `card` and `code` slides get 1, 2, 3… in order. Slides with `number=off` are skipped and don't consume a number. `number=N` displays N, and the running counter continues as if that slide had consumed a number normally.
- **Slide counter** `i/total` is drawn on every slide (including cover and end), where total = number of rendered slides, unless the header sets `counter: off`.
- **Swipe hint:** on the cover = the `coverSwipe` string; on card/code/quote = `swipe`; on end, or any slide with `cta`, = none.

### 4.7 Built-in strings

| Key | `id` | `en` |
|---|---|---|
| `swipe` | `Geser →` | `Swipe →` |
| `coverSwipe` | `Geser untuk lihat` | `Swipe to see` |
| `cta` | `Simpan • Bagikan` | `Save • Share` |

Keep these in one `strings.ts` table, so adding a language means adding one column. A trailing `→` is drawn as the `arrow-right` icon, never as a glyph.

### 4.8 Warnings

The parser and renderer return warnings as `{ code, slideIndex | null, line, message }`. Show them in the editor gutter and as a badge on the filmstrip thumbnail.

| Code | Source | Blocks export? |
|---|---|---|
| `overflow` | renderer: text doesn't fit even at the minimum size | **Yes**, unless the user confirms "Export anyway" |
| `code-line-too-long` | renderer: a code line doesn't fit at the minimum mono size | **Yes** (same confirm) |
| `internal-error` | parser: an unexpected exception (the deck comes back empty; message "Parser error — please report") | **Yes**, and not a text-length problem |
| `unknown-header-key`, `unknown-template`, `unknown-lang`, `unknown-counter`, `unknown-slide-type`, `unknown-attr` | parser (`unknown-attr` for `surface=` comes from the renderer) | No |
| `unknown-photo` | photo resolution against the tray | No (renders without the photo) |
| `missing-headline` | parser | No |
| `unclosed-fence`, `code-missing-fence` | parser | No |
| `long-deck` | parser: more than 10 slides | No (style hint only) |
| `long-word` | renderer: a word was too wide and was broken between characters | No |
| `photo-low-res` | photo store (not the parser): photo shorter than 1280px on its short side | No |

---

## 5. Features

Priorities: **P0** = required for V1, **P1** = V1 if time allows (planned in the milestones), **P2** = later.

### F1. Deck editor (P0)
- A large monospace textarea holding the deck text. Parse on every change (debounced 150 ms).
- Warnings are listed under the editor. Clicking one moves the cursor to its line.
- When the cursor moves into a slide block, that slide is selected in the preview and filmstrip. Clicking a filmstrip thumbnail moves the cursor to the start of that block and scrolls it into view.
- A collapsible "Syntax" cheat sheet panel shows §4 in about 15 lines with copyable examples.
- **Acceptance:** typing in the editor updates the preview within 300 ms on a mid-range laptop for a 10-slide deck. Click-to-line works in both directions.

### F2. Preview and filmstrip (P0)
- The large preview shows the selected slide at full aspect ratio, scaled to fit. Prev/next buttons, plus ←/→ keys when the preview has focus.
- The filmstrip shows all slides as thumbnails, with the slide number, a warning badge and the active outline.
- Toggles: **Safe zone** overlay (F8) and **Grid** (8 px baseline grid, debug).
- **Acceptance:** the preview and the exported PNG are pixel-identical (same render function, different output canvas).

### F3. Template system (P0)
- **2 families × 3 variants** (all defined in DESIGN.md §4–6):
  - `editorial/rose-dusk`, `editorial/sage`, `editorial/midnight`
  - `dev/github-dark`, `dev/terminal`, `dev/paper-light`
- A family is layout code. A variant is a data object (colours, fonts, surface rotation, decoration switches). Adding a variant must not require touching layout code.
- Every family renders all 5 slide types, including `code` in editorial and `quote` in dev.
- Template picker: a dropdown grouped by family, with a 4-swatch preview per variant. Changing the template rewrites the `template:` header line in the text (or inserts a header if there is none), so the text stays the single source of truth.
- **Syntax highlighting** in code blocks: `bash`/`sh` in P0; `js`, `ts`, `py`, `sql` in P1. Unknown language → plain text in the base code colour.
- **Acceptance:** the same deck text renders correctly in all 6 templates with no overflow for the sample decks (F15).

### F4. Text auto-fit (P0)
- Each text region has a max size, a min size and a step (DESIGN.md §3.4). The renderer tries sizes from max down to min until the wrapped text fits the region's height and line limit.
- Wrapping is greedy by words. A single word wider than the region is broken by characters, and that case gets a warning.
- Avoid a one-word last line in headlines: if the last line has one word and the previous line has 3 or more, move one word down (only if it still fits).
- If the text doesn't fit at the min size, draw it clipped to the region, mark the slide `overflow`, and outline it in red **in the preview only**.
- **Acceptance:** unit tests cover fit, step-down, the min-size overflow flag, character breaking and the widow fix.

### F5. Photos (P0)
- Drag-drop or pick multiple images (JPG/PNG/WebP/HEIC if the browser supports decoding it; otherwise show a friendly error).
- On import: decode, downscale so the long side is ≤ 2400 px, store as a Blob in IndexedDB with `{ id, name, width, height, focalX: 0.5, focalY: 0.5 }`.
- **Photo ID** = filename without extension, slugified (`Senja Pantai.jpg` → `senja-pantai`), with `-2`, `-3` appended on collisions. The ID is shown under each thumbnail in the photo tray with a copy button. `photo=2` refers to the second photo in the tray.
- **Focal point:** click on the enlarged photo in the tray to set (focalX, focalY). The cover crop keeps the focal point as close to the slide centre as the image allows.
- **Darkness slider** (per deck, 0–100, default 50) controls overlay strength. DESIGN.md §3.6 defines the overlay.
- Text drawn on a photo always uses the variant's `onPhoto` tokens.
- **Acceptance:** a landscape photo cropped to 9:16 with focal (0.2, 0.5) keeps the left subject in frame. Photos survive a page reload.

### F6. Export (P0)
- **Download this slide:** a PNG, 1080×1920, sRGB, named `{slug}_{NN}.png` (NN is 2-digit, 1-based).
- **Download all:** one ZIP `{slug}.zip` containing every slide PNG (JSZip, STORE compression since PNG is already compressed). One file avoids the browser's "multiple downloads" prompt.
- `slug` = slugified `title` header, else the cover headline, else `carousel`; max 40 characters.
- If any slide has a blocking warning, show a dialog listing them with **Fix** (jumps to the first one) and **Export anyway**.
- Export renders on a fresh off-screen 1080×1920 canvas at scale 1, never by reading back the scaled preview.
- **Acceptance:** exported files are exactly 1080×1920. The ZIP opens on macOS and Android. 10 slides export in under 3 s.

### F7. Fonts (P0)
- All fonts are bundled with the app (no Google Fonts CDN at runtime), so it works offline and renders the same everywhere.
- Before the first render, and before every export, `await` the loading of every face the active template uses (`document.fonts.load(...)` per face + `document.fonts.ready`). Until then, show a skeleton preview and disable the export buttons.
- **Acceptance:** with the network disabled after first load, exports still use the correct fonts. A test asserts the font-loading promise resolves before `exportAll()` draws anything.

### F8. Safe zone (P0)
- An overlay toggle shows TikTok's UI-covered regions (DESIGN.md §2) as translucent red areas, with labels ("caption", "buttons", "tabs"). It never appears in exports.
- **Export safe-zone test image:** a 1080×1920 PNG with a labelled grid and the zones drawn. The owner posts it once as a private/draft post to check the margins on a real phone, then adjusts `SAFE` constants if needed. They live in one file.
- **Acceptance:** no headline, body, badge, code block, CTA or counter is placed outside the content-safe box in any template (enforced by a unit test over layout boxes).

### F9. Autosave (P0)
- The deck text and settings autosave to `localStorage` (debounced 500 ms). Photos live in IndexedDB. On load, restore the last open deck.
- Wrap all storage access in try/catch. If storage is unavailable, show a small banner "Autosave off in this browser" and keep working in memory.

### F10. Deck library (P1)
- A sidebar list of saved decks (title, template, updated time, cover thumbnail). New / Duplicate / Rename / Delete (with confirm).
- Photos are shared across decks (one tray). A photo that no deck references can be removed with "Clean unused photos".

### F11. Deck file import/export (P1)
- **Save deck file:** `{slug}.carousel.json` = `{ format: "carousel-press/1", text, settings, photos: [{ id, name, focalX, focalY, mime, dataBase64 }] }`, containing only the photos this deck uses.
- **Open deck file:** validate `format`, import the photos (renaming IDs on collision and rewriting `photo=` references in the text), and open the deck.

### F12. Template gallery (P1)
- A modal showing the current deck's cover **and** first card rendered in all 6 templates, side by side. Click one to apply it.

### F13. Caption panel (P1)
- Shows the `caption:` value with a character count and a **Copy** button. TikTok's own caption limit changes over time, so only show the count; don't enforce a limit.

### F14. Inline formatting (P1)
- `*accent*` and `` `inline code` `` as defined in §4.5. P0 renders the markers literally if this isn't done yet, but the parser already tokenises them.

### F15. Sample decks (P0)
- Menu → "Load sample". The app ships with at least:
  1. `editorial-couples-id`: the 6-slide deck in §8.1 (editorial/rose-dusk)
  2. `dev-git-id`: the 9-slide deck in §8.2 (dev/github-dark)
  3. `editorial-places-en`: a short English deck (cover, 3 cards, end) using `editorial/midnight` and `photo=sample-dusk`
- **Sample photo:** on first run, seed the photo tray with one image, `sample-dusk`, generated by code at build time or first run (a gradient dusk sky, a soft sun and layered hill silhouettes; see DESIGN.md §5.7). It is tray index 1, so `photo=1` in sample 8.1 resolves. No third-party photos are ever bundled.
- Loading a sample asks for confirmation if the current deck has unsaved changes. In practice: it opens as a new deck in the library.

### F17. Open a deck from a link (P1)
- **Contract (fixed; other apps such as NusaStats generate these links):** `https://andifathulms.github.io/carousel-press/#deck=<data>`, where `<data>` is base64url (RFC 4648 §5: `-` and `_`, no `=` padding) of the deck text's UTF-8 bytes. The deck travels in the URL fragment, which the browser never sends to a server, so opening a link makes no network request (§10 of CLAUDE.md).
- On boot, after storage has loaded (and on `hashchange` in an open tab), a `deck=` fragment opens as a **new deck in the library** and is selected. The deck that was open stays as it was. The fragment is then removed with `history.replaceState`, so a reload doesn't import it again.
- Invalid base64url, invalid UTF-8, or decoded text over 100 KB creates no deck. An error toast says "Tautan deck tidak bisa dibaca" (Indonesian browsers) or "Couldn't read the deck link".
- The decoded text goes through the normal parser, so its warnings show as usual. Photos aren't part of a link, so `photo=N` gets the usual `unknown-photo`. Without storage the deck still opens in the editor and can be exported.
- Code: `src/core/deckLink.ts` (`encodeDeckLink(text, base)`, `decodeDeckLink(hash)`, pure) and `src/ui/deckLinkImport.ts`.

### F16. P2 (do not build in V1; keep the architecture open)
- PWA / offline install, a custom variant editor, JPG export with a quality slider, a 4:5 format, a batch "deck file → ZIP" CLI using the same core.

---

## 6. Non-functional requirements

- **Static only:** builds to `dist/` and runs from any static host. GitHub Pages under a sub-path (`/carousel-press/`) must work.
- **Privacy:** no network calls at runtime apart from loading the app itself. No analytics. Photos never leave the device.
- **Browsers:** latest Chrome, Edge, Firefox and Safari (desktop). Mobile Safari/Chrome must load and export (layout can be simplified; see DESIGN.md §9).
- **Performance:** first render under 1.5 s after fonts load. Typing never blocks for more than 50 ms (render off the input event, debounced; cache each slide's bitmap by a hash of slide + template + photo + darkness).
- **Accessibility (app UI):** keyboard reachable, visible focus, labelled controls, WCAG AA contrast for UI text. Template tokens are also contrast-tested (DESIGN.md §4.4).
- **Determinism:** the same text + template + photos always produce byte-identical PNGs in the same browser. No `Math.random()` in rendering; decoration uses a seeded PRNG (seed = slug + slide index).

## 7. Success measures

- **Owner-reported:** a 6-slide post from text to ZIP in under 3 minutes, and less than 1 manual fix per post.
- Zero exported slides with fallback fonts, overflow or content in the safe-zone margins.
- All 3 sample decks render cleanly in all 6 templates (checked by the visual review step in CLAUDE.md).

## 8. Sample decks (ship these verbatim)

These are original texts written for this app. Don't replace them with copied content from any real account.

### 8.1 `editorial-couples-id`

````text
handle: @namaakun
template: editorial/rose-dusk
lang: id
title: 5 pertanyaan kecil
caption: Coba tanya malam ini, terus ceritain hasilnya di komen 🤍 #pertanyaanpasangan #ldr
---
[cover photo=1]
5 Pertanyaan Kecil | yang Bikin Kalian Makin Dekat
Nggak harus serius. Cukup jujur.
---
[icon=heart]
Apa hal kecil dariku yang diam-diam kamu suka?
Bukan yang besar-besar. Yang sering kelewat tapi kamu perhatiin.
---
[icon=mountain]
Lima tahun lagi, kamu pengen kita lagi ngapain?
Nggak usah realistis dulu. Bayangin aja.
---
[icon=shield]
Ada hal yang belum berani kamu ceritain ke aku?
Boleh dijawab sekarang, boleh juga nanti. Aku tunggu.
---
[icon=home]
Kebiasaan keluargamu yang pengen kamu bawa ke rumah kita?
Dari cara makan bareng sampai cara menyelesaikan masalah.
---
[cta icon=leaf photo=1]
Kalau besok kita cuma punya satu hari bebas, mau ke mana?
Siapa tahu ini jadi bahan obrolan kalian nanti.
````

### 8.2 `dev-git-id`

````text
handle: @namaakun
template: dev/github-dark
lang: id
title: 7 perintah git
caption: Save dulu, nanti pas lupa tinggal buka lagi. #git #programmer #belajarcoding
---
[cover kicker="GIT • CHEAT SHEET"]
7 Perintah Git | yang Wajib Kamu Tahu
Bukan cuma add, commit, push.
---
[code]
Cek kondisi repo
Lihat file yang berubah, sudah di-stage, atau belum dilacak.
```bash
git status
```
---
[code]
Stage sebagian perubahan
Pilih potongan perubahan satu per satu sebelum commit.
```bash
git add -p
```
Tekan y untuk ambil, n untuk lewati.
---
[code]
Perbaiki commit terakhir
Ganti pesan atau tambahkan file yang ketinggalan.
```bash
git add file-ketinggalan.js
git commit --amend
```
Jangan dipakai untuk commit yang sudah di-push ke branch bersama.
---
[code]
Simpan kerjaan sementara
Bersihkan working tree tanpa commit, lalu ambil lagi nanti.
```bash
git stash
git stash pop
```
---
[code]
Lihat riwayat dengan ringkas
Satu baris per commit, lengkap dengan grafik branch.
```bash
git log --oneline --graph
```
---
[code]
Pindah ke branch baru
Buat branch dan langsung pindah ke sana.
```bash
git switch -c fitur-login
```
---
[code]
Buang perubahan di satu file
Kembalikan file ke versi commit terakhir.
```bash
git restore app.js
```
Hati-hati: perubahan yang belum di-commit hilang permanen.
---
[end]
Save dulu.
Nanti pas lupa Git, kamu bakal nyari ini lagi.
````

## 9. Milestones

| # | Deliverable | Done when |
|---|---|---|
| M1 | Project scaffold, parser + tests, `editorial/rose-dusk` card/cover/end, single PNG export, bundled fonts | Sample 8.1 exports correctly |
| M2 | `dev/github-dark` with all 5 types, code block + bash highlighting, auto-fit + overflow | Sample 8.2 exports with no warnings |
| M3 | Photos (tray, IDs, focal point, darkness), safe-zone overlay + test image | Cover with a photo looks like DESIGN.md §5.2 |
| M4 | Filmstrip, editor ↔ preview sync, ZIP export, autosave | Full write → ZIP loop works offline |
| M5 | Remaining 4 variants, template picker, quote slide polish, visual review across 3 samples × 6 templates | Review grid shows no overflow or clipping |
| M6 | P1 features (library, deck file, gallery, caption, inline formatting), GitHub Pages deploy | Live URL works under the sub-path |

## 10. Open decisions (owner)

- Final name. "Carousel Press" is the working name; alternatives are "Slide Press" and "Carousel Studio". The name appears only in `index.html` `<title>`, the app header and `package.json`.
- Whether to add a third family later (e.g. "Bold", big sans-serif type for facts/history decks). The architecture must allow it without refactoring.
