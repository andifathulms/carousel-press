import { between, mulberry32 } from '../core/hash';
import { makeCanvas } from './ctx';

/** DESIGN §5.7: generated sample photo, no third-party assets. */
export const SAMPLE_DUSK = {
  id: 'sample-dusk',
  w: 1440,
  h: 2560,
  seed: 0x5d05c,
  sky: [['#262A48', 0], ['#5B4566', 0.35], ['#B86E6E', 0.58], ['#EE9E6E', 0.70], ['#F6C68E', 0.76]] as const,
  sun: { x: 0.60, y: 0.74, r: 80, color: '#FFE6B8', glowR: 420, glow: '#FFD49A', glowAlpha: 0.55 },
  hills: [
    { color: '#4A3550', base: 0.73, amp: 0.045, scale: 420 },
    { color: '#2E2236', base: 0.79, amp: 0.04, scale: 300 },
    { color: '#18121E', base: 0.87, amp: 0.035, scale: 220 },
  ],
  grainAlpha: 0.03,
};

/** Seeded 1-D value noise with smoothstep interpolation, in [-1, 1]. */
function valueNoise(rng: () => number, length: number, scale: number): (x: number) => number {
  const n = Math.ceil(length / scale) + 2;
  const pts = Array.from({ length: n }, () => between(rng, -1, 1));
  return (x) => {
    const f = x / scale;
    const i = Math.floor(f);
    const t = f - i;
    const s = t * t * (3 - 2 * t);
    return (pts[i] ?? 0) * (1 - s) + (pts[i + 1] ?? 0) * s;
  };
}

/** Draw sample-dusk and return it as a PNG blob plus its size. */
export async function generateSampleDusk(): Promise<{ blob: Blob; width: number; height: number }> {
  const P = SAMPLE_DUSK;
  const { canvas, ctx } = makeCanvas(P.w, P.h);
  const rng = mulberry32(P.seed);

  const sky = ctx.createLinearGradient(0, 0, 0, P.h);
  for (const [c, at] of P.sky) sky.addColorStop(at, c);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, P.w, P.h);

  const sx = P.sun.x * P.w, sy = P.sun.y * P.h;
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, P.sun.glowR);
  glow.addColorStop(0, P.sun.glow);
  glow.addColorStop(1, 'rgba(255,212,154,0)');
  ctx.globalAlpha = P.sun.glowAlpha;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, P.w, P.h);
  ctx.globalAlpha = 1;
  ctx.fillStyle = P.sun.color;
  ctx.beginPath();
  ctx.arc(sx, sy, P.sun.r, 0, Math.PI * 2);
  ctx.fill();

  for (const hill of P.hills) {
    const n1 = valueNoise(rng, P.w, hill.scale);
    const n2 = valueNoise(rng, P.w, hill.scale / 3);
    ctx.fillStyle = hill.color;
    ctx.beginPath();
    ctx.moveTo(0, P.h);
    for (let x = 0; x <= P.w; x += 8) {
      const y = (hill.base + hill.amp * (0.75 * n1(x) + 0.25 * n2(x))) * P.h;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(P.w, P.h);
    ctx.closePath();
    ctx.fill();
  }

  const img = ctx.getImageData(0, 0, P.w, P.h);
  const d = img.data;
  const grain = mulberry32(P.seed + 1);
  const amp = 255 * P.grainAlpha;
  for (let i = 0; i < d.length; i += 4) {
    const g = (grain() * 2 - 1) * amp;
    d[i] = d[i]! + g;
    d[i + 1] = d[i + 1]! + g;
    d[i + 2] = d[i + 2]! + g;
  }
  ctx.putImageData(img, 0, 0);

  const blob = 'convertToBlob' in canvas
    ? await canvas.convertToBlob({ type: 'image/png' })
    : await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob failed'))), 'image/png'));
  return { blob, width: P.w, height: P.h };
}
