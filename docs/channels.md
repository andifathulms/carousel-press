# Channels: content brief for writing decks

Read this before writing any deck. The owner runs two TikTok accounts, and every deck is for exactly one of them.
If a request names an account ("10 posts for Ruang Rasa", "deck for Fathul Learn Coding"), use that account's section.
If it doesn't name one, infer it from the topic (relationships/feelings → Ruang Rasa, code/AI/tools → Fathul Learn Coding) and say which one you picked.

The deck format is PRD §4. This file only says *what* to write and which template/attributes to use. It adds no new syntax.

| | 🌿 Ruang Rasa | 💻 Fathul Learn Coding |
|---|---|---|
| Purpose | Start conversations | Teach/share useful things |
| Audience | Indonesian young adults | Indonesian beginner/junior devs, students, AI-curious |
| Reader should think | "I want to send this to someone." | "I should save this." |
| Primary action | Share / save | Save / follow |
| Tone | Warm, intimate, relatable, thoughtful | Practical, curious, friendly, concise, slightly nerdy |
| Voice | Anonymous companion | Fathul learning in public: "belajar bareng, bukan menggurui" |
| Template family | `editorial/*` | `dev/*` |
| Slide types | `cover`, `card`, `quote`, `end` | `cover`, `card`, `code`, `end` (`quote` rarely) |

---

## 1. 🌿 Ruang Rasa

**Tagline:** *Pertanyaan kecil. Cerita yang lebih dalam.*
A faceless Indonesian account about meaningful conversations, relationships and self-reflection.
It should feel like "someone gave me a good question to think about", never "someone is telling me how to live my life".

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
- **Cards:** pick a fitting `icon=` per card (see list below) or leave `auto`. Don't type `01`, `02`: badge numbers are drawn automatically.
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

- **Templates:** `dev/github-dark` (default: near-black + green, closest to the brand), `dev/terminal` (Linux/CLI topics). `dev/paper-light` has a blue accent, so it's off-brand; use it only for variety.
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

## 3. Shared rules

- Don't let either account become a content farm: every deck needs a specific angle, not a generic list.
- No text copied from real TikTok accounts.
- Emoji are fine in text (system emoji font); arrows and bookmarks are drawn by the app, don't type them.
- Icons available for `icon=`: alert, arrow-right, book, bookmark, bug, chat, check-circle, circle-arrow, clock, code, coffee, cpu, database, flower, folder, gift, git-branch, heart, heart-spark, home, key, leaf, lightbulb, map-pin, moon, mountain, music, plane, rocket, shield-heart, smile, star, sun, terminal, umbrella (aliases: shield, pin, branch, bulb, check, spark).
- When asked for many posts at once, vary pillar, template and opening hook across them.
- Out of scope for this app: screen recordings, video demos. Only photo carousels.

## 4. Open items

- **Handles.** Decks omit `handle:` and fall back to the single handle in Settings, so one of the two accounts will get the wrong handle. Once the owner gives both handles, put `handle:` in every deck header.
- **Fonts vs the brand note.** The brand note says Playfair Display + DM Sans; `editorial/rose-dusk` uses Playfair + Poppins (DM Sans is on `midnight`). Tokens follow DESIGN.md, so this is accepted as-is unless the owner wants a variant change.
