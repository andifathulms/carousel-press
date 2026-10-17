# Channels: content brief for writing decks

Read this before writing any deck. The owner runs thirteen TikTok accounts, and every deck is for exactly one of them.
If a request names an account ("10 posts for Ruang Rasa", "deck for Whistle Notes"), use that account's section.
If it doesn't name one, infer it from the topic and say which one you picked:

- relationships, friendship, family, feelings, self-reflection → **Ruang Rasa**
- code, AI for developers, dev tools → **Fathul Learn Coding**
- Indonesian history, kingdoms, local events, place-name origins → **Sejarah Nusantara**
- sports rules, how a sport works, rule incidents → **Whistle Notes**
- regional statistics, rankings, "kabupaten mana yang paling…" → **Peta Angka**
- English vocabulary, grammar, pronunciation for Indonesians → **Kosakata Inggris**
- Indonesian words, KBBI meanings, kata baku, kata serapan → **Kata Baku**
- Quran ayat, hadith, doa, Islamic reminders → **Ayat Harian**
- Stoicism and philosophy as armor for work, family and comparison stress, dilemmas → **Filsafat Harian**
- exam and selection-test prep (SKD CPNS, sekolah kedinasan, PPPK, BUMN, psikotes) → **SKD Harian**
- Excel, Word, PowerPoint, email and other office tips → **Jago Kantoran**
- Arabic language learning (fusha vocabulary, roots, phrases, basic grammar; not Quran vocabulary) → **Kosakata Arab**
- Mandarin learning (hanzi, pinyin, tones, HSK 1–2) → **Kosakata Mandarin**

The deck format is PRD §4. This file only says *what* to write and which template/attributes to use. It adds no new syntax.

| Account | Language | What it posts | Template family | Default template |
|---|---|---|---|---|
| 🌿 Ruang Rasa (@ruangrasakita.id) | `id` | Lines to send, conversation starters | `editorial/ruang-*` | one per pillar (see §1) |
| 💻 Fathul Learn Coding (@fathul_learncoding) | `id` | Dev tips, AI for devs, learning journey | `dev/*` | `dev/github-dark` |
| 📜 Sejarah Nusantara (@sejarah.nusantara.id) | `id` | Lesser-known Indonesian history | `editorial/*` | `editorial/sage` |
| 🏟️ Whistle Notes | `id` | Sports rules as verdict quizzes | `sport/*` | `sport/papan` (football), `sport/lapangan` (indoor) |
| 📊 Peta Angka | `id` | Regional data from NusaStats packs | `editorial/*` | `editorial/midnight` |
| ✏️ Kosakata Inggris (@kosakata_inggris) | `id` (teaches English) | Daily words, common mistakes, A/B quizzes | `lexicon/*` | `lexicon/notebook` |
| 📖 Kata Baku (@katabaku.id) | `id` | Indonesian words, KBBI, baku, serapan | `lexicon/*` | `lexicon/kamus` |
| 🌙 Ayat Harian | `id` (+ Arabic) | One ayah / hadith a day, calm reminders | `serene/*` | `serene/fajr` |
| 🏛️ Filsafat Harian (@filsafatharian.id) | `id` | Street-level Stoicism: mental armor for work and family stress | `editorial/tameng` | `editorial/tameng` |
| 📝 SKD Harian | `id` | Daily SKD/selection-test questions and strategy | `lexicon/*` | `lexicon/lembar` |
| 🗂️ Jago Kantoran | `id` | Excel, Word, email and office fixes | `dev/*` | `dev/sheet` |
| ✍️ Kosakata Arab (@kosakata.arab) | `id` (teaches Arabic) | Fusha words, roots, phrases for beginners | `lexicon/*` | `lexicon/arab` |
| 🏮 Kosakata Mandarin (@kosakata.mandarin) | `id` (teaches Mandarin) | Hanzi, pinyin and tones for beginners | `lexicon/*` | `lexicon/hanzi` |

---

## 1. 🌿 Ruang Rasa

**Tagline:** *Buat kamu yang susah ngomong duluan.*
A faceless Indonesian account about relationships, friendship, family and self-reflection.
Ruang Rasa writes the words that are hard to say, so the viewer only has to send them. It should feel like "this is exactly what I wanted to tell them", never "someone is telling me how to live my life".

**Direction (owner, Oct 2026 review).** The old decks were question lists: every slide was homework for later, with someone who wasn't there, and the account looked like an info account (badges, icons, three backgrounds per deck, the same dusk cover). Now every slide gives the viewer something right away: a line to send, a choice to make, or something they recognise. Comments ask for one tap, not a paragraph.

**The account is a mouthpiece (owner, Oct 2026 second review).** Young Indonesians avoid conflict and find direct vulnerability hard, so they let a post say it for them. They don't do it by forwarding to parents (who aren't on TikTok). They do it in four ways:
- **TikTok DM / tag:** "ini kamu banget", "baca sampai habis".
- **Repost:** a *kode*. The post sits on their profile until the person sees it. Nothing has to be said.
- **Screenshot** of one slide to a WhatsApp chat, WA story or the family group. This is the only way content reaches orang rumah.
- **Copying the line** into their own chat.

So every send card must work **cold**: the recipient sees only that slide and reads it as a message from the sender. Anything addressed to the sender ("Ganti tempatnya", "Isi titiknya", `____` blanks) gives the script away, and the person sending feels exposed. That embarrassment is exactly what they were avoiding.

The second lesson: the gap is in the **hard** conversations, not the sweet ones. Most people can type "kangen". What they can't type is a request for the money back, a "no", a first apology, a reply to "kapan nikah?", or "kita ini apa?". Those lines get saved *and* sent.

| | |
|---|---|
| Purpose | Say the hard thing for the viewer |
| Audience | Indonesian young adults, 18–27 (students, first jobs, anak rantau) |
| Reader should think | "I want to send this to someone." / "Ini kodeku." |
| Primary action | Share (DM, repost, screenshot), then comment |
| Tone | Warm, intimate, relatable, gently funny; a little *nyesek* is fine, sindiran is not |
| Voice | Anonymous companion; the viewer is the one speaking on "send" cards |
| Slide types | `cover`, `card`, `quote`, `end` |

### Pillars and templates

Each pillar has its own colour, the same on every slide of the deck, so the feed is colour-coded.

| Pillar | Template | Weight |
|---|---|---|
| **Rumah**: orang tua, saudara, kakek nenek, grup keluarga, anak rantau | `editorial/ruang-daun` | ~30% |
| **Sahabat**: sahabat, teman lama, rekan kerja, teman kos | `editorial/ruang-kunyit` | ~25% |
| **Berdua**: PDKT, gebetan, HTS, pasangan, LDR, sebelum menikah, uang | `editorial/ruang-bata` | ~25% (specific angles only, it's the most crowded; at least 1 in 3 Berdua posts is pre-relationship: PDKT, HTS, gebetan) |
| **Diri sendiri**: refleksi, usia 20an, Pertanyaan Malam | `editorial/ruang-malam` | ~20% |

**Obrolan susah** runs across the pillars, not as a pillar of its own: at least 1 in 3 "Kirim ini" posts is a hard conversation. Starters:
- **Uang:** nagih utang ke teman, nolak minjemin, split bill yang nggak adil.
- **Bilang nggak:** nolak ajakan, nolak lembur, nolak titipan, nolak dijodohin.
- **Minta maaf duluan:** to a pasangan, sahabat, or orang rumah.
- **Orang rumah:** "kapan nikah/kerja?", telling them you're resigning, moving out, or not coming home for mudik.
- **Berdua:** "kita ini apa?", ending it gently, asking for space.

### Formats (rotate; never the same format twice in a row)

1. **Kirim ini**: every card is a message the viewer can send as is. Headline = the line (from the viewer's point of view). Body is optional and **only in the sender's voice**, as the second line of the same message ("Nggak harus cerita. Aku temenin diem juga bisa."). No blanks: write a complete line the viewer can personalise. Tips for the sender go on **one** card just before the end: headline `Biar nggak kerasa *copas:*` (or `Sebelum kamu *kirim:*` for heavy topics), 2–3 body lines of ≤ 38 characters each, so every tip fits on one line. End asks for a tag or the line's number.
2. **Kamu yang mana?**: one familiar situation. Card 1 lists options as body lines `A. …` to `D. …`. Next cards: "Kalau kamu A, dia B: …", gentle and practical. No diagnosis and no "right" letter. End: "Komen dua huruf. Contoh: A-B."
3. **Pilih satu (A/B)**: headline = both options, `*A.* Kafe yang ramai | *B.* Masak berdua di rumah` (type a non-breaking space after `*A.*`/`*B.*` so a letter never ends a line, and avoid one long word per option), body = the short question. End: "Komen urutanmu. Contoh: ABBAB." The viewer then asks their person and compares.
4. **Artinya…**: everyday phrases and what they mean. Headline = `“the phrase” | *Artinya: …*` (the meaning is the payoff, so it stays headline size), no body. End: "Kalimat nomor berapa yang paling sering kamu dengar?"
5. **Kamu juga?**: small situations the viewer recognises (headline), plus one kind line (body). End asks for a number.
6. **Pertanyaan Malam #N**: a numbered series, 3 slides: the question (cover with kicker `PERTANYAAN MALAM · #N`), the account's own short answer (`[quote icon=none]`, attribution `— admin Ruang Rasa`), then `[end]` "Giliranmu." **The owner writes the answer slide personally**; the sample deck's answer is a draft to replace.
7. **Kode buat dia**: built to be **reposted**. Every card is one standalone line in the viewer's voice that hints at what they can't say ("Aku nggak minta banyak. *Cukup kabarin kalau sampai.*"). Headline only, no tips card. Keep the hints gentle and honest: never sindiran, never guilt-tripping, never a line about a third person. End: `[end cta="Repost buat dia"]`, ask = "Komen inisialnya. Satu huruf aja."
8. **Ganti kalimatnya #N**: a numbered series for **saves**, not sends. Headline = `“kalimat lama” | *Coba: “kalimat baru”*`, body = why it lands better, then one recap card listing only the new lines, then the end. Kicker `GANTI KALIMATNYA #N · <WHO>`.
9. **Pertanyaan** (the old question list): at most 1 post in 5, only with a strong, specific cover.

### Writing rules

- Language: Indonesian (`lang: id`), casual and warm: `kamu` / `aku` / `kita`, never `Anda`. Light slang is fine (`nggak`, `bikin`, `banget`), don't overdo it.
- Sentence case everywhere. One `*accent*` phrase per headline, on the words that carry the feeling.
- Make the point of view clear. On "send" cards the viewer is "aku". On other cards, talk to the viewer about themselves. Don't write "-ku" lines that read as the account talking to the viewer.
- Use curly quotes `“ ”` in slide text (straight `"` look like inch marks in Fraunces). Keep straight quotes in header lines and `[attr="…"]` values: they're syntax.
- The cover makes a promise; card 1 is the strongest payoff. **Never repeat the cover line as a card.**
- Covers: a scene the viewer knows, a phrase everyone has heard, or a pick-a-side question. ≤ 12 words. The subtitle says what the viewer gets ("5 kalimat pembuka…"), never "N pertanyaan buat…".
- Comment asks are one tap: a letter, a number, an emoji, a tag, an initial, or "satu kata".
- Inclusive by default: don't assume gender, marriage, religion, two parents or a warm home ("orang rumah" over "orang tua" in captions when it fits). Hari Ibu decks are about ibu by definition; their caption still makes room ("atau siapa pun yang jadi ibumu").
- Hard conversations stay kind and firm: the line protects the relationship *and* the viewer's boundary. No scripts that shame, threaten, or manipulate the other person.
- Avoid: generic motivational quotes, cheesy romance, pop/fake psychology ("tanda dia toxic"), manipulative advice, hidden-answer hooks, telling people what a relationship "should" be.
- Before shipping, ask of each send card: **if the recipient saw only this slide, would it read as a message from the sender?**

### Deck recipe

- **Header:** `handle: @ruangrasakita.id` in every deck.
- **Template:** the pillar's `editorial/ruang-*` variant. No photo by default: the cover is the pillar colour. If you use a photo, use a real candid one (hands, a table, a window), different on every post, never the sample dusk.
- **Cover:** `[cover kicker="RUANG RASA · <TOPIC>"]`, headline with one `*accent*`, subtitle. Put the phrase people search for in the subtitle and in the caption's first line ("kata-kata minta maaf ke pacar", "cara nagih utang ke teman", "ucapan hari ibu"). Relationship content gets a lot of search traffic in Indonesia.
- **Cards:** `[number=off icon=none]` on every card. Badges and icons read as a listicle.
- **End:** `[end cta="<the action>"]` (e.g. `Kirim ke dia`, `Kirim ke grup keluarga`, `Repost buat dia`), headline = the one-tap ask, body = how to answer. Not "Simpan • Bagikan".
- **Length:** cover + 4–6 cards (+ the tips card) + end (Pertanyaan Malam: 3 slides). Stay ≤ 10 slides.
- **Caption:** the first line pushes the hook further, the last line repeats the comment ask, plus 2–4 hashtags.
- **Posting:** a soft trending sound on every carousel (chosen in TikTok), a pinned comment with the account's own answer within 10 minutes, and replies to the first comments in the first hour.
- **Calendar:** Hari Ibu (22 Des): start a Rumah run in late November and post the send deck on 20–21 Des so it's ready to be sent on the day. Then natal/tahun baru (pulang atau nggak), gajian (25th: uang decks), Ramadan and Lebaran (“kapan nikah?” scripts, mudik, minta maaf). Valentine is minor here.
- **Track:** shares + reposts per 1,000 views, against the median of the last 10 posts.

```text
template: editorial/ruang-kunyit
handle: @ruangrasakita.id
lang: id
title: pembuka obrolan buat teman lama
caption: Yang paling susah itu chat pertama setelah lama nggak ngobrol. Ini 5 kalimat pembuka, tinggal kirim 🤍 Kamu kepikiran siapa? #temanlama #sahabat
---
[cover kicker="RUANG RASA · TEMAN LAMA"]
Kita nggak pernah berantem. | Cuma *pelan-pelan* jarang chat.
5 kalimat pembuka, biar nggak berhenti di “apa kabar”.
---
[number=off icon=none]
Tadi aku lewat tempat kita dulu, *langsung keinget kamu.*
---
[number=off icon=none]
Biar nggak kerasa *copas:*
Sebut tempatnya: kantin, kos, halte.
Mulai ringan. Yang berat nyusul.
---
[end cta="Kirim ke dia"]
Kamu kepikiran *siapa* dari tadi?
Tag dia di komentar. Nggak usah nulis apa-apa.
```

---

## 2. 💻 Fathul Learn Coding

**Tagline:** *Belajar coding sambil berbagi hal-hal yang berguna buat developer.*
Profile line: `💻 Coding • 🤖 AI • 🛠️ Dev Tools`.
Voice is "I found this useful, here's how it works", not "I'm the expert, listen to me".

**What works (owner data, Oct 2026).** Nine posts, ~16,900 views, 1,330 likes (7.9%), but only 31 followers (≈ 1 per 540 views).
- Best: "7 perintah Linux yang sering kepakai" (3,401 views) and "Salah di Git? Ini 6 cara undo-nya" (2,975), both in `dev/terminal` and both rescue/daily-use topics.
- The six GitHub-dark posts averaged ~1,500.
- People save the tips but don't follow Fathul: every post is a one-off list, and no post shows the learning-in-public voice.

**Direction (owner, Oct 2026 second review): the panicking junior.** The audience is Indonesian bootcamp grads, juniors and students in a tough job market. They swipe past theory. They save the fix for the moment something breaks at work: the terminal command, the git rescue, the error and what it means.
- **Sell relief, not fear.** The hook is a real moment of panic they recognise ("`git push` ditolak di hari pertama kerja?"). The deck answers it calmly ("Tenang, ini 3 baris"), and the save is how they keep that relief for later.
- **Never threaten.** No "biar nggak dipecat", "kamu bakal gagal interview", or "junior zaman sekarang…". That reads cheap and makes an anxious viewer scroll on.

**Bio (owner to set):** "💻 Git, terminal & AI buat developer, tiap minggu. / 🛟 Git Rescue · ⌨️ Terminal Harian · 🧠 Tebak Output / Belajar bareng, bukan menggurui. Porto di komen yang di-pin." (A bio link usually needs ~1,000 followers; until then the portfolio goes in a pinned comment.)

### Series (number every one in the kicker: `GIT RESCUE • #N`)

1. **Git Rescue #N**: one panic, one fix ("Commit ke branch yang salah?"). Every command run in a scratch repo before posting. A recap slide with all commands, a `reset --hard` warning where it applies.
2. **Kerja Nyata #N**: what bootcamps skip and the first month at work demands. Examples: running a project from its README, reading a stack trace, a commit message the team accepts, a first PR and its review, `pull` before you start, rebasing a shared branch, asking a good question in the team chat. Same shape as Git Rescue: the situation, the steps, a recap.
3. **Tebak Output #N**: 3 short snippets (JS, Python, shell). Question slide: `[code]` with the options as body lines; answer slide: "Jawaban: X", the real output as a comment, one-line why. **Every output is run (Node, Python, a real shell) before posting.** Keep code lines ≤ 24 characters so they stay large.
4. **Terminal Harian #N**: one command a day-to-day dev actually uses, with a realistic example.
5. **Catatan Fathul #N** (weekly): first person, a true bug, mistake or "akhirnya aku paham…". Only real stories; the owner writes them.
6. **AI for devs**: problem-first workflows ("AI-nya ngarang fungsi yang nggak ada"), never news or hype.

| | |
|---|---|
| Purpose | Give juniors the fix before they need it |
| Audience | Indonesian bootcamp grads, junior devs, students, AI-curious |
| Reader should think | "I'm saving this for when it breaks." |
| Primary action | **Save** (main metric), then follow |
| Tone | Calm, practical, friendly, concise, slightly nerdy |
| Voice | Fathul learning in public: "belajar bareng, bukan menggurui" |
| Slide types | `cover`, `card`, `code`, `end` (`quote` rarely) |

### Pillars

| Pillar | Weight |
|---|---|
| **Rescue & daily tips** (most saveable): Git rescue, terminal, debugging, VS Code, SQL, snippets | ~40% |
| **Kerja Nyata**: the first-job skills bootcamps skip (series above) | ~20% |
| **AI for developers**: Claude, ChatGPT, Gemini, Copilot, AI IDEs, prompting for code, AI-assisted debugging, honest workflows. The angle is always "how can a developer actually use this?". Not AI news, not "10 tools that will change the world" | ~15% |
| **Learning journey** (Catatan Fathul): things Fathul recently learned, mistakes, debugging lessons. This is what turns savers into followers | ~15% |
| **Concepts** (API, HTTP, databases, JS/Python basics) and **dev tools** | ≤ 10%, at most 1 post in 6 |

Concepts always open **error-first**: the cover is the error or the confusing result people meet ("Jalan di Postman, gagal di browser?"), never "X itu sebenarnya apa?" on its own.

### Writing rules

- Language: Indonesian (`lang: id`), friendly and concise; keep technical terms in English (`commit`, `branch`, `query`, `prompt`).
- Every command or snippet must be correct and runnable as written. **Run it before posting**: git in a scratch repo, shell in a real shell, Node/Python outputs for real. Prefer the common, safe form; add a warning in the body for destructive commands (`reset --hard`, `rm -rf`, `DROP`).
- One command/idea per slide: headline = what it does, body = when you'd use it, code = the exact command, optional note after the fence.
- **Card 1 answers the cover.** If the cover names a command, error or question, that is the first card. In a list deck, the cover's item goes first and the rest follow. A panicking viewer won't swipe to slide 6.
- AI pillar: tools change fast. Don't state prices, model versions, limits or rankings unless the owner confirms them. Describe workflows, not hype.
- Learning-journey decks use first person (`aku`) and admit what was confusing. A `quote` slide works for the "aha" sentence.
- Light humour is fine; usefulness comes first.
- Before shipping, ask: would a junior save this *before* they need it, and find the fix in under 5 seconds when they open it again?

### Deck recipe

- **Header:** `handle: @fathul_learncoding` in every deck.
- **Templates:** `dev/terminal` is the default (Git, shell, AI, tools, concepts). `dev/github-dark` only for JS/Python/SQL code-heavy decks, where colour highlighting helps. Never `dev/paper-light` (that was Whistle Notes' old look).
- **Length:** cover + 4–7 slides + end, ≤ 10 total.
- **Cover:** `[cover kicker="GIT RESCUE • #2"]` or `[cover kicker="GIT • CHEAT SHEET"]` (TOPIC • FORMAT in caps; the first segment becomes the header path, `~/git`). Headline: the moment of panic ("Port 3000 udah dipakai?"), not "N perintah…". On rescue and cheat-sheet decks, end the subtitle with a short save reason, worded differently each post ("Simpan buat pas panik.", "Simpan dulu, kepakai nanti.").
- **Slides:** `[code]` with a fenced block in `bash`, `js`, `py` or `sql` for commands/snippets; plain cards for concepts. Inline `` `code` `` in headlines is fine. Keep code lines short (no wrapping; long lines get shrunk then clipped with `code-line-too-long`).
- **Recap slide**, the slide people actually save: `[code number=off]` "Simpan ini" just before the end, on every rescue, Kerja Nyata and cheat-sheet deck whose commands fit.
  - **One screenshot:** at most 14 code lines.
  - **Labelled:** a `# what it's for` comment line above each command or group (bash comment lines get no `$` prompt).
  - **No repeats without a label.** When two situations share commands, give each its own `# kalau …` group.
  - **Same order as the cards.**
  - Body: one line on how to pick ("Pilih sesuai kondisimu.").
  - Shortcuts go in a plain fenced block with no language, one `shortcut  what it does` per line.
  - Multi-line queries (SQL) that can't fit get no recap; the cover subtitle carries the save cue instead.
- **End (owner, Oct 2026):** a one-tap ask and a reason to follow, never "Simpan dulu" boilerplate: `[end cta="Follow"]` for series ("Pernah *panik* gara-gara Git?" + "Komen 🙋 kalau pernah. Git Rescue #3 minggu depan."), `cta="Simpan"` otherwise. The portfolio sign-off stays on about 1 in 3 posts, as the last body line:
  ```text
  [end cta="Simpan"]
  Shortcut mana yang *paling ngebantu?*
  Satu shortcut di komen.

  Lagi butuh web portofolio atau aplikasi web? Ngobrol aja di *andifathulms.github.io*
  ```
- **Caption:** first line = the panic moment plus the promise of the fix ("Commit di main padahal harusnya di branch fitur? Masih bisa dipindahin."), then 2–4 hashtags (`#belajarcoding`, `#programmer`, `#git`, `#ai`…).
- **Track:** saves per 1,000 views is the main measure of a post. Follows per post is the measure of the account. When saves are high but follows aren't, post the next number of the series sooner and mention it on the end slide.

---

## 3. 📜 Sejarah Nusantara

**Account:** Sejarah Nusantara, `@sejarah.nusantara.id` (put `handle: @sejarah.nusantara.id` in every deck header). Earlier docs called it "Catatan Kaki Sejarah".
**Tagline:** *Yang nggak sempat masuk buku pelajaran.*

**What works (owner data, Oct 2026).** One of the best-performing accounts: "Kesultanan ini pernah dihapus negara" **29.1K** views · "Dipenjara, diceraikan, gelarnya dicabut" (Opu Daeng Risaju) 7.3K · "Bukti tertulis tertua di Nusantara" (Yupa) 5.4K · "Malamnya bertamu, subuhnya mengepung" (Bultiken, a re-upload) 150. People share history they weren't taught. Keep the photo cards. Tell it as it happened, uncomfortable parts included, with sources and without adjectives: the facts carry the weight. The 150-view post was most likely held back as a re-upload or as sensitive military content, not rejected by viewers; for those topics use the sources' own words on the cover, no images of victims, sources in a pinned comment, and rewrite fully when re-uploading.
- **End slides:** a one-tap ask specific to the deck, never the generic "Di daerahmu ada cerita kayak gini?": "Pernah diajarkan di sekolahmu?", "Pernah dengar namanya?", or a real debate ("Arung Palakka: pahlawan atau pengkhianat?").

**Direction (owner, Oct 2026 second review): regional pride and the untaught.**
- **The audience:** Indonesians are proud of their region, and many feel the national curriculum skipped its history.
- **What travels:** the region named in one glance, the hook moment told first, a debate people can take sides on, and sources that win the argument.
- **What it is not:** a cover-up story ("yang disembunyikan"), a fight between ethnic groups, or a 14-slide lecture.
A faceless Indonesian account telling lesser-known stories from Indonesian history, one place or event at a time: kingdoms, local events, place-name origins, objects and people the textbook skipped.
It should feel like "wait, this happened here?", never like a lecture or a political opinion.

| | |
|---|---|
| Purpose | Make people curious about local history |
| Audience | Indonesian teens to adults, students, people proud of their region |
| Reader should think | "I didn't know this, I'm sending it to someone from there." |
| Primary action | **Comment** (one tap or A/B), then share to people from that region |
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
- Body ≤ 30 words per slide (two short sentences at most). One beat of the story per slide.
- The hook must be true. No "rahasia yang disembunyikan", no clickbait the deck can't back up.

### Comments, debate and moderation (owner, Oct 2026 second review)

Comments drive this account's reach, and regional pride is what makes people comment and share. Two rules keep that fuel from turning into a fire:

- **"Yang nggak sempat masuk buku", never "yang disembunyikan".** Don't claim a cover-up the sources don't show. When someone shouts "hoaks", the account's answer is a pinned, sourced comment, and that only works if the deck never overclaimed.
- **Debate, not hate.** A good debate has two positions you can defend from the sources, about a person, a decision or a reading of a text:
  - "Arung Palakka: pahlawan atau pengkhianat?"
  - "20.000 atau 1.020 sapi?"
  - "Naskah mana yang benar?"

  Never frame a question about an ethnic group, a region or a religion ("suku mana yang…", "siapa yang lebih…"). On topics with an ethnic edge (Bubat, Bongaya, Trunajaya), say so in the cover subtitle or first card, and attach the debate to the person or the source, not the group.
- **About 1 in 3 posts ends with a debate:** `[end cta="Komen A atau B"]`, headline = the question with `*A.*` / `*B.*` options, body = "Komen A atau B. Alasanmu di balasan." The other posts end with a deck-specific one-tap ask: "Pernah diajarkan di sekolahmu?", "Orang Palembang, udah tahu soal ini?". Never "Di daerahmu ada cerita kayak gini?".
- **Moderation (owner, in TikTok):**
  - Turn on the comment keyword filter with slurs and ethnic insults.
  - Pin a comment with the sources within 10 minutes.
  - Reply to the top disagreeing comment with a source, not an opinion.
  - Delete comments that attack a group; keep the ones that argue with the history.

### Regions

Each post should wake up a different regional audience, so **rotate regions**: never two posts in a row from the same province. Java is over half the audience and has its own untaught local histories (Banten, Cirebon, Blambangan, Madura, Betawi, Banyumas). Give it at least 1 post in 4 alongside Sumatra, Kalimantan, Sulawesi, Bali–Nusa Tenggara, Maluku and Papua (Papua only when the owner asks, see Sensitive topics).

### Deck recipe

- **Header:** `handle: @sejarah.nusantara.id`.
- **Templates:** `editorial/sage` (default: calm, archival feel, Lora serif), `editorial/midnight` (tragedies, wars, night-time events). Switch to `editorial/archive` once it exists (see Open items).
- **Cover:**
  - Kicker = the region first, then the year: `[cover kicker="KALIMANTAN TIMUR · 1965" photo=<id>]`. Someone from there should recognise it in one second. Use the province, or the city when it's better known.
  - Headline = the hook moment: a surprising true statement with a `|` break.
  - Subtitle = who and where in one sentence.
- **Story deck** (one event), hook first:
  1. **Card 1 is the hook moment itself**, told in full (standard 11).
  2. Then 2–4 cards on how it came to this, in date order.
  3. Then the aftermath, the "today" link, and the end.

  Use `number=off` on story cards.
- **List deck** ("4 nama kota yang…"): cover + 4–6 cards + end. The cover's item is card 1.
- **Length:** 8–10 slides (cover + 6–8 cards + end); at most 12 when the story truly needs it. Details that don't fit go in the pinned comment, not on more slides.
- **Cards:** `[number=off icon=none photo=<id>]`. The editorial family adds an icon automatically, so always write `icon=none`; icons over photos are noise. Headline ≤ 8 words with the year in accent (`*1965*: …`). **Body ≤ 30 words**, two short sentences at most: one beat per slide, readable over a photo on a phone.
- **Quote slide:** a documented quote (with attribution and source only), or a line from a prasasti/chronicle.
- **End:** `[end photo=<cover photo> cta="…"]` with a named action (`cta="Komen A atau B"`, `cta="Komen"`, `cta="Kirim ke orang Kaltim"`), never the default "Simpan • Bagikan".
- **Caption:** first line = the hook plus the region ("Kutai, Kalimantan Timur: …") + `Sumber:` short source list + a credit line if the image licence needs one + 2–4 hashtags including the region (`#sejarahindonesia`, `#kalimantantimur`, `#kutai`).

```text
handle: @sejarah.nusantara.id
template: editorial/sage
lang: id
title: payung sultan kutai dibakar
caption: Kutai, Kalimantan Timur: … Sumber: [sumber terverifikasi] · Foto: [credit] #sejarahindonesia #kalimantantimur #kutai
---
[cover kicker="KALIMANTAN TIMUR · 1965" photo=kutai-kedaton]
Payung Sultan Kutai | Dibakar di Depan Warga
21 Mei 1965, Samarinda. Sultannya ditahan tentara tanpa diadili.
---
[number=off icon=none photo=kutai-mahkota]
*21 Mei 1965*: pusaka dibakar
Pakaian kebesaran dan payung Sultan dibakar di Lapangan Kinibalu, di depan warga yang dikumpulkan.
---
[number=off icon=none photo=kutai-mahakam]
Berawal di tepi Mahakam
…
---
[end photo=kutai-kedaton cta="Komen"]
Kamu baru tahu *soal ini?*
Komen 🙋 kalau baru tahu.
```

(Example only: verify every fact and fill in real sources/credits before posting.)

---

## 4. 🏟️ Whistle Notes

**Tagline:** *Kamu wasitnya.*
A faceless Indonesian account that settles match arguments: one rule, shown on a drawn pitch or court, with the viewer making the call before the answer.
It should feel like "oh, so THAT's why the referee did that", never like reading a rulebook.

**Direction (owner, Oct 2026 review).** The old decks were lectures: 11–12 slides of paragraphs over stock photos, in the coding account's template. Now the account is a game: show the situation, ask for a verdict, reveal it on the next swipe. Rules about positions are drawn, not described.

| | |
|---|---|
| Purpose | Let fans make the call, then show the rule |
| Audience | Indonesian casual fans, new viewers of a sport, people who argue about referee calls |
| Reader should think | "I got 2 out of 3. Sending this to the friend who was wrong." |
| Primary action | Comment (a verdict or a score), then share / save |
| Tone | Clear, confident, a little playful, never smug |
| Voice | The friend who actually read the rulebook |
| Slide types | `cover`, `card` (with `verdict=`), `diagram`, `end` |

### Sports and templates

| Sport | Template | Weight |
|---|---|---|
| Sepak bola, futsal | `sport/papan` | ~40% |
| Bulu tangkis (Pojok Bulu Tangkis series) | `sport/lapangan` | ~25% (15-point countdown to 4 Jan 2027) |
| Voli | `sport/lapangan` | ~15% |
| Basket | `sport/lapangan` | ~10% |
| MotoGP and others | `sport/papan` | ~10% (MotoGP: FIM Grand Prix regulations as the rulebook) |
| Myth-vs-rule posts, any sport | `sport/kapur` | as a format |

Cricket and tennis: no new decks for now (low Indonesian interest); the existing two stay as samples.

### Formats

1. **Kamu Wasitnya** (main format): cover + 3 × (situation, verdict) + optional bonus + end = 8–9 slides. The situation is a `[diagram]` when it's about positions, else a `[number=off]` card; its body ends with the question ("Sah atau offside? Jawab dulu, baru geser."). The verdict is `[verdict="SAH" tone=ok]` (or `warn` / `bad`), headline = the rule in one line, body = one or two sentences + the law number on its own line. Order: an easy one, a myth, a hard one.
2. **Mitos vs Aturan** (`sport/kapur`): each card `[verdict="Mitos" tone=bad]`, headline = the myth in quotes, body starts "Aturannya:" with the key words in `*accent*`.
3. **Habis Pertandingan**: one contested call from a real match within 24–48 hours: what happened (diagram), what the law says, the verdict. Real match, date and minute; describe the call, don't blame the referee; full sources in the pinned comment.
4. **Pojok Bulu Tangkis #N**: numbered series, quiz format, scorelines in the headline (`Skor 15–14. | *Gimnya udah selesai?*`).
5. **Satu Aturan, Satu Diagram**: explainer for rules too complex for a quiz (volleyball rotation): every slide about a position has a diagram; text ≤ 20 words.

### Accuracy rules (non-negotiable)

- Use the **current official rulebook** of the governing body (e.g. IFAB Laws of the Game, BWF Laws of Badminton, ITF Rules of Tennis, FIBA, FIVB, ICC/MCC Laws of Cricket). Name the law/rule number and edition in the caption.
- Rules change every season. If unsure whether a rule changed recently, say so to the owner instead of guessing. Trials and proposals (e.g. new offside ideas) only when confirmed and clearly labelled as trials.
- When competitions differ (NBA vs FIBA, college vs pro), say which one the deck follows.
- Incidents: real dates, competitions and sources only. Describe what happened and what changed, no blame.

### Images

No photos by default: the drawn diagrams and the board colours are the look, and they need no licence. Diagram syntax is PRD §4.9 (fields: football, futsal, badminton, volleyball, basketball, tennis). If a cover photo really adds something (an archive shot for a history incident), it follows the image policy in Shared rules; never league/agency match photos, logos or kits.

### Writing rules

- Language: Indonesian (`lang: id`), plain words, short sentences. Keep terms fans actually use (`offside`, `handball`, `deuce`, `tie-break`, `reli`, `kok`, `fault`, `travelling`) and explain any term the first time.
- Rule names follow common Indonesian usage: tendangan bebas (tidak) langsung, tendangan gawang, lemparan ke dalam, tendangan sudut, kartu merah; bulu tangkis: gim, servis, petak servis.
- ≤ 20 words a slide (verdict body: ≤ 2 sentences + the law number). Headlines are drawn in capitals, so write them in sentence case with one `*accent*` phrase.
- Use numbers and positions concretely ("1,15 meter", "posisi 6 lebih dekat ke net"), not vague words.
- Light humour is fine ("Tag teman yang tadi teriak 'itu offside!'"). Don't mock players, referees or fans.

### Deck recipe

- **Template:** `sport/papan` for football, `sport/lapangan` for indoor sports, `sport/kapur` for myth posts.
- **Length (owner, Oct 2026):** 6–10 slides.
- **Cover:** `[cover kicker="SEPAK BOLA • LAW 11 • KAMU WASITNYA"]` (SPORT • LAW • FORMAT), headline = the counter-intuitive fact or the challenge, subtitle = how to play ("Tebak dulu, baru geser.").
- **End:** `[end cta="Simpan buat debat VAR"]`, headline = the score ask ("Skor kamu *berapa dari 3?*"), body = "Komen angkanya." + a tag line.
- **Caption:** the first line pushes the hook further; then `Sumber: <rulebook, law number, edition>` (rulebook names stay in English) + 2–4 hashtags. The full source list goes in a pinned comment.
- **Posting:** match days for football and badminton; a punchy trending sound; reply to wrong verdicts with the law number, kindly.

```text
template: sport/papan
lang: id
title: kamu wasitnya offside
caption: Tiga situasi, satu bendera. Tebak dulu sebelum geser, terus komen skormu. Sumber: IFAB Laws of the Game 2026/27, Law 11 #sepakbola #offside
---
[cover kicker="SEPAK BOLA • LAW 11 • KAMU WASITNYA"]
3 situasi. | Kamu *wasitnya.*
Tebak dulu, baru geser. Skor kamu berapa dari 3?
---
[diagram number=off]
Sejajar bek kedua terakhir saat dioper.
Sah atau offside? Jawab dulu, baru geser.
```football
line 30 garis offside
gk 50,4
def 34,30
att 72,30
att 40,62
pass 40,62 -> 72,30
```
---
[verdict="Sah" tone=ok]
Sejajar itu *onside.*
Offside kalau lebih dekat ke garis gawang daripada bola dan lawan kedua terakhir.
Law 11.1
---
[end cta="Simpan buat debat VAR"]
Skor kamu *berapa dari 3?*
Komen angkanya.
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

## 6. ✏️ Kosakata Inggris

**Account:** Kosakata Inggris, `@kosakata_inggris` (put `handle: @kosakata_inggris` in every deck header). Earlier docs called it "English Sehari".
**Tagline:** *Satu hari, satu hal kecil tentang bahasa Inggris.*
**Bio (owner to set):** "📖 Kata hari ini, tiap hari. Plus salah kaprah bahasa Inggris yang sering kita pakai. Simpan, pakai!" (The live bio has a typo, "serih", Oct 2026.)
A faceless account that teaches English to Indonesians, one small, useful thing per post: a sentence people get wrong, a word with a surprising meaning, the natural way to say something.
It should feel like "oh, jadi selama ini aku salah" or "untung aku tahu sebelum ngomong", never like a textbook or a test.

**What works (owner data, Oct 2026: 41 followers, 721 likes).**

| Cover as posted | Views |
|---|---|
| Di London, pants itu celana dalam | **3,792** |
| "He said me"? Harusnya "He told me" | **3,544** |
| Nulis "your welcome"? Harusnya "you're" | 1,122 |
| "I live here since 2020" belum tepat | 1,028 |
| "I did a mistake"? Harusnya made | 724 |
| Walked itu satu ketukan, bukan wal-ked | 710 |
| 11 kalimat Inggris yang sering salah | 630 |
| Think jadi thought? Ini polanya | 382 |

Two kinds of cover win, by about 5× over lists and grammar patterns:
- **The exact sentence people say, in quotes, and it's wrong:** "He said me".
- **A surprising and slightly embarrassing meaning:** pants = celana dalam.

Lists ("11 kalimat") and patterns ("Think jadi thought") are the weakest. Both winners are now numbered series (see Formats).

**Direction (owner, Oct 2026 second review): the keminggris anxiety, both sides.** Most Indonesians have basic English but are afraid of looking stupid. *Keminggris* is also the word for mocking someone who sprinkles English to look clever. So the fear runs two ways: "my English is wrong" **and** "I'll sound try-hard".
- **The promise:** English that sounds *normal* in real situations (kantor, chat, interview, travel), not textbook English and not show-off English.
- **No mocking, ever:** the account may laugh at the school script ("I'm fine, thank you, and you?"), never at a person or group, Jaksel speakers included.

### Formats (rotate; never the same format twice in a row, except Kata hari ini)

1. **Kata hari ini #N** (daily, 4 slides): cover with the word big and a one-line hook (kicker `KATA HARI INI · #N`) → `[word]` (IPA + meaning from Cambridge/Oxford) → a one-line situation or mini quiz `[card]` → end "Besok: Kata hari ini #N+1." with `cta="Follow"`. This delivers the bio's promise and is the follow engine.
2. **Salah ngomong #N** (proven, 3,544): the cover quotes the exact wrong sentence ("He said me"?) and the fix. Slide 2 is that sentence fixed (`[compare]`) or the A/B quiz on it, then 3–5 more `[compare]`s or quiz rounds of the same family, then the end "Kamu tadi jawab *A atau B?*".
3. **Beda arti #N** (proven, 3,792): UK vs US, false friends, words that mean something embarrassing or surprising somewhere else ("pants itu celana dalam", "fabric itu kain"). Slide 2 is the cover's word. Keep it clean: surprising, not vulgar.
4. **Bahasa sekolah vs aslinya #N** (new): the script everyone learned at school vs what people actually say ("I'm fine, thank you, and you?" → "Not bad, you?" / "Pretty good"). When the school version is grammatical, **don't use `[compare]`**: it always strikes through the left box, which says "salah". Use a card instead: `[card kicker="<situation>" number=off]`, headline = the natural phrase, body = `Di sekolah: “…”` + the why line starting *Nggak salah, cuma kaku*. (A no-strike compare style is proposed in Open items.) Use `[compare]` only for real mistakes. Never call correct English "salah".
5. **Artinya apa? #N** (new, slang decoder): 4–5 slang words or abbreviations Indonesians see in comments, series and games. Each `[word]` gets meaning, an example, and a **"Pakai di:" line**, e.g. `nongkrong ✅ · chat kantor ⚠️ · email ❌`. The point is to *understand* it, not to show off with it. No vulgar, sexual or drug slang, nothing that mocks a group.
6. **Interview #N / Kantor #N** (new, high saves): one high-stakes situation per deck ("Tell me about yourself", "What's your weakness?", replying to a boss, a meeting phrase), with natural phrases to copy and one card of the stiff vs natural answer. Recap slide with every phrase before the end.
7. **Sering salah dibaca #N** (pronunciation): one trap per deck (-ed, silent letters, stress), with `say:` respelling and IPA.
8. **Patterns** (irregular verbs, make vs do): lowest priority (382 views), only with a mistake-hook cover, never the rule first.

### Slide order and endings

- **The cover is the hook.** Quote the exact sentence or name the surprising meaning, ≤ 8 words in the headline. Never "N kalimat yang…" or a grammar term as the cover.
- **Card 1 answers the cover** (standard 11): slide 2 is the cover's sentence fixed, or its A/B quiz, or the cover's word. Never the rule.
- **One-tap comment asks:** "A atau B?", "UK atau US?", "kata mana yang dulu kamu baca lengkap?". Don't ask learners to write a whole English sentence in public.
- **End lines** are specific to the deck and never the same on consecutive posts; the CTA names the action (`cta="Simpan"`, `cta="Follow"`). Series ends name the next number ("Salah ngomong #3 besok lusa.").
- **Search words** in the caption's first line ("Kesalahan bahasa Inggris yang sering dipakai orang Indonesia."), hashtags `#belajarbahasainggris`, `#kosakatainggris` + one topic tag.
- **Rhythm:** Kata hari ini daily, plus 2–3 bigger decks a week, rotating Salah ngomong and Beda arti first (proven) with one new format a week.

| | |
|---|---|
| Purpose | English that sounds normal, without the fear |
| Audience | Indonesian students, job seekers, office workers learning English (beginner → intermediate) |
| Reader should think | "Untung aku tahu sebelum ngomong." / "I'll save this." |
| Primary action | Save and share ("kirim ke teman yang suka bilang he said me"), then a one-tap comment |
| Tone | Friendly, encouraging, a little playful; mistakes are normal |
| Voice | A patient friend who knows where Indonesians usually slip |
| Slide types | `cover`, `word`, `table`, `compare`, `card`, `end` |

### Accuracy rules

- Meanings, IPA and verb forms must match a reputable learner's dictionary (Cambridge Dictionary, Oxford Learner's Dictionaries or Merriam-Webster). Name it in the caption when giving IPA or a definition.
- **Slang and abbreviations:** the meaning must be in Cambridge, Merriam-Webster, Oxford or Dictionary.com (slang section). Never Urban Dictionary alone. Say if a word is informal, dated or mainly American/British.
- **"Natural" claims:** when a deck says what people "actually say", the phrase must appear as an example or entry in one of those dictionaries or a major learner resource (Cambridge, British Council, BBC Learning English). Don't invent "native speakers always say…".
- Say which pronunciation you show: `(UK)`, `(US)`, or both. Default: both when they differ.
- `say:` respelling is a friendly approximation in Indonesian spelling, not a replacement for IPA. Keep both.
- When British and American usage differ (spelling, words, verb forms like *learnt/learned*), say so.
- Translations should be natural Indonesian, not word-for-word.

### Writing rules

- Explanations in Indonesian (`lang: id`); English examples in English. Keep it casual (`kamu`, `nggak` is fine).
- One concept per deck. Example sentences short, everyday, and relevant to Indonesian life (kantor, kampus, ojol, nongkrong, interview).
- Highlight the target word in examples with `*word*`.
- Never mock learners' mistakes or anyone's English. "Banyak yang salah di sini" beats "Masa nggak tahu?". *Kaku* (stiff) is not *salah* (wrong): say which one it is.
- Before shipping, ask: would someone who's nervous about English save this, and would they feel smarter, not judged?

### Deck recipe

- **Header:** `handle: @kosakata_inggris`, `template: lexicon/notebook`, `lang: id`.
- **Length:** 8–12 slides (the two winners had 10). Compact: every slide teaches something with an example, nothing is there just to fill space. Kata hari ini stays at 4.
- **Cover:** `[cover kicker="<SERIES> · #N"]` for series (`SALAH NGOMONG · #2`, `BEDA ARTI · #2`, `ARTINYA APA? · #1`, `INTERVIEW · #1`), otherwise the topic in caps. Use the `deep` surface for cover/end (the notebook template does this by default).
- **Salah ngomong deck:** cover → A/B quiz `[card]` or the cover's `[compare]` → 3–5 more `[compare]`s or quiz rounds → end.
- **Beda arti deck:** cover → the cover's word as `[word]` (both meanings, region labelled) → 4–6 more `[word]` or `[compare]` → end with "Kamu tim *UK atau US?*"-style ask.
- **Sekolah vs aslinya deck:** cover → the cover's script as a natural-vs-school card → 3–5 more → a recap `[table]` (Sekolah | Aslinya) → end.
- **Artinya apa? deck:** cover → 4–5 `[word]` (meaning, example, "Pakai di:" in the note line) → end.
- **Interview/Kantor deck:** cover → the stiff vs natural card (same card pattern as Sekolah vs aslinya; `[compare]` only for a real mistake) → 3–4 phrase `[card]`s or `[word]`s → recap `[table]` or `[card]` with every phrase → end.
- **Word-of-the-day deck:** cover → `[word]` → `[card]` situation or quiz → end.
- **End:** `[end cta="…"]` with a deck-specific line and a one-tap ask (see "Slide order and endings").
- **Caption:** one line with search words + dictionary source if IPA/definitions are used + 2–4 hashtags (`#belajarbahasainggris`, `#kosakatainggris`, `#englishslang`, `#interviewbahasainggris`…).

```text
handle: @kosakata_inggris
template: lexicon/notebook
lang: id
title: salah ngomong said told
caption: Kesalahan bahasa Inggris yang sering dipakai orang Indonesia: said vs told. Sumber: Cambridge Dictionary #belajarbahasainggris #kosakatainggris
---
[cover kicker="SALAH NGOMONG · #1"]
“He Said Me”? | Harusnya “He Told Me”
Say dan tell sama-sama berarti bilang, tapi polanya beda.
---
[compare]
wrong: He said me to wait.
right: He *told* me to wait.
why: Tell langsung diikuti orangnya. Say tidak: say *to* me, atau say something.
---
[end cta="Simpan"]
Kamu tadi jawab *A atau B?*
Komen satu huruf.
```

---

## 7. 📖 Kata Baku

**Account:** Kata Baku, `@katabaku.id` (put `handle: @katabaku.id` in every deck header). Earlier docs called it "Kamus Kecil".

**Tagline:** *Kata-kata kita sendiri, yang ternyata jarang kita kenal.*
A faceless account about the Indonesian language: words most people don't know, what KBBI actually says, standard vs non-standard spelling, and where our words came from.
It should feel like "lho, ternyata kata ini dari bahasa Portugis?", never like a grammar teacher correcting people.

**What works (owner data, Oct 2026, second update).**

| Cover as posted | Views |
|---|---|
| 11 kata indah yang jarang dipakai | **4,959** |
| Mempesona atau memesona? | **4,252** |
| Merubah jadwal? Rubah itu nama hewan | **3,780** |
| Acuh itu peduli, bukan cuek | 713 |
| Cek KBBI: "email" bukan surat elektronik | 693 |
| Soto Banjar, tapi jeruk bali | 628 |
| Kamu masih nulis "resiko"? | 465 |
| Kata sehari-hari dari bahasa Portugis | 344 |

**Two engines, about 5–10× everything else:**
1. **Kata Indah, the verified kind** (saves, shares). Words that really are in KBBI, for captions, bios and vows.
2. **Mana yang baku?** (comments). A two-spelling question people argue about before checking ("mempesona atau memesona?"), or a mistake taken literally as a joke ("rubah itu nama hewan").

Weak: finger-pointing covers, trivia with no use (serapan), padanan and plain rule lists.

**Direction (owner, Oct 2026 second review): the anak indie aesthetic, kept honest.**
- **Who it serves:** young writers and romantics who want beautiful Indonesian words for captions, bios and wedding vows. That is the biggest audience.
- **Where it's crowded:** the senandika niche is full of copied lists, and several viral "kata indah" (swastamita, nabastala, anindya…) aren't in KBBI. The account's edge is in the handle: **kata indah yang benar-benar ada, dipakai dengan benar**.
- **Alternate the two engines.** The aesthetic one grows saves and shares; the baku debates grow comments. Neither alone.

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

### Formats (in order of proven pull; alternate 1 and 2)

1. **Kata Indah #N** (series, saves and shares): words that are really in KBBI, one `[word]` slide each, a recap `[table]` near the end (`| Kata | Kelas |`, words and KBBI word class only, never shortened meanings), and an end that asks viewers to use one word in a sentence. Kicker `KATA INDAH #N · KBBI VI`. Say "yang benar-benar ada di KBBI": that's the account's edge over copied lists.
   - **Caption-ready:** every word's `example:` is a line someone would actually post (a caption, a bio, a line for a partner), not a textbook sentence.
   - **Usage note** in `note:` when the word is easy to misuse, e.g. "nomina: *renjana*, bukan *merenjana*". Keep "Sumber: KBBI VI Daring" in the note.
   - **Themes:** senja, hujan, rindu, laut, **untuk pasangan / undangan pernikahan**, **untuk ibu** (Hari Ibu, 22 Des), kerja, kota.
   - **Debunk opener on some numbers:** a famous word that isn't in KBBI, then the real ones.
2. **Mana yang baku? #N** (series, comments): the cover is the two spellings as a question ("Mempesona atau | Memesona?").
   - Card 1 is the answer with the one rule behind it (e.g. *k, t, s, p* luluh).
   - Then 3–5 more pairs, as `[compare]` with `wrong-label: Tidak baku` / `right-label: Baku`, or quiz rounds.
   - End: "Kamu tadi jawab *yang mana?*" / "Komen A atau B."
3. **Salah kaprah** (literal joke): an everyday mistake, with a cover that takes the wrong form literally ("Merubah jadwal? Rubah itu nama hewan."). Then `[compare]` slides, plus a `[word]` slide that pays off the joke (`rubah`, the animal).
4. **Salah arti**: meanings people get backwards ("Acuh itu peduli, bukan cuek."). End: "Selama ini kamu pakai yang mana? Jujur aja."
5. **Kata indah palsu** (occasional, comments and shares): viral "kata indah" that aren't in KBBI, the closest real word for each, and where the viral one probably came from (only if a source says so).
6. **Aturan with a twist** (EYD), **serapan**, **padanan**: at most 1 post in 5, only with a strong hook that frames something the viewer uses ("Soto Banjar, tapi jeruk bali."). Never a plain rule list or trivia.

### Covers and endings

- Cover formulas: take the mistake literally · the meaning is the opposite · "the famous one isn't real" (swastamita) · a numbered collection with the KBBI promise · two cases, one rule. **Avoid** "Kamu masih nulis…": it points a finger (post 1).
- The end line is specific to the deck type, never the same on consecutive posts: Kata Indah "Pakai satu kata tadi *dalam satu kalimat.*" · Salah kaprah "Kesalahan mana yang *paling bikin gatal?*" · Salah arti "Selama ini kamu pakai *yang mana?*" · Serapan "Tebak: kata mana lagi *yang dari Portugis?*" · Aturan "Tag teman yang *paling sering salah soal ini.*"
- Captions: the first line pushes the hook further in search words ("Kata indah bahasa Indonesia yang beneran ada di KBBI."), then sources, then 3–4 hashtags (`#bahasaindonesia`, `#kataindah` or `#katabaku`, `#kbbi`).
- Rhythm: follow a winner fast (the next number of a working series within the week), 3–4 posts a week alternating Kata Indah and Salah kaprah.

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
- **Length (owner, Oct 2026):** 8–14 slides. Compact: every slide teaches something with an example, nothing is there just to fill space. Go up to 14 only when the topic needs it.
- **Kata hari ini deck:** cover → `[word]` (meaning, example, origin) → `[card]` the story behind the word → `[table]` related words or padanan → end.
- **Serapan deck:** cover → `[table]` (`Kata | Dari | Bentuk asli`) → 2–3 `[word]` slides with `origin:` → end.
- **Baku deck:** cover → `[table]` (`Baku | Tidak baku`) → 2–3 `[compare]` slides with `wrong-label: Tidak baku` / `right-label: Baku` → end.
- **Header:** `handle: @katabaku.id`, `template: lexicon/kamus`, `lang: id`.
- **Kata Indah deck:** cover (kicker `KATA INDAH #N · KBBI VI`) → optional myth card → `[word]` × 6–8 (caption-ready `example:`, usage note when needed) → recap `[table]` → end. Up to 8 words, so the recap fits one table. 10–12 slides.
- **Mana yang baku? deck:** cover (kicker `MANA YANG BAKU? · #N`) → card 1: the cover's answer + the rule → 3–5 `[compare]` or quiz pairs → optional recap `[table]` (`Baku | Tidak baku`) → end with an A/B ask. 8–11 slides.
- **Unverified words:** KBBI VI Daring can't be fetched by scripts. When a deck was drafted without opening KBBI by hand, list every word in `docs/deck-sources.md` under the deck with "cek KBBI manual sebelum posting", and the owner checks before posting.
- **End:** `[end cta="…"]` with the deck-type line from "Covers and endings".
- **Caption:** one line + `Sumber: KBBI VI Daring` (+ other sources) + 2–4 hashtags (`#bahasaindonesia`, `#kbbi`, `#katabaku`, `#kataserapan`…).
- **Fallback until the lexicon features ship:** same as Kosakata Inggris.

```text
template: lexicon/kamus
lang: id
title: baku atau tidak
caption: Sering salah, padahal dipakai tiap hari. Sumber: KBBI VI Daring #bahasaindonesia #katabaku #kbbi
---
[cover kicker="KATA BAKU"]
Analisa, Nafas, Karir: | Ketiganya Tidak Baku
Plus 4 kata lain yang sering salah tulis.
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
[end cta="Simpan"]
Kesalahan mana yang *paling bikin gatal?*
Tulis di komen.
```

(Example only: replace the `meaning` placeholder with KBBI's exact definition before posting.)

---

## 8. 🌙 Ayat Harian

**Tagline:** *Satu ayat, satu hari. Pengingat kecil untuk hati.*
A faceless Indonesian account sharing one Quran ayah (or one authentic hadith) a day, with its translation and a short, gentle reflection.
It should feel like a quiet moment in a noisy feed: calm, sincere, never preachy, never sensational. The owner's intention is a good deed, so **accuracy matters more than reach**: one wrong letter, wrong translation or fake hadith undoes the purpose.

**Direction (owner, Oct 2026 review).** Engagement is strong (an early post had a 12% like rate); reach is what's missing. Each post now opens with a calm cover that says who the ayah is for and carries the phrase people search for ("Ayat penenang hati"). The ayah follows unchanged. Tafsir and Renungan labels are small so the words lead, and each post ends with one line specific to it. None of this touches the accuracy rules.

| | |
|---|---|
| Purpose | Share Quran and Sunnah as a daily reminder |
| Audience | Indonesian Muslims of all ages, busy people scrolling who need a pause |
| Reader should think | "Ini pas banget buat hari ini." Then save it or send it to someone |
| Primary action | Save / share |
| Tone | Calm, warm, humble, hopeful |
| Voice | A fellow learner sharing a reminder, "pengingat untuk diri sendiri dan kita semua", never a preacher or a judge |
| Slide types | `cover` (every post), `ayah`, `hadith`, `quote` (tafsir), `card` (renungan), `end` |

### Pillars

1. **Ayat hari ini**: one short ayah (or a clearly marked portion) + Kemenag translation + one reflection line.
2. **Hadis pilihan**: one authentic hadith (sahih/hasan) with takhrij and grading.
3. **Doa dari Al-Qur'an**: the prayers in the Quran (e.g. "Rabbana…" duas), with when people commonly read them.
4. **Tematik**: short series on one theme across days (sabar, syukur, orang tua, rezeki, harapan, taubat).
5. **Kosakata Al-Qur'an**: one Quranic word, its root and meaning, shown in the ayah where it appears (pairs well with learning Arabic).
6. **Momen**: Jumat, Ramadan, Dzulhijjah, the start of the Hijri year: a fitting ayah or hadith, no dates or rulings beyond what's verified.

### Accuracy rules (non-negotiable)

- **Never write Arabic text, translations or hadith from memory or generate them.** Copy them exactly from the sources below, and list the exact source URL for every ayah/hadith in the reply before the deck. If a source can't be checked, leave a `[SALIN …]` placeholder and tell the owner.
- **Quran Arabic text:** Tanzil.net (Uthmani text; keep its attribution and don't modify the text) or the Quran Kemenag site (quran.kemenag.go.id). Use one source consistently.
- **Indonesian translation:** Terjemahan Kemenag RI (quran.kemenag.go.id), quoted verbatim. Cite it in `source:` and in the caption.
- **Hadith:** only sahih or hasan, with the book + number and a named grading authority. Prefer Bukhari/Muslim. Reliable references: HadeethEnc (hadeethenc.com, which has Indonesian translations and grading) and Sunnah.com. **No hadith that only circulates on social media, no "hadis" without takhrij, no weak or fabricated narrations, even with good messages.**
- **Ayah portions:** quoting part of an ayah is fine, but mark it (`portion: true`) and never cut it in a way that changes the meaning.
- **Tafsir slide (owner rule, Oct 2026):** every Quran post has a Tafsir slide between the ayah and the Renungan: `[quote kicker="Tafsir" icon=none]`, the quote on the first line, then `— Tafsir Ringkas Kemenag RI` (plus ` · dikutip sebagian` for an excerpt) as the attribution. Quote Tafsir Ringkas Kemenag RI (the `wajiz` text behind quran.kemenag.go.id) verbatim: the whole entry if it fits, otherwise whole sentences. Mark a cut inside a sentence with "…". Never paraphrase it, and pick sentences that don't change the meaning. Hadith posts have no tafsir slide.
- **Reflection ("Renungan") is not tafsir.** Keep it to 1–2 gentle sentences that stay close to the plain translation, on `[card kicker="Renungan"]` with the reflection as the headline. If explaining meaning, cite a tafsir (Tafsir Kemenag, Tafsir Ibnu Katsir, Tafsir Al-Muyassar) by name, and keep it short.

### What this account never does

- No fiqh rulings or fatwas, no khilafiyah debates, no sectarian or political content, no judging groups or people.
- No "scientific miracle", numerology, dream or viral miracle stories, and no health or cure claims.
- No guilt or pressure framing ("share kalau kamu beriman", "dosa kalau di-skip"), and no engagement bait ("ketik aamiin", "jangan di-skip").
- No promise framing on covers or end slides ("ayat ini bikin rezeki lancar", "pasti dikabulkan").
- No people or animals in images; no music recommendations in the post. Prefer text-only slides; nature photos rarely, heavily darkened.
- No affiliate links or product promotion on this account.
- Before posting, the owner reads every Arabic line against the source. For hadith posts, a check by someone knowledgeable (e.g. a local ustadz) is recommended.

### Writing rules

- Language: Indonesian (`lang: id`), gentle and simple: `kita`, `semoga`, `mari`. Use common Indonesian Islamic terms (`ayat`, `hadis`, `doa`, `sabar`, `syukur`).
- Write surah names the way Kemenag does (e.g. `Ar-Ra'd`, `Al-Baqarah`), formatted `QS. <Surah> [<no>]: <ayat>`.
- **Honorifics in Arabic (owner rule, Oct 2026), never Swt./saw./as./ra.:** `Allah سبحانه وتعالى`, `Nabi Muhammad ﷺ` / `Rasulullah ﷺ` (the single character U+FDFA), a prophet + `عليه السلام`, a sahabah + `رضي الله عنه` (`عنها` for a woman). Join the words of a phrase with no-break spaces (U+00A0) so it never wraps mid-phrase. Copy the phrases from these lines or a source text; the app draws them in Amiri (the bundled Amiri lacks the newer one-character ligatures for the others, so they're written out). This applies to our own text; if a quoted source uses an abbreviation, prefer an excerpt without it.
- Keep slides short. Arabic + translation is the whole message; the reflection is optional.

### Deck recipe

- **Templates:** `serene/fajr` (default, morning posts), `serene/isya` (evening posts). Nothing else.
- **Length:** Quran posts 4–5 slides: `[cover]` → `[ayah]` → Tafsir (`[quote kicker="Tafsir"]`) → optional Renungan (`[card kicker="Renungan"]`) → `[end]`. Two short ayat may share one tafsir slide after them.
- **Hadith posts:** `[cover]` → `[hadith]` → optional Renungan → `[end]` (3–4 slides).
- **Cover (every post):** `[cover kicker="<SEARCH PHRASE>"]`. The kicker is what people type ("AYAT PENENANG HATI", "DOA UNTUK ORANG TUA", "HADIS TENTANG MENAHAN MARAH"). The headline says who or what moment the ayah is for, in our own words, with one `*accent*` ("Untuk kamu yang merasa bebannya *terlalu berat* hari ini."). The subtitle names the reference ("Satu ayat untuk malam ini · QS. Al-Baqarah [2]: 286"). Calm and true to the ayah: no promises, no urgency. Series covers keep the series name and day ("Sabar · Hari 1").
- **Long ayat:** if the Arabic doesn't fit (`arabic-too-long`), use a shorter portion. Never split one ayah across slides.
- **End:** one line specific to the post, plus a soft action: `[end cta="Kirim"]` + "Kirim ke satu orang yang *sedang merasa berat.*" / "Untuk siapa doa ini *kamu kirim pagi ini?*" / "Ayat mana yang paling *menenangkan hatimu?*" + a short second line. Don't reuse the same end slide on consecutive posts.
- **Caption:** the first line = the search phrase + who it's for ("Ayat penenang hati, untuk pikiran yang sedang penuh."), then `Teks Arab: <source> · Terjemahan: Kemenag RI` (or hadith `ref` + grade + source), then 3 hashtags: `#ayatharian` or `#hadis`, one that matches a search (`#ayatpenenanghati`, `#doauntukorangtua`, `#ayattentangsabar`), and `#pengingatdiri`.
- **Rhythm:** one post a day at a fixed time (fajr after Subuh, isya after Isya; test 05:30 and 20:00 WIB), alternating ayah and hadith days, a Jumat post weekly, and numbered series ("Doa dari Al-Qur'an #N", 7-day themes).
- **Sound:** a murottal of the same ayah from TikTok's library, or none. No music.
- **Arabic in the app: shipped (M8, Oct 2026).** `[ayah]`, `[hadith]`, the Amiri faces and `serene/*` are built (see SPEC-ayah.md), so Arabic is posted through the app.
- **How the shipped samples were made:** Arabic copied by script from the Tanzil Uthmani text file (tanzil.net), translations from the Kemenag API behind quran.kemenag.go.id, hadith (Indonesian text, Arabic matn, grade, book number) from HadeethEnc. Nothing was typed by hand; a portion is cut by whole words from the source line. Avoid verse 1 of a surah from the Tanzil file (it carries the basmala) and ayat whose Kemenag translation has a footnote unless the footnote is shown. The Oct 2026 restructure moved these lines by script and checked them byte for byte.

```text
template: serene/fajr
lang: id
title: hati yang tenang
caption: Ayat penenang hati, untuk pikiran yang sedang penuh. Teks Arab: Tanzil (tanzil.net) · Terjemahan: Kemenag RI #ayatharian #ayatpenenanghati #pengingatdiri
---
[cover kicker="AYAT PENENANG HATI"]
Saat pikiran penuh dan *hati belum tenang.*
Satu ayat untuk pagi ini · QS. Ar-Ra'd [13]: 28
---
[ayah]
arab: [SALIN TEKS ARAB QS. AR-RA'D 13:28 DARI TANZIL / QURAN KEMENAG]
terjemah: [SALIN TERJEMAHAN KEMENAG RI UNTUK QS. AR-RA'D 13:28]
ref: QS. Ar-Ra'd [13]: 28
source: Terjemahan Kemenag RI
---
[quote kicker="Tafsir" icon=none]
[SALIN TAFSIR RINGKAS KEMENAG RI UNTUK QS. AR-RA'D 13:28]
— Tafsir Ringkas Kemenag RI
---
[card kicker="Renungan"]
Saat pikiran penuh, mungkin yang kita butuhkan bukan jawaban, tapi berhenti sejenak dan mengingat-Nya.
---
[end cta="Simpan"]
Ayat mana yang paling *menenangkan hatimu?*
Tulis di komentar. Kita saling mengingatkan.
```

(The placeholders are intentional: the agent must fill them by copying from the sources, never from memory.)

---

---

## 9. 🏛️ Filsafat Harian

**Handle:** `@filsafatharian.id`
**Tagline:** *Tameng buat hari-hari yang berat.*
A faceless Indonesian account of **street-level Stoicism**: philosophy as mental armor against the things that actually wear young Indonesians down. That means toxic bosses and group-chat scoldings, hustle culture and comparing salaries, nosy relatives ("kapan nikah?", "kerja di mana sekarang?") and family expectations. The audience made *Filosofi Teras* a bestseller. They don't want Greek history. They want something that works tonight.
It should feel like "I can carry this into tomorrow's meeting", never like a lecture, a motivational quote page or a museum.

**Direction (owner, Oct 2026 repositioning).**
- **Armor, not ignoring.** The Stoic move isn't pretending you didn't hear. It is seeing that what hurts is the story you add (Epictetus, *Enchiridion* 5 and 20), keeping what is yours (your judgment, your reply, your work) and leaving what isn't (their opinion of your life). "Ignore them" contradicts the account's own *Salah kaprah #1* (Stoik ≠ mati rasa).
- **Some things need action, not armor.** Unpaid overtime, harassment, threats and wage theft get documented and reported. Acting justly is also within your control. Every deck keeps its "Tapi…" card, and this is where it earns it: the account never tells anyone to put up with abuse.
- **Stoa is the spine (~70%).** Epictetus, Seneca and Marcus Aurelius. Other schools (~30%) appear only when they serve the same armor: Epicurus on wants and flexing, Zhuangzi, Confucius, Al-Ghazali, *nrimo* read carefully. No history-lesson posts: "Filsuf dalam 5 slide" and pure concept decks are retired.
- **Real quotes are the edge.** Philosophy TikTok is full of fake Marcus Aurelius quotes. "Kutipan asli, ada nomor pasalnya" is something this account can claim.
- **Not Ruang Rasa.** Ruang Rasa writes the reply to *send* ("kapan nikah?" scripts). Filsafat Harian gives what to *think*, so the question stops hurting. Link across when it fits: "Butuh kalimat balasannya? Cek @ruangrasakita.id."

| | |
|---|---|
| Purpose | Mental armor for work, family and comparison stress, from real philosophy |
| Audience | Indonesian first-jobbers and students, 18–30; readers of *Filosofi Teras* |
| Reader should think | "I'll use this tomorrow." Then save it, screenshot the quote, or send it to a coworker |
| Primary action | Save, screenshot (quote slide), share |
| Tone | Calm, dry, on the viewer's side; a little dark humour is fine. Never smug, never hustle |
| Voice | A colleague who reads Stoa and tells you over late-night coffee: "coba lihat dari sini" |
| Template | `editorial/tameng` (always) |
| Slide types | `cover`, `card`, `quote`, `compare`, `end` |

### Template: `editorial/tameng` (two voices)

- **Today's problem** speaks in heavy sans (Inter 800) on dark asphalt: cover, situation, idea and advice cards.
- **The 2,000-year-old answer** speaks in a book face (Gentium Book Plus) on **paper**: every `[quote]` slide flips to the light `kertas` surface by itself. That's the slide people screenshot. Keep one verified quote per deck so the flip happens once.
- **Steel is for the limit:** put `surface=baja` on the "Tapi…" card. Don't use `baja` anywhere else.
- **One ember accent** per headline, on 2–3 words (the sting or the turn). Long ember runs shout.
- No icons (`icon=none`), no photos, no badges on narrative cards (`number=off`).

### Formats (rotate; never the same format twice in a row)

1. **Tameng #N** (saves): one situation that hurts → what actually hurts (the judgment) → the verified quote (paper) → the idea (what's yours, what isn't) → "Coba malam ini/besok" (one action) → "Tapi…" on steel (when armor isn't enough) → end. Kicker `FILSAFAT HARIAN · TAMENG #N`. Model: `filsafat-tameng-bos-marah-id`.
2. **Satu kalimat** (screenshots): cover (the situation) → the quote on paper → what it means at work or at home → its limit (steel) → end. 4–5 slides.
3. **Kata medsos vs kata Stoa #N** (saves): `[compare]` slides that correct pop Stoicism. Examples: "stoik = cuek", "stoik = pasrah", "stoik = nggak boleh sedih", "stoik = sigma/alpha". Kicker `SALAH KAPRAH STOIK · #N`.
4. **Kamu pilih mana?** (comments): a real dilemma as A/B (`*A.* Resign. | *B.* Bertahan setahun lagi.`). Each thinker weighs it (kicker = thinker), never deciding for the viewer. End: "Kamu A atau B? Komen satu huruf."

### Situations (rotate across these)

- **Kantor:** a boss scolding in the group chat, credit stolen by a coworker, unrealistic deadlines, failing probation, layoffs, Monday dread, a WA from the boss on your day off.
- **Keluarga:** "kapan nikah/punya anak?", being compared to a cousin, being expected to send money home, choosing a career your parents don't understand.
- **Perbandingan:** a friend's salary or promotion, LinkedIn and Instagram updates, "umur segini harusnya udah…".
- **Hustle:** rest guilt, "kerja keras bagai kuda" content, side-hustle pressure. The account is anti-hustle: rest is not weakness.
- **Diri sendiri:** overthinking at 2 a.m., fear of failing, a mistake you can't stop replaying.

### Slide rules

- **Card 1 answers the cover:** the situation, as a scene the viewer knows ("Namamu disebut di grup, *jam sepuluh malam.*").
- **Labels are kickers, thoughts are headlines:** `[card kicker="Situasinya" number=off icon=none]`. Kickers in use: "Situasinya", "Yang sebenarnya melukai", "Ide <thinker> · <one human detail>, <era>" (e.g. "pernah jadi budak, abad ke-1–2 M": make the thinker a person, not a date), "Coba malam ini", "Tapi…".
- **Attribution fits one line** (≤ 50 characters): `— Epiktetos, Enchiridion 20 (terj. bebas, Higginson)`. Longer is cut with "…" without a warning (open item), so shorten the work's name (`Surat 13.4`), never drop the section number.
- **Cover:** the situation as a statement or question, ≤ 10 words, sting in ember. The subtitle says what changes for the viewer ("Cara Stoa biar kalimatnya nggak ikut kamu bawa tidur.").
- **End:** a one-tap ask about the viewer's own version ("Kalimat bos yang *paling nempel?*" → "Satu kata aja di komen.") with `cta="Simpan"`.

### Accuracy rules (non-negotiable)

- **Quotes are the biggest risk.** A direct quote needs the primary text and location (work + section, e.g. *Enchiridion* 20, *Meditations* 2.1, *Surat* 13.4) and a named public-domain translation (Higginson or Carter for Epictetus, George Long for Marcus Aurelius, Gummere for Seneca), checked against the full text (Project Gutenberg, Wikisource). Slides say "(terj. bebas, <translator>)". Otherwise paraphrase and label it "Gagasannya, disarikan".
- Advice in "Coba…" cards comes from the text when possible (*Enchiridion* 20's "gain time and respite" → "jangan balas sekarang"); the deck's own suggestions are marked as such in deck-sources.md.
- Sources in the reply before the deck: primary texts, the Stanford Encyclopedia of Philosophy, the Internet Encyclopedia of Philosophy. Never quote sites or Pinterest. Log them in `docs/deck-sources.md`.
- Biographical hooks must be checked (Epictetus was a slave for part of his life, SEP; Marcus Aurelius was emperor; Seneca was Nero's advisor and very rich, so say so when a Seneca deck is about money).

### Sensitivity rules

- **Workplace:** the armor is for words and moods, never for abuse. Harassment, threats, unpaid wages and unsafe work: the "Tapi…" card points to documenting and reporting (HR, Disnaker). Don't name real companies or bosses.
- **Family:** no "orang tua toxic" labels or pop psychology. Parents and relatives are people with their own fears; the armor is for the viewer's peace, not for contempt.
- **Mental health:** perspectives, not treatment. Decks about heavy feelings (overthinking, burnout, failure) add to the caption: "Kalau lagi berat banget, ngobrol sama orang yang kamu percaya atau tenaga profesional, ya."
- **No hustle, no "sigma/alpha" framing,** no manipulation tactics dressed as philosophy. Stoicism isn't about being cold or winning.
- **Religion and politics:** philosophy as a way of thinking, never against faith; no current politics, parties or figures.

### Writing rules

- Indonesian (`lang: id`), relaxed and clear: `kamu`, `aku`, `nggak`. Office words people use (*grup*, *atasan*, *lembur*, *deadline*) are fine.
- One situation and one idea per deck.
- Technical terms once, explained right after: *prohairesis* → "bagian dirimu yang memilih".
- Curly quotes in slide text.

### Deck recipe

- **Header:** `template: editorial/tameng` and `handle: @filsafatharian.id` in every deck.
- **Length:** cover + 5–6 slides + end, ≤ 9 slides.
- **Caption:** the first line pushes the hook further, then `Sumber:` (primary text + translator · SEP), then 3–4 hashtags that people search (`#stoikisme`, `#filsafatharian`, `#duniakerja`, `#bostoxic`, `#kapannikah`, `#overthinking`).
- **Calendar:** Monday mornings (kantor), the 25th (gajian, comparison), Ramadan and Lebaran ("kapan nikah?", mudik, being compared), end-of-year appraisals, and weeks with layoff news (calm, practical; never mocking).

```text
template: editorial/tameng
handle: @filsafatharian.id
lang: id
title: tameng 1 bos marah di grup
caption: Pesannya nggak bisa kamu hapus. Cerita yang kamu tambahkan di kepala, bisa. Sumber: Epiktetos, Enchiridion 1 & 20 (terj. T.W. Higginson) · SEP "Epictetus" #stoikisme #filsafatharian #duniakerja
---
[cover kicker="FILSAFAT HARIAN · TAMENG #1"]
Bos marah di grup. | *Semua orang baca.*
Cara Stoa biar kalimatnya nggak ikut kamu bawa tidur.
---
[card kicker="Yang sebenarnya melukai" number=off icon=none]
Bukan pesannya, tapi cerita yang *kamu tambahkan.*
---
[quote icon=none]
Yang menghinamu bukan orang yang memaki, tapi pandanganmu bahwa itu menghina.
— Epiktetos, Enchiridion 20 (terj. bebas, Higginson)
---
[card kicker="Tapi…" number=off icon=none surface=baja]
Tameng *bukan alasan diam* kalau sudah keterlaluan.
---
[end cta="Simpan"]
Kalimat bos yang *paling nempel?*
Satu kata aja di komen.
```

## 10. 📝 SKD Harian

**Tagline:** *Satu topik, lima soal, biar hari tes nggak kaget.*
A faceless Indonesian account for practice and strategy for government and state selection tests. SKD CPNS is the core (most posts). Side series cover Sekolah Kedinasan (many schools use SKD via BKN's CAT plus their own stages), PPPK (teknis, manajerial, sosio-kultural, wawancara), Rekrutmen Bersama BUMN (basic aptitude, AKHLAK values, English) and general job psychotests (deret, analogi, logika). UTBK-SNBT is out of scope.
It should feel like "oh, there's a 30-second way to do this", never like a tutoring ad or a promise.

**Direction (owner, Oct 2026).** One question per post felt unusual. Every main post now teaches one topic through 5 worked questions, easy to hard, so the viewer learns the pattern, not one answer.
**Bio (owner to set):** must say it isn't an official account, e.g. "📝 Latihan SKD CPNS & kedinasan: satu topik, 5 soal + pembahasan. Soal buatan sendiri. Bukan akun resmi BKN."

| | |
|---|---|
| Purpose | Daily practice and test strategy for selection tests |
| Audience | Indonesian fresh graduates, job seekers, SMA students aiming for sekolah kedinasan, honorer staff preparing for PPPK |
| Reader should think | "3 out of 5, and now I know the trick for this type." |
| Primary action | Save (the recap), comment the score, follow for the next topic |
| Tone | Calm, clear, encouraging; never "pasti lolos", never panic |
| Voice | A calm senior who passed the test and explains it plainly |
| Slide types | `cover`, `card` (with `verdict=` for answers), `compare`, `table`, `end` |

### Pillars

1. **1 Topik, 5 Soal** (most posts): one question type per deck, TIU numerik (soal cerita, deret, perbandingan, persen) and verbal (analogi, silogisme, sinonim/antonim). **Figural only once an image slide exists** (see Open items); it can't be drawn yet.
2. **TWK**: Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, sejarah, as questions with the article or source cited in the answer slide.
3. **TKP**: a workplace situation with five options and the scoring explained, labelled "pembahasan versi kami".
4. **Mini Tryout Minggu**: 5–8 questions, the answer key at the end.
5. **Strategi**: time, question order, traps, how scoring works.
6. **Info Resmi**: only after an official announcement, quoting it.
7. **Beda Tes**: compares CPNS, Kedinasan, PPPK and BUMN (stages, components), each with its official source.
8. **Psikotes**: deret angka, analogi and logika for general job tests.

### Accuracy rules (non-negotiable)

- **Original questions only.** Never copy from tutoring books, tryout apps or other accounts, never paraphrase one closely, and never anything framed as "soal bocoran" or "soal asli tahun lalu".
- **Every TIU answer is recomputed independently** before posting. Write the full working in the reply, check that exactly one option is correct, and check that the other options are wrong for a reason (a trap the explanation can name).
- **TWK facts** are checked against the official text (UUD 1945 with its amendments, the law itself), with the article cited on the answer slide ("Pasal 1 ayat (3) UUD 1945"). Never from memory or a question bank.
- **TKP** has no single published key. Every TKP explanation says "pembahasan versi kami" and explains the reasoning, never "kunci resmi".
- **Rules that change every year** (passing grade, formation rules, number of questions, time, stages): cite that year's regulation or official announcement by name and number, and never reuse an older year's figures.
- **Dates and registration info** come only from official channels: SSCASN (sscasn.bkn.go.id), the BKN kedinasan portal, each school's official site, and the official BUMN recruitment site. Every such post ends with "Cek pengumuman resmi".
- **No affiliation implied** with BKN, KemenPANRB, any school or any BUMN: no logos, no "resmi", no copying their visual style.

### Writing rules

- Language: Indonesian (`lang: id`), clear and calm: `kamu`, short sentences. Terms as the tests use them: TWK, TIU, TKP, passing grade, formasi, CAT.
- Numbers in Indonesian format (`Rp31.000`, `2,5`). Headlines hold the question; body lines hold the options `A. …` to `E. …`.
- Motivation without promises: "Latihan rutin bikin kamu lebih cepat", never "dijamin lolos".
- No mocking wrong answers. "Banyak yang kejebak di sini" beats "Masa gini aja salah".

### Deck recipe

- **Template:** `lexicon/lembar` (built for this account, Oct 2026): an exam answer sheet. Square-grid paper with teal ink for questions, graphite cover and end with a pencil-yellow accent, Barlow throughout so numbers read cleanly. Its `ok`/`bad` colours carry verdicts and compares. Never `lexicon/notebook` (Kosakata Inggris) or `editorial/rose-dusk` (Playfair's old-style figures make `Rp31.000` hard to read).
- **1 Topik, 5 Soal** (main format): cover (kicker `TIU NUMERIK · 1 TOPIK, 5 SOAL`; headline = the topic as the viewer meets it, "Soal cerita 2 barang?"; subtitle = "5 soal dari mudah ke sulit…") → 5 × (question card, solution card) → recap `[table]` (`| Soal | Triknya |`) → end. 13 slides; may run to 14.
  - **Question card:** `[card kicker="Soal N · Mudah|Sedang|Sulit" number=off icon=none]`, the question as the headline with the asked quantity in `*accent*` (`*1 apel − 1 jeruk = ?*`), options `A. …` to `E. …` as body lines. Keep the headline to 3 short lines; write the ask as an equation when it fits.
  - **Solution card:** `[card verdict="N · Jawaban C" tone=ok]`, headline `Trik: *<the trick>*`, then the working **one calculation per body line** (never a paragraph: equations must not break across lines), then `Jebakan X: …` naming the trap option.
  - Order the 5 from easy to hard, each a different trick for the same topic, and spread the right answers over A–E.
- **Mini Tryout:** cover → 5–8 question cards (`number=1`…, options as body lines) → answer key `[table]` (`| No | Jawaban | Materi |`) → 2–4 explanation cards for the hardest ones → end. ≤ 14 slides.
- **Strategi:** cover → 4–6 numbered cards → end.
- **TWK answers** end the body with the source on its own line (`Pasal 36A UUD 1945`). **TKP answers** use `[table]` with each option's score and `kicker` "Pembahasan versi kami" on the card after it.
- **End:** `[end cta="Follow"]` with a one-tap ask ("Skor kamu *berapa dari 5?*") and what comes next ("Topik berikutnya: deret angka.").
- **Caption:** one line + the source if the post states facts (regulation, UUD article) + "Soal latihan buatan kami, bukan soal resmi" on question posts + 2–4 hashtags (`#skdcpns`, `#cpns`, `#tiu`, `#twk`, `#tkp`, `#sekolahkedinasan`, `#pppk`, `#rekrutmenbumn`).
- **Rhythm:** 1 Topik, 5 Soal 4–5 times a week, Mini Tryout on Sunday, 1–2 strategy or Beda Tes posts a week; side series (Kedinasan, PPPK, BUMN, Psikotes) at most 1 in 4 posts, more around their registration windows.

Working for the example (each checked by brute force: exactly one solution, exactly one matching option):
1. 3p + 2b = 31.000, 2p + 3b = 34.000 → p = 5.000, b = 8.000, p + b = 13.000 (**D**). Traps: A/C one item, B ÷ 10 items.
2. 4a + 3j = 26.000, 3a + 4j = 23.000 → a = 5.000, j = 2.000, a − j = 3.000 (**C**). Traps: B jeruk, D apel, E a + j.
3. A + B = 12, B + C = 15, A + C = 13 → A = 5, B = 7, C = 8, total 20 kg (**B**). Trap: D 40 (not halved).
4. 2(a + 20.000) + 3a = 190.000 → anak 30.000 (**A**), dewasa 50.000. Traps: B 190.000 ÷ 5, C dewasa, D (190.000 − 20.000) ÷ 5.
5. k + y = 50, y − 5 = 4(k − 5) → anak 13, ayah 37 (5 years ago 8 and 32) (**C**). Traps: A 8 (stopped 5 years ago), B 50 ÷ 5, E ayah.

```text
template: lexicon/lembar
lang: id
title: soal cerita persamaan 5 soal
caption: 5 soal cerita TIU, 5 trik tanpa x dan y. Soal latihan buatan kami, bukan soal resmi BKN. #skdcpns #cpns #tiu #latihansoal
---
[cover kicker="TIU NUMERIK · 1 TOPIK, 5 SOAL"]
Soal cerita 2 barang? | *Nggak perlu x dan y.*
5 soal dari mudah ke sulit. Kerjakan dulu, baru geser ke pembahasannya.
---
[card kicker="Soal 1 · Mudah" number=off icon=none]
3 pulpen + 2 buku = Rp31.000. | 2 pulpen + 3 buku = Rp34.000. | *1 pulpen + 1 buku = ?*
A. Rp5.000
B. Rp6.500
C. Rp8.000
D. Rp13.000
E. Rp15.500
---
[card verdict="1 · Jawaban D" tone=ok]
Trik: *jumlahkan, lalu bagi.*
5 pulpen + 5 buku = Rp65.000
Rp65.000 ÷ 5 = Rp13.000
Jebakan B: dibagi 10, padahal 5 pasang.
---
[card kicker="Soal 2 · Mudah" number=off icon=none]
4 apel + 3 jeruk = Rp26.000. | 3 apel + 4 jeruk = Rp23.000. | *1 apel − 1 jeruk = ?*
A. Rp1.000
B. Rp2.000
C. Rp3.000
D. Rp5.000
E. Rp7.000
---
[card verdict="2 · Jawaban C" tone=ok]
Trik: *kurangkan.*
Persamaan 1 − persamaan 2 = 1 apel − 1 jeruk
Rp26.000 − Rp23.000 = Rp3.000
Jebakan B dan D: harga jeruk dan harga apel.
---
[card kicker="Soal 3 · Sedang" number=off icon=none]
Berat A + B = 12 kg. | B + C = 15 kg. | A + C = 13 kg. | *Berat A + B + C?*
A. 13 kg
B. 20 kg
C. 25 kg
D. 40 kg
E. 27 kg
---
[card verdict="3 · Jawaban B" tone=ok]
Trik: *jumlahkan semua, bagi 2.*
12 + 15 + 13 = 40 (tiap huruf terhitung 2 kali)
40 ÷ 2 = 20 kg
Jebakan D: lupa dibagi 2.
---
[card kicker="Soal 4 · Sedang" number=off icon=none]
2 tiket dewasa + 3 tiket anak = Rp190.000. | Tiket dewasa Rp20.000 lebih mahal. | *Harga 1 tiket anak?*
A. Rp30.000
B. Rp38.000
C. Rp50.000
D. Rp34.000
E. Rp42.000
---
[card verdict="4 · Jawaban A" tone=ok]
Trik: *anggap semua tiket anak dulu.*
Rp190.000 − 2 × Rp20.000 = Rp150.000
Rp150.000 ÷ 5 tiket = Rp30.000
Jebakan C: itu harga tiket dewasa.
---
[card kicker="Soal 5 · Sulit" number=off icon=none]
Umur ayah + anak sekarang = 50 tahun. | 5 tahun lalu, umur ayah 4 kali umur anak. | *Umur anak sekarang?*
A. 8 tahun
B. 10 tahun
C. 13 tahun
D. 15 tahun
E. 37 tahun
---
[card verdict="5 · Jawaban C" tone=ok]
Trik: *mundur dulu, baru maju.*
5 tahun lalu: 50 − 10 = 40
Anak dulu: 40 ÷ (4 + 1) = 8 tahun
Sekarang: 8 + 5 = 13 tahun
Jebakan A: berhenti di 5 tahun lalu.
---
[table]
Simpan: 5 trik soal cerita
| Soal | Triknya |
| 1 | Jumlahkan, lalu bagi |
| 2 | Kurangkan |
| 3 | Jumlahkan semua, bagi 2 |
| 4 | Anggap semua sama dulu |
| 5 | Mundur dulu, baru maju |
---
[end cta="Follow"]
Skor kamu *berapa dari 5?*
Komen angkanya. Topik berikutnya: deret angka.
```

(The sample deck `skd-persamaan-5-soal-id`: 13 slides, zero warnings in every template.)

### Starter list (30 ideas)

1. Soal cerita persamaan: 5 soal, 5 trik (the example).
2. TIU deret: pola selang-seling (two series interleaved).
3. TIU perbandingan: kerja bersama (A selesai 6 hari, B 3 hari).
4. TIU silogisme: "Semua… sebagian…", the conclusion everyone picks wrongly.
5. TIU analogi kata: hubungan alat dan fungsi.
6. TIU persen: diskon bertingkat 20% + 10% ≠ 30%.
7. TIU soal cerita: kecepatan berpapasan.
8. TIU sinonim/antonim: 5 kata yang sering menjebak (meanings checked in KBBI).
9. TWK: Pancasila sebagai dasar negara, which document and which date (sources cited).
10. TWK: bentuk negara dan kedaulatan, Pasal 1 UUD 1945.
11. TWK: bendera, bahasa, lambang dan lagu kebangsaan, Pasal 35–36C UUD 1945.
12. TWK: Bhinneka Tunggal Ika, where the phrase comes from (Kakawin Sutasoma, sourced).
13. TWK: amendemen UUD 1945, four amendments and their years.
14. TWK: sejarah, Sumpah Pemuda, the three points verbatim.
15. TKP: atasan memberi tugas mendadak di jam pulang (pembahasan versi kami).
16. TKP: rekan kerja salah dan dilimpahkan ke kamu.
17. TKP: pelayanan publik, warga marah di loket.
18. TKP: how TKP is scored (per the official rule of the year, cited).
19. Mini Tryout Minggu #1: 6 TIU numerik.
20. Mini Tryout Minggu #2: 4 TWK + 2 TKP.
21. Strategi: urutan mengerjakan TWK, TIU, TKP, with the reasoning and no guarantees.
22. Strategi: 5 jebakan soal cerita (satuan, "kecuali", sisa, persen dari persen, pembulatan).
23. Strategi: kapan lompati soal, the per-question time budget (from that year's official time and count).
24. Strategi: hitung cepat tanpa kalkulator, ×5, ×25, ÷ 0,5.
25. Beda Tes: CPNS vs Sekolah Kedinasan vs PPPK vs BUMN, stages side by side (each sourced).
26. Sekolah Kedinasan: what usually follows SKD (examples from one school's latest official announcement).
27. PPPK: the four components (teknis, manajerial, sosio-kultural, wawancara) explained.
28. BUMN: the AKHLAK values, one situational question.
29. Psikotes: deret angka with two operations.
30. Info Resmi: the opening of this year's registration, posted only after the announcement, with "Cek pengumuman resmi di SSCASN".

---

## 11. 🗂️ Jago Kantoran

**Tagline:** *Kerjaan kantor lebih cepat, satu trik sehari.*
A faceless Indonesian account teaching practical office skills to office workers, students and admin staff: Excel and Google Sheets, Word and Google Docs, PowerPoint, email and meetings, PDFs, and fixing the errors everyone hits.
It should feel like "this saves me 20 minutes tomorrow morning", never like a software manual.

| | |
|---|---|
| Purpose | Make everyday office tasks faster and less frustrating |
| Audience | Indonesian office workers, admin and finance staff, teachers, students writing reports and theses |
| Reader should think | "I'm saving this for when I open Excel tomorrow." |
| Primary action | Save, then share with a colleague |
| Tone | Practical, friendly, quick; a little relief when a problem goes away |
| Voice | The colleague at the next desk who knows the shortcut |
| Slide types | `cover`, `sheet` (formula on a mini spreadsheet), `code`, `table`, `compare`, `card`, `end` |

### Pillars

1. **Excel / Google Sheets**: functions, pivot tables, conditional formatting, data validation, cleaning data, charts.
2. **Word / Google Docs**: daftar isi otomatis, styles, page numbers starting on page 3, mail merge, track changes, formatting surat.
3. **PowerPoint / Slides**: layouts, alignment, master slides, presenter view.
4. **Email & meeting**: formal email, CC vs BCC, Gmail and Outlook tricks, Zoom and Teams.
5. **Shortcuts & PDF**: keyboard shortcuts, merging, compressing and signing PDFs.
6. **Masalah Kantor**: fixing common errors: `#N/A`, `#VALUE!`, numbers turning into dates, prints cut off.
7. **AI di kantor**: drafting, summarising, formula help. Workflows only; no prices or model versions unless the owner confirms them.

### Formats (reuse one topic in several)

1. **Tutorial**: one task, one step per slide.
2. **Compare**: two ways to do it (VLOOKUP vs XLOOKUP, CC vs BCC) and when to use which.
3. **Salah → Benar**: a common mistake and its fix.
4. **Kuis**: a formula on one slide, "hasilnya apa?" and the answer on the next.
5. **Kasus nyata**: a real office situation (rekap absensi, gaji per divisi) solved start to finish.
6. **Excel vs Google Sheets**: the same task in both where they differ.

**Weekly rotation:** Mon Excel tutorial · Tue Word/Docs · Wed Masalah Kantor · Thu Shortcuts/PDF · Fri Excel quiz · Sat Email/PowerPoint · Sun AI di kantor or a recap. 4–5 posts a week is fine; skip days rather than fill them.

### Accuracy rules (non-negotiable)

- **Every formula and shortcut is tested before posting**, and the caption says where: "Diuji di Excel 365 (Windows)", "Diuji di Google Sheets". No test, no post.
- **Version limits are stated.** For example, XLOOKUP needs Excel 2021, Excel 365 or Excel for the web, and Excel 2019 and older don't have it. When Google Sheets differs (function name, menu, shortcut), give the Sheets version too.
- **Separators depend on the region setting.** Excel set to Indonesian region uses `;` between arguments; English (US) uses `,`. Show the `;` form on slides (most of the audience) and say once per deck that `,` is the other form.
- **Shortcuts:** say Windows or Mac. Menu names are given in English and Indonesian when the Indonesian Office interface differs (e.g. Home/Beranda) only if checked.
- **AI pillar:** describe workflows; don't state prices, limits or model versions unless the owner confirms them. Never paste confidential office data into an AI tool in an example.

### Writing rules

- Language: Indonesian (`lang: id`), relaxed: `kamu`. Keep menu names, function names and buttons exactly as the software writes them (`XLOOKUP`, `Conditional Formatting`, `Insert`).
- One task per deck, one step per slide. Headline = what the step does; body = what each part of the formula means; the `[sheet]` shows the formula working; note = what happened ("K03 ketemu di baris 4, jadi hasilnya Sari.").
- Use one small, realistic sample table across the whole deck (IDs, names, divisions), the same on every `[sheet]`, so every result can be checked.
- Keep formulas short: no wrapping, and long lines shrink. Split a long formula into helper columns rather than one long line.

### Deck recipe

- **Template:** `dev/sheet` (built for this account, Oct 2026): a spreadsheet. Faint cell gridlines, an office-green accent, a white formula panel, a rule in the header instead of a terminal path, and a large `fx` on cover and end. Write formulas in `[code]` fences with the language `excel`: functions are drawn green, cell references blue, strings brown, like a spreadsheet's formula editor. Never `dev/paper-light`, `dev/terminal` or `dev/github-dark` (Fathul Learn Coding's looks).
- **Formulas are shown on a `[sheet]`** (PRD §4.10), not only as code: first fence line `E2 =XLOOKUP(D2;A2:A6;B2:B6)`, then the table from A1. The app colours each reference and outlines its range in the same colour, and marks E2 as the result. Write the found cells as `*K03*` so viewers see where the lookup landed. Keep it to ≤ 5 columns and ≤ 6 rows so cells stay at full size. Use `[code]` with `excel` only for formula-only points (the `,` vs `;` slide).
- **Tutorial:** cover → one `[sheet]` per step → `,`/`;` note `[code]` → version `[card]` → end. 6–10 slides.
- **Compare:** cover → `[compare]` (`wrong-label`/`right-label` set to e.g. `VLOOKUP`/`XLOOKUP`) or `[table]` side by side → "kapan pakai yang mana" card → end.
- **Masalah Kantor:** cover (the error as the hook: "`#N/A` padahal datanya ada?") → 2–4 cause cards → one `[code]` or card per fix → end.
- **Cover:** `[cover kicker="EXCEL • TUTORIAL"]` (APP • FORMAT), headline = the annoyance the viewer has ("Masih hitung kolom buat *VLOOKUP?*"), subtitle = what they get.
- **End:** `[end cta="Simpan"]`, a one-tap ask ("Kantormu masih pakai *Excel versi berapa?*") + what's next.
- **Caption:** one line + "Diuji di …" + 2–4 hashtags (`#exceltips`, `#tipskantor`, `#belajarexcel`, `#googlesheets`, `#tipsword`).
- **Monetisation (later):** the planned first product is templates (absensi, anggaran, inventaris, surat, laporan). Sell only after the audience is built; until then, no product links or "link di bio" pushes in posts.

Tested for the example (Oct 2026, Python `formulas` engine 1.3.4 on this exact table, `,` separators; **not yet run in Excel 365 or Google Sheets**, so the owner runs it once and fills in the caption's "Diuji di"): `=XLOOKUP(D2,A2:A6,B2:B6)` with D2 = K03 → `Sari`; with K09 and a 4th argument `"Tidak ada"` → `Tidak ada` (without it `#N/A`); `=XLOOKUP(D2,B2:B6,A2:A6)` with Dimas → `K04`; `VLOOKUP` looking left → `#N/A`.

````text
template: dev/sheet
lang: id
title: xlookup dasar
caption: Cari data di tabel tanpa menghitung nomor kolom. Diuji di [versi Excel yang dipakai owner]. #exceltips #tipskantor #xlookup
---
[cover kicker="EXCEL • TUTORIAL"]
Masih hitung kolom | buat *VLOOKUP?*
XLOOKUP: cari data dari tabel, 3 langkah.
---
[sheet]
Cari nama dari ID
D2 = yang dicari, A = kolom ID, B = kolom hasil.
```sheet
E2 =XLOOKUP(D2;A2:A6;B2:B6)
ID | Nama | Divisi | Cari | Hasil
K01 | Rina | Keuangan | K03 | Sari
K02 | Bayu | HRD | |
*K03* | *Sari* | IT | |
K04 | Dimas | Gudang | |
K05 | Lala | IT | |
```
K03 ketemu di baris 4, jadi hasilnya Sari.
---
[sheet]
Kalau ID-nya nggak ada
Argumen keempat menggantikan #N/A dengan teks sendiri.
```sheet
E2 =XLOOKUP(D2;A2:A6;B2:B6;"Tidak ada")
ID | Nama | Divisi | Cari | Hasil
K01 | Rina | Keuangan | K09 | Tidak ada
K02 | Bayu | HRD | |
K03 | Sari | IT | |
K04 | Dimas | Gudang | |
K05 | Lala | IT | |
```
Tanpa argumen keempat, hasilnya #N/A.
---
[sheet]
Cari ke kiri
ID ada di kiri nama. VLOOKUP nggak bisa ke kiri.
```sheet
E2 =XLOOKUP(D2;B2:B6;A2:A6)
ID | Nama | Divisi | Cari | Hasil
K01 | Rina | Keuangan | Dimas | K04
K02 | Bayu | HRD | |
K03 | Sari | IT | |
*K04* | *Dimas* | Gudang | |
K05 | Lala | IT | |
```
Kolom cari dan kolom hasil boleh di mana saja.
---
[code]
Excel kamu pakai koma?
Pemisah argumen ikut pengaturan region. Excel berbahasa Inggris (region US) pakai koma.
```excel
=XLOOKUP(D2,A2:A6,B2:B6)
```
Excel menolak rumusnya? Ganti ; jadi , (atau sebaliknya).
---
[card number=off icon=alert]
XLOOKUP butuh *Excel 2021 atau 365*
Excel 2019 ke bawah belum punya. Google Sheets punya, tulisannya sama.
---
[end cta="Simpan"]
Kantormu masih pakai *Excel versi berapa?*
Komen tahunnya. Besok: VLOOKUP vs XLOOKUP.
````

(The sample deck `kantor-xlookup-id`: 7 slides, zero warnings in every template.)

### Starter list (30 ideas)

1. XLOOKUP dasar: cari nama dari ID (the example).
2. VLOOKUP vs XLOOKUP: when the old one is still fine (compare).
3. `#N/A` padahal datanya ada: spasi tersembunyi, TRIM (Masalah Kantor).
4. Angka berubah jadi tanggal: why it happens and how to stop it.
5. Kuis: hasil `=TEXT(A2;"dd mmm yyyy")`?
6. SUMIFS: total gaji per divisi (kasus nyata).
7. COUNTIFS: rekap absensi per bulan.
8. Pivot table pertama kamu, in 4 steps.
9. Conditional formatting: tandai stok di bawah minimum.
10. Data validation: dropdown pilihan divisi.
11. Membersihkan data: pisah nama depan/belakang (Text to Columns vs TEXTSPLIT, with version limits).
12. Hapus duplikat tanpa kehilangan data asli.
13. `#VALUE!`: angka yang ternyata teks.
14. Excel vs Google Sheets: IMPORTRANGE, which has no direct Excel equivalent.
15. Word: daftar isi otomatis dari Heading styles.
16. Word: nomor halaman mulai dari halaman 3 (section break).
17. Word: mail merge undangan dari daftar Excel.
18. Word: Track Changes for a document reviewed by your boss.
19. Format surat dinas: margin, spacing and the parts of a letter, as a template checklist.
20. Google Docs: version history, getting back yesterday's draft.
21. PowerPoint: align and distribute, so the boxes stop looking messy.
22. PowerPoint: presenter view on a second screen.
23. Email formal: subject, greeting and closing (Salah → Benar).
24. CC vs BCC: when to use each (compare).
25. Gmail: schedule send and undo send.
26. Zoom/Teams: 5 meeting shortcuts (Windows/Mac labelled).
27. PDF: merge and compress without uploading confidential files (offline tools named only if tested).
28. Print kepotong: set print area and fit to one page.
29. Shortcut Excel yang hemat waktu: Ctrl+Shift+L, Ctrl+T, Ctrl+; (each tested, Mac equivalents given).
30. AI di kantor: ask AI to explain a formula you inherited, then check it on sample data.

## 12. ✍️ Kosakata Arab

**Tagline:** *Bahasa Arab dari nol, satu kata satu hari.*
A faceless account teaching Modern Standard Arabic (fusha) for daily life to Indonesian absolute beginners: one word, one root, one phrase or one small rule per post. A sibling of Kosakata Inggris (English) and Kata Baku (Indonesian): same lexicon slides, same "one thing per deck" discipline.
It should feel like "oh, so that's how كِتَاب and مَكْتَبَة are related", never like a pesantren exam or a teacher showing off.
**Account:** `@kosakata.arab` (put `handle: @kosakata.arab` and `script: arab` in every deck header). **Postable since M9a (Oct 2026):** Arabic renders right-to-left with full harakat in word, table and compare slides (SPEC-script.md). It launches before Kosakata Mandarin.

| | |
|---|---|
| Purpose | Make everyday Arabic approachable for Indonesian beginners |
| Audience | Indonesian absolute beginners: students, people preparing for umrah or work in the Gulf, parents learning alongside their children |
| Reader should think | "I can read and use this word today." |
| Primary action | Save, then comment the practice word |
| Tone | Warm, encouraging, patient; mistakes are part of learning |
| Voice | "Belajar bareng": the owner is learning Arabic too and shares what clicked |
| Slide types | `cover`, `word`, `table`, `compare`, `card`, `end` |

### Scope

- **Fusha (MSA) for daily life.** Dialects (Saudi, Egyptian) only as a labelled side series ("Dialek Saudi #N"), every dialect word marked on the slide.
- **Quran vocabulary belongs to Ayat Harian.** No ayat, no Quranic word studies, no tafsir here. Religious daily phrases (salam, greetings) are fine as everyday language. If a card ever quotes the Qur'an, it must be an `[ayah]` slide (Amiri Quran, Ayat Harian's sourcing rules), never `[word]`.
- Carousels first. Pronunciation videos (voice only, native audio or native-checked, **never text-to-speech**) are a later phase.

### Pillars

1. **Kata hari ini #N**: one word with full harakat, Indonesian-friendly transliteration, meaning and an example sentence.
2. **Akar kata #N**: one three-letter root and its word family (ك-ت-ب: menulis, buku, penulis, kantor, perpustakaan).
3. **Ungkapan sehari-hari**: greetings, introducing yourself, at the market, travel and umrah phrases.
4. **Tata bahasa dasar**: mudzakkar/muannats, dhamir (pronouns), isim isyarah (hadza/hadzihi), simple nominal sentences. One rule per deck.
5. **Huruf yang sering tertukar**: ع vs ء, ح vs ه, ق vs ك, ص vs س, with how to hear and write the difference.
6. **Kata serapan Arab**: Indonesian words that came from Arabic and how the meaning moved (crossover with Kata Baku; KBBI for the Indonesian side).
7. **Kuis**: guess the meaning from a root pattern, or pick the right harakat.

### Accuracy rules (non-negotiable)

- **Never write Arabic text or harakat from memory.** Check every word and its harakat against **Almaany** (almaany.com) or **Hans Wehr**, and list the source per word in the reply before the deck. Wiktionary's vowelled headwords are a useful cross-check, not the final source.
- **Copy, don't type:** paste the vowelled form from the source. A missing or wrong harakat changes the word (مُدَرِّسَة is a female teacher, مَدْرَسَة a school).
- **Example sentences** come from a dictionary or are checked by a native speaker. Sentences you composed yourself are uncertain: leave them out, or keep a `[SALIN …]` placeholder until checked.
- **A native-speaker spot-check is recommended**, and strongly so for the first 20 posts. Mark anything uncertain in the reply and leave it out of the deck.
- **Transliteration has one fixed convention**, explained once in a pinned post and never mixed. `translit:` uses macrons for long vowels (`kitāb`, `kātib`, `jamīlah`), ta marbutah as `-ah` at a pause (`maktabah`), `ʿ` for ع and `ʾ` for ء when they matter, `sy` for ش, `kh` for خ, `dz` for ذ. It's drawn in the transliteration face, so the macrons always render. `say:` is optional, for an Indonesian reading tip ("ki-taab", a-nya panjang).
- **Dialect words are labelled** on the slide ("Dialek Mesir"), never mixed into fusha decks unlabelled.

### Writing rules

- Explanations in Indonesian (`lang: id`), relaxed: `kamu`, `kita`. Arabic terms the way Indonesian learners know them: harakat, fathah, kasrah, dhammah, sukun, mudzakkar, muannats, dhamir.
- One word or one point per deck. Example sentences short and about everyday life (rumah, pasar, sekolah, kantor).
- Put the Arabic in `word:` / table cells, the transliteration in `translit:`, the root in `root:` (letters separated by spaces), the wazan in `pattern:`, the plural in `plural:` (`كُتُب · kutub`), the meaning in `meaning:`. Arabic `example:` sentences may highlight whole words with `*…*`.
- Encourage, never test publicly: "Coba baca pelan-pelan" beats "Masa nggak bisa baca?".

### Deck recipe

- **Template:** `lexicon/arab` (shipped Oct 2026): ivory exercise-book paper, lapis ink, terracotta root letters, a margin on the right for RTL writing. Header: `handle: @kosakata.arab`, `template: lexicon/arab`, `script: arab` (turns on the `harakat-missing` reminder).
- **Kata hari ini:** cover (kicker `KATA HARI INI · #N`) → `[word]` (word with harakat, `translit:`, `root:`, `pattern:`, `plural:`, `meaning:`, `example:` + `translation:`, `note:` with the source) → `[table]` related forms (≤ 8 rows) → `[card]` practice prompt → end.
- **Akar kata:** cover (kicker `AKAR KATA · #N`) → `[table]` the family (`| Arab | Cara baca | Arti |`, ≤ 8 rows) → 1–2 `[word]` for the most useful members → `[card]` the pattern (e.g. ma-…-ah = tempat) → `[card]` kuis using the pattern on a new root → end.
- **Huruf tertukar:** cover → `[compare]` (`wrong-label`/`right-label` set to the two letters) → `[table]` minimal pairs → end. Mostly-Arabic tables (conjugations) can use `[table dir=rtl]`, which draws the first column on the right.
- **End:** `[end cta="Simpan"]`, always a practice prompt for the comments ("Tulis satu kata lagi dari akar ini di komen.").
- **Length:** 6–10 slides. One word or one point; tables ≤ 8 rows.
- **Caption:** one line + `Sumber: Almaany` (or Hans Wehr) + 2–4 hashtags (`#belajarbahasaarab`, `#bahasaarab`, `#kosakataarab`, `#arabpemula`).

The shipped sample `lexicon-arab-kitab` (SPEC-script §12). Checked Oct 2026: every vowelled word (كِتَاب, كُتُب, كَتَبَ, كَاتِب, مَكْتَب, مَكْتَبَة, فِعَال, هٰذَا, سَيَّارَة feminine, جَمِيل / جَمِيلَة) matched Wiktionary's vowelled entries byte for byte; Almaany blocks scripts and Hans Wehr isn't online, so the owner checks both before posting. The sentences هٰذَا كِتَابٌ and سَيَّارَةٌ جَمِيلَةٌ are built from those words with regular grammar (tanwin, agreement): a native-speaker check is recommended. Before posting, also make the end slide a practice prompt (this sample keeps the spec's wording).

```text

handle: @kosakata.arab
template: lexicon/arab
script: arab
lang: id
title: akar kata ك-ت-ب
caption: Satu akar, banyak kata. Simpan buat hafalan! #bahasaarab #belajarbahasaarab
---
[cover]
Satu akar,|*lima kata*
Kenalan dengan akar ك-ت-ب: "menulis"
---
[word]
word: كِتَاب
translit: kitāb
pos: isim · kata benda
tag: A1
root: ك ت ب
pattern: فِعَال
plural: كُتُب · kutub
meaning: buku
example: هٰذَا *كِتَابٌ*
translation: Ini (adalah) buku.
---
[table]
Satu akar, banyak kata
| Arab | Baca | Arti |
| كَتَبَ | kataba | menulis |
| كِتَاب | kitāb | buku |
| كَاتِب | kātib | penulis |
| مَكْتَب | maktab | kantor; meja tulis |
| مَكْتَبَة | maktabah | perpustakaan |
---
[compare]
headline: Kata sifat ikut jenis bendanya
wrong: سَيَّارَةٌ جَمِيلٌ
right: سَيَّارَةٌ جَمِيلَةٌ
why: سَيَّارَة (mobil) itu muannats (feminin), jadi kata sifatnya juga pakai ة: jamīlah.
---
[end]
Akar kata apa yang mau dibahas besok?
Tulis di komentar
```

(Renders with zero warnings in every template.)

### Starter list (30 ideas)

1. Akar kata #1: ك-ت-ب, menulis sampai perpustakaan (the example).
2. Kata hari ini: buku, with its plural.
3. Kata hari ini: rumah.
4. Kata hari ini: air.
5. Kata hari ini: guru (and its feminine form).
6. Kata hari ini: teman.
7. Akar kata #2: د-ر-س, belajar, pelajaran, sekolah, guru.
8. Akar kata #3: ع-ل-م, ilmu, tahu, dunia (with the 'ain introduced).
9. Akar kata #4: ف-ت-ح, membuka, kunci, pembukaan.
10. Ungkapan: salam dan jawabannya, written in full.
11. Ungkapan: memperkenalkan diri (nama saya…, saya dari Indonesia).
12. Ungkapan: menanyakan kabar dan menjawabnya.
13. Ungkapan: di pasar, berapa harganya?
14. Ungkapan: arah (kanan, kiri, lurus) for travel and umrah.
15. Ungkapan: terima kasih dan sama-sama.
16. Tata bahasa: mudzakkar vs muannats, the ta marbutah sign.
17. Tata bahasa: hadza vs hadzihi (ini, untuk laki-laki dan perempuan).
18. Tata bahasa: dhamir tunggal (saya, kamu laki-laki, kamu perempuan, dia).
19. Tata bahasa: kalimat nominal pertama, "ini buku" (native-checked).
20. Tata bahasa: al- (kata sandang) and when the l isn't pronounced.
21. Huruf tertukar: ع vs ء.
22. Huruf tertukar: ح vs ه.
23. Huruf tertukar: ق vs ك.
24. Huruf tertukar: ص vs س.
25. Harakat: fathah, kasrah, dhammah, sukun, one word each.
26. Kata serapan: kitab, kursi, kamus (Indonesian side checked in KBBI, Arabic side in Almaany).
27. Kata serapan: kata yang artinya bergeser (e.g. a word whose Indonesian meaning differs from fusha).
28. Kuis: tebak arti dari pola ma-…-ah.
29. Kuis: pilih harakat yang benar (two vowelled forms, one wrong).
30. Dialek Saudi #1 (side series): one everyday dialect word next to its fusha form, both labelled.

---

## 13. 🏮 Kosakata Mandarin

**Tagline:** *Mandarin dari nol, satu kata satu nada.*
A faceless account teaching standard Mandarin to Indonesian absolute beginners, roughly HSK 1–2: one word, one tone rule, one character part or one phrase per post. Simplified characters, pinyin with tone marks. A sibling of Kosakata Inggris and Kata Baku.
It should feel like "oh, so 不 isn't always bù", never like a cram school or a test.
**Account:** `@kosakata.mandarin` (put `handle: @kosakata.mandarin`, `script: hanzi` and `tones: color` in every deck header). **Postable since M9b (Oct 2026):** hanzi come from bundled Noto SC, pinyin tone marks render everywhere, and the headword gets ruby pinyin (SPEC-script.md). It still launches a few weeks after Kosakata Arab (device and account limits).

| | |
|---|---|
| Purpose | Make beginner Mandarin approachable, tones first |
| Audience | Indonesian absolute beginners: students, workers at Chinese companies, travellers, people curious about the Hokkien words in Indonesian |
| Reader should think | "I can say this today, with the right tone." |
| Primary action | Save, then comment the practice line in pinyin |
| Tone | Friendly, encouraging, a little playful; tones are hard for everyone |
| Voice | "Belajar bareng": the owner is learning Mandarin too |
| Slide types | `cover`, `word`, `table`, `compare`, `card`, `end` |

### Scope

- **Standard Mandarin, simplified characters, pinyin with tone marks**, roughly HSK 1–2.
- **No politics**: no current affairs, no territorial or government topics, no comparisons between countries.
- Carousels first. Pronunciation videos (voice only, native audio or native-checked, **never text-to-speech**) are a later phase; tones are where audio will matter most.

### Pillars

1. **Kata hari ini #N**: hanzi, pinyin, meaning, an example sentence with pinyin and translation.
2. **Nada**: the 4 tones and the neutral tone, and the written tone changes of 不 (bù → bú before a 4th tone) and 一.
3. **Bongkar hanzi**: character components with real examples (氵 shuǐ, the water radical, in 河 hé "sungai" and 喝 hē "minum"; 口 kǒu "mulut" in 吃 chī "makan" and 喝 hē). Standard analyses only.
4. **Ungkapan sehari-hari**: greetings, numbers, bargaining, ordering food.
5. **Kata bantu bilangan**: 个 gè, 本 běn (books), 张 zhāng (flat things), 杯 bēi (cups)… one per deck with 3–5 nouns.
6. **Tata bahasa dasar**: 是 shì, 吗 ma, 了 le, 的 de, basic word order. One point per deck.
7. **Kata Hokkien dalam bahasa Indonesia**: crossover with Kata Baku. Every etymology checked (KBBI label + a scholarly source such as Jones, *Loan-Words in Indonesian and Malay*); say "Hokkien", not "Mandarin", when the source says so.
8. **Kuis**: pick the tone, pick the classifier, read the pinyin.

### Accuracy rules (non-negotiable)

- **Never write hanzi or pinyin from memory.** Check every hanzi, pinyin and meaning against **CC-CEDICT** or **MDBG**, and list the source per word in the reply before the deck.
- **Run the checker before posting:** `npm run check:cedict -- <deck.txt>` checks every `[word]` (`word:` + `pinyin:`, tone marks or numbers) and every table with `Hanzi` and `Pinyin` columns against the CC-CEDICT data file, accepts the written tone changes of 不 and 一, flags traditional characters and unknown characters in examples, and prints the English definitions to compare with the Indonesian meaning. Setup is in `scripts/check-cedict.ts`. `ok~` means no whole-word entry (e.g. 一天), but every character's reading matches: still check it by eye.
- **Tone marks always**, never tone numbers on slides (`xièxie`, not `xie4xie5`).
- **Character components:** standard analyses only (radical names and meanings from a dictionary). No folk etymology, no "this character is a picture of…" unless a standard reference says so.
- **A native-speaker spot-check is recommended**, and strongly so for the first 20 posts. Mark anything uncertain in the reply and leave it out.

### Writing rules

- Explanations in Indonesian (`lang: id`), relaxed: `kamu`, `kita`. Grammar terms in Indonesian (nada, kata bantu bilangan), with the Mandarin term once.
- Hanzi in `word:` and table cells; pinyin in `pinyin:` (one syllable per hanzi; tone marks or tone numbers like `xie4 xie5`, the app draws marks; written tone changes such as `bú kèqi` are drawn as typed); `hsk:` for the level badge; `measure:` for the classifier (`本 běn`); `example:` (hanzi, `*…*` highlights characters) with `example-pinyin:` and `translation:`; meaning in `meaning:`. Pinyin columns in tables are plain cells.
- No `say:` respelling: Indonesian spelling misleads on tones and on sounds like x, q, zh. Pinyin is the pronunciation guide.
- One word or one point per deck; tables ≤ 8 rows. Example sentences short and everyday (makan, beli, kenalan).

### Deck recipe

- **Template:** `lexicon/hanzi` (shipped Oct 2026): rice paper, black ink, vermilion, headword characters in 田字格 practice boxes with ruby pinyin, tone colours with `tones: color` (each tone keeps its mark, so colour is never the only signal).
- **Kata hari ini:** cover (kicker `KATA HARI INI · #N`) → `[word]` (`word:`, `pinyin:`, `hsk:`, `meaning:`, `example:` + `example-pinyin:` + `translation:`, `note:` with the source) → one more `[word]` or a `[table]` → `[card]` kuis → `[card]` jawaban → end.
- **Nada:** cover → `[table]` (`| Hanzi | Pinyin | Arti |`, ≤ 8 rows, the rule shown on real words) → `[card]` kuis → `[card]` jawaban → end.
- **Kata bantu bilangan:** cover → `[word]` the classifier → `[table]` 3–5 nouns with it → `[compare]` (`wrong-label: Salah` / `right-label: Benar`) the common mistake → end.
- **End:** `[end cta="Simpan"]`, always a practice prompt for the comments in pinyin with tones ("Tulis 'terima kasih' dan 'sama-sama' pakai pinyin.").
- **Length:** 6–10 slides.
- **Caption:** one line + `Sumber: CC-CEDICT` (or MDBG) + 2–4 hashtags (`#belajarmandarin`, `#bahasamandarin`, `#hsk1`, `#mandarinpemula`).

The shipped sample `lexicon-hanzi-xiexie` (SPEC-script §12). Checked Oct 2026 with `npm run check:cedict`: 谢谢 xiè xie (typed `xie4 xie5`) ✓ · 不客气 bú kèqi ✓ (CC-CEDICT bù kèqi; bú is the written tone change before kè) · 妈 mā ✓ · 麻 má ✓ · 马 mǎ ✓ · 骂 mà ✓; 一本书 yì běn shū follows the 一 rule before a 3rd tone. Native check recommended for the example sentence. Before posting, make the end slide a practice prompt (this sample keeps the spec's wording).

````text

handle: @kosakata.mandarin
template: lexicon/hanzi
script: hanzi
tones: color
lang: id
title: terima kasih & sama-sama
caption: Dua kata pertama yang wajib kamu bisa. #belajarmandarin #bahasamandarin
---
[cover]
Bilang *terima kasih*|dalam Mandarin
Plus cara jawabnya
---
[word]
word: 谢谢
pinyin: xie4 xie5
pos: kata kerja
hsk: 1
meaning: terima kasih
example: *谢谢*你！
example-pinyin: Xièxie nǐ!
translation: Terima kasih (ya)!
---
[word]
word: 不客气
pinyin: bú kèqi
pos: ungkapan
hsk: 1
meaning: sama-sama; jangan sungkan
note: 不 dibaca bú (nada 2) karena diikuti nada 4.
---
[table]
Satu bunyi, empat nada
| Hanzi | Pinyin | Arti |
| 妈 | mā | ibu |
| 麻 | má | rami |
| 马 | mǎ | kuda |
| 骂 | mà | memarahi |
---
[compare]
headline: Buku pakai kata bantu 本
wrong: 一个书
right: 一本书
why: Benda berjilid seperti buku pakai 本 (běn), bukan 个. Dibaca yì běn shū.
---
[end]
Kata apa yang mau kamu pelajari besok?
Tulis di komentar
````

(Renders with zero warnings in every template.)

### Starter list (30 ideas)

1. Kata hari ini #1: 谢谢 xièxie / 不客气 bú kèqi (the example).
2. Kata hari ini: 你好 nǐ hǎo, and when people actually say it.
3. Kata hari ini: 再见 zàijiàn.
4. Kata hari ini: 我 wǒ, 你 nǐ, 他/她 tā (one sound, two characters).
5. Kata hari ini: 茶 chá (and ordering it).
6. Kata hari ini: 人 rén.
7. Nada #1: the four tones on one syllable (ma), with real words only.
8. Nada #2: the neutral tone (谢谢, 吗 ma, 的 de).
9. Nada #3: 不 bù → bú before a 4th tone.
10. Nada #4: 一 yī → yí / yì.
11. Nada #5: 3rd tone + 3rd tone (你好), the tone change speakers make but pinyin doesn't write.
12. Bongkar hanzi: 氵 water radical in 河 hé and 喝 hē.
13. Bongkar hanzi: 口 mouth in 吃 chī, 喝 hē.
14. Bongkar hanzi: 人 person as a component.
15. Bongkar hanzi: 女 nǚ woman as a component (好 hǎo), standard analysis only.
16. Ungkapan: angka 1–10.
17. Ungkapan: 多少钱 duōshao qián, menawar harga.
18. Ungkapan: memesan makanan.
19. Ungkapan: memperkenalkan diri (nama, asal).
20. Kata bantu bilangan: 个 gè, the default classifier.
21. Kata bantu bilangan: 本 běn for books.
22. Kata bantu bilangan: 张 zhāng for flat things.
23. Kata bantu bilangan: 杯 bēi for cups and glasses.
24. Tata bahasa: 是 shì, "adalah" (and when Mandarin doesn't use it).
25. Tata bahasa: 吗 ma, turning a sentence into a yes/no question.
26. Tata bahasa: 的 de, punya.
27. Tata bahasa: 了 le, the basic completed-action use (one use only).
28. Kata Hokkien dalam bahasa Indonesia #1: words like loteng or bakmi (each etymology verified; label Hokkien, not Mandarin).
29. Kuis: pick the classifier.
30. Kuis: pick the tone (two pinyin spellings, one right).

---

## 14. Shared rules

### Standards from the Oct 2026 account reviews (every account, every new deck)

Eight accounts were reviewed (Ruang Rasa, Whistle Notes, Ayat Harian, Kata Baku, Kosakata Inggris, Fathul Learn Coding, Filsafat Harian, Sejarah Nusantara). What we learned, and the numbers behind it, is in `docs/performance.md`. Every deck you write follows these, on top of the account's own section:

1. **The cover is the hook, and the subtitle says what the viewer gets.** A specific, true scene, fact or question, not a topic label. Never "N pertanyaan buat…"-style homework, never a finger-pointing "Kamu masih…".
2. **Never repeat the cover line as a card.** Card 1 is the strongest payoff.
3. **Every slide pays off now:** a line to send, a verdict to check, a word to use, a mistake to stop, something the viewer recognises. No slide that is only setup or filler.
4. **Comment asks take one tap:** a letter, a number, a word, a tag. Not a private paragraph in public.
5. **The end line is specific to the post** (or the deck type) and is never the same on two consecutive posts. The CTA label names the action (`cta="Kirim ke dia"`), not a generic "Simpan • Bagikan".
6. **Search words:** put the phrase people type ("ayat penenang hati", "kata indah bahasa indonesia") in the cover kicker or subtitle and in the caption's first line; hashtags that match searches beat huge generic ones.
7. **Series beat one-offs:** when a format works, number it in the kicker ("KATA INDAH #2", "POJOK BULU TANGKIS #3") and post the next one within the week.
8. **One look per account:** each account has its own template family (Ruang Rasa `editorial/ruang-*`, Whistle Notes `sport/*`, Ayat Harian `serene/*`, Kata Baku `lexicon/kamus`, SKD Harian `lexicon/lembar`, Jago Kantoran `dev/sheet`, and soon Kosakata Arab `lexicon/arab`, Kosakata Mandarin `lexicon/hanzi`…). Text-first; photos only when they add something.
9. **Formats rotate:** never the same format twice in a row on one account.
10. **Before shipping, render it and look:** zero warnings, no word broken mid-word (reword with shorter words), every claim backed by the account's sources.
11. **Card 1 answers the cover.** If the cover names something specific (a command, an error, a phrase, a question), the first card delivers it. In a list deck the cover's item goes first. Viewers who came for the hook won't swipe to slide 6.
12. **Slides that get forwarded must read cold.** On any slide meant to be sent or screenshotted (Ruang Rasa send cards, Ayat Harian reminders, recap cards), the person receiving it only sees that slide. So no instructions addressed to the sender, no `____` blanks, and no "see the previous slide". Tips go on their own slide.
13. **The saved slide is built to be found again.** A recap or cheat card fits one screen, is labelled (what each line is for), has no unexplained repeats, and follows the order of the cards.
14. **Relief over fear.** Hooks name a real moment of trouble or doubt the viewer recognises, and the deck answers it calmly. Never threaten the viewer ("biar nggak dipecat", "kamu bakal gagal"), and never shame them ("Kamu masih…").
15. **Curly quotes in slide text:** `“ ”` and `’`. Straight `"` stays only in code, header lines and `[attr="…"]` values. (Ruang Rasa is converted; other accounts' older decks convert when they are next edited.)

Anything an account section says on top of these is stricter, not looser.

When asked for "N posts" for an account: read its section, pick formats from its "Formats" list (rotating), apply the standards above, and say which format each deck uses.

### General rules

- Don't let any account become a content farm: every deck needs a specific angle, not a generic list.
- No text copied from real TikTok accounts.
- Each account keeps its own default template so feeds look distinct. Borrowing another account's template is fine occasionally, never as a habit.
- Emoji are fine in text (system emoji font); arrows and bookmarks are drawn by the app, don't type them.
- Icons available for `icon=`: alert, book, bug, chat, check-circle, clock, code, coffee, cpu, database, flower, folder, gift, git-branch, heart, heart-spark, home, key, leaf, lightbulb, map-pin, moon, mountain, music, plane, rocket, shield-heart, smile, star, sun, terminal, umbrella (aliases: shield, pin, branch, bulb, check, spark). `arrow-right`, `circle-arrow` and `bookmark` are drawn by the app (swipe hint, CTA) and can't be used in `icon=`.
- When asked for many posts at once, vary pillar, template and opening hook across them.
- **Hooks (owner, Oct 2026):** the cover is the hook. Make it concrete and specific (a number, a name, a surprising true fact, a situation the viewer recognises), not a topic label. The caption's first line adds to the hook instead of summarising the deck. The hook must still be true and backed by the deck: no clickbait, and keep each account's tone (Ayat Harian stays calm; Ruang Rasa stays gentle).
- **Re-uploading a deleted post:** rewrite the cover, caption, title and the wording of every slide, and change the order where it still reads well, so it isn't flagged as the same content. Keep the facts, sources and photos (photo choice and order may change).
- **Fact accounts** (Sejarah Nusantara, Whistle Notes, Peta Angka, Kosakata Inggris, Kata Baku, Ayat Harian, Filsafat Harian, SKD Harian, Jago Kantoran, Kosakata Arab, Kosakata Mandarin): list sources in the reply before the deck; never invent a fact, date, number or quote to fill a gap.
- **Image policy** (all accounts):
  - Any image that's free to reuse. First choice: public domain or CC0 (Wikimedia Commons, Unsplash/Pexels, Rijksmuseum, Nationaal Archief), because they need no credit. Never Google Images, Pinterest, news sites, agency photos or other social accounts.
  - No source manifest or source list in the reply is needed for images. Just pick a fitting free image.
  - Only if the licence requires attribution (CC BY / CC BY-SA): put a short credit line in the caption.
  - Images for sample decks are bundled with the app: save a downscaled JPEG to `src/samples/photos/<photo-id>.jpg` (it fills 1080×1920; wide images cropped to ≤ 2160 px wide), reference it with `photo=<photo-id>`, and set a focal point in `src/samples/photos.ts` if the subject isn't centred. Loading the sample adds it to the photo tray automatically.
- Out of scope for this app: screen recordings, video demos. Only photo carousels.

## 15. Open items

- **Handles.** Decks omit `handle:` and fall back to the single handle in Settings, so most accounts will get the wrong handle. Once the owner gives all thirteen handles, put `handle:` in every deck header. Done: Ruang Rasa (`@ruangrasakita.id`), Fathul Learn Coding (`@fathul_learncoding`), Sejarah Nusantara (`@sejarah.nusantara.id`), Filsafat Harian (`@filsafatharian.id`). Ruang Rasa matters most: its slides are screenshotted out of TikTok, and the handle on the slide is the only way those shares turn into follows.
- **`editorial/tameng` (Filsafat Harian): shipped (Oct 2026),** replacing `editorial/stone` for this account (stone stays available). Two voices: Inter 800 headlines on asphalt, Gentium Book Plus quotes on a paper surface, steel for the "Tapi…" card, one ember accent. Tokens in DESIGN §5.1.
- **Long quote attributions are cut silently.** The attribution line is truncated with "…" at the content width in every editorial template, with no warning. Until a warning (or a second line) exists, keep attributions ≤ 50 characters.
- **Ayah & hadith features: shipped (M8, Oct 2026).** `[ayah]`, `[hadith]`, Amiri Quran / Amiri and `serene/fajr` / `serene/isya` are built (see SPEC-ayah.md). Export is blocked with no override when a required field is missing, the Arabic doesn't fit at 48 px, or the Arabic font didn't load.
- **Lexicon features: shipped (M7, Oct 2026).** `[word]`, `[table]`, `[compare]` and `lexicon/notebook` / `lexicon/kamus` are built (see SPEC-lexicon.md); the card fallbacks in the recipes are no longer needed. Note: KBBI VI Daring now lives at kbbi.kemendikdasmen.go.id, and its etymology labels (Por, Skt…) are only shown to logged-in users, so don't print them unless checked while logged in.
- **Ruang Rasa templates: shipped (Oct 2026).** Ruang Rasa moved off `rose-dusk`/`sage`/`midnight` to `editorial/ruang-*` (Fraunces + Instrument Sans). Still proposed, needs a PRD change: `kicker` on cards, a chat-bubble line, an options list with letter discs, a "kirim ke" tag. **The chat-bubble line comes first** (Oct 2026 second review): a generic bubble (no WhatsApp branding) makes a send card read as "a message to send" at a glance and suits screenshots.
- **BPS Papua fix.** No BPS-based Peta Angka decks until the NusaStats ingest fix is merged (26 new-Papua kabupaten were missing from rankings). Dukcapil and DJPK packs are fine now.
- **`chart` slide.** Add `[chart data=<pack-id> kind=bar top=N]` to Carousel Press: paste a `carousel-data/1` pack into a Data tab, rendered as a bar chart in template colours. Until then, rankings are one card per region.
- **`figure` slide + `credit=`.** A slide that shows an image uncropped in a frame (maps, charts) without the dark photo overlay, plus a `credit="…"` line on photo slides. Needed by Sejarah Nusantara and Peta Angka. Courts and pitches are covered by `[diagram]` (shipped Oct 2026).
- **`editorial/archive` variant.** Sepia paper, dark brown ink, serif, a small year/place label, so Sejarah Nusantara stops borrowing `sage`.
- **New accounts may replace weak ones (owner decides).** SKD Harian and Jago Kantoran could replace an underperforming account (Whistle Notes or Ruang Rasa) instead of running alongside it. Nothing is paused until the owner decides.
- **SKD Harian bio:** must include "Bukan akun resmi BKN" (see §10). No BKN, KemenPANRB, school or BUMN logos anywhere.
- **`lexicon/lembar` (SKD Harian) and `dev/sheet` (Jago Kantoran): shipped (Oct 2026).** Built for these accounts, plus `excel` formula colouring in code blocks and the `[sheet]` slide (PRD §4.10), a mini spreadsheet for Jago Kantoran's formula steps (see `docs/decisions.md`).
- **No-strike compare (proposed, Kosakata Inggris, Oct 2026).** `[compare]` always strikes through the left box, so it can only show real mistakes. "Kaku vs natural" slides (Sekolah vs aslinya, Interview) need the same two-box look without the strike and red tint, e.g. a `style: soft` field on `[compare]` (neutral left box, no strike). Needs a SPEC-lexicon change and owner approval; until then those slides are cards.
- **Image-question slide (proposed, SKD Harian).** Figural TIU questions (pattern series, rotations, mirror images) need a question image drawn or shown uncropped with options A–E under it. This overlaps the proposed `figure` slide; until one exists, SKD Harian posts no figural questions.
- **Difficulty badge (SKD Harian).** No attribute exists for a difficulty badge; the difficulty goes in each question card's kicker (`Soal 3 · Sedang`). A real badge would need a PRD change.
- **Launch order: Kosakata Arab first, Kosakata Mandarin a few weeks later** (device and account limits). Both are postable since M9a/M9b.
- **`lexicon/arab` and Arabic script support: shipped (M9a, Oct 2026).** RTL Arabic with harakat in word/table/compare, `translit`/`root`/`pattern`/`plural`, `[table dir=rtl]`, blocking `script-glyph-missing` / `script-overflow` (see SPEC-script.md).
- **`lexicon/hanzi` and hanzi support: shipped (M9b, Oct 2026).** Noto SC slices loaded per text, kinsoku, pinyin with ruby, tone colours, 田字格 boxes, blocking `script-glyph-missing` / `script-overflow` (see SPEC-script.md).
- **Missing-glyph check for CJK: fixed (M9b).** Hanzi without a loaded or bundled glyph now raise the blocking `script-glyph-missing`, and hanzi inside Latin text come from Noto Sans SC.
- **`check:cedict` (shipped, Oct 2026).** `npm run check:cedict -- <deck.txt>` validates hanzi and pinyin against CC-CEDICT (data file not committed: CC BY-SA 4.0; download steps in the script). There is no equivalent for Arabic: Almaany blocks scripted requests and Hans Wehr isn't online, so Arabic harakat stay a manual check (plus Wiktionary as a scripted cross-check).
- **Pronunciation videos (later phase, both language accounts).** Voice only, native audio or native-checked, never text-to-speech. Out of scope for this app (photo carousels only).

