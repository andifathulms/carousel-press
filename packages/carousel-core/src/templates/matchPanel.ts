// `[results]` and `[stats]` panels (PRD §4.11, DESIGN §6.10): team badges (the crest image when the
// deck names one and it is loaded, else a colour circle with the code), scorelines, scorers and
// paired stat bars. One fixed stack item per slide.
import { contrast, withAlpha } from '../core/color';
import type { MatchData, ResultRow, Team } from '../core/match';
import type { Slide } from '../core/types';
import type { StackItem } from '../layout/stack';
import type { Ctx } from '../render/ctx';
import type { PhotoInput } from '../render/photo';
import { CONTENT_W } from '../render/safezone';
import { setFont, setShadow, truncateToWidth } from '../render/text';
import { displayFamily } from './traits';
import type { Surface, Variant } from './types';

export const MATCH = {
  results: { rowH: 84, rowHDense: 72, dense: 6, gap: 12, radius: 14, padX: 14, badge: 54, badgeText: 20, name: 28, score: 46, scoreW: 116, border: 4, nameGap: 14 },
  stats: {
    head: 176, badge: 100, badgeText: 32, score: 104, teamName: 26, gapAfterHead: 20,
    goal: 26, goalLh: 34, goalsTop: 12, maxGoalLines: 5,
    rowH: 78, label: 24, value: 36, bar: 14, barGap: 6, barRadius: 7,
  },
  rowBgAlpha: 0.07,
  minBadgeContrast: 1.6,
  /** Crests sit on a light disc so dark crests stay visible on dark templates. */
  crestDisc: '#F6F5F1',
  crestScale: 0.74,
};

type Crests = ReadonlyMap<string, PhotoInput> | undefined;

/** Text colour on a team badge: whichever of white or near-black reads better. */
export function badgeInk(color: string): string {
  return contrast('#FFFFFF', color) >= contrast('#111111', color) ? '#FFFFFF' : '#111111';
}

export function matchItem(slide: Slide, gap: number): StackItem | null {
  const d = slide.match;
  if (!d) return null;
  return { kind: 'match', h: matchHeight(d), w: CONTENT_W, gap };
}

export function matchHeight(d: MatchData): number {
  if (d.kind === 'results') {
    const R = MATCH.results;
    const rowH = d.rows.length > R.dense ? R.rowHDense : R.rowH;
    return d.rows.length * rowH + (d.rows.length - 1) * R.gap;
  }
  const S = MATCH.stats;
  return S.head + goalsHeight(d) + (d.stats.length ? S.gapAfterHead + d.stats.length * S.rowH : 0);
}

function goalsHeight(d: MatchData): number {
  const S = MATCH.stats;
  const lines = Math.min(S.maxGoalLines, Math.max(d.goals?.home.length ?? 0, d.goals?.away.length ?? 0));
  return lines ? S.goalsTop + lines * S.goalLh : 0;
}

interface PlacedLike { x: number; y: number }

export function drawMatch(ctx: Ctx, p: PlacedLike, d: MatchData, v: Variant, s: Surface, onPhoto: boolean, crests?: Crests): void {
  setShadow(ctx, onPhoto);
  if (d.kind === 'results') drawResults(ctx, p, d.rows, v, s, crests);
  else if (d.match) drawStats(ctx, p, d, d.match, v, s, crests);
}

function display(v: Variant, size: number): { family: string; weight: number; size: number } {
  return { family: displayFamily(v), weight: v.headlineWeight ?? 700, size };
}

function drawBadge(ctx: Ctx, t: Team, cx: number, cy: number, d: number, textSize: number, v: Variant, s: Surface, crests: Crests): void {
  const crest = t.crest ? crests?.get(t.crest) : undefined;
  if (crest) {
    ctx.save();
    setShadow(ctx, false);
    ctx.beginPath();
    ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
    ctx.fillStyle = MATCH.crestDisc;
    ctx.fill();
    // Contain the crest in a square inside the disc, keeping its aspect ratio.
    const box = d * MATCH.crestScale;
    const k = Math.min(box / crest.width, box / crest.height);
    const w = crest.width * k;
    const h = crest.height * k;
    ctx.drawImage(crest.image, cx - w / 2, cy - h / 2, w, h);
    ctx.restore();
    return;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
  ctx.fillStyle = t.color;
  ctx.fill();
  if (contrast(t.color, s.bg) < MATCH.minBadgeContrast) {
    ctx.strokeStyle = s.muted;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  setFont(ctx, display(v, textSize));
  ctx.fillStyle = badgeInk(t.color);
  ctx.textAlign = 'center';
  ctx.fillText(t.code, cx, cy + textSize * 0.36);
  ctx.textAlign = 'left';
}

function drawResults(ctx: Ctx, p: PlacedLike, rows: ResultRow[], v: Variant, s: Surface, crests: Crests): void {
  const R = MATCH.results;
  const rowH = rows.length > R.dense ? R.rowHDense : R.rowH;
  const badge = rows.length > R.dense ? R.badge - 8 : R.badge;
  const nameW = (CONTENT_W - R.scoreW) / 2 - R.padX - badge - R.nameGap * 2;
  rows.forEach((r, i) => {
    const y = p.y + i * (rowH + R.gap);
    const cy = y + rowH / 2;
    ctx.fillStyle = withAlpha(s.ink, MATCH.rowBgAlpha);
    ctx.beginPath();
    ctx.roundRect(p.x, y, CONTENT_W, rowH, R.radius);
    ctx.fill();
    if (r.highlight) {
      ctx.strokeStyle = s.accent;
      ctx.lineWidth = R.border;
      ctx.beginPath();
      ctx.roundRect(p.x + R.border / 2, y + R.border / 2, CONTENT_W - R.border, rowH - R.border, R.radius);
      ctx.stroke();
    }
    drawBadge(ctx, r.home, p.x + R.padX + badge / 2, cy, badge, R.badgeText, v, s, crests);
    drawBadge(ctx, r.away, p.x + CONTENT_W - R.padX - badge / 2, cy, badge, R.badgeText, v, s, crests);
    const homeWon = r.homeGoals > r.awayGoals;
    const awayWon = r.awayGoals > r.homeGoals;
    setFont(ctx, { family: v.fonts.sans, weight: homeWon ? 600 : 400, size: R.name });
    ctx.fillStyle = homeWon ? s.ink : s.body;
    ctx.fillText(truncateToWidth(ctx, r.home.name, nameW), p.x + R.padX + badge + R.nameGap, cy + R.name * 0.35);
    setFont(ctx, { family: v.fonts.sans, weight: awayWon ? 600 : 400, size: R.name });
    ctx.fillStyle = awayWon ? s.ink : s.body;
    ctx.textAlign = 'right';
    ctx.fillText(truncateToWidth(ctx, r.away.name, nameW), p.x + CONTENT_W - R.padX - badge - R.nameGap, cy + R.name * 0.35);
    setFont(ctx, display(v, R.score));
    ctx.fillStyle = s.ink;
    ctx.textAlign = 'center';
    ctx.fillText(`${r.homeGoals}–${r.awayGoals}`, p.x + CONTENT_W / 2, cy + R.score * 0.36);
    ctx.textAlign = 'left';
  });
}

/** A team colour that stays visible on the surface; otherwise the given fallback. */
function barColor(color: string, s: Surface, fallback: string): string {
  return contrast(color, s.bg) >= MATCH.minBadgeContrast ? color : fallback;
}

function drawStats(ctx: Ctx, p: PlacedLike, d: MatchData, m: ResultRow, v: Variant, s: Surface, crests: Crests): void {
  const S = MATCH.stats;
  const cx = p.x + CONTENT_W / 2;
  const by = p.y + S.badge / 2;
  drawBadge(ctx, m.home, p.x + S.badge / 2 + 20, by, S.badge, S.badgeText, v, s, crests);
  drawBadge(ctx, m.away, p.x + CONTENT_W - S.badge / 2 - 20, by, S.badge, S.badgeText, v, s, crests);
  setFont(ctx, display(v, S.score));
  ctx.fillStyle = s.ink;
  ctx.textAlign = 'center';
  ctx.fillText(`${m.homeGoals}–${m.awayGoals}`, cx, by + S.score * 0.36);
  setFont(ctx, { family: v.fonts.sans, weight: 600, size: S.teamName });
  ctx.fillStyle = s.body;
  const nameY = p.y + S.badge + 16 + S.teamName;
  const nameW = CONTENT_W / 3;
  ctx.fillText(truncateToWidth(ctx, m.home.name, nameW), p.x + S.badge / 2 + 20, nameY);
  ctx.fillText(truncateToWidth(ctx, m.away.name, nameW), p.x + CONTENT_W - S.badge / 2 - 20, nameY);
  ctx.textAlign = 'left';

  // Scorers: home under the left badge, away under the right, one per line.
  if (d.goals) {
    setFont(ctx, { family: v.fonts.sans, weight: 400, size: S.goal });
    ctx.fillStyle = s.body;
    const top = p.y + S.head + S.goalsTop;
    const colW = CONTENT_W / 2 - 16;
    const lines = (list: string[]): string[] => list.length > S.maxGoalLines ? [...list.slice(0, S.maxGoalLines - 1), `+${list.length - S.maxGoalLines + 1} gol lagi`] : list;
    lines(d.goals.home).forEach((g, i) => ctx.fillText(truncateToWidth(ctx, g, colW), p.x, top + (i + 0.75) * S.goalLh));
    ctx.textAlign = 'right';
    lines(d.goals.away).forEach((g, i) => ctx.fillText(truncateToWidth(ctx, g, colW), p.x + CONTENT_W, top + (i + 0.75) * S.goalLh));
    ctx.textAlign = 'left';
  }
  const rowsTop = p.y + S.head + goalsHeight(d);

  let homeCol = barColor(m.home.color, s, s.ink);
  let awayCol = barColor(m.away.color, s, s.muted);
  if (contrast(homeCol, awayCol) < 1.25) awayCol = homeCol === s.muted ? s.ink : s.muted;
  if (homeCol === awayCol) homeCol = s.ink;

  d.stats.forEach((st, i) => {
    const top = rowsTop + S.gapAfterHead + i * S.rowH;
    const base = top + S.value * 0.8;
    const hiHome = st.homeValue > st.awayValue;
    const hiAway = st.awayValue > st.homeValue;
    setFont(ctx, display(v, S.value));
    ctx.fillStyle = hiHome ? s.accent : s.ink;
    ctx.fillText(st.home, p.x, base);
    ctx.fillStyle = hiAway ? s.accent : s.ink;
    ctx.textAlign = 'right';
    ctx.fillText(st.away, p.x + CONTENT_W, base);
    setFont(ctx, { family: v.fonts.sans, weight: 400, size: S.label });
    ctx.fillStyle = s.body;
    ctx.textAlign = 'center';
    ctx.fillText(truncateToWidth(ctx, st.label, CONTENT_W * 0.6), cx, base - 4);
    ctx.textAlign = 'left';
    const total = st.homeValue + st.awayValue;
    const barY = base + 16;
    const avail = CONTENT_W - S.barGap;
    const hw = total > 0 ? (st.homeValue / total) * avail : avail / 2;
    ctx.fillStyle = withAlpha(s.ink, MATCH.rowBgAlpha);
    ctx.beginPath();
    ctx.roundRect(p.x, barY, CONTENT_W, S.bar, S.barRadius);
    ctx.fill();
    // A zero value draws no bar; the track shows through.
    if (st.homeValue > 0) {
      ctx.fillStyle = homeCol;
      ctx.beginPath();
      ctx.roundRect(p.x, barY, hw, S.bar, S.barRadius);
      ctx.fill();
    }
    if (st.awayValue > 0) {
      ctx.fillStyle = awayCol;
      ctx.beginPath();
      ctx.roundRect(p.x + hw + S.barGap, barY, avail - hw, S.bar, S.barRadius);
      ctx.fill();
    }
  });
}
