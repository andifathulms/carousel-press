// `[results]` and `[stats]` notation (PRD §4.11): football scorelines and one match's stats.
// Pure: no DOM. A team is "CODE Name #hex": a 2–4 character code drawn in a colour badge
// (never a club crest), the name, and the badge colour.
//
//   ```results
//   EVE Everton #274488 | 1-2 | CHE Chelsea #034694 *     ← trailing * = highlighted row
//   ```
//
//   ```stats
//   ARS Arsenal #E20520 | 2-1 | LEE Leeds United #FFCD00  ← first line: the match
//   Penguasaan bola | 58,2% | 41,8%                        ← label | home | away
//   Tembakan | 13 | 11
//   ```

export const RESULTS_MAX_ROWS = 9;
export const STATS_MAX_ROWS = 7;

export interface Team {
  code: string;
  name: string;
  /** #rrggbb */
  color: string;
  /** Photo id of the crest image (`@crest-arsenal`), drawn instead of the code when the image is available. */
  crest: string | null;
}

export interface ResultRow {
  home: Team;
  away: Team;
  homeGoals: number;
  awayGoals: number;
  highlight: boolean;
}

export interface StatRow {
  label: string;
  home: string;
  away: string;
  /** Numeric values for the bars (comma or dot decimals; %, letters ignored). */
  homeValue: number;
  awayValue: number;
}

export interface MatchData {
  kind: 'results' | 'stats';
  rows: ResultRow[];
  /** stats only: the match in the header and its stat rows. */
  match: ResultRow | null;
  stats: StatRow[];
  /** stats only: a `Gol | … | …` line: scorers per side, comma-separated ("Saka 12'"). */
  goals: { home: string[]; away: string[] } | null;
}

export interface MatchIssue {
  /** 0-based line inside the fence, or -1 for the whole fence. */
  offset: number;
  message: string;
}

const TEAM = /^([A-Za-z0-9]{2,4})\s+(.+?)\s+(#[0-9a-fA-F]{6})(?:\s+@([a-z0-9][a-z0-9-]{0,60}))?$/;
const SCORE = /^(\d{1,2})\s*[-–:]\s*(\d{1,2})$/;

function parseTeam(s: string): Team | null {
  const m = TEAM.exec(s.trim());
  return m ? { code: m[1]!.toUpperCase(), name: m[2]!, color: m[3]!.toUpperCase(), crest: m[4] ?? null } : null;
}

/** "CODE Name #hex | 1-2 | CODE Name #hex [*]" → a row, or a reason it isn't one. */
export function parseResultLine(line: string): ResultRow | string {
  let text = line.trim();
  const highlight = /\s\*$/.test(text);
  if (highlight) text = text.slice(0, -1).trim();
  const parts = text.split('|').map((p) => p.trim());
  if (parts.length !== 3) return 'Expected "CODE Name #hex | 1-2 | CODE Name #hex"';
  const home = parseTeam(parts[0]!);
  const away = parseTeam(parts[2]!);
  const score = SCORE.exec(parts[1]!);
  if (!home || !away) return 'A team must be written "CODE Name #rrggbb"';
  if (!score) return 'The score must be written like 1-2';
  return { home, away, homeGoals: Number(score[1]), awayGoals: Number(score[2]), highlight };
}

/** "58,2%" → 58.2, "1.234" (Indonesian thousands) → 1234, "0.9" → 0.9. */
export function statNumber(s: string): number {
  const noThousands = s.replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2');
  const m = /-?\d+(?:[.,]\d+)?/.exec(noThousands);
  return m ? Number(m[0].replace(',', '.')) : NaN;
}
const num = statNumber;

export function parseMatch(kind: 'results' | 'stats', lines: string[]): { data: MatchData | null; issues: MatchIssue[] } {
  const issues: MatchIssue[] = [];
  const rows: ResultRow[] = [];
  const stats: StatRow[] = [];
  let match: ResultRow | null = null;
  let goals: MatchData['goals'] = null;
  lines.forEach((raw, offset) => {
    if (raw.trim() === '') return;
    if (kind === 'results' || !match) {
      const r = parseResultLine(raw);
      if (typeof r === 'string') {
        issues.push({ offset, message: r });
        return;
      }
      if (kind === 'results') {
        if (rows.length >= RESULTS_MAX_ROWS) issues.push({ offset, message: `At most ${RESULTS_MAX_ROWS} results per slide` });
        else rows.push(r);
      } else match = r;
      return;
    }
    const parts = raw.split('|').map((p) => p.trim());
    if (parts.length !== 3 || !parts[0]) {
      issues.push({ offset, message: 'Expected "Label | home | away"' });
      return;
    }
    if (/^gol$/i.test(parts[0])) {
      const list = (s: string): string[] => s.split(',').map((x) => x.trim()).filter((x) => x && x !== '-');
      goals = { home: list(parts[1]!), away: list(parts[2]!) };
      return;
    }
    const homeValue = num(parts[1]!);
    const awayValue = num(parts[2]!);
    if (Number.isNaN(homeValue) || Number.isNaN(awayValue)) {
      issues.push({ offset, message: 'Stat values must be numbers' });
      return;
    }
    if (stats.length >= STATS_MAX_ROWS) {
      issues.push({ offset, message: `At most ${STATS_MAX_ROWS} stats per slide` });
      return;
    }
    stats.push({ label: parts[0]!, home: parts[1]!, away: parts[2]!, homeValue, awayValue });
  });
  if (kind === 'results' && rows.length === 0) {
    issues.push({ offset: -1, message: 'No result lines' });
    return { data: null, issues };
  }
  if (kind === 'stats' && !match) {
    issues.push({ offset: -1, message: 'The first line must be the match: "CODE Name #hex | 1-2 | CODE Name #hex"' });
    return { data: null, issues };
  }
  return { data: { kind, rows, match, stats, goals }, issues };
}

/** Every crest photo id a slide's match data refers to. */
export function crestIds(d: MatchData | null): string[] {
  if (!d) return [];
  const teams = d.kind === 'results' ? d.rows.flatMap((r) => [r.home, r.away]) : d.match ? [d.match.home, d.match.away] : [];
  return [...new Set(teams.map((t) => t.crest).filter((c): c is string => !!c))];
}
