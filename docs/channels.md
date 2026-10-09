# Channels: content brief for writing decks

Read this before writing any deck. The owner runs seven TikTok accounts, and every deck is for exactly one of them.
If a request names an account ("10 posts for Ruang Rasa", "deck for Whistle Notes"), use that account's section.
If it doesn't name one, infer it from the topic and say which one you picked:

- relationships, friendship, family, feelings, self-reflection → **Ruang Rasa**
- code, AI for developers, dev tools → **Fathul Learn Coding**
- Indonesian history, kingdoms, local events, place-name origins → **Catatan Kaki Sejarah**
- sports rules, how a sport works, rule incidents → **Whistle Notes**
- regional statistics, rankings, "kabupaten mana yang paling…" → **Peta Angka**
- English vocabulary, grammar, pronunciation for Indonesians → **English Sehari**
- Indonesian words, KBBI meanings, kata baku, kata serapan → **Kamus Kecil**

The deck format is PRD §4. This file only says *what* to write and which template/attributes to use. It adds no new syntax.

| Account | Language | What it posts | Template family | Default template |
|---|---|---|---|---|
| 🌿 Ruang Rasa | `id` | Conversation questions | `editorial/*` | `editorial/rose-dusk` |
| 💻 Fathul Learn Coding | `id` | Dev tips, AI for devs, learning journey | `dev/*` | `dev/github-dark` |
| 📜 Catatan Kaki Sejarah | `id` | Lesser-known Indonesian history | `editorial/*` | `editorial/sage` |
| 🏟️ Whistle Notes | `id` | One sports rule per post | `dev/*` (clean sans) | `dev/paper-light` |
| 📊 Peta Angka | `id` | Regional data from NusaStats packs | `editorial/*` | `editorial/midnight` |
| ✏️ English Sehari | `id` (teaches English) | Words, irregular verbs, common mistakes | `lexicon/*` | `lexicon/notebook` |
| 📖 Kamus Kecil | `id` | Indonesian words, KBBI, baku, serapan | `lexicon/*` | `lexicon/kamus` |

---

## 1. 🌿 Ruang Rasa

**Tagline:** *Pertanyaan kecil. Cerita yang lebih dalam.*
A faceless Indonesian account about meaningful conversations, relationships and self-reflection.
It should feel like "someone gave me a good question to think about", never "someone is telling me how to live my life".

| | |
|---|---|
| Purpose | Start conversations |
| Audience | Indonesian young adults |
| Reader should think | "I want to send this to someone." |
| Primary action | Share / save |
| Tone | Warm, intimate, relatable, thoughtful |
| Voice | Anonymous companion |
| Slide types | `cover`, `card`, `quote`, `end` |

### Pillars

1. **Couple / relationship**: questions for your partner, before marriage, LDR, things couples should talk about, relationship dilemmas.
2. **Friendship**: questions for your best friend, "how well do you know your friend?", friendship dilemmas, shared memories.
3. **Family**: questions for parents, for siblings, Indonesian family situations.
4. **Self-reflection**: questions to ask yourself, life decisions, personal growth, "kalau kamu bisa…".
5. **Interactive / fun**: would you rather, this or that, pilih satu, "what would you do?", simple personality/result cards.

### Writing rules

- Language: Indonesian (`lang: id`), casual and warm: `kamu` / `aku` / `kita`, never `Anda`. Light slang is fine (`nggak`, `bikin`, `banget`), don't overdo it.
- One question or idea per card. The headline is the question; the body is one short line that adds warmth or context.
- Questions should be open (not yes/no) and specific enough to start a real answer ("Momen apa…", "Hal kecil apa…").
- Inclusive by default: don't assume gender, marriage, religion or that every relationship works the same way.
- Avoid: generic motivational quotes, cheesy romance, pop/fake psychology ("tanda dia toxic"), manipulative advice, telling people what a relationship "should" be.
- Before shipping, ask of each card: would someone screenshot this and send it to a specific person?

### Deck recipe

- **Templates:** `editorial/rose-dusk` (default: cream, dusty rose, deep green), `editorial/sage` (nostalgia, family, calm), `editorial/midnight` (night-time, longing, LDR). Rotate between them so the feed doesn't look identical.
- **Length:** cover + 5–7 cards + end. Stay ≤ 10 slides (`long-deck` warning above that).
- **Cover:** `[cover photo=1]`, headline with a number and a `|` break, subtitle as a low-pressure invitation.
- **Cards:** pick a fitting `icon=` per card (see the list in Shared rules) or leave `auto`. Don't type `01`, `02`: badge numbers are drawn automatically.
- **Interactive pillar:** "A atau B?" goes in the headline, the body nudges people to answer in the comments. No hidden answers, since a carousel can't hide them.
- **End:** `[end]` with a save/share line, e.g. `Simpan dulu 🤍` + `Buat bahan obrolan nanti.` Or end on the last question with `[cta]`.
- **Caption:** one line, warm, invites a reply, plus 2–4 hashtags (`#pertanyaanpasangan`, `#sahabat`, `#refleksidiri`…).

```text
template: editorial/rose-dusk
lang: id
title: 5 pertanyaan buat sahabat
caption: Kirim ke sahabatmu, terus bandingin jawabannya 🤍 #sahabat #pertanyaan
---
[cover photo=1]
5 Pertanyaan | Buat Sahabatmu
Jawab jujur. Nggak ada yang salah.
---
[icon=smile]
Kapan pertama kali kamu ngerasa kita bakal jadi dekat?
Coba ingat-ingat momennya.
---
[end]
Simpan dulu 🤍
Buat bahan obrolan nanti.
```

---

## 2. 💻 Fathul Learn Coding

**Tagline:** *Belajar coding sambil berbagi hal-hal yang berguna buat developer.*
Profile line: `💻 Coding • 🤖 AI • 🛠️ Dev Tools`.
Voice is "I found this useful, here's how it works", not "I'm the expert, listen to me".

| | |
|---|---|
| Purpose | Teach/share useful things |
| Audience | Indonesian beginner/junior devs, students, AI-curious |
| Reader should think | "I should save this." |
| Primary action | Save / follow |
| Tone | Practical, curious, friendly, concise, slightly nerdy |
| Voice | Fathul learning in public: "belajar bareng, bukan menggurui" |
| Slide types | `cover`, `card`, `code`, `end` (`quote` rarely) |

### Pillars

1. **Coding fundamentals**: concepts explained simply (API, HTTP, databases, JS/Python basics). "X itu sebenarnya apa?"
2. **Practical dev tips** (most saveable): Git, GitHub, VS Code shortcuts, Linux/terminal commands, SQL, debugging, snippets.
3. **AI for developers**: Claude, ChatGPT, Gemini, Copilot, AI IDEs, prompting for code, AI-assisted debugging, practical workflows, honest comparisons. The angle is always "how can a developer actually use this?". Not AI news, not "10 tools that will change the world".
4. **Developer tools**: extensions, CLI tools, deployment platforms, databases, useful sites. Filter: would a developer actually use it?
5. **Learning journey**: things Fathul recently learned, "akhirnya aku paham…", mistakes, debugging lessons, small projects. This is what separates the account from generic tip pages.

### Writing rules

- Language: Indonesian (`lang: id`), friendly and concise; keep technical terms in English (`commit`, `branch`, `query`, `prompt`).
- Every command or snippet must be correct and runnable as written. Prefer the common, safe form; add a warning in the body for destructive commands (`reset --hard`, `rm -rf`, `DROP`).
- One command/idea per slide: headline = what it does, body = when you'd use it, code = the exact command, optional note after the fence.
- AI pillar: tools change fast. Don't state prices, model versions, limits or rankings unless the owner confirms them. Describe workflows, not hype.
- Learning-journey decks use first person (`aku`) and admit what was confusing. A `quote` slide works for the "aha" sentence.
- Light humour is fine; usefulness comes first.

### Deck recipe

- **Templates:** `dev/github-dark` (default: near-black + green, closest to the brand), `dev/terminal` (Linux/CLI topics). Don't use `dev/paper-light` here: it's Whistle Notes' look.
- **Length:** cover + 4–7 slides + end, ≤ 10 total.
- **Cover:** `[cover kicker="GIT • CHEAT SHEET"]` style kicker (TOPIC • FORMAT in caps), headline with a number and `|` break.
- **Slides:** `[code]` with a fenced block in `bash`, `js`, `py` or `sql` for commands/snippets; plain cards for concepts. Inline `` `code` `` in headlines is fine. Keep code lines short (no wrapping; long lines get shrunk then clipped with `code-line-too-long`).
- **End:** `[end]`, save line, then the portfolio sign-off as the last body line (see decisions.md):
  ```text
  [end]
  Simpan dulu ⭐
  Nanti pas lupa, balik lagi ke sini.

  Lagi butuh web portofolio atau aplikasi web? Ngobrol aja di *andifathulms.github.io*
  ```
- **Caption:** one line on why it's useful + 2–4 hashtags (`#belajarcoding`, `#programmer`, `#git`, `#ai`…).

---

## 3. 📜 Catatan Kaki Sejarah

**Tagline:** *Yang nggak sempat masuk buku pelajaran.*
A faceless Indonesian account telling lesser-known stories from Indonesian history, one place or event at a time: kingdoms, local events, place-name origins, objects and people the textbook skipped.
It should feel like "wait, this happened here?", never like a lecture or a political opinion.

| | |
|---|---|
| Purpose | Make people curious about local history |
| Audience | Indonesian teens to adults, students, people proud of their region |
| Reader should think | "I didn't know this, I'm sending it to someone from there." |
| Primary action | Share / save / comment ("di daerahku juga ada…") |
| Tone | Curious, vivid, respectful, neutral |
| Voice | A storyteller who did the reading: concrete dates, places, names; no exaggeration |
| Slide types | `cover`, `card`, `quote`, `end` |

### Pillars

1. **Kerajaan & kesultanan**: how they rose, ended, or survived as cultural institutions (Kutai, Ternate, Gowa, Banjar, Siak…).
2. **Peristiwa lokal**: regional events that stayed regional: uprisings, disasters, battles, odd incidents.
3. **Asal-usul nama**: where a city, river or island name comes from (only if the origin is documented; label folklore as folklore).
4. **Benda & tempat**: one object, building or site and its story (a prasasti, a fort, a ship, a palace).
5. **Tokoh yang terlupa**: one lesser-known person and the moment they mattered.

### Accuracy rules (non-negotiable)

- **Every date, name, number and claim needs a source.** Before writing the deck, list sources in the reply: books, journals, official/government sites, museum or archive pages. Wikipedia is a starting point only; find at least one stronger source for the key facts.
- If sources disagree, say so on the slide ("Sebagian sumber menyebut 1575, sebagian lain…") or leave the detail out.
- If something can't be confirmed, don't write it. Never fill gaps with plausible-sounding details.
- Folklore and legend are welcome, but labelled: "Menurut cerita rakyat…".
- No present-day political commentary. Tell what happened; let viewers draw conclusions.

### Real history, not the comfortable version (owner rule, Oct 2026)

- Tell what actually happened, including what reflects badly on the Indonesian state or military, the Dutch, the Japanese, kingdoms, or national heroes: arrests without trial, burned regalia, forced takeovers, slavery, massacres, collaboration. Don't sanitise by leaving the hard part out.
- Show violence on every side (e.g. both Banjar fighters and the Dutch, both Gowa and the VOC), stated factually, no gore.
- Wikipedia is a lead, not a source. Every such claim needs a stronger source; when sources disagree on a date, number or who did it, say so on the slide or keep only what they agree on.

### Sensitive topics

- Topics involving SARA, 1965–66, Papua, Aceh, Timor Leste, or communal conflicts (e.g. Sampit, Poso): only when the owner explicitly asks. Neutral wording, sources from more than one side, no blame language, no graphic detail, no images of victims or bodies.
- Don't mock or rank ethnic groups, regions or religions.
- Royal families still exist: describe them respectfully and accurately.

### Images

Every slide has a photo: the place, object, an old print/map, or a true related subject (cloves for the clove trade, the river a kingdom stood on). Use 4–6 distinct photos per deck, each on at most 2–3 slides; the cover photo returns on the end slide. Never label one place as another. Follow the image policy in Shared rules. No AI-generated images presented as historical; if one is used, the slide must say "ilustrasi".

### Writing rules

- Language: Indonesian (`lang: id`), standard but relaxed: `kamu` is fine, light slang only in the hook. Proper names in correct spelling (`Kesultanan Kutai Kartanegara ing Martadipura` on first mention).
- Put the year or place at the start of story headlines: `*1960*: …`, `Tenggarong, 2001: …` (`*…*` = accent colour).
- Body ≤ 45 words per slide (2–3 short sentences). One beat of the story per slide.
- The hook must be true. No "rahasia yang disembunyikan", no clickbait the deck can't back up.

### Deck recipe

- **Templates:** `editorial/sage` (default: calm, archival feel, Lora serif), `editorial/midnight` (tragedies, wars, night-time events). Switch to `editorial/archive` once it exists (see Open items).
- **Two deck shapes:**
  - **Story deck** (one event): cover → context → turning point → what happened → aftermath → "today" link → end. Use `number=off` on story cards.
  - **List deck** ("5 kerajaan yang…", "4 nama kota yang…"): cover + 4–6 numbered cards + end.
- **Length:** up to 14 slides (cover + up to 12 cards + end). This goes past the app's 10-slide `long-deck` hint on purpose: the story needs the room.
- **Cover:** `[cover photo=<id>]` with a photo of the place/object or an old print or map; headline = a surprising true statement or question with a `|` break; subtitle sets place + era.
- **Quote slide:** a documented quote (with attribution and source only), or a line from a prasasti/chronicle.
- **End:** `[end photo=<same id>]` with `Di daerahmu ada cerita kayak gini?` + `Tulis di komen, siapa tahu jadi postingan berikutnya.`
- **Caption:** one line hook + `Sumber:` short source list + a credit line if the image licence needs one + 2–4 hashtags (`#sejarahindonesia`, `#sejarahlokal`, `#kalimantantimur`…).

```text
template: editorial/sage
lang: id
title: kutai pernah dihapus
caption: Kerajaan tua yang masih punya sultan. Sumber: [isi sumber terverifikasi] · Foto: [credit lines] #sejarahindonesia #kutai #kalimantantimur
---
[cover photo=kutai-kedaton]
Kesultanan Ini Pernah | Dihapus Negara
Lalu "hidup lagi" 41 tahun kemudian. Kutai Kartanegara, Kalimantan Timur.
---
[number=off icon=home]
Berdiri sejak abad ke-14
Kutai Kartanegara berpusat di tepi Sungai Mahakam dan memeluk Islam pada abad ke-16.
---
[number=off icon=map-pin]
Setelah merdeka, jadi daerah istimewa
Wilayah kesultanan sempat punya status khusus di dalam Republik Indonesia.
---
[number=off icon=alert]
*1960*: status itu dihapus
Pemerintah pusat menghapus status istimewanya. Kekuasaan politik sultan berakhir, wilayahnya jadi bagian biasa dari Kalimantan Timur.
---
[number=off icon=star]
*2001*: sultan dinobatkan lagi
Aji Muhammad Salehuddin II naik takhta pada 22 September 2001, kali ini sebagai simbol budaya, bukan pemerintahan.
---
[end]
Di daerahmu ada cerita kayak gini?
Tulis di komen, siapa tahu jadi postingan berikutnya.
```

(Example only: verify every fact and fill in real sources/credits before posting.)

---

## 4. 🏟️ Whistle Notes

**Tagline:** *One rule. Explained properly.*
A faceless Indonesian account that explains sports rules one piece at a time: the objective of a sport, one rule, one tricky case, or the incident that changed a rule.
It should feel like "oh, so THAT's why the referee did that", never like reading a rulebook.

| | |
|---|---|
| Purpose | Make sports rules click |
| Audience | Indonesian casual fans, new viewers of a sport, people who argue about referee calls |
| Reader should think | "Saving this for the next match argument." |
| Primary action | Save / share / comment ("do X next") |
| Tone | Clear, confident, a little playful, never smug |
| Voice | The friend who actually read the rulebook |
| Slide types | `cover`, `card`, `quote` (rarely), `end` |

### Pillars

1. **One rule explained**: offside, handball, tennis scoring, badminton service, LBW, travelling, volleyball rotation…
2. **How to play in 6 slides**: the objective and the 4–5 rules a new viewer needs (one sport per post, never "all the rules").
3. **Tricky cases / myths**: "Is it offside if…?", common misconceptions, edge cases from the rulebook.
4. **Why the rule exists**: the incident or problem that created or changed a rule (with dates and sources).
5. **Pojok bulu tangkis**: a recurring series on badminton rules and scoring (Indonesia's favourite sport).

### Accuracy rules (non-negotiable)

- Use the **current official rulebook** of the governing body (e.g. IFAB Laws of the Game, BWF Laws of Badminton, ITF Rules of Tennis, FIBA, FIVB, ICC/MCC Laws of Cricket). Name the law/rule number and edition in the caption.
- Rules change every season. If unsure whether a rule changed recently, say so to the owner instead of guessing. Trials and proposals (e.g. new offside ideas) only when confirmed and clearly labelled as trials.
- When competitions differ (NBA vs FIBA, college vs pro), say which one the deck follows.
- Incidents: real dates, competitions and sources only. Describe what happened and what changed, no blame.

### Images

Every slide has a photo (4–6 distinct photos per deck, each used on at most 2–3 slides): equipment, lines, nets, courts, or players who aren't the point of the photo (silhouettes, archive shots). Follow the image policy in Shared rules. No agency/league match photos, no club or league logos or kits, no brand logos as the subject. Pitch/court diagrams come later with the `figure` slide (see Open items).

### Writing rules

- Language: Indonesian (`lang: id`), plain words, short sentences. Keep terms Indonesian fans actually use (`offside`, `handball`, `deuce`, `tie-break`, `reli`, `kok`, `fault`) and explain any term the first time (e.g. "lawan kedua terakhir").
- Rule names follow common Indonesian usage: tendangan bebas (tidak) langsung, tendangan gawang, lemparan ke dalam, tendangan sudut, kartu merah; bulu tangkis: gim, servis, petak servis.
- One idea per slide. Headline = the point; body ≤ 40 words (2–3 short sentences).
- Use numbers and positions concretely ("both feet", "behind the service line"), not vague words.
- Light humour is fine ("Simpan buat debat VAR berikutnya"). Don't mock players, referees or fans.

### Deck recipe

- **Templates:** `dev/paper-light` (default: light, clean Inter, blue accent; reads like a rulebook), `dev/github-dark` for variety. No `code` slides.
- **Length:** cover + 4–6 cards + end, ≤ 10 total.
- **Cover:** `[cover photo=<id> kicker="SEPAK BOLA • PERATURAN 11"]` style kicker (SPORT • RULE in caps), headline as the question or "X, Dijelaskan dengan Benar" with a `|` break.
- **Cards:** build up in order: objective → basic rule → the tricky part → exceptions → why it exists. Badge numbers on.
- **End:** `[end photo=<id>]` with a save line + `Mau dibahas aturan apa lagi? Tulis di komen.`
- **Caption:** one line + `Sumber: <rulebook, law number, edition>` (rulebook names stay in English) + 2–4 hashtags (`#sepakbola`, `#offside`, `#aturanbola`, `#bulutangkis`…).

```text
template: dev/paper-light
lang: id
title: offside dijelaskan
caption: Aturan yang paling sering diperdebatkan. Sumber: IFAB Laws of the Game 2026/27, Law 11 #sepakbola #offside #aturanbola
---
[cover photo=sport-offside-line kicker="SEPAK BOLA • PERATURAN 11"]
Offside, | Dijelaskan dengan Benar
Berdiri di posisi offside saja belum tentu pelanggaran.
---
[photo=sport-ball-kick]
Posisi offside bukan pelanggaran
Peraturannya jelas: berada di posisi offside bukan pelanggaran. Yang dihukum adalah ikut terlibat dalam permainan dari posisi itu.
---
[end photo=sport-offside-line]
Simpan buat debat VAR berikutnya.
Mau dibahas aturan apa lagi? Tulis di komen.
```

(Short excerpt; the full deck is `src/samples/sports-offside-id.txt`.)

---

## 5. 📊 Peta Angka

**Tagline:** *Indonesia dibaca lewat angka, satu daerah satu cerita.*
A faceless Indonesian account turning official regional statistics into surprising, easy-to-read facts about provinsi, kabupaten/kota and kecamatan.
It should feel like "wait, my kabupaten is #2?!", never like a government report or a ranking that shames a region.
Not an official account: never use BPS/Kemendagri/Kemenkeu logos, and say "Diolah dari data …", not "Data resmi dari …".

| | |
|---|---|
| Purpose | Make regional data surprising and shareable |
| Audience | Indonesian young adults, students, people curious about their own region |
| Reader should think | "Daerahku nomor berapa?", then tag a friend from that region |
| Primary action | Share / comment ("daerahku gimana?") / save |
| Tone | Curious, clear, neutral, respectful to every region |
| Voice | A data nerd who checks everything twice; plain words, no jargon without explanation |
| Slide types | `cover`, `card`, `quote` (rarely), `end` |

### Where the numbers come from (non-negotiable)

- **Only from a NusaStats data pack** (`"format": "carousel-data/1"`) that the owner pastes into the request, produced by `manage.py export_carousel_pack`. If no pack is provided, ask for one. **Never use numbers from memory or the web.**
- Use the pack's `rows`, `unit`, `period`, `source` and `notes` exactly. Every caveat in `notes` must appear on a slide or in the caption.
- **One source per deck.** Never put BPS, Dukcapil and DJPK numbers in the same ranking or comparison, and never compute per-capita figures by mixing sources.
- Round only in the text: at most 2 decimals for indices/percent, whole numbers for people and Rupiah. Large Rupiah in words: `Rp7,5 triliun`, `Rp3,9 miliar`.
- **Indonesian number format:** decimal comma, thousands dot (`89,55`, `582.327`, `15,3%`).
- Name the exact series when BPS has several (e.g. "IPM (UHH Long Form SP2020)"). Never mix series.
- Dukcapil numbers = **registered** residents (administrasi kependudukan), not census results. Say so when the story is about population.
- If a pack's notes say `n = X dari Y` (incomplete), don't call anything "tertinggi/terendah se-Indonesia".

### Fairness rules

- **No shaming.** Never "kabupaten terburuk", "paling tertinggal", or jokes about a region. A low value is a gap to explain, not a verdict.
- At most **1 in 4 posts** may headline a lowest-ranking. Prefer top-end, surprising, or "gap" framing ("Beda 22 tahun umur harapan hidup antar kabupaten").
- When the bottom of a ranking is the same Papua highland kabupaten again, add context (geography, access, cost of living) or don't headline the bottom.
- Don't attribute causes (nickel industry, tourism, migration…) unless the owner supplies a separate source.
- **Never use:** Dukcapil "bottom" rankings for % children / crude death rate / KTP-el coverage (registration artifacts), stunting 2018, blood-type rhesus, "least smokers", divorce framed as a judgement, religion "least diverse".
- Aggregates at kecamatan level or above only. No desa-level or small-group breakdowns.

### Pillars

1. **"Ternyata…" facts**: one surprising comparison (e.g. one kecamatan with more residents than 370 kab/kota).
2. **Top 5**: the five highest in something positive or neutral (density, oldest population, fishers, fiscal independence).
3. **Gap**: highest vs lowest, framed as distance, not winners and losers.
4. **Daerahmu**: one province's kab/kota compared (Kaltim first: home ground), ending with "kabupatenmu nomor berapa?".
5. **Cara baca data**: explain one concept simply (IPM, garis kemiskinan, rasio jenis kelamin, PAD), as a follow-up to a ranking post.

### How data slides are built (until the `chart` slide exists)

- **Cover:** the surprising fact as the headline with a `|` break; subtitle = what's measured + period; kicker = `"DATA • <SOURCE> <YEAR>"`.
- **Ranking cards:** one region per card. Headline = region name (with Kota/Kab. as in the pack). Body starts with the value in accent, `*582.327 jiwa*`, followed by one short line of meaning.
- **Top 5 = countdown:** `number=5` … `number=1` so the reveal is the last card; the #1 card gets `icon=star`, the others `icon=map-pin`.
- **Gap decks:** card 1 = highest, card 2 = lowest, card 3 = the distance in plain words ("5,5× lipat", "beda 22 tahun"), card 4 = what the metric means.
- **Context card (always):** `[icon=book]` headline `Catatan`, body = what the number measures + the pack's caveat, in plain words.
- **End:** `[end]` with `Daerahmu nomor berapa?` + `Tulis di komen, nanti kami cek datanya.`
- **Caption:** hook line + `Sumber: <pack.source>` + `Diolah oleh Peta Angka` + 2–4 hashtags (`#datadaerah`, `#indonesia`, `#statistik`, `#kalimantantimur`…).
- **Templates:** `editorial/midnight` (default: navy + amber reads like a dashboard), `editorial/sage` for explainer decks.
- **Length:** cover + 5–7 slides + end, ≤ 10 total.

```text
template: editorial/midnight
lang: id
title: kecamatan terpadat penduduk
caption: Satu kecamatan, lebih ramai dari 370 kabupaten/kota. Sumber: Ditjen Dukcapil Kemendagri (GIS Dukcapil), diakses Okt 2026 · Diolah oleh Peta Angka #datadaerah #jakarta #indonesia
---
[cover kicker="DATA • DUKCAPIL 2026"]
Satu Kecamatan Ini | Lebih Ramai dari 370 Kabupaten
Jumlah penduduk terdaftar per kecamatan.
---
[number=5 icon=map-pin]
Cilincing, Jakarta Utara
*445.729 jiwa*
---
[number=4 icon=map-pin]
Tambun Selatan, Kab. Bekasi
*450.469 jiwa*, satu-satunya di luar Jakarta di daftar ini.
---
[number=3 icon=map-pin]
Kalideres, Jakarta Barat
*464.076 jiwa*
---
[number=2 icon=map-pin]
Cengkareng, Jakarta Barat
*581.788 jiwa*
---
[number=1 icon=star]
Cakung, Jakarta Timur
*582.327 jiwa*, lebih banyak dari penduduk 370 dari 514 kabupaten/kota di Indonesia.
---
[icon=book]
Catatan
Ini penduduk terdaftar di Dukcapil, bukan hasil sensus. Tanggal rujukan data tidak dicantumkan sumber.
---
[end]
Daerahmu nomor berapa?
Tulis di komen, nanti kami cek datanya.
```

---

## 6. ✏️ English Sehari

**Tagline:** *Satu hari, satu hal kecil tentang bahasa Inggris.*
A faceless account that teaches English to Indonesians, one small, useful thing per post: a word, a verb pattern, a common mistake, a pronunciation trap.
It should feel like "oh, jadi selama ini aku salah", never like a textbook or a test.

| | |
|---|---|
| Purpose | Make English click for Indonesian speakers |
| Audience | Indonesian students, job seekers, workers, anyone learning English (beginner → intermediate) |
| Reader should think | "I'll save this and use it today." |
| Primary action | Save / share / comment (try the word in a sentence) |
| Tone | Friendly, encouraging, a little playful; mistakes are normal |
| Voice | A patient friend who knows where Indonesians usually slip |
| Slide types | `cover`, `word`, `table`, `compare`, `card`, `end` |

### Pillars

1. **Word of the day**: one useful word with meaning, pronunciation, an example and its forms.
2. **Irregular verbs by pattern**: V1–V2–V3 grouped so they stick (`think–thought`, `buy–bought`, `spend–spent`, `send–sent`, `sing–sang–sung`…).
3. **Salah kaprah**: mistakes Indonesians commonly make (`I am agree` → `I agree`, `discuss about` → `discuss`, `very like` → `really like`).
4. **False friends**: words that look like Indonesian but mean something else (e.g. English *actual* ≠ Indonesian *aktual*).
5. **Pronunciation traps**: silent letters, stress, `-ed` endings (`walked` /t/, `played` /d/, `wanted` /ɪd/).
6. **Pairs that confuse**: make vs do, bored vs boring, fun vs funny, say vs tell, borrow vs lend.
7. **Phrasal verbs & everyday expressions**: one situation per post (meeting, chatting, email).
8. **Mini quiz**: question on one slide, answer on the next slide (a carousel can reveal it by swiping).

### Accuracy rules

- Meanings, IPA and verb forms must match a reputable learner's dictionary (Cambridge Dictionary, Oxford Learner's Dictionaries or Merriam-Webster). Name it in the caption when giving IPA or a definition.
- Say which pronunciation you show: `(UK)`, `(US)`, or both. Default: both when they differ.
- `say:` respelling is a friendly approximation in Indonesian spelling, not a replacement for IPA. Keep both.
- When British and American usage differ (spelling, words, verb forms like *learnt/learned*), say so.
- Translations should be natural Indonesian, not word-for-word.

### Writing rules

- Explanations in Indonesian (`lang: id`); English examples in English. Keep it casual (`kamu`, `nggak` is fine).
- One concept per deck. Example sentences short, everyday, and relevant to Indonesian life (kantor, kampus, ojol, nongkrong).
- Highlight the target word in examples with `*word*`.
- Never mock learners' mistakes. "Banyak yang salah di sini" beats "Masa nggak tahu?".

### Deck recipe

- **Templates:** `lexicon/notebook` (default). Use `deep` surface (`surface=deep`) for the cover/end if no photo.
- **Length:** cover + 6–12 slides + end, up to 14 slides (past the `long-deck` hint on purpose). Each slide explains with an example; prefer depth over a bare list.
- **Word-of-the-day deck:** cover → `[word]` → `[table]` (forms, or synonyms/opposites) → `[compare]` (common mistake with it) → `[card]` "Coba pakai: …" prompt → end.
- **Pattern deck (verbs):** cover → 2–3 `[table]` slides grouped by pattern → `[word]` for the trickiest one → `[compare]` → end.
- **Salah kaprah deck:** cover → 3–5 `[compare]` slides → end.
- **Quiz deck:** cover → `[card]` question + "Jawaban di slide berikutnya" → `[compare]` or `[card]` answer → … → end.
- **End:** `[end]` with `Simpan dulu ✏️` + a reply prompt (`Coba bikin kalimat pakai kata ini di komen`).
- **Caption:** one line + dictionary source if IPA/definitions are used + 2–4 hashtags (`#belajarbahasainggris`, `#englishsehari`, `#irregularverbs`, `#vocabulary`…).
- **Fallback until the lexicon features ship** (see Open items): `[word]` → `[card]` with headline = word and body lines `IPA · arti · contoh`; `[table]` → `[card]` with one row per body line (`think → thought`); `[compare]` → `[card]` with `✘ …` / `✔ …` body lines.

```text
template: lexicon/notebook
lang: id
title: verb pola ought
caption: Think jadi thought, buy jadi bought. Ini polanya 👇 Sumber IPA: Cambridge Dictionary #belajarbahasainggris #irregularverbs
---
[cover kicker="IRREGULAR VERBS"]
Think → Thought? | Ini Polanya
6 kata kerja yang V2-nya berakhiran -ought / -aught.
---
[table]
Pola *-ought*
| V1 | V2 / V3 | Arti |
| think | th*ought* | berpikir |
| bring | br*ought* | membawa |
| buy | b*ought* | membeli |
| fight | f*ought* | bertarung |
---
[table]
Pola *-aught*
| V1 | V2 / V3 | Arti |
| teach | t*aught* | mengajar |
| catch | c*aught* | menangkap |
---
[word]
pos: verb · V2/V3 of think
word: thought
ipa: /θɔːt/ (UK) · /θɑːt/ (US)
say: "thot", ujung lidah di antara gigi
meaning: berpikir; mengira
example: I *thought* you were coming.
translation: Kukira kamu mau datang.
---
[compare]
wrong: Yesterday I thinked about it.
right: Yesterday I *thought* about it.
why: Think tidak pakai -ed. Bentuk lampaunya thought.
---
[end]
Simpan dulu ✏️
Coba bikin kalimat pakai "brought" di komen.
```

---

## 7. 📖 Kamus Kecil

**Tagline:** *Kata-kata kita sendiri, yang ternyata jarang kita kenal.*
A faceless account about the Indonesian language: words most people don't know, what KBBI actually says, standard vs non-standard spelling, and where our words came from.
It should feel like "lho, ternyata kata ini dari bahasa Portugis?", never like a grammar teacher correcting people.

| | |
|---|---|
| Purpose | Make people curious and a bit proud of Bahasa Indonesia |
| Audience | Indonesian students, writers, office workers, content creators, word nerds |
| Reader should think | "I'm sending this to the friend who always writes 'resiko'." |
| Primary action | Share / save / comment ("kata lain yang sering salah?") |
| Tone | Curious, warm, light humour, never preachy |
| Voice | A friend who reads KBBI for fun |
| Slide types | `cover`, `word`, `table`, `compare`, `card`, `quote` (rarely), `end` |

### Pillars

1. **Kata hari ini**: a rare or beautiful word with its KBBI meaning, word class and an example (`gawai`, `swafoto`, `luring`…).
2. **Kata serapan**: where a word came from and its original form (Arab, Sanskerta, Belanda, Portugis, Tionghoa/Hokkien, Tamil, Persia, Inggris), e.g. `jendela` ← Portugis *janela*, `kantor` ← Belanda *kantoor*.
3. **Baku vs tidak baku**: spellings people get wrong (`risiko`, `apotek`, `praktik`, `nasihat`…).
4. **Padanan kata asing**: the Indonesian equivalent of a foreign term (`unduh` = download, `daring/luring` = online/offline, `tetikus` = mouse).
5. **Satu kata, banyak arti**: homonyms and polysemy (`bisa` = can / venom), and meanings that shifted over time.
6. **Kata daerah di KBBI**: regional words that made it into KBBI (with the region label).
7. **Imbuhan & bentuk kata**: one affix or a confusing pair per post (`di-` attached vs `di` as preposition, `merubah` vs `mengubah`).
8. **Peribahasa & ungkapan**: one proverb with its meaning and a modern example.

### Accuracy rules (non-negotiable)

- **KBBI VI Daring** (kbbi.kemdikbud.go.id) is the reference for meanings, word class, labels and spelling. Quote definitions exactly and briefly, and cite "KBBI VI Daring" in the caption (and the `note:` field on `[word]` slides). Never paraphrase a definition and present it as KBBI's.
- If KBBI doesn't list a word or a sense, say so ("belum tercatat di KBBI") instead of inventing a meaning.
- Etymology: use KBBI's language label where it has one, plus a scholarly source when making claims (e.g. Russell Jones (ed.), *Loan-Words in Indonesian and Malay*, 2007). If origins are disputed, say "diduga dari…" or leave it out. No folk etymology presented as fact.
- Baku/tidak baku and padanan claims must be checkable in KBBI or Badan Bahasa resources (e.g. Pedoman Umum Pembentukan Istilah, glosarium/padanan istilah).

### Writing rules

- Language: Indonesian (`lang: id`), relaxed but correct. The account's own spelling must be impeccable: no typos, correct baku forms everywhere outside the deliberate "tidak baku" examples.
- Use the word class labels KBBI uses (`nomina`, `verba`, `adjektiva`…) in `pos:`.
- Highlight the target word with `*word*` in examples. Examples should be natural, modern sentences.
- Correct gently: "Yang baku ternyata…" beats "Kamu salah!".

### Deck recipe

- **Templates:** `lexicon/kamus` (default). Use `surface=deep` for cover/end if no photo.
- **Length:** cover + 6–12 slides + end, up to 14 slides (past the `long-deck` hint on purpose). Each slide explains with an example; prefer depth over a bare list.
- **Kata hari ini deck:** cover → `[word]` (meaning, example, origin) → `[card]` the story behind the word → `[table]` related words or padanan → end.
- **Serapan deck:** cover → `[table]` (`Kata | Dari | Bentuk asli`) → 2–3 `[word]` slides with `origin:` → end.
- **Baku deck:** cover → `[table]` (`Baku | Tidak baku`) → 2–3 `[compare]` slides with `wrong-label: Tidak baku` / `right-label: Baku` → end.
- **End:** `[end]` with a comment prompt (`Kata apa yang sering bikin kamu ragu?`).
- **Caption:** one line + `Sumber: KBBI VI Daring` (+ other sources) + 2–4 hashtags (`#bahasaindonesia`, `#kbbi`, `#katabaku`, `#kataserapan`…).
- **Fallback until the lexicon features ship:** same as English Sehari.

```text
template: lexicon/kamus
lang: id
title: baku atau tidak
caption: Sering salah, padahal dipakai tiap hari. Sumber: KBBI VI Daring #bahasaindonesia #katabaku #kbbi
---
[cover kicker="KATA BAKU"]
Kamu Masih Nulis | "Resiko"?
4 kata yang sering salah tulis.
---
[table]
Mana yang baku?
| Baku | Tidak baku |
| *risiko* | resiko |
| *apotek* | apotik |
| *praktik* | praktek |
| *nasihat* | nasehat |
Sumber: KBBI VI Daring
---
[compare]
wrong-label: Tidak baku
right-label: Baku
wrong: Apa resikonya?
right: Apa *risikonya*?
why: KBBI mencatat bentuk bakunya "risiko".
---
[word]
pos: nomina
tag: SERAPAN
word: jendela
meaning: [kutip definisi persis dari KBBI VI Daring]
example: Buka *jendela* biar udaranya segar.
origin: dari bahasa Portugis *janela*
note: Sumber: KBBI VI Daring
---
[end]
Kata apa yang sering bikin kamu ragu?
Tulis di komen, nanti kita bahas.
```

(Example only: replace the `meaning` placeholder with KBBI's exact definition before posting.)

---

## 8. Shared rules

- Don't let any account become a content farm: every deck needs a specific angle, not a generic list.
- No text copied from real TikTok accounts.
- Each account keeps its own default template so feeds look distinct. Borrowing another account's template is fine occasionally, never as a habit.
- Emoji are fine in text (system emoji font); arrows and bookmarks are drawn by the app, don't type them.
- Icons available for `icon=`: alert, arrow-right, book, bookmark, bug, chat, check-circle, circle-arrow, clock, code, coffee, cpu, database, flower, folder, gift, git-branch, heart, heart-spark, home, key, leaf, lightbulb, map-pin, moon, mountain, music, plane, rocket, shield-heart, smile, star, sun, terminal, umbrella (aliases: shield, pin, branch, bulb, check, spark).
- When asked for many posts at once, vary pillar, template and opening hook across them.
- **Fact accounts** (Catatan Kaki Sejarah, Whistle Notes, Peta Angka, English Sehari, Kamus Kecil): list sources in the reply before the deck; never invent a fact, date, number or quote to fill a gap.
- **Image policy** (all accounts):
  - Any image that's free to reuse. First choice: public domain or CC0 (Wikimedia Commons, Unsplash/Pexels, Rijksmuseum, Nationaal Archief), because they need no credit. Never Google Images, Pinterest, news sites, agency photos or other social accounts.
  - No source manifest or source list in the reply is needed for images. Just pick a fitting free image.
  - Only if the licence requires attribution (CC BY / CC BY-SA): put a short credit line in the caption.
  - Images for sample decks are bundled with the app: save a downscaled JPEG to `src/samples/photos/<photo-id>.jpg` (it fills 1080×1920; wide images cropped to ≤ 2160 px wide), reference it with `photo=<photo-id>`, and set a focal point in `src/samples/photos.ts` if the subject isn't centred. Loading the sample adds it to the photo tray automatically.
- Out of scope for this app: screen recordings, video demos. Only photo carousels.

## 9. Open items

- **Handles.** Decks omit `handle:` and fall back to the single handle in Settings, so most accounts will get the wrong handle. Once the owner gives all seven handles, put `handle:` in every deck header.
- **Lexicon features: shipped (M7, Oct 2026).** `[word]`, `[table]`, `[compare]` and `lexicon/notebook` / `lexicon/kamus` are built (see SPEC-lexicon.md); the card fallbacks in the recipes are no longer needed. Note: KBBI VI Daring now lives at kbbi.kemendikdasmen.go.id, and its etymology labels (Por, Skt…) are only shown to logged-in users, so don't print them unless checked while logged in.
- **Fonts vs the brand note.** The brand note says Playfair Display + DM Sans; `editorial/rose-dusk` uses Playfair + Poppins (DM Sans is on `midnight`). Tokens follow DESIGN.md, so this is accepted as-is unless the owner wants a variant change.
- **BPS Papua fix.** No BPS-based Peta Angka decks until the NusaStats ingest fix is merged (26 new-Papua kabupaten were missing from rankings). Dukcapil and DJPK packs are fine now.
- **`chart` slide.** Add `[chart data=<pack-id> kind=bar top=N]` to Carousel Press: paste a `carousel-data/1` pack into a Data tab, rendered as a bar chart in template colours. Until then, rankings are one card per region.
- **`figure` slide + `credit=`.** A slide that shows an image uncropped in a frame (maps, court/pitch diagrams, charts) without the dark photo overlay, plus a `credit="…"` line on photo slides. Needed by Catatan Kaki Sejarah, Whistle Notes and Peta Angka.
- **`editorial/archive` variant.** Sepia paper, dark brown ink, serif, a small year/place label, so Catatan Kaki Sejarah stops borrowing `sage`.