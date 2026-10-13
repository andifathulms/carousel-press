import type { Ctx } from './ctx';
import { between } from '../core/hash';

/** DESIGN §3.7 */
export const BLOB = {
  points: 7,
  angleJitterDeg: 10,
  radiusJitter: 0.18,
  tension: 0.5,
  a: { cx: 1040, cy: 1840, spread: 30, rMin: 300, rMax: 380, rMinBig: 420, rMaxBig: 480 },
  b: { cx: 1070, cyMin: 260, cyMax: 420, rMin: 200, rMax: 260, chance: 0.5 },
};

export interface Pt {
  x: number;
  y: number;
}

/** Seeded points around a centre. */
export function blobPoints(rng: () => number, cx: number, cy: number, r: number): Pt[] {
  const pts: Pt[] = [];
  const n = BLOB.points;
  const start = rng() * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const jitter = (between(rng, -1, 1) * BLOB.angleJitterDeg * Math.PI) / 180;
    const a = start + (i / n) * Math.PI * 2 + jitter;
    const rr = r * (1 + between(rng, -1, 1) * BLOB.radiusJitter);
    pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
  }
  return pts;
}

/** Closed Catmull-Rom spline through the points, as cubic Béziers. */
export function traceBlob(ctx: Ctx, pts: readonly Pt[], tension = BLOB.tension): void {
  const n = pts.length;
  const p = (i: number): Pt => pts[((i % n) + n) % n]!;
  const k = (tension * 2) / 3; // tension 0.5 → controls at ±(p2 − p0)/6: classic Catmull-Rom
  ctx.beginPath();
  ctx.moveTo(p(0).x, p(0).y);
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1 = { x: p1.x + ((p2.x - p0.x) * k) / 2, y: p1.y + ((p2.y - p0.y) * k) / 2 };
    const c2 = { x: p2.x - ((p3.x - p1.x) * k) / 2, y: p2.y - ((p3.y - p1.y) * k) / 2 };
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
  }
  ctx.closePath();
}

/** Blob A (bottom-right) and optionally blob B (top-right). Drawn before any text. */
export function drawBlobs(ctx: Ctx, rng: () => number, color: string, big: boolean): void {
  const A = BLOB.a;
  const ax = A.cx + between(rng, -A.spread, A.spread);
  const ay = A.cy + between(rng, -A.spread, A.spread);
  const ar = big ? between(rng, A.rMinBig, A.rMaxBig) : between(rng, A.rMin, A.rMax);
  const showB = big || rng() < BLOB.b.chance;
  const B = BLOB.b;
  const by = between(rng, B.cyMin, B.cyMax);
  const br = between(rng, B.rMin, B.rMax);

  ctx.fillStyle = color;
  traceBlob(ctx, blobPoints(rng, ax, ay, ar));
  ctx.fill();
  if (showB) {
    traceBlob(ctx, blobPoints(rng, B.cx, by, br));
    ctx.fill();
  }
}
