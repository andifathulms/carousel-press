// Sports Codex match recap: fetch one night's finished matches from ESPN's public site API
// and write a Carousel Press deck (cover → [results] per league → [stats] for the 2 best
// stories → end). Every number on the slides comes from the API response; nothing is invented.
//
//   npm run recap -- --date 2026-10-17                 (Saturday: PL, LaLiga, Serie A, Bundesliga)
//   npm run recap -- --date 2026-10-21 --leagues ucl   (midweek: ucl, uel, uecl)
//
// The date is the European match day (ESPN's date). Matches that end after midnight WIB are included.
import { mkdirSync, writeFileSync } from 'node:fs';

const LEAGUES: Record<string, { id: string; name: string; tag: string }> = {
  pl: { id: 'eng.1', name: 'Premier League', tag: '#premierleague' },
  laliga: { id: 'esp.1', name: 'LaLiga', tag: '#laliga' },
  seriea: { id: 'ita.1', name: 'Serie A', tag: '#seriea' },
  bundesliga: { id: 'ger.1', name: 'Bundesliga', tag: '#bundesliga' },
  ucl: { id: 'uefa.champions', name: 'Liga Champions', tag: '#ucl' },
  uel: { id: 'uefa.europa', name: 'Liga Europa', tag: '#uel' },
  uecl: { id: 'uefa.europa.conf', name: 'Liga Konferensi', tag: '#uecl' },
};
const DEFAULT_LEAGUES = ['pl', 'laliga', 'seriea', 'bundesliga'];
const API = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const ROWS_PER_SLIDE = 9;
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

interface Side { code: string; name: string; color: string; goals: number; id: string }
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
      return { code: code(c.team.abbreviation ?? c.team.displayName), name: clean(c.team.shortDisplayName ?? c.team.displayName), color: color(c.team.color), goals: Number(c.score ?? 0), id: c.team.id };
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

const teamLine = (s: Side): string => `${s.code} ${s.name} ${s.color}`;
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
  if (total >= 5) cands.push({ g, score: 40 + total * 5, headline: `${total} gol dalam satu laga: *${g.home.name} ${sc} ${g.away.name}.*`, hook: `${g.home.name} ${sc} ${g.away.name}.` });
  if (upsetGap(g)) cands.push({ g, score: 45 + upsetGap(g), headline: `Peringkat ${g.rank[winner!.id]} kalahkan peringkat ${g.rank[loser!.id]}: *${winner!.name} menang ${winSc}.*`, hook: `${winner!.name} bikin kejutan.` });
  return cands.sort((x, y) => y.score - x.score)[0] ?? null;
}

const STAT_ROWS: [string, string, string][] = [
  ['Penguasaan bola', 'possessionPct', '%'], ['Tembakan', 'totalShots', ''], ['Tepat sasaran', 'shotsOnTarget', ''],
  ['Kartu merah', 'redCards', ''], ['Sepak pojok', 'wonCorners', ''], ['Kartu kuning', 'yellowCards', ''], ['Pelanggaran', 'foulsCommitted', ''],
];

function statsSlide(s: Story): string {
  const g = s.g;
  const h = g.stats[g.home.id]!;
  const a = g.stats[g.away.id]!;
  const rows = STAT_ROWS.filter(([, k]) => Number.isFinite(val(h, k)) && Number.isFinite(val(a, k)) && !(k === 'redCards' && val(h, k) + val(a, k) === 0))
    .slice(0, 5)
    .map(([label, k, unit]) => `${label} | ${fmt(val(h, k))}${unit} | ${fmt(val(a, k))}${unit}`);
  const scorers = [g.home, g.away]
    .map((t) => ({ t, list: g.goals.filter((x) => x.team === t.code).map((x) => `${x.who} ${x.min}`) }))
    .filter((x) => x.list.length)
    .map((x) => `${x.t.code}: ${x.list.join(', ')}`);
  return [
    `[stats kicker="${g.leagueName.toUpperCase()}"]`,
    s.headline,
    ...(scorers.length ? scorers : ['Tanpa gol.']),
    '```stats',
    scoreLine(g),
    ...rows,
    '```',
  ].join('\n');
}

async function main(): Promise<void> {
  const date = (arg('date') ?? '').replace(/-/g, '');
  if (!/^\d{8}$/.test(date)) throw new Error('Use --date YYYY-MM-DD (the European match day)');
  const keys = (arg('leagues') ?? DEFAULT_LEAGUES.join(',')).split(',').map((k) => k.trim()).filter(Boolean);
  for (const k of keys) if (!LEAGUES[k]) throw new Error(`Unknown league "${k}". Use: ${Object.keys(LEAGUES).join(', ')}`);

  const all: Game[] = [];
  const skipped: string[] = [];
  for (const k of keys) {
    const r = await games(k, date);
    all.push(...r.done);
    skipped.push(...r.skipped);
  }
  if (!all.length) throw new Error('No finished matches for that date yet.');

  const d = new Date(Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8)));
  const dayLabel = `${HARI[d.getUTCDay()]} ${d.getUTCDate()} ${BULAN[d.getUTCMonth()]}`.toUpperCase();
  const goals = all.reduce((n, g) => n + g.home.goals + g.away.goals, 0);
  const upsets = new Set(all.filter((g) => upsetGap(g) > 0).map((g) => g.id));
  const stories = all.map(story).filter((s): s is Story => !!s).sort((x, y) => y.score - x.score);
  const picks: Story[] = [];
  for (const s of stories) {
    if (picks.length >= 2) break;
    if (picks.some((p) => p.g.league === s.g.league) && stories.some((o) => !picks.includes(o) && o !== s && o.g.league !== s.g.league && !picks.some((p) => p.g.league === o.g.league))) continue;
    picks.push(s);
  }
  const leaguesUsed = keys.filter((k) => all.some((g) => g.league === k)).map((k) => LEAGUES[k]!);
  const hook = picks[0]?.hook ?? '';
  const slides: string[] = [];
  slides.push([
    `[cover kicker="RECAP · ${dayLabel}"]`,
    `${all.length} laga, ${goals} gol. | *${hook || 'Semua skor tadi malam.'}*`,
    `Semua skor ${leaguesUsed.map((l) => l.name).join(', ')}.${picks.length ? ` Plus statistik ${picks.length} laga paling seru.` : ''}`,
  ].join('\n'));
  for (const L of leaguesUsed) {
    const lg = all.filter((g) => g.leagueName === L.name);
    for (let i = 0; i < lg.length; i += ROWS_PER_SLIDE) {
      const part = lg.length > ROWS_PER_SLIDE ? ` (${i / ROWS_PER_SLIDE + 1}/${Math.ceil(lg.length / ROWS_PER_SLIDE)})` : '';
      slides.push([
        `[results kicker="HASIL · ${dayLabel}"]`,
        `${L.name}${part}`,
        '```results',
        ...lg.slice(i, i + ROWS_PER_SLIDE).map((g) => scoreLine(g, upsets.has(g.id))),
        '```',
        ...(lg.slice(i, i + ROWS_PER_SLIDE).some((g) => upsets.has(g.id)) ? ['Bingkai kuning: tim peringkat lebih bawah menang.'] : []),
      ].join('\n'));
    }
  }
  for (const s of picks) slides.push(statsSlide(s));
  slides.push(['[end cta="Follow"]', 'Tim kamu *menang atau kalah?*', 'Komen kode timnya. Contoh: ' + (all[0]?.home.code ?? 'ARS') + '.'].join('\n'));

  const header = [
    'handle: @sportscodex',
    'template: sport/papan',
    'lang: id',
    `title: recap ${date}`,
    `caption: Hasil ${leaguesUsed.map((l) => l.name).join(', ')} tadi malam, lengkap dengan statistik. Data: ESPN. ${leaguesUsed.map((l) => l.tag).slice(0, 4).join(' ')} #sportscodex`,
  ].join('\n');
  const text = `${header}\n---\n${slides.join('\n---\n')}\n`;
  const out = arg('out') ?? `recaps/recap-${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}.txt`;
  mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(out, text);
  console.log(`recap: ${all.length} matches, ${goals} goals, ${slides.length} slides → ${out}`);
  if (picks.length) console.log(`stats: ${picks.map((p) => `${p.g.home.name} ${p.g.home.goals}-${p.g.away.goals} ${p.g.away.name}`).join(' · ')}`);
  if (skipped.length) console.log(`not finished (left out):\n  ${skipped.join('\n  ')}`);
}

main().catch((e) => {
  console.error(`recap: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
