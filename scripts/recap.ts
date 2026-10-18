// Sports Codex match recap: fetch one night's finished matches from ESPN's public site API and
// write ONE post per competition, in that competition's template: cover → all results → one
// stats page per match (scorers, possession, shots…) → end. Every number comes from the API.
// Club crests are downloaded to recaps/<date>/crests/ (local only, git-ignored, never bundled)
// and the PNGs are rendered with the app's renderer into recaps/<date>/<league>/.
//
//   npm run recap -- --date 2026-10-17                  (weekend: pl, laliga, seriea, bundesliga)
//   npm run recap -- --date 2026-10-21 --leagues ucl    (midweek: ucl, uel, uecl)
//   add --no-crests for colour badges, --no-render to only write the decks
//
// The date is the European match day (ESPN's date); matches ending after midnight WIB are included.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify } from '../packages/carousel-core/src/core/slug';

const LEAGUES: Record<string, { id: string; name: string; tags: string; template: string }> = {
  pl: { id: 'eng.1', name: 'Premier League', tags: '#premierleague #epl', template: 'sport/pl' },
  laliga: { id: 'esp.1', name: 'LaLiga', tags: '#laliga #ligaspanyol', template: 'sport/laliga' },
  seriea: { id: 'ita.1', name: 'Serie A', tags: '#seriea #ligaitalia', template: 'sport/seriea' },
  bundesliga: { id: 'ger.1', name: 'Bundesliga', tags: '#bundesliga #ligajerman', template: 'sport/bundesliga' },
  ucl: { id: 'uefa.champions', name: 'Liga Champions', tags: '#ucl #ligachampions', template: 'sport/ucl' },
  uel: { id: 'uefa.europa', name: 'Liga Europa', tags: '#uel #ligaeuropa', template: 'sport/uel' },
  uecl: { id: 'uefa.europa.conf', name: 'Liga Konferensi', tags: '#uecl #conferenceleague', template: 'sport/uecl' },
};
const DEFAULT_LEAGUES = ['pl', 'laliga', 'seriea', 'bundesliga'];
const API = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const ROWS_PER_SLIDE = 9;
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

interface Side { code: string; name: string; color: string; goals: number; id: string; logo: string | null; crest: string | null }
interface Game { league: string; leagueName: string; id: string; home: Side; away: Side; stats: Record<string, Record<string, number>>; goals: { min: string; who: string; team: string }[]; rank: Record<string, number> }

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

async function get(url: string): Promise<any> {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return await r.json();
    } catch (e) {
      if (attempt >= 3) throw e;
      await new Promise((ok) => setTimeout(ok, 1500 * attempt));
    }
  }
}

const code = (s: string): string => s.normalize('NFKD').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'TIM';
const color = (c: string | undefined): string => (c && /^[0-9a-fA-F]{6}$/.test(c) ? `#${c.toUpperCase()}` : '#8A8F8C');
/** "Yussuf Poulsen" → "Poulsen"; keeps particles: "Virgil van Dijk" → "van Dijk". */
const surname = (full: string): string => {
  const w = full.trim().split(/\s+/);
  if (w.length < 2) return full;
  const i = w.findIndex((x, j) => j > 0 && /^(van|von|de|da|di|dos|del|der|el|al|le|la)$/i.test(x));
  return (i > 0 ? w.slice(i) : w.slice(-1)).join(' ');
};
const clean = (s: string): string => s.replace(/[|#*`]/g, '').trim();
/** A stat value, NaN when the API didn't send it. */
const val = (o: Record<string, number> | undefined, k: string): number => o?.[k] ?? NaN;
const fmt = (n: number): string => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));

async function ranks(league: string): Promise<Record<string, number>> {
  try {
    const d = await get(`https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings`);
    const out: Record<string, number> = {};
    const entries = d.children?.[0]?.standings?.entries ?? [];
    for (const e of entries) {
      const rank = e.stats?.find((s: any) => s.name === 'rank')?.value;
      if (typeof rank === 'number') out[e.team.id] = rank;
    }
    return out;
  } catch {
    return {};
  }
}

async function games(key: string, date: string): Promise<{ done: Game[]; skipped: string[] }> {
  const L = LEAGUES[key]!;
  const board = await get(`${API}/${L.id}/scoreboard?dates=${date}`);
  const rank = L.id.startsWith('uefa') ? {} : await ranks(L.id);
  const done: Game[] = [];
  const skipped: string[] = [];
  for (const e of board.events ?? []) {
    const comp = e.competitions[0];
    const side = (h: string): Side => {
      const c = comp.competitors.find((x: any) => x.homeAway === h);
      return { code: code(c.team.abbreviation ?? c.team.displayName), name: clean(c.team.shortDisplayName ?? c.team.displayName), color: color(c.team.color), goals: Number(c.score ?? 0), id: c.team.id,
        logo: typeof c.team.logo === 'string' ? c.team.logo : null, crest: null };
    };
    if (!e.status?.type?.completed) {
      skipped.push(`${L.name}: ${e.name} (${e.status?.type?.description ?? 'belum selesai'})`);
      continue;
    }
    const home = side('home');
    const away = side('away');
    const sum = await get(`${API}/${L.id}/summary?event=${e.id}`);
    const stats: Game['stats'] = {};
    for (const t of sum.boxscore?.teams ?? []) {
      stats[t.team.id] = Object.fromEntries((t.statistics ?? []).map((s: any) => [s.name, Number(s.displayValue)]));
    }
    const goals = (sum.keyEvents ?? [])
      .filter((k: any) => k.scoringPlay)
      .map((k: any) => ({
        min: k.clock?.displayValue ?? '',
        who: clean(surname(k.participants?.[0]?.athlete?.displayName ?? '?') + (/own/i.test(k.type?.text ?? '') ? ' (bd)' : /pen/i.test(k.type?.text ?? '') ? ' (p)' : '')),
        team: k.team?.id === home.id ? home.code : away.code,
      }));
    done.push({ league: key, leagueName: L.name, id: e.id, home, away, stats, goals, rank });
  }
  return { done, skipped };
}

const teamLine = (s: Side): string => `${s.code} ${s.name} ${s.color}${s.crest ? ` @${s.crest}` : ''}`;
const scoreLine = (g: Game, hl = false): string => `${teamLine(g.home)} | ${g.home.goals}-${g.away.goals} | ${teamLine(g.away)}${hl ? ' *' : ''}`;

/** The lower-ranked team won and the gap is at least 6 places. */
function upsetGap(g: Game): number {
  const rh = g.rank[g.home.id];
  const ra = g.rank[g.away.id];
  if (!rh || !ra || g.home.goals === g.away.goals) return 0;
  const winnerRank = g.home.goals > g.away.goals ? rh : ra;
  const loserRank = g.home.goals > g.away.goals ? ra : rh;
  return winnerRank - loserRank >= 6 ? winnerRank - loserRank : 0;
}

interface Story { g: Game; score: number; headline: string; hook: string }

function story(g: Game): Story | null {
  const h = g.stats[g.home.id];
  const a = g.stats[g.away.id];
  if (!h || !a || !Number.isFinite(val(h, 'possessionPct'))) return null;
  const total = g.home.goals + g.away.goals;
  const winner = g.home.goals > g.away.goals ? g.home : g.away.goals > g.home.goals ? g.away : null;
  const loser = winner === g.home ? g.away : winner === g.away ? g.home : null;
  const ls = loser ? g.stats[loser.id]! : null;
  const ws = winner ? g.stats[winner.id]! : null;
  const sc = `${g.home.goals}–${g.away.goals}`;
  // Score from the loser's side for "kalah" lines, the winner's side for "menang".
  const lossSc = loser ? `${loser.goals}–${winner!.goals}` : sc;
  const winSc = winner ? `${winner.goals}–${loser!.goals}` : sc;
  const cands: Story[] = [];
  if (loser && ls && val(ls, 'possessionPct') >= 60) cands.push({ g, score: 50 + val(ls, 'possessionPct'), headline: `${loser.name} kuasai bola ${fmt(val(ls, 'possessionPct'))}%, *tetap kalah ${lossSc}.*`, hook: `${loser.name} kalah, padahal kuasai bola.` });
  if (loser && ls && ws && val(ls, 'totalShots') >= 2 * Math.max(1, val(ws, 'totalShots'))) cands.push({ g, score: 60 + val(ls, 'totalShots'), headline: `${val(ls, 'totalShots')} tembakan lawan ${val(ws, 'totalShots')}, *${loser.name} tetap kalah.*`, hook: `${loser.name} kalah, padahal ${val(ls, 'totalShots')} tembakan.` });
  if (total >= 5) cands.push({ g, score: 40 + total * 12 + Math.abs(g.home.goals - g.away.goals), headline: `${total} gol dalam satu laga: *${g.home.name} ${sc} ${g.away.name}.*`, hook: `${g.home.name} ${sc} ${g.away.name}.` });
  if (upsetGap(g)) cands.push({ g, score: 45 + upsetGap(g), headline: `Peringkat ${g.rank[winner!.id]} kalahkan peringkat ${g.rank[loser!.id]}: *${winner!.name} menang ${winSc}.*`, hook: `${winner!.name} bikin kejutan.` });
  return cands.sort((x, y) => y.score - x.score)[0] ?? null;
}

const STAT_ROWS: [string, string, string][] = [
  ['Penguasaan bola', 'possessionPct', '%'], ['Tembakan', 'totalShots', ''], ['Tepat sasaran', 'shotsOnTarget', ''],
  ['Kartu merah', 'redCards', ''], ['Sepak pojok', 'wonCorners', ''], ['Kartu kuning', 'yellowCards', ''], ['Pelanggaran', 'foulsCommitted', ''],
];

/** Default headline for a match without a stronger story. */
function plainHeadline(g: Game): string {
  const sc = `${g.home.goals}–${g.away.goals}`;
  if (g.home.goals === g.away.goals) return `${g.home.name} dan ${g.away.name} *imbang ${sc}.*`;
  const [w, l] = g.home.goals > g.away.goals ? [g.home, g.away] : [g.away, g.home];
  return `${w.name} *menang ${w.goals}–${l.goals}* atas ${l.name}.`;
}

const maxScorers = (g: Game): number => Math.max(...[g.home, g.away].map((t) => new Set(g.goals.filter((x) => x.team === t.code).map((x) => x.who)).size));

function statsSlide(g: Game, i: number, n: number): string {
  const h = g.stats[g.home.id];
  const a = g.stats[g.away.id];
  const rows = h && a ? STAT_ROWS.filter(([, k]) => Number.isFinite(val(h, k)) && Number.isFinite(val(a, k)) && !(k === 'redCards' && val(h, k) + val(a, k) === 0))
    // Many scorers take room from the stat rows: 4+ on one side leaves 4 rows (or 3 when 5+).
    .slice(0, 5 - Math.max(0, Math.min(2, maxScorers(g) - 3)))
    .map(([label, k, unit]) => `${label} | ${fmt(val(h, k))}${unit} | ${fmt(val(a, k))}${unit}`) : [];
  // One line per scorer: a brace or hat-trick reads "Nkunku 5' 41' 44'".
  const side = (t: Side): string => {
    const byWho = new Map<string, string[]>();
    for (const x of g.goals.filter((y) => y.team === t.code)) byWho.set(x.who, [...(byWho.get(x.who) ?? []), x.min]);
    return [...byWho].map(([who, mins]) => `${who} ${mins.join(' ')}`).join(', ') || '-';
  };
  return [
    `[stats kicker="LAGA ${i} DARI ${n}"]`,
    story(g)?.headline ?? plainHeadline(g),
    '```stats',
    scoreLine(g),
    ...(g.goals.length ? [`Gol | ${side(g.home)} | ${side(g.away)}`] : []),
    ...rows,
    '```',
  ].join('\n');
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function fetchCrests(all: Game[], dir: string): Promise<void> {
  mkdirSync(dir, { recursive: true });
  const seen = new Map<string, string | null>();
  for (const s of all.flatMap((g) => [g.home, g.away])) {
    if (!seen.has(s.id)) {
      const id = `crest-${slugify(s.name)}`;
      const file = join(dir, `${id}.png`);
      let ok = existsSync(file);
      for (let attempt = 1; !ok && s.logo && attempt <= 3; attempt++) {
        try {
          const r = await fetch(s.logo, { headers: { 'user-agent': 'Mozilla/5.0' } });
          if (r.ok) {
            writeFileSync(file, Buffer.from(await r.arrayBuffer()));
            ok = true;
          }
        } catch { /* retried, then falls back to the colour badge */ }
        if (!ok) await new Promise((res) => setTimeout(res, 1500 * attempt));
      }
      if (!ok) console.log(`crest: no image for ${s.name}, using the colour badge`);
      seen.set(s.id, ok ? id : null);
    }
    s.crest = seen.get(s.id) ?? null;
  }
}

function leagueDeck(key: string, lg: Game[], dayLabel: string): string {
  const L = LEAGUES[key]!;
  const goals = lg.reduce((n, g) => n + g.home.goals + g.away.goals, 0);
  const upsets = new Set(lg.filter((g) => upsetGap(g) > 0).map((g) => g.id));
  const best = lg.map(story).filter((s): s is Story => !!s).sort((x, y) => y.score - x.score)[0];
  const slides: string[] = [];
  slides.push([
    `[cover kicker="${L.name.toUpperCase()} · ${dayLabel}"]`,
    `${lg.length} laga, ${goals} gol. | *${best?.hook ?? 'Semua skor tadi malam.'}*`,
    `Hasil lengkap ${L.name}, lalu statistik tiap laga: pencetak gol, penguasaan bola, tembakan.`,
  ].join('\n'));
  for (let i = 0; i < lg.length; i += ROWS_PER_SLIDE) {
    const part = lg.length > ROWS_PER_SLIDE ? ` (${i / ROWS_PER_SLIDE + 1}/${Math.ceil(lg.length / ROWS_PER_SLIDE)})` : '';
    const chunk = lg.slice(i, i + ROWS_PER_SLIDE);
    slides.push([
      `[results kicker="HASIL · ${dayLabel}"]`,
      `Semua skor${part}`,
      '```results',
      ...chunk.map((g) => scoreLine(g, upsets.has(g.id))),
      '```',
      ...(chunk.some((g) => upsets.has(g.id)) ? ['Bingkai: tim peringkat lebih bawah menang.'] : []),
    ].join('\n'));
  }
  lg.forEach((g, i) => slides.push(statsSlide(g, i + 1, lg.length)));
  slides.push(['[end cta="Follow"]', 'Tim kamu *menang atau kalah?*', `Komen kode timnya. Contoh: ${lg[0]!.home.code}.`].join('\n'));
  const header = [
    'handle: @sportscodex',
    `template: ${L.template}`,
    'lang: id',
    `title: ${L.name} ${dayLabel.toLowerCase()}`,
    `caption: Hasil ${L.name} tadi malam: ${lg.map((g) => `${g.home.name} ${g.home.goals}-${g.away.goals} ${g.away.name}`).join(', ')}. Statistik tiap laga di dalam. Data: ESPN. ${L.tags} #sportscodex`,
  ].join('\n');
  return `${header}\n---\n${slides.join('\n---\n')}\n`;
}

/** Render each deck with the app's renderer (the dev review page), writing PNGs next to the deck. */
async function renderDecks(decks: { text: string; dir: string }[], crestDir: string): Promise<void> {
  console.log('render: building the renderer…');
  execSync('npx vite build --outDir dist-review --logLevel error', { cwd: root, env: { ...process.env, REVIEW: '1' }, stdio: 'inherit' });
  const { preview } = await import('vite');
  const { chromium } = await import('playwright');
  const server = await preview({ root, base: './', build: { outDir: 'dist-review' }, preview: { port: 4189, strictPort: false } });
  const url = server.resolvedUrls?.local[0] ?? 'http://localhost:4189/';
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
    await page.goto(`${url}review.html`);
    await page.waitForFunction(() => typeof window.__renderDeck === 'function');
    for (const d of decks) {
      const ids = [...new Set([...d.text.matchAll(/@(crest-[a-z0-9-]+)/g)].map((m) => m[1]!))];
      const images: Record<string, string> = {};
      for (const id of ids) {
        const f = join(crestDir, `${id}.png`);
        if (existsSync(f)) images[id] = `data:image/png;base64,${readFileSync(f).toString('base64')}`;
      }
      const r = await page.evaluate(([text, imgs]) => window.__renderDeck!(text, imgs), [d.text, images] as const);
      mkdirSync(d.dir, { recursive: true });
      r.dataUrls.forEach((u, i) => writeFileSync(join(d.dir, `${String(i + 1).padStart(2, '0')}.png`), Buffer.from(u.split(',')[1]!, 'base64')));
      const blocking = r.warnings.filter((w) => w.code === 'overflow' || w.code === 'match-line');
      console.log(`render: ${r.dataUrls.length} PNG → ${d.dir}${blocking.length ? `  ⚠ ${blocking.map((w) => w.message).join('; ')}` : ''}`);
    }
  } finally {
    await browser.close();
    await new Promise<void>((ok) => server.httpServer.close(() => ok()));
  }
}

async function main(): Promise<void> {
  const date = (arg('date') ?? '').replace(/-/g, '');
  if (!/^\d{8}$/.test(date)) throw new Error('Use --date YYYY-MM-DD (the European match day)');
  const keys = (arg('leagues') ?? DEFAULT_LEAGUES.join(',')).split(',').map((k) => k.trim()).filter(Boolean);
  for (const k of keys) if (!LEAGUES[k]) throw new Error(`Unknown league "${k}". Use: ${Object.keys(LEAGUES).join(', ')}`);
  const d = new Date(Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8)));
  const dayLabel = `${HARI[d.getUTCDay()]} ${d.getUTCDate()} ${BULAN[d.getUTCMonth()]}`.toUpperCase();
  const outDir = arg('out') ?? join(root, 'recaps', `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`);
  const crestDir = join(outDir, 'crests');

  const byLeague: [string, Game[]][] = [];
  const skipped: string[] = [];
  for (const k of keys) {
    const r = await games(k, date);
    skipped.push(...r.skipped);
    if (r.done.length) byLeague.push([k, r.done]);
  }
  if (!byLeague.length) throw new Error('No finished matches for that date yet.');
  const all = byLeague.flatMap(([, g]) => g);
  if (!process.argv.includes('--no-crests')) await fetchCrests(all, crestDir);

  const decks: { text: string; dir: string }[] = [];
  mkdirSync(outDir, { recursive: true });
  for (const [k, lg] of byLeague) {
    const text = leagueDeck(k, lg, dayLabel);
    writeFileSync(join(outDir, `${k}.txt`), text);
    decks.push({ text, dir: join(outDir, k) });
    console.log(`deck: ${LEAGUES[k]!.name}: ${lg.length} laga → ${join(outDir, `${k}.txt`)}`);
  }
  if (skipped.length) console.log(`not finished (left out):\n  ${skipped.join('\n  ')}`);
  if (!process.argv.includes('--no-render')) await renderDecks(decks, crestDir);
}

main().catch((e) => {
  console.error(`recap: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
